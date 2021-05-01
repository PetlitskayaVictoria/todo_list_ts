import React, {useEffect, useState} from 'react'
import {tasksAPI} from "../api/todolist-api";

export default {
    title: 'API-Tasks'
}

export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    const todolistId = '74fe1fc8-245b-4a76-b56b-5153deddf837'
    useEffect(() => {
        tasksAPI.getTasks(todolistId)
            .then((res) => setState(res.data))
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const CreateTask = () => {
    const [state, setState] = useState<any>(null)
    const todolistId = '74fe1fc8-245b-4a76-b56b-5153deddf837'
    const title = "Watch a movie"
    useEffect(() => {
        tasksAPI.createTask(todolistId, title)
            .then((res) => setState(res.data))
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const DeleteTask = () => {
    const [state, setState] = useState<any>(null)
    const todoListId = '74fe1fc8-245b-4a76-b56b-5153deddf837'
    const taskId = '846670ea-8117-4cdc-add6-3344305d7953'
    useEffect(() => {
        tasksAPI.deleteTask(todoListId, taskId)
            .then((res) => setState(res.data))
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const UpdateTask = () => {
    const [state, setState] = useState<any>(null)
    const todoListId = '74fe1fc8-245b-4a76-b56b-5153deddf837'
    const taskId = '9331a769-91bd-451d-927b-9d7252310ef2'
    const title = 'Watch a JS lesson'
    useEffect(() => {
        tasksAPI.updateTask(todoListId, taskId, title)
            .then((res) => setState(res.data))
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
