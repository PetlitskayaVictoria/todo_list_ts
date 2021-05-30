import {
    addTodolistAC,
    removeTodolistAC,
    setTodoListsAC,
} from "../tl-reducer";
import {TaskPriorities, tasksAPI, TaskStatuses, UpdateTaskModelType} from "../../../../api/todolist-api";
import {AppRootStateType} from "../../../../app/store";
import {Dispatch} from "redux";
import {
    RequestStatusType,
    setAppStatusAC
} from "../../../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type TaskStateType = {
    [key: string]: Array<TaskDomainType>
}
let initialState: TaskStateType = {}

const slice = createSlice({
    name : "tasks",
    initialState : initialState,
    reducers : {
        removeTaskAC(state, action: PayloadAction<{ taskId: string, todoListId: string }>) {
            const tasks = state[action.payload.todoListId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > - 1) {
                tasks.splice(index, 1)
            }
        },
        addTaskAC(state, action: PayloadAction<{ task: TaskType }>) {
            state[action.payload.task.todoListId].unshift({...action.payload.task, entityStatus : 'idle'})
        },
        updateTaskAC(state, action: PayloadAction<{ taskId: string, domainModel: UpdateDomainTaskModelType, todoListId: string }>) {
            const tasks = state[action.payload.todoListId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > - 1) {
                tasks[index] = {...tasks[index], ...action.payload.domainModel}
            }
        },
        setTasksAC(state, action: PayloadAction<{ todoListId: string, tasks: Array<TaskType> }>) {

            state[action.payload.todoListId] = action.payload.tasks.map((t) => {
                return {...t, entityStatus : 'idle'}
            })
        },
        changeTaskEntityStatusAC(state, action: PayloadAction<{ taskId: string, todoListId: string, entityStatus: RequestStatusType }>) {
            const tasks = state[action.payload.todoListId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > - 1) {
                tasks[index].entityStatus = action.payload.entityStatus
            }
        }
    },
    extraReducers : (builder) => {
        builder.addCase(addTodolistAC, (state, action) => {
            state[action.payload.todoList.id] = []
        });
        builder.addCase(removeTodolistAC, (state, action) => {
            delete state[action.payload.todolistId]
        });
        builder.addCase(setTodoListsAC, (state, action) => {
            action.payload.todoLists.forEach((tl) => state[tl.id] = [])
        });

    }
})
export const tasksReducer = slice.reducer
export const {removeTaskAC, addTaskAC, updateTaskAC, setTasksAC, changeTaskEntityStatusAC} = slice.actions

// thunks

export const getTasksTC = (todolistId: string) =>
    (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status : 'loading'}))
        tasksAPI.getTasks(todolistId).then((res) => {
            dispatch(setTasksAC({todoListId : todolistId, tasks : res.data.items}))
            dispatch(setAppStatusAC({status : 'succeeded'}))
        }).catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
    }
export const deleteTaskTC = (todolistId: string, taskId: string) =>
    (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status : 'loading'}))
        dispatch(changeTaskEntityStatusAC({taskId, todoListId : todolistId, entityStatus : "loading"}))
        tasksAPI.deleteTask(todolistId, taskId).then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(removeTaskAC({taskId, todoListId : todolistId}))
                dispatch(setAppStatusAC({status : 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        }).catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
    }
export const addTaskTC = (todolistId: string, title: string) =>
    (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status : 'loading'}))
        tasksAPI.createTask(todolistId, title).then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(addTaskAC({task : res.data.data.item}))
                dispatch(setAppStatusAC({status : 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        }).catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
    }
export const updateTaskTC = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType) =>
    (dispatch: Dispatch, getState: () => AppRootStateType) => {
        const state = getState()
        const task = state.tasks[todolistId].find((t) => t.id === taskId)
        if (!task) {
            return
        }

        const apiModel: UpdateTaskModelType = {
            title : task.title,
            description : task.description,
            status : task.status,
            priority : task.priority,
            startDate : task.startDate,
            deadline : task.deadline,
            ...domainModel
        }
        dispatch(setAppStatusAC({status : 'loading'}))
        dispatch(changeTaskEntityStatusAC({taskId, todoListId : todolistId, entityStatus : "loading"}))
        tasksAPI.updateTask(todolistId, taskId, apiModel).then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(updateTaskAC({taskId, domainModel, todoListId : todolistId}))
            } else {
                handleServerAppError(res.data, dispatch)
            }

        }).catch((error) => {
            handleServerNetworkError(error, dispatch)
        }).finally(() => {
            dispatch(setAppStatusAC({status : 'succeeded'}))
            dispatch(changeTaskEntityStatusAC({taskId, todoListId : todolistId, entityStatus : "succeeded"}))
        })
    }

// types

export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type TaskType = {
    id: string
    title: string
    description: string
    todoListId: string
    order: number
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    addedDate: string
}
export type TaskDomainType = TaskType & { entityStatus: RequestStatusType }
