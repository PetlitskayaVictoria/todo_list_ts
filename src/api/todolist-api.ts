import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': '9fa0e134-93f8-4f6c-b99f-9c479847d776'
    }
})

export const todolistAPI = {
    updateTodolist(todolistId: string, title: string) {
        return instance.put<ResponseType<{}>>(`todo-lists/${todolistId}`, {title})
    },
    getTodoLists() {
        return instance.get<Array<TodolistType>>(`todo-lists`)
    },
    createTodolist(title: string) {
        return instance.post<ResponseType<{item: TodolistType}>>(`todo-lists`, {title})
    },
    deleteTodolist(todolistId: string) {
        return instance.delete<ResponseType<{}>>(`todo-lists/${todolistId}`)
    }
}

export const tasksAPI = {
    updateTask(todolistId: string, taskId: string, title: string) {
        return instance.put<ResponseType<TaskType>>(`todo-lists/${todolistId}/tasks/${taskId}`, {title})
    },
    getTasks(todolistId: string) {
        return instance.get<GetTasksType>(`todo-lists/${todolistId}/tasks`)
    },
    createTask(todolistId: string, title: string) {
        return instance.post<ResponseType<TaskType>>(`todo-lists/${todolistId}/tasks`, {title})
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType<{}>>(`todo-lists/${todolistId}/tasks/${taskId}`)
    }
}

export type TodolistType= {
    id: string
    addedDate: string
    order: number
    title: string
}
type ResponseType<D> = {
    resultCode: number
    messages: Array<string>
    data: D
}
export enum TaskStatuses {
    New= 0,
    InProgress= 1,
    Completed = 2,
    Draft = 3
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    High = 2,
    Urgently = 3,
    Later = 4
}
type TaskType= {
    id: string
    title: string
    description: string | null
    todoListId: string
    order: number
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string | null
    deadline: string | null
    addedDate: string
}

type GetTasksType = {
    items: Array<TaskType>
    totalCount: number
    error: string | null
}


