import {setAppErrorAC, SetAppErrorACType, setAppStatusAC, SetAppStatusACType,} from '../app/app-reducer';
import { Dispatch } from 'redux';

import { ResponseType } from "./../api/todolist-api"


// generic function
export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: ErrorUtilsDispatchType) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC({error: data.messages[0]}))
    } else {
        dispatch(setAppErrorAC({error: 'Some error occurred'}))
    }
    dispatch(setAppStatusAC({status: 'failed'}))
}

export const handleServerNetworkError = (error: {message: string}, dispatch: ErrorUtilsDispatchType) => {
    dispatch(setAppErrorAC({error: error.message}))
    dispatch(setAppStatusAC({status: 'failed'}))
}

type ErrorUtilsDispatchType = Dispatch<SetAppErrorACType | SetAppStatusACType>
