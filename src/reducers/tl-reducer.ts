import {v1} from "uuid";
import {todolistAPI, TodolistType} from "../api/todolist-api";
import {AppRootStateType} from "../state/store";

const REMOVE_TODOLIST = 'REMOVE-TODOLIST'
const ADD_TODOLIST = 'ADD-TODOLIST'
const CHANGE_TODOLIST_TITLE = 'CHANGE-TODOLIST-TITLE'
const CHANGE_FILTER = 'CHANGE-FILTER'
const SET_TODO_LISTS = 'SET_TODO_LISTS'

export type FilterValuesType = "all" | "active" | "completed"
export type TodolistDomainType = TodolistType & {filter: FilterValuesType}

export type removeTodoListActionType = {
    type: 'REMOVE-TODOLIST',
    id: string
}

export type addTodoListActionType = {
    type: 'ADD-TODOLIST',
    todoList: TodolistType
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
    | SetTodoListsACType

export const toDoListID1 = v1()
export const toDoListID2 = v1()

let initialState: Array<TodolistDomainType> = [

]

export const todoListReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case ADD_TODOLIST: {
            // const newTodoListId = action.todoList.id
            const newTodoList: TodolistDomainType = {
                ...action.todoList,
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
            return state.map(tl => {
                return tl.id === action.id ? {...tl, title : action.title} : tl
            })
        }
        case SET_TODO_LISTS: {
            return action.todoLists.map((tl) => ({...tl, filter: "all"}))
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

export const addTodolistAC = (todoList: TodolistType): addTodoListActionType => {
    return {
        type: ADD_TODOLIST,
        todoList
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

export const setTodoListsAC = (todoLists: Array<TodolistType>) => {
    return {
        type: SET_TODO_LISTS,
        todoLists
    } as const
}

export const getTodoListsTC = () => (dispatch: any, getState: () => AppRootStateType) => {
    todolistAPI.getTodoLists().then((res) => {
        dispatch(setTodoListsAC(res.data))
    })
}

export const createTodoListTC = (title: string) => (dispatch: any, getState: () => AppRootStateType) => {
    todolistAPI.createTodolist(title).then((res) => {
        if (res.data.resultCode === 0) {
            dispatch(addTodolistAC(res.data.data.item))
        }
    })
}

export const deleteTodoListTC = (todoListId: string) => (dispatch: any, getState: () => AppRootStateType) => {
    todolistAPI.deleteTodolist(todoListId).then((res) => {
        if (res.data.resultCode === 0) {
            dispatch(removeTodolistAC(todoListId))
        }
    })
}


export const changeTodolistTitleTC = (todoListId: string, title: string) => (dispatch: any, getState: () => AppRootStateType) => {
    todolistAPI.updateTodolist(todoListId, title).then((res) => {
        if (res.data.resultCode === 0) {
            dispatch(changeTodolistTitleAC(title, todoListId))
        }
    })
}

export type SetTodoListsACType = ReturnType<typeof setTodoListsAC>
