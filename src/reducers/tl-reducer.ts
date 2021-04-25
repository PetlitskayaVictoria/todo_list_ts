import {FilterValuesType, TodoListType} from "../App";
import {v1} from "uuid";

const REMOVE_TODOLIST = 'REMOVE-TODOLIST'
const ADD_TODOLIST = 'ADD-TODOLIST'
const CHANGE_TODOLIST_TITLE = 'CHANGE-TODOLIST-TITLE'
const CHANGE_FILTER = 'CHANGE-FILTER'

export type removeTodoListActionType = {
    type: 'REMOVE-TODOLIST',
    id: string
}

export type addTodoListActionType = {
    type: 'ADD-TODOLIST',
    title: string
    todoListId: string
}

type changeTodoListTitleActionType = {
    type: 'CHANGE-TODOLIST-TITLE',
    id: string,
    title: string
}

type changeFilterActionType = {
    type: 'CHANGE-FILTER',
    id: string,
    newValue: FilterValuesType
}

export type ActionsType =
    removeTodoListActionType
    | addTodoListActionType
    | changeTodoListTitleActionType
    | changeFilterActionType

export const toDoListID1 = v1()
export const toDoListID2 = v1()

let initialState: Array<TodoListType> = [
    // {id : toDoListID1, title : "What to learn", filter : "active"},
    // {id : toDoListID2, title : "What to buy", filter : "all"}
]

export const todoListReducer = (state = initialState, action: ActionsType): Array<TodoListType> => {
    switch (action.type) {
        case ADD_TODOLIST: {
            const newTodoListId = action.todoListId
            const newTodoList: TodoListType = {
                id : newTodoListId,
                title : action.title,
                filter : "all"
            }

            return [newTodoList, ...state]

        }
        case REMOVE_TODOLIST: {
            return state.filter(tl => tl.id !== action.id)

        }
        case CHANGE_FILTER: {
            return state.map(tl => {
                return tl.id === action.id ? {...tl, filter : action.newValue} : tl
            })
        }
        case CHANGE_TODOLIST_TITLE: {
            debugger
            return state.map(tl => {
                return tl.id === action.id ? {...tl, title : action.title} : tl
            })
        }
        default:
            return state
    }
}

export const removeTodolistAC = (todolistId: string) => {
    return {
        type: REMOVE_TODOLIST,
        id: todolistId
    } as const
}

export const addTodolistAC = (title: string): addTodoListActionType => {
    return {
        type: ADD_TODOLIST,
        title: title,
        todoListId: v1()
    } as const
}

export const changeTodolistTitleAC = (title: string, id: string) => {
    return {
        type: CHANGE_TODOLIST_TITLE,
        id: id,
        title: title
    } as const
}

export const changeFilterAC = (id: string, newValue: FilterValuesType) => {
    return {
        type: CHANGE_FILTER,
        id: id,
        newValue: newValue
    } as const
}
