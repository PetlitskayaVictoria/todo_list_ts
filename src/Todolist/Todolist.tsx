import React, {ChangeEvent, useCallback} from "react";
import {FilterValuesType, TaskType, TodoListType} from "../App";
import AddItemForm from "../AddItemForm";
import EditableSpan from "./EditableSpan";
import {Button, Checkbox, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../state/store";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "../reducers/tasks-reducer";
import {changeFilterAC, changeTodolistTitleAC, removeTodolistAC} from "../reducers/tl-reducer";
import Task from "./Task/Task";

type TodoListPropsType = {
    id: string
    title: string
    filter: FilterValuesType
    tasks: Array<TaskType>
    removeTask: (taskId: string, todoListID: string) => void
    addTask: (title: string, todoListID: string) => void
    changeFilter: (newFilterValue: FilterValuesType, todoListID: string) => void
    changeStatus: (taskId: string, isDone: boolean, todoListID: string) => void
    removeTodoList: (todoListID: string) => void
    changeTaskTitle: (title: string, taskId: string, todoListId: string) => void
    changeTodoListTitle: (title: string, todoListId: string) => void
}

const Todolist = React.memo((props: TodoListPropsType) => {
    console.log("Todo list")

    let todoList = useSelector<AppRootStateType, TodoListType>(state => state.todoLists.filter(tl => tl.id === props.id)[0])
    let tasks = useSelector<AppRootStateType, TaskType[]>(state => state.tasks[props.id])
    const dispatch = useDispatch()

    let allToDoListTasks = props.tasks;
    let todoListTasks = allToDoListTasks;
    if (props.filter === "active") {
        todoListTasks = allToDoListTasks.filter(t => !t.isDone)
    } else if (props.filter === "completed") {
        todoListTasks = allToDoListTasks.filter(t => t.isDone)
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
                                 isDone={t.isDone}
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
