import {authAPI} from "../api/todolist-api";
import {Dispatch} from "redux";
import {setIsLoggedInAC} from "../features/Login/auth-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";

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

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status : action.status}
        case "APP/SET-ERROR":
            return {...state, error : action.error}
        case "APP/SET_IS_INITIALIZED": return {...state, isInitialized: action.isInitialized}
        default:
            return state
    }
}

export const setAppStatusAC = (status: RequestStatusType) => (
    {type : 'APP/SET-STATUS', status} as const
)

export const setAppErrorAC = (error: string | null) => (
    {type : 'APP/SET-ERROR', error} as const
)
export const setIsInitialized = (isInitialized: boolean) => (
    {type : 'APP/SET_IS_INITIALIZED', isInitialized} as const
)

export const initializeAppTC = () => (dispatch: Dispatch) => {
    authAPI.me().then(res => {
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(true));
        } else {
            handleServerAppError(res.data, dispatch)
        }
    }).catch((error) => {
        handleServerNetworkError(error, dispatch)
    }).finally(() => {
        dispatch(setIsInitialized(true))
    })
}

export type SetAppStatusACType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorACType = ReturnType<typeof setAppErrorAC>
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type SetIsInitialized = ReturnType<typeof setIsInitialized>
type ActionsType =
    | SetAppStatusACType
    | SetAppErrorACType
    | SetAppErrorActionType
    | SetAppStatusActionType
    | SetIsInitialized
