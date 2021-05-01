import React, {useCallback} from "react";
import AddItemForm from "../AddItemForm";
import EditableSpan from "./EditableSpan";
import {Button, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../state/store";
import {addTaskAC, TaskType} from "../reducers/tasks-reducer";
import {
    changeFilterAC,
    changeTodolistTitleAC,
    FilterValuesType,
    removeTodolistAC,
    TodolistDomainType
} from "../reducers/tl-reducer";
import Task from "./Task/Task";
import {TaskStatuses} from "../api/todolist-api";

type TodoListPropsType = {
    id: string
    title: string
    filter: FilterValuesType
    tasks: Array<TaskType>
    removeTask: (taskId: string, todoListID: string) => void
    addTask: (title: string, todoListID: string) => void
    changeFilter: (newFilterValue: FilterValuesType, todoListID: string) => void
    changeStatus: (taskId: string, status: TaskStatuses, todoListID: string) => void
    removeTodoList: (todoListID: string) => void
    changeTaskTitle: (title: string, taskId: string, todoListId: string) => void
    changeTodoListTitle: (title: string, todoListId: string) => void
}

const Todolist = React.memo((props: TodoListPropsType) => {
    console.log("Todo list")

    let todoList = useSelector<AppRootStateType, TodolistDomainType>(state => state.todoLists.filter(tl => tl.id === props.id)[0])
    let tasks = useSelector<AppRootStateType, TaskType[]>(state => state.tasks[props.id])
    const dispatch = useDispatch()

    let allToDoListTasks = props.tasks;
    let todoListTasks = allToDoListTasks;
    if (props.filter === "active") {
        todoListTasks = allToDoListTasks.filter(t => t.status !== TaskStatuses.Completed)
    } else if (props.filter === "completed") {
        todoListTasks = allToDoListTasks.filter(t => t.status === TaskStatuses.Completed)
    }

    const createTask = useCallback((title: string) => {
        dispatch(addTaskAC(title, todoList.id))
    }, [dispatch])

    const changeTodoListTitle = useCallback((title: string) => {
        dispatch(changeTodolistTitleAC(title, todoList.id))
    }, [dispatch])

    const removeTodoList = useCallback(() => {
        dispatch(removeTodolistAC(todoList.id))
    }, [dispatch])

    return (
        <div>
            <h3><EditableSpan title={todoList.title} changeTitle={changeTodoListTitle}/>
                <IconButton onClick={removeTodoList}>
                    <Delete/>
                </IconButton>
            </h3>
            <AddItemForm createItem={createTask}/>
            <div>
                {todoListTasks.map(t => {
                    return <Task key={t.id}
                                 id={t.id}
                                 todoListId={props.id}
                                 title={t.title}
                                 status={t.status}
                    />
                })}
            </div>
            <div>
                <Button color={todoList.filter === 'all' ? "primary" : "default"}
                        variant={"contained"}
                        size={"small"}
                        onClick={() => {
                            dispatch(changeFilterAC(todoList.id, "all"))
                        }}>All
                </Button>
                <Button color={todoList.filter === "active" ? "primary" : "default"}
                        variant={"contained"}
                        size={"small"}
                        onClick={() => {
                            dispatch(changeFilterAC(todoList.id, "active"))
                        }}>Active
                </Button>
                <Button color={todoList.filter === 'completed' ? "primary" : "default"}
                        variant={"contained"}
                        size={"small"}
                        onClick={() => {
                            dispatch(changeFilterAC(todoList.id, "completed"))
                        }}>Completed
                </Button>
            </div>
        </div>
    )
})

export default Todolist