import {TaskStateType} from "../../../../app/App";
import {
    AddTodoListActionType,
    RemoveTodoListActionType,
    SetTodoListsACType,
} from "../tl-reducer";
import {TaskPriorities, tasksAPI, TaskStatuses, UpdateTaskModelType} from "../../../../api/todolist-api";
import {AppRootStateType} from "../../../../app/store";
import {Dispatch} from "redux";

let initialState: TaskStateType = {}

export const tasksReducer = (state = initialState, action: ActionsType): TaskStateType => {
    switch (action.type) {
        case "SET_TASKS":
            return {...state, [action.todoListId]: action.tasks}
        case 'REMOVE_TASK':
            return {...state, [action.todoListId]: state[action.todoListId].filter(t => t.id !== action.taskId)}
        case 'ADD_TASK':
            return {...state, [action.task.todoListId] : [action.task, ...state[action.task.todoListId]]}
        case "UPDATE_TASK":
            return {...state, [action.todoListId]: state[action.todoListId].map(
                (t) => {if (t.id === action.taskId) {return {...t, ...action.domainModel}} else {return t}})}
        case "ADD-TODOLIST":
            return {...state, [action.todoList.id] : []}
        case "REMOVE-TODOLIST": {
            const stateCopy = {...state}
            delete stateCopy[action.todolistId]
            return stateCopy
        }
        case "SET_TODO_LISTS": {
            const stateCopy = {...state}
            action.todoLists.forEach((tl) => {stateCopy[tl.id] = []})
            return stateCopy
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

// thunks

export const getTasksTC = (todolistId: string) =>
    (dispatch: Dispatch<ActionsType>) => {
        tasksAPI.getTasks(todolistId).then((res) => {
            dispatch(setTasksAC(todolistId, res.data.items))
        })
    }
export const deleteTaskTC = (todolistId: string, taskId: string) =>
    (dispatch: Dispatch<ActionsType>) => {
        tasksAPI.deleteTask(todolistId, taskId).then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(removeTaskAC(taskId, todolistId))
            }
        })
    }
export const addTaskTC = (todolistId: string, title: string) =>
    (dispatch: Dispatch<ActionsType>) => {
        tasksAPI.createTask(todolistId, title).then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(addTaskAC(res.data.data.item))
            }
        })
    }
export const updateTaskTC = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType) =>
    (dispatch: Dispatch<ActionsType>, getState: () => AppRootStateType) => {
        const state = getState()
        const task = state.tasks[todolistId].find((t) => t.id === taskId)
        if (!task) {return}

        const apiModel: UpdateTaskModelType = {
            title : task.title,
            description : task.description,
            status : task.status,
            priority : task.priority,
            startDate : task.startDate,
            deadline : task.deadline,
            ...domainModel
        }

        tasksAPI.updateTask(todolistId, taskId, apiModel).then((res) => {
            dispatch(updateTaskAC(taskId, domainModel, todolistId))
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
export type ActionsType =
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | ReturnType<typeof setTasksAC>
    | RemoveTodoListActionType
    | SetTodoListsACType
    | AddTodoListActionType
