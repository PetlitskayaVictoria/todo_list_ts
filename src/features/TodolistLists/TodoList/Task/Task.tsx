import React, {ChangeEvent, useCallback} from "react";
import {
    deleteTaskTC, updateTaskTC
} from "./tasks-reducer";
import {Checkbox, IconButton} from "@material-ui/core";
import EditableSpan from "../../../../components/EditableSpan/EditableSpan";
import {Delete} from "@material-ui/icons";
import {useDispatch} from "react-redux";
import {TaskStatuses} from "../../../../api/todolist-api";
import {RequestStatusType} from "../../../../app/app-reducer";

export type TaskPropsType = {
    id: string
    todoListId: string
    title: string
    entityStatus: RequestStatusType
    status: TaskStatuses
}

const Task = React.memo((props: TaskPropsType) => {
    const dispatch = useDispatch()
    const removeTask = () => {
        dispatch(deleteTaskTC(props.todoListId, props.id))
    }

    const changeStatus = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New

        dispatch(updateTaskTC(props.todoListId, props.id, {status}))
    }, [dispatch, props.id, props.todoListId])

    const changeTaskTitle = useCallback((title: string) => {
        dispatch(updateTaskTC(props.todoListId, props.id, {title}))
    }, [dispatch, props.id, props.todoListId])

    return (
        <div className={props.status === TaskStatuses.Completed ? "isDone" : ""}>
            <Checkbox checked={props.status === TaskStatuses.Completed}
                      onChange={changeStatus}
                      color={"secondary"}
                      disabled={props.entityStatus === 'loading'}
            ></Checkbox>
            <EditableSpan title={props.title}
                          changeTitle={changeTaskTitle}
                          disabled={props.entityStatus === 'loading'}
            />
            <IconButton onClick={removeTask} disabled={props.entityStatus === 'loading'}>
                <Delete />
            </IconButton>
        </div>
    )
})

export default Task
