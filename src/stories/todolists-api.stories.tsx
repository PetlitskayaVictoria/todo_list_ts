import React, {useEffect, useState} from 'react'
import {todolistAPI} from "../api/todolist-api";

export default {
    title: 'API-Todolists'
}

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistAPI.getTodoLists()
            .then((res) => setState(res.data))

    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    const title = "Plans for the big weekend"
    useEffect(() => {
        todolistAPI.createTodolist(title)
            .then((res) => setState(res.data))
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    const todoListId = 'e700b6df-5a95-4095-8488-93f021a0eeb7'
    useEffect(() => {
        todolistAPI.deleteTodolist(todoListId)
            .then((res) => setState(res.data))
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    const todoListId = 'e700b6df-5a95-4095-8488-93f021a0eeb7'
    const title = 'Plans for the weekend are changed 2'
    useEffect(() => {
        todolistAPI.updateTodolist(todoListId, title).then((res) => setState(res.data))
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
