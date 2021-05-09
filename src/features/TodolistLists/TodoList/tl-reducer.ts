import {todolistAPI, TodolistType} from "../../../api/todolist-api";
import {AppRootStateType} from "../../../app/store";
import {Dispatch} from "redux";

let initialState: Array<TodolistDomainType> = []

export const todoListReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'ADD-TODOLIST':
            return [{...action.todoList, filter : "all"}, ...state]
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.todolistId)
        case 'CHANGE-FILTER':
            return state.map(tl => {return tl.id === action.id ? {...tl, filter : action.newValue} : tl})
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => {return tl.id === action.id ? {...tl, title : action.title} : tl})
        case 'SET_TODO_LISTS':
            return action.todoLists.map((tl) => ({...tl, filter: "all"}))
        default:
            return state
    }
}

// actions

export const removeTodolistAC = (todolistId: string) => ({type: 'REMOVE-TODOLIST', todolistId} as const)
export const addTodolistAC = (todoList: TodolistType): AddTodoListActionType => ({type: 'ADD-TODOLIST', todoList} as const)
export const changeTodolistTitleAC = (title: string, id: string) => ({type: 'CHANGE-TODOLIST-TITLE', id, title} as const)
export const changeFilterAC = (id: string, newValue: FilterValuesType) => ({type: 'CHANGE-FILTER', id, newValue} as const)
export const setTodoListsAC = (todoLists: Array<TodolistType>): SetTodoListsACType => ({type: 'SET_TODO_LISTS', todoLists} as const)

// thunks

export const getTodoListsTC = () =>
    (dispatch: Dispatch<ActionsType>) => {
    todolistAPI.getTodoLists().then((res) => {
        dispatch(setTodoListsAC(res.data))
    })
}
export const createTodoListTC = (title: string) =>
    (dispatch: Dispatch<ActionsType>) => {
    todolistAPI.createTodolist(title).then((res) => {
        if (res.data.resultCode === 0) {
            dispatch(addTodolistAC(res.data.data.item))
        }
    })
}
export const deleteTodoListTC = (todoListId: string) =>
    (dispatch: Dispatch<ActionsType>) => {
    todolistAPI.deleteTodolist(todoListId).then((res) => {
        if (res.data.resultCode === 0) {
            dispatch(removeTodolistAC(todoListId))
        }
    })
}
export const changeTodolistTitleTC = (todoListId: string, title: string) =>
    (dispatch: Dispatch<ActionsType>) => {
    todolistAPI.updateTodolist(todoListId, title).then((res) => {
        if (res.data.resultCode === 0) {
            dispatch(changeTodolistTitleAC(title, todoListId))
        }
    })
}

// types

export type FilterValuesType = "all" | "active" | "completed"
export type TodolistDomainType = TodolistType & {filter: FilterValuesType}

export type RemoveTodoListActionType = {
    type: 'REMOVE-TODOLIST',
    todolistId: string
}
export type AddTodoListActionType = {
    type: 'ADD-TODOLIST',
    todoList: TodolistType
}
export type SetTodoListsACType = {
    type: 'SET_TODO_LISTS',
    todoLists: Array<TodolistType>
}
export type ActionsType =
    | RemoveTodoListActionType
    | AddTodoListActionType
    | SetTodoListsACType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeFilterAC>



