import {TaskStateType} from "../App";
import {v1} from "uuid";
import {addTodoListActionType, removeTodoListActionType, toDoListID1, toDoListID2} from "./tl-reducer";
import {TaskPriorities, TaskStatuses} from "../api/todolist-api";

type RemoveTaskActionType = {
    type: 'REMOVE_TASK'
    taskId: string
    todoListId: string
}

type AddTaskActionType = {
    type: 'ADD_TASK'
    title: string
    todoListId: string
}

export type TaskType = {
    id: string
    title: string
    description: string | null
    todoListId: string
    order: number
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string | null
    deadline: string | null
    addedDate: string
}

type ChangeTaskStatusActionType = {
    type: 'CHANGE_TASK_STATUS'
    taskId: string
    status: TaskStatuses
    todoListId: string
}

type ChangeTaskTitleActionType = {
    type: 'CHANGE_TASK_TITLE'
    taskId: string
    title: string
    todoListId: string
}

export type ActionsType =
    RemoveTaskActionType
    | AddTaskActionType
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType
    | addTodoListActionType
    | removeTodoListActionType

let initialState: TaskStateType = {
    // [toDoListID1] : [
    //     {id : v1(), title : "JS", isDone : true},
    //     {id : v1(), title : "CSS", isDone : false},
    //     {id : v1(), title : "React", isDone : false},
    //     {id : v1(), title : "Angular", isDone : false},
    //     {id : v1(), title : "Java", isDone : true},
    // ],
    // [toDoListID2] : [
    //     {id : v1(), title : "Books", isDone : true},
    //     {id : v1(), title : "Cake", isDone : false},
    // ]
}

export const tasksReducer = (state = initialState, action: ActionsType): TaskStateType => {
    let stateCopy = {...state}
    switch (action.type) {
        case 'REMOVE_TASK': {
            const todoListTasks = stateCopy[action.todoListId]
            stateCopy[action.todoListId] = todoListTasks.filter(t => t.id !== action.taskId)
            return stateCopy

        }
        case 'ADD_TASK': {
            const newTask = {
                id : v1(),
                title: action.title,
                description: '',
                todoListId: action.todoListId,
                order: 0,
                status: TaskStatuses.New,
                priority: TaskPriorities.Middle,
                startDate: '',
                deadline: '',
                addedDate: ''
            }
            const updatedTasks = stateCopy[action.todoListId]
            stateCopy[action.todoListId] = [newTask, ...updatedTasks]
            return stateCopy
        }
        case "CHANGE_TASK_STATUS": {
            const newTasks = stateCopy[action.todoListId].map(t => {
                    if (t.id === action.taskId) {
                        return {...t, status : action.status}
                    } else {
                        return t
                    }
                }
            )
            stateCopy[action.todoListId] = newTasks
            return stateCopy
        }
        case "CHANGE_TASK_TITLE": {
            const newTasks = stateCopy[action.todoListId].map(t => {
                    if (t.id === action.taskId) {
                        return {...t, title : action.title}
                    } else {
                        return t
                    }
                }
            )
            stateCopy[action.todoListId] = newTasks
            return stateCopy
        }

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
export const addTaskAC = (title: string, todolistId: string): AddTaskActionType => {
    return {
        type : 'ADD_TASK',
        title : title,
        todoListId : todolistId
    }
}

export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todolistId: string): ChangeTaskStatusActionType => {
    return {
        type : 'CHANGE_TASK_STATUS',
        taskId : taskId,
        status,
        todoListId : todolistId

    }
}

export const changeTaskTitleAC = (title: string, taskId: string, todolistId: string): ChangeTaskTitleActionType => {
    return {
        type : "CHANGE_TASK_TITLE",
        taskId : taskId,
        title : title,
        todoListId : todolistId
    }
}





