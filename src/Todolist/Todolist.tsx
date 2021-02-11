import React, {ChangeEvent} from "react";
import {FilterValuesType, TaskType} from "../App";
import AddItemForm from "../AddItemForm";
import EditableSpan from "./EditableSpan";

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

function Todolist(props: TodoListPropsType) {
    const createTask = (title: string) => {
        props.addTask(title, props.id)
    }

    const changeTodoListTitle = (title: string) => {
        props.changeTodoListTitle(title, props.id)
    }

    const tasks = props.tasks.map(t => {
        const removeTask = () => {
            props.removeTask(t.id, props.id)
        }

        const changeStatus = (e: ChangeEvent<HTMLInputElement>) => {
            props.changeStatus(t.id, e.currentTarget.checked, props.id)
        }

        const changeTaskTitle = (title: string) => {
            props.changeTaskTitle(title, t.id, props.id)
        }

        return (
            <li key={t.id} className={t.isDone ? "isDone" : ""}>
                <input type="checkbox"
                       checked={t.isDone}
                       onChange={changeStatus}
                />
                <EditableSpan title={t.title} changeTitle={changeTaskTitle}/>
                <button onClick={removeTask}>X</button>
            </li>
        )
    })

    return (
        <div>
            <h3><EditableSpan title={props.title} changeTitle={changeTodoListTitle} /><button onClick={ () => {
                props.removeTodoList(props.id)
            }}>x</button></h3>
            <AddItemForm createItem={createTask}/>
            <ul>
                {tasks}
            </ul>
            <div>
                <button className={props.filter === 'all' ? "active-filter" : ""}
                        onClick={() => {
                            props.changeFilter("all", props.id)
                        }}>All
                </button>
                <button className={props.filter === 'active' ? "active-filter" : ""}
                        onClick={() => {
                            props.changeFilter("active", props.id)
                        }}>Active
                </button>
                <button className={props.filter === 'completed' ? "active-filter" : ""}
                        onClick={() => {
                            props.changeFilter("completed", props.id)
                        }}>Completed
                </button>
            </div>
        </div>
    )
}

export default Todolist
