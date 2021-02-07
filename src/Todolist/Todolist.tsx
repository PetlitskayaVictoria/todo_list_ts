import React, {useState, KeyboardEvent, ChangeEvent} from "react";
import {FilterValuesType, TaskType} from "../App";

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
}

function Todolist(props: TodoListPropsType) {
    const [title, setTitle] = useState<string>("")
    const [error, setError] = useState<string | null>(null)
    const createTask = () => {
        if (title.trim()) {
            props.addTask(title, props.id)
            setTitle("")
        } else {
            setTitle("")
            setError("Name is required")
        }
    }
    const changeInputValue = (event: ChangeEvent<HTMLInputElement>) => {
        setTitle(event.currentTarget.value)
        setError(null)
    }
    const onKeyPressAddTask = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") createTask()
    }

    const tasks = props.tasks.map(t => {
        const removeTask = () => {
            props.removeTask(t.id, props.id)
        }

        const changeStatus = (e: ChangeEvent<HTMLInputElement>) => {
            props.changeStatus(t.id, e.currentTarget.checked, props.id)
        }

        return (
            <li key={t.id} className={t.isDone ? "isDone" : ""}>
                <input type="checkbox"
                       checked={t.isDone}
                       onChange={changeStatus}
                />
                <span>{t.title}</span>
                <button onClick={removeTask}>X</button>
            </li>
        )
    })

    return (
        <div>
            <h3>{props.title}<button onClick={ () => {
                props.removeTodoList(props.id)
            }}>x</button></h3>
            <div>

                <input className={error ? "error" : ""}
                       value={title}
                       onChange={changeInputValue}
                       onKeyPress={onKeyPressAddTask}
                       onBlur={() => {setError(null)}}

                />
                <button onClick={createTask}>+</button>
                { error && <div className={"errorMessage"}>{error}</div>}

            </div>
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
