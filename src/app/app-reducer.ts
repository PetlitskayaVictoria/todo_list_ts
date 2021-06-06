import {authAPI} from "../api/todolist-api";
import {setIsLoggedInAC} from "../features/Login/auth-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export type InitialStateType = {
    status: RequestStatusType
    error: string | null
    isInitialized: boolean
}
export const initializeAppTC = createAsyncThunk("app/initializeApp", async (param, {dispatch}) => {
        let res = await authAPI.me()
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({value: true}));
        } else {}
})

const slice = createSlice({
    name: "app",
    initialState: {
        status : 'idle',
        error : null,
        isInitialized : false
    } as InitialStateType,
    reducers: {
        setAppStatusAC(state, action: PayloadAction<{status: RequestStatusType}>) {
            state.status = action.payload.status
        },
        setAppErrorAC(state, action: PayloadAction<{error: string | null}>) {
            state.error = action.payload.error
        }
    },
    extraReducers : (builder) => {
        builder.addCase(initializeAppTC.fulfilled, (state, action) => {
            state.isInitialized = true
        });
    }
})
export const appReducer = slice.reducer
export const {setAppStatusAC, setAppErrorAC} = slice.actions

export type SetAppStatusACType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorACType = ReturnType<typeof setAppErrorAC>

