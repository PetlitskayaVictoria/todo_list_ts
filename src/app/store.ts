import {tasksReducer} from '../features/TodolistLists/TodoList/Task/tasks-reducer';
import {todoListReducer} from '../features/TodolistLists/TodoList/tl-reducer';
import {combineReducers} from 'redux';
import thunkMiddleware, {ThunkAction} from 'redux-thunk'
import {appReducer} from "./app-reducer";
import {authReducer} from "../features/Login/auth-reducer";
import {configureStore, getDefaultMiddleware} from "@reduxjs/toolkit";
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todoLists: todoListReducer,
    app: appReducer,
    auth: authReducer
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunkMiddleware)
})

export type AppRootStateType = ReturnType<typeof rootReducer>

// @ts-ignore
window.store = store;
