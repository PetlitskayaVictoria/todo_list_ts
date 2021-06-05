import React, {useCallback, useEffect} from "react";
import AddItemForm from "../../../components/AddItemForm/AddItemForm";
import EditableSpan from "../../../components/EditableSpan/EditableSpan";
import {Button, Grid, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../../app/store";
import {addTaskTC, getTasksTC, TaskDomainType, TaskType} from "./Task/tasks-reducer";
import {
    changeFilterAC,
    changeTodolistTitleTC, deleteTodoListTC,
    FilterValuesType,
    TodolistDomainType
} from "./tl-reducer";
import Task from "./Task/Task";
import {TaskStatuses} from "../../../api/todolist-api";
import {RequestStatusType} from "../../../app/app-reducer";

type TodoListPropsType = {
    id: string
    title: string
    filter: FilterValuesType
    entityStatus: RequestStatusType
    removeTask: (taskId: string, todoListID: string) => void
    changeFilter: (newFilterValue: FilterValuesType, todoListID: string) => void
}

const Todolist = React.memo((props: TodoListPropsType) => {

    let todoList = useSelector<AppRootStateType, TodolistDomainType>(state => state.todoLists.filter(tl => tl.id === props.id)[0])
    let tasks = useSelector<AppRootStateType, TaskDomainType[]>(state => state.tasks[props.id])
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getTasksTC(props.id))
    }, [])

    let allToDoListTasks = tasks;
    let todoListTasks = allToDoListTasks;
    if (props.filter === "active") {
        todoListTasks = allToDoListTasks.filter(t => t.status !== TaskStatuses.Completed)
    } else if (props.filter === "completed") {
        todoListTasks = allToDoListTasks.filter(t => t.status === TaskStatuses.Completed)
    }

    const createTask = useCallback((title: string) => {
        dispatch(addTaskTC(todoList.id, title))
    }, [dispatch])

    const changeTodoListTitle = useCallback((title: string) => {
        dispatch(changeTodolistTitleTC(todoList.id, title))
    }, [dispatch])

    const removeTodoList = useCallback(() => {
        dispatch(deleteTodoListTC(todoList.id))
    }, [dispatch])

    return (
        <div>
            <h3><EditableSpan title={todoList.title} changeTitle={changeTodoListTitle}/>
                <IconButton onClick={removeTodoList} disabled={props.entityStatus === 'loading'}>
                    <Delete/>
                </IconButton>
            </h3>
            <AddItemForm createItem={createTask} disabled={props.entityStatus === 'loading'}/>
            <div style={{marginTop: "20px"}}>
                {todoListTasks.map(t => {
                    return <Task key={t.id}
                                 id={t.id}
                                 todoListId={props.id}
                                 title={t.title}
                                 status={t.status}
                                 entityStatus={t.entityStatus}
                    />
                })}
            </div>
            <div style={{marginTop: "20px"}}>
                <Button color={todoList.filter === 'all' ? "secondary" : "default"}
                        variant={todoList.filter === 'all' ? "outlined" : undefined}
                        size={"small"}
                        onClick={() => {
                            dispatch(changeFilterAC({id: todoList.id, newValue: "all"}))
                        }}>All
                </Button>
                <Button color={todoList.filter === "active" ? "secondary" : "default"}
                        variant={todoList.filter === 'active' ? "outlined" : undefined}
                        size={"small"}
                        onClick={() => {
                            dispatch(changeFilterAC({id: todoList.id, newValue: "active"}))
                        }}>Active
                </Button>
                <Button color={todoList.filter === 'completed' ? "secondary" : "default"}
                        variant={todoList.filter === 'completed' ? "outlined" : undefined}
                        size={"small"}
                        onClick={() => {
                            dispatch(changeFilterAC({id: todoList.id, newValue: "completed"}))
                        }}>Completed
                </Button>
            </div>
        </div>
    )
})

export default Todolist
