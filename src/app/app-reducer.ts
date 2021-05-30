import {authAPI} from "../api/todolist-api";
import {Dispatch} from "redux";
import {setIsLoggedInAC} from "../features/Login/auth-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState: InitialStateType = {
    status : 'idle',
    error : null,
    isInitialized : false
}

type InitialStateType = {
    status: RequestStatusType
    error: string | null
    isInitialized: boolean
}

const slice = createSlice({
    name: "app",
    initialState: initialState,
    reducers: {
        setAppStatusAC(state, action: PayloadAction<{status: RequestStatusType}>) {
            state.status = action.payload.status
        },
        setAppErrorAC(state, action: PayloadAction<{error: string | null}>) {
            state.error = action.payload.error
        },
        setIsInitialized(state, action: PayloadAction<{isInitialized: boolean}>) {
            state.isInitialized = action.payload.isInitialized
        }
    }
})
export const appReducer = slice.reducer
export const {setAppStatusAC, setAppErrorAC, setIsInitialized} = slice.actions

export const initializeAppTC = () => (dispatch: Dispatch) => {
    authAPI.me().then(res => {
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({value: true}));
        } else {
            handleServerAppError(res.data, dispatch)
        }
    }).catch((error) => {
        handleServerNetworkError(error, dispatch)
    }).finally(() => {
        dispatch(setIsInitialized({isInitialized: true}))
    })
}

export type SetAppStatusACType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorACType = ReturnType<typeof setAppErrorAC>

