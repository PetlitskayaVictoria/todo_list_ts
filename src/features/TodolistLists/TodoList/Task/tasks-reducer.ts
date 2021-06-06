import {
    createTodoListTC, deleteTodoListTC, getTodoListsTC,
} from "../tl-reducer";
import {TaskPriorities, tasksAPI, TaskStatuses, UpdateTaskModelType} from "../../../../api/todolist-api";
import {AppRootStateType} from "../../../../app/store";
import {
    RequestStatusType,
    setAppStatusAC
} from "../../../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

export type TaskStateType = {
    [key: string]: Array<TaskDomainType>
}

export const getTasksTC = createAsyncThunk('tasks/getTasks', async (todoListId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status : 'loading'}))
    try {
        let res = await tasksAPI.getTasks(todoListId)
        const tasks = res.data.items
        thunkAPI.dispatch(setAppStatusAC({status : 'succeeded'}))
        return {todoListId, tasks}
    } catch (error) {
        handleServerNetworkError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({})
    }
})
export const deleteTaskTC = createAsyncThunk('tasks/deleteTask', async (param: { todolistId: string, taskId: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status : 'loading'}))
    thunkAPI.dispatch(changeTaskEntityStatusAC({
        taskId : param.taskId,
        todoListId : param.todolistId,
        entityStatus : "loading"
    }))
    try {
        let res = await tasksAPI.deleteTask(param.todolistId, param.taskId)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status : 'succeeded'}))
            return {taskId : param.taskId, todoListId : param.todolistId}
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({})
        }
    } catch (error) {
        handleServerNetworkError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({})
    }
})
export const addTaskTC = createAsyncThunk('tasks/addTask', async (param: { todolistId: string, title: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status : 'loading'}))
    try {
        let res = await tasksAPI.createTask(param.todolistId, param.title)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status : 'succeeded'}))
            return {task : res.data.data.item}
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({})
        }
    } catch (error) {
        handleServerNetworkError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({})
    }
})
export const updateTaskTC = createAsyncThunk('tasks/updateTask', async (param: { todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType }, thunkAPI) => {
    const state = thunkAPI.getState() as AppRootStateType
    const task = state.tasks[param.todolistId].find((t) => t.id === param.taskId)
    if (!task) {
        return thunkAPI.rejectWithValue("Task is not found")
    }

    const apiModel: UpdateTaskModelType = {
        title : task.title,
        description : task.description,
        status : task.status,
        priority : task.priority,
        startDate : task.startDate,
        deadline : task.deadline,
        ...param.domainModel
    }
    thunkAPI.dispatch(setAppStatusAC({status : 'loading'}))
    thunkAPI.dispatch(changeTaskEntityStatusAC({
        taskId : param.taskId,
        todoListId : param.todolistId,
        entityStatus : "loading"
    }))
    try {
        let res = await tasksAPI.updateTask(param.todolistId, param.taskId, apiModel)
        if (res.data.resultCode === 0) {
            return {taskId : param.taskId, domainModel : param.domainModel, todoListId : param.todolistId}
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({})
        }
    } catch (error) {
        handleServerNetworkError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({})
    } finally {
        thunkAPI.dispatch(setAppStatusAC({status : 'succeeded'}))
        thunkAPI.dispatch(changeTaskEntityStatusAC({
            taskId : param.taskId,
            todoListId : param.todolistId,
            entityStatus : "succeeded"
        }))
    }
})

const slice = createSlice({
    name : "tasks",
    initialState : {} as TaskStateType,
    reducers : {
        changeTaskEntityStatusAC(state, action: PayloadAction<{ taskId: string, todoListId: string, entityStatus: RequestStatusType }>) {
            const tasks = state[action.payload.todoListId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > - 1) {
                tasks[index].entityStatus = action.payload.entityStatus
            }
        }
    },
    extraReducers : (builder) => {
        builder.addCase(createTodoListTC.fulfilled, (state, action) => {
            state[action.payload.todoList.id] = []
        });
        builder.addCase(deleteTodoListTC.fulfilled, (state, action) => {
            delete state[action.payload.todolistId]
        });
        builder.addCase(getTodoListsTC.fulfilled, (state, action) => {
            action.payload.todoLists.forEach((tl) => state[tl.id] = [])
        });
        builder.addCase(getTasksTC.fulfilled, (state, action) => {
            state[action.payload.todoListId] = action.payload.tasks.map((t) => {
                return {...t, entityStatus : 'idle'}
            })
        });
        builder.addCase(deleteTaskTC.fulfilled, (state, action) => {
            const tasks = state[action.payload.todoListId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > - 1) {
                tasks.splice(index, 1)
            }
        });
        builder.addCase(addTaskTC.fulfilled, (state, action) => {
            state[action.payload.task.todoListId].unshift({...action.payload.task, entityStatus : 'idle'})
        });
        builder.addCase(updateTaskTC.fulfilled, (state, action) => {
            const tasks = state[action.payload.todoListId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > - 1) {
                tasks[index] = {...tasks[index], ...action.payload.domainModel}
            }
        });
    }
})
export const tasksReducer = slice.reducer
export const {changeTaskEntityStatusAC} = slice.actions

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
