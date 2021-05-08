import {TaskStateType} from "../App";
import {
    addTodoListActionType,
    removeTodoListActionType,
    SetTodoListsACType,
} from "./tl-reducer";
import {TaskPriorities, tasksAPI, TaskStatuses, UpdateTaskModelType} from "../api/todolist-api";
import {AppRootStateType} from "../state/store";

type RemoveTaskActionType = {
    type: 'REMOVE_TASK'
    taskId: string
    todoListId: string
}

type AddTaskActionType = {
    type: 'ADD_TASK'
    task: TaskType
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

type UpdateTaskActionType = {
    type: 'UPDATE_TASK'
    taskId: string
    domainModel: UpdateDomainTaskModelType
    todoListId: string
}

type ChangeTaskTitleActionType = {
    type: 'CHANGE_TASK_TITLE'
    taskId: string
    title: string
    todoListId: string
}

type SetTasksACType = {
    type : "SET_TASKS",
    todoListId: string,
    tasks: Array<TaskType>
}

export type ActionsType =
    RemoveTaskActionType
    | AddTaskActionType
    | UpdateTaskActionType
    | ChangeTaskTitleActionType
    | addTodoListActionType
    | removeTodoListActionType
    | SetTodoListsACType
    | SetTasksACType

let initialState: TaskStateType = {
}

export const tasksReducer = (state = initialState, action: ActionsType): TaskStateType => {
    let stateCopy = {...state}
    switch (action.type) {
        case "SET_TASKS": {
            stateCopy[action.todoListId] = action.tasks
            return stateCopy
        }
        case 'REMOVE_TASK': {
            const todoListTasks = stateCopy[action.todoListId]
            stateCopy[action.todoListId] = todoListTasks.filter(t => t.id !== action.taskId)
            return stateCopy

        }
        case 'ADD_TASK': {
            return {...state, [action.task.todoListId] : [action.task, ...state[action.task.todoListId]]}
        }
        // case "CHANGE_TASK_STATUS": {
        //     const newTasks = stateCopy[action.todoListId].map(t => {
        //             if (t.id === action.taskId) {
        //                 return {...t, status : action.status}
        //             } else {
        //                 return t
        //             }
        //         }
        //     )
        //     stateCopy[action.todoListId] = newTasks
        //     return stateCopy
        // }
        case "UPDATE_TASK": {
            const newTasks = stateCopy[action.todoListId].map((t) => {
                if (t.id === action.taskId) {
                    return {...t, ...action.domainModel}
                } else {
                    return t
                }
            })
            stateCopy[action.todoListId] = newTasks
            return stateCopy
        }
        // case "CHANGE_TASK_TITLE": {
        //     const newTasks = stateCopy[action.todoListId].map(t => {
        //             if (t.id === action.taskId) {
        //                 return {...t, title : action.title}
        //             } else {
        //                 return t
        //             }
        //         }
        //     )
        //     stateCopy[action.todoListId] = newTasks
        //     return stateCopy
        // }

        case "ADD-TODOLIST": {
            return {
                ...state,
                [action.todoListId] : []
            }
        }

        case "REMOVE-TODOLIST": {
            delete stateCopy[action.id]
            return stateCopy

        }
        case "SET_TODO_LISTS": {
            const stateCopy = {...state}
            action.todoLists.forEach((tl) => {
                stateCopy[tl.id] = []
            }
            )
            return stateCopy
        }

        default:
            return state
    }
}

export const removeTaskAC = (taskId: string, todolistId: string): RemoveTaskActionType => {
    return {
        type : 'REMOVE_TASK',
        taskId : taskId,
        todoListId : todolistId
    }
}
export const addTaskAC = (task: TaskType): AddTaskActionType => {
    return {
        type : 'ADD_TASK',
        task
    }
}

export const updateTaskAC = (taskId: string, domainModel: UpdateDomainTaskModelType, todoListId: string): UpdateTaskActionType => {
    return {
        type : 'UPDATE_TASK',
        taskId : taskId,
        domainModel,
        todoListId

    }
}

export const changeTaskTitleAC = (title: string, taskId: string, todoListId: string): ChangeTaskTitleActionType => {
    return {
        type : "CHANGE_TASK_TITLE",
        taskId,
        title,
        todoListId
    }
}

export const setTasksAC = (todoListId: string, tasks: Array<TaskType>): SetTasksACType => {
    return {
        type : "SET_TASKS",
        todoListId, tasks
    }
}

export const getTasksTC = (todolistId: string) => (dispatch: any, getState: () => AppRootStateType) => {
    tasksAPI.getTasks(todolistId).then((res) => {
        dispatch(setTasksAC(todolistId, res.data.items))
    })
}

export const deleteTaskTC = (todolistId: string, taskId: string) => (dispatch: any, getState: () => AppRootStateType) => {
    tasksAPI.deleteTask(todolistId, taskId).then((res) => {
        if (res.data.resultCode === 0) {
            dispatch(removeTaskAC(taskId, todolistId))
        }
    })
}

export const addTaskTC = (todolistId: string, title: string) => (dispatch: any, getState: () => AppRootStateType) => {
    tasksAPI.createTask(todolistId, title).then((res) => {
        if (res.data.resultCode === 0) {
            dispatch(addTaskAC(res.data.data.item))
        }
    })
}

// export const changeTaskTitleTC = (todolistId: string, taskId: string, title: string) => (dispatch: any, getState: () => AppRootStateType) => {
//     tasksAPI.updateTask(todolistId, taskId, title).then((res) => {
//         if (res.data.resultCode === 0) {
//             dispatch(changeTaskTitleAC(title, taskId, todolistId))
//         }
//     })
// }


export const updateTaskTC = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType) => (dispatch: any, getState: () => AppRootStateType) => {
    const state = getState()
    const task = state.tasks[todolistId].find((t) => t.id === taskId)
    if (!task) {
        return
    }

    const apiModel: UpdateTaskModelType = {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        startDate: task.startDate,
        deadline: task.deadline,
        ...domainModel
    }

    tasksAPI.updateTask(todolistId, taskId, apiModel).then((res) => {
            dispatch(updateTaskAC(taskId, domainModel, todolistId))
    })
}

export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}


