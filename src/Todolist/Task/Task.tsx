import React, {ChangeEvent, useCallback} from "react";
import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "../../reducers/tasks-reducer";
import {Checkbox, IconButton} from "@material-ui/core";
import EditableSpan from "../EditableSpan";
import {Delete} from "@material-ui/icons";
import {useDispatch} from "react-redux";
import {TaskStatuses} from "../../api/todolist-api";

export type TaskPropsType = {
    id: string
    todoListId: string
    title: string
    status: TaskStatuses
}

const Task = React.memo((props: TaskPropsType) => {
    console.log("Task is called")
    const dispatch = useDispatch()
    const removeTask = () => {
        dispatch(removeTaskAC(props.id, props.todoListId))
    }

    const changeStatus = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New

        dispatch(changeTaskStatusAC(props.id, status, props.todoListId))
    }, [dispatch, props.id, props.todoListId])

    const changeTaskTitle = useCallback((title: string) => {
        dispatch(changeTaskTitleAC(title, props.id, props.todoListId))
    }, [dispatch, props.id, props.todoListId])

    return (
        <div className={props.status === TaskStatuses.Completed ? "isDone" : ""}>
            <Checkbox checked={props.status === TaskStatuses.Completed}
                      onChange={changeStatus}
                      color={"secondary"}
            ></Checkbox>
            <EditableSpan title={props.title} changeTitle={changeTaskTitle}/>
            <IconButton onClick={removeTask}>
                <Delete />
            </IconButton>
        </div>
    )
})

export default Task
