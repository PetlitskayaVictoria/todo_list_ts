export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState: InitialStateType = {
    status: 'idle',
    error: null
}

type InitialStateType = {
    status: RequestStatusType,
    error: string | null
}

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case "APP/SET-ERROR":
            return {...state, error: action.error}
        default:
            return state
    }
}

export const setAppStatusAC = (status: RequestStatusType) => (
    {type: 'APP/SET-STATUS', status} as const
)

export const setAppErrorAC = (error: string | null) => (
    {type: 'APP/SET-ERROR', error} as const
)
export type SetAppStatusACType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorACType = ReturnType<typeof setAppErrorAC>
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
type ActionsType =
    | SetAppStatusACType
    | SetAppErrorACType
    | SetAppErrorActionType
    | SetAppStatusActionType
