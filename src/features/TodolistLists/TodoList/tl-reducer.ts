import {tasksAPI, todolistAPI, TodolistType} from "../../../api/todolist-api";
import {Dispatch} from "redux";
import {
    RequestStatusType,
    setAppStatusAC,
} from "../../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

export const getTodoListsTC = createAsyncThunk('todolists/getTodoLists', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status : 'loading'}))
    try {
        let res = await todolistAPI.getTodoLists()
        thunkAPI.dispatch(setAppStatusAC({status : 'succeeded'}))
        return {todoLists : res.data}
    } catch (error) {
        handleServerNetworkError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({})
    }
})
export const createTodoListTC = createAsyncThunk('todolists/createTodoList', async (title: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status : 'loading'}))
    try {
        let res = await todolistAPI.createTodolist(title)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status : 'succeeded'}))
            return {todoList : res.data.data.item}
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({})
        }
    } catch (error) {
        handleServerNetworkError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({})
    }
})
export const deleteTodoListTC = createAsyncThunk('todolists/deleteTodoList', async (todoListId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status : 'loading'}))
    thunkAPI.dispatch(changeTodolistEntityStatusAC({id : todoListId, entityStatus : 'loading'}))
    try {
        let res = await todolistAPI.deleteTodolist(todoListId)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status : 'succeeded'}))
            return {todolistId : todoListId}
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({})
        }
    } catch (error) {
        handleServerNetworkError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({})
    }
})
export const changeTodolistTitleTC = createAsyncThunk('todolists/changeTodolistTitle', async (param: {todoListId: string, title: string}, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status : 'loading'}))
    try {
        let res = await todolistAPI.updateTodolist(param.todoListId, param.title)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status : 'succeeded'}))
            return {title: param.title, id : param.todoListId}
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({})
        }
    } catch (error) {
        handleServerNetworkError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({})
    }
})

const slice = createSlice({
    name : "todolists",
    initialState : [] as Array<TodolistDomainType>,
    reducers : {
        // changeTodolistTitleAC(state, action: PayloadAction<{ title: string, id: string }>) {
        //     const index = state.findIndex(tl => tl.id === action.payload.id)
        //     state[index].title = action.payload.title
        // },
        changeFilterAC(state, action: PayloadAction<{ id: string, newValue: FilterValuesType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].filter = action.payload.newValue
        },
        changeTodolistEntityStatusAC(state, action: PayloadAction<{ id: string, entityStatus: RequestStatusType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].entityStatus = action.payload.entityStatus
        },
    },
    extraReducers : (builder) => {
        builder.addCase(getTodoListsTC.fulfilled, (state, action) => {
            return action.payload.todoLists.map((tl) => ({...tl, filter : "all", entityStatus : 'idle'}))
        });
        builder.addCase(createTodoListTC.fulfilled, (state, action) => {
            state.unshift({...action.payload.todoList, filter : "all", entityStatus : "idle"})
        });
        builder.addCase(deleteTodoListTC.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            if (index > - 1) {
                state.splice(index, 1)
            }
        });
        builder.addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].title = action.payload.title
        });
    }
})
export const todoListReducer = slice.reducer
export const {changeFilterAC, changeTodolistEntityStatusAC} = slice.actions

// types

export type FilterValuesType = "all" | "active" | "completed"
export type TodolistDomainType = TodolistType & { filter: FilterValuesType, entityStatus: RequestStatusType }


