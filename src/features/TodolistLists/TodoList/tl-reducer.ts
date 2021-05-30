import {todolistAPI, TodolistType} from "../../../api/todolist-api";
import {Dispatch} from "redux";
import {
    RequestStatusType,
    setAppStatusAC,
} from "../../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

let initialState: Array<TodolistDomainType> = []

const slice = createSlice({
    name : "todolists",
    initialState : initialState,
    reducers : {
        removeTodolistAC(state, action: PayloadAction<{ todolistId: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            if (index > -1) {
                state.splice(index, 1)
            }
        },
        addTodolistAC(state, action: PayloadAction<{ todoList: TodolistType }>) {
            state.unshift({...action.payload.todoList, filter : "all", entityStatus : "idle"})
        },
        changeTodolistTitleAC(state, action: PayloadAction<{ title: string, id: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].title = action.payload.title
        },
        changeFilterAC(state, action: PayloadAction<{ id: string, newValue: FilterValuesType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].filter = action.payload.newValue
        },
        setTodoListsAC(state, action: PayloadAction<{ todoLists: Array<TodolistType> }>) {
            return action.payload.todoLists.map((tl) => ({...tl, filter : "all", entityStatus : 'idle'}))
        },
        changeTodolistEntityStatusAC(state, action: PayloadAction<{ id: string, entityStatus: RequestStatusType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].entityStatus = action.payload.entityStatus
        },

    }
})
export const todoListReducer = slice.reducer
export const {removeTodolistAC, addTodolistAC, changeTodolistTitleAC, changeFilterAC, setTodoListsAC, changeTodolistEntityStatusAC} = slice.actions

// thunks

export const getTodoListsTC = () =>
    (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status : 'loading'}))
        todolistAPI.getTodoLists().then((res) => {
            dispatch(setTodoListsAC({todoLists: res.data}))
            dispatch(setAppStatusAC({status : 'succeeded'}))
        }).catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
    }
export const createTodoListTC = (title: string) =>
    (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status : 'loading'}))
        todolistAPI.createTodolist(title).then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(addTodolistAC({todoList: res.data.data.item}))
                dispatch(setAppStatusAC({status : 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        }).catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
    }
export const deleteTodoListTC = (todoListId: string) =>
    (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status : 'loading'}))
        dispatch(changeTodolistEntityStatusAC({id: todoListId, entityStatus: 'loading'}))
        todolistAPI.deleteTodolist(todoListId).then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(removeTodolistAC({todolistId: todoListId}))
                dispatch(setAppStatusAC({status : 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        }).catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
    }
export const changeTodolistTitleTC = (todoListId: string, title: string) =>
    (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status : 'loading'}))
        todolistAPI.updateTodolist(todoListId, title).then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(changeTodolistTitleAC({title, id: todoListId}))
                dispatch(setAppStatusAC({status : 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        }).catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
    }

// types

export type FilterValuesType = "all" | "active" | "completed"
export type TodolistDomainType = TodolistType & { filter: FilterValuesType, entityStatus: RequestStatusType }


