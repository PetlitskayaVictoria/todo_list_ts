import {
    AddTodoListActionType,
    RemoveTodoListActionType,
    SetTodoListsACType,
} from "../tl-reducer";
import {TaskPriorities, tasksAPI, TaskStatuses, UpdateTaskModelType} from "../../../../api/todolist-api";
import {AppRootStateType} from "../../../../app/store";
import {Dispatch} from "redux";
import {RequestStatusType, SetAppErrorACType, setAppStatusAC, SetAppStatusACType} from "../../../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../../../utils/error-utils";

export type TaskStateType = {
    [key: string]: Array<TaskDomainType>
}
let initialState: TaskStateType = {}

export const tasksReducer = (state = initialState, action: ActionsType): TaskStateType => {
    switch (action.type) {
        case "SET_TASKS":
            return {...state, [action.todoListId] : action.tasks.map((t) => {return {...t, entityStatus : 'idle'}})}
        case 'REMOVE_TASK':
            return {...state, [action.todoListId] : state[action.todoListId].filter(t => t.id !== action.taskId)}
        case 'ADD_TASK':
            return {...state, [action.task.todoListId] : [{...action.task, entityStatus : 'idle'}, ...state[action.task.todoListId]]}
        case "UPDATE_TASK":
            return {
                ...state, [action.todoListId] : state[action.todoListId].map(
                    (t) => {
                        if (t.id === action.taskId) {
                            return {...t, ...action.domainModel}
                        } else {
                            return t
                        }
                    })
            }
        case "ADD-TODOLIST":
            return {...state, [action.todoList.id] : []}
        case "REMOVE-TODOLIST": {
            const stateCopy = {...state}
            delete stateCopy[action.todolistId]
            return stateCopy
        }
        case "SET_TODO_LISTS": {
            const stateCopy = {...state}
            action.todoLists.forEach((tl) => {
                stateCopy[tl.id] = []
            })
            return stateCopy
        }
        case "CHANGE_TASK_ENTITY_STATUS": return {
            ...state, [action.todoListId] : state[action.todoListId].map(
                (t) => {
                    if (t.id === action.taskId) {
                        return {...t, entityStatus: action.entityStatus}
                    } else {
                        return t
                    }
                })
        }
        default:
            return state
    }
}

// actions

export const removeTaskAC = (taskId: string, todoListId: string) => ({
    type : 'REMOVE_TASK',
    taskId,
    todoListId
} as const)
export const addTaskAC = (task: TaskType) => ({type : 'ADD_TASK', task} as const)
export const updateTaskAC = (taskId: string, domainModel: UpdateDomainTaskModelType, todoListId: string) => ({
    type : 'UPDATE_TASK', taskId : taskId, domainModel, todoListId
} as const)
export const setTasksAC = (todoListId: string, tasks: Array<TaskType>) => ({
    type : "SET_TASKS",
    todoListId,
    tasks
} as const)
export const changeTaskEntityStatusAC = (taskId: string, todoListId: string, entityStatus: RequestStatusType) => ({
    type : 'CHANGE_TASK_ENTITY_STATUS', taskId, todoListId, entityStatus
} as const)

// thunks

export const getTasksTC = (todolistId: string) =>
    (dispatch: Dispatch<ActionsType>) => {
        dispatch(setAppStatusAC('loading'))
        tasksAPI.getTasks(todolistId).then((res) => {
            dispatch(setTasksAC(todolistId, res.data.items))
            dispatch(setAppStatusAC('succeeded'))
        }).catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
    }
export const deleteTaskTC = (todolistId: string, taskId: string) =>
    (dispatch: Dispatch<ActionsType>) => {
        dispatch(setAppStatusAC('loading'))
        dispatch(changeTaskEntityStatusAC(taskId, todolistId, "loading"))
        tasksAPI.deleteTask(todolistId, taskId).then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(removeTaskAC(taskId, todolistId))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        }).catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
    }
export const addTaskTC = (todolistId: string, title: string) =>
    (dispatch: Dispatch<ActionsType>) => {
        dispatch(setAppStatusAC('loading'))
        tasksAPI.createTask(todolistId, title).then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(addTaskAC(res.data.data.item))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        }).catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
    }
export const updateTaskTC = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType) =>
    (dispatch: Dispatch<ActionsType>, getState: () => AppRootStateType) => {
        const state = getState()
        const task = state.tasks[todolistId].find((t) => t.id === taskId)
        if (!task) {
            return
        }

        const apiModel: UpdateTaskModelType = {
            title : task.title,
            description : task.description,
            status : task.status,
            priority : task.priority,
            startDate : task.startDate,
            deadline : task.deadline,
            ...domainModel
        }
        dispatch(setAppStatusAC('loading'))
        dispatch(changeTaskEntityStatusAC(taskId, todolistId, "loading"))
        tasksAPI.updateTask(todolistId, taskId, apiModel).then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(updateTaskAC(taskId, domainModel, todolistId))
            } else {
                handleServerAppError(res.data, dispatch)
            }

        }).catch((error) => {
            handleServerNetworkError(error, dispatch)
        }).finally(() => {
            dispatch(setAppStatusAC('succeeded'))
            dispatch(changeTaskEntityStatusAC(taskId, todolistId, "succeeded"))
        })
    }

// types

export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type TaskType = {
    id: string
    title: string
    description: string
    todoListId: string
    order: number
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    addedDate: string
}
export type TaskDomainType = TaskType & {entityStatus: RequestStatusType}
export type ActionsType =
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | ReturnType<typeof setTasksAC>
    | RemoveTodoListActionType
    | SetTodoListsACType
    | AddTodoListActionType
    | SetAppStatusACType
    | SetAppErrorACType
    | ReturnType<typeof changeTaskEntityStatusAC>
