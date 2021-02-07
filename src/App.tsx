import React, {useState} from 'react';
import './App.css';
import Todolist from "./Todolist/Todolist";
import {v1} from "uuid";

export type TaskType = {
    id: string,
    title: string,
    isDone: boolean

}

type TodoListType = {
    id: string
    title: string
    filter: FilterValuesType
}

type TaskStateType = {
    [key: string]: Array<TaskType>
}

export type FilterValuesType = "all" | "active" | "completed"

function App() {

    // let [tasks, setTasks] = useState<Array<TaskType>>([
    //     {id : v1(), title : "JS", isDone : true},
    //     {id : v1(), title : "CSS", isDone : false},
    //     {id : v1(), title : "React", isDone : false},
    //     {id : v1(), title : "Angular", isDone : false},
    //     {id : v1(), title : "Java", isDone : true},
    // ])
    const toDoListID1 = v1()
    const toDoListID2 = v1()
    const [todoLists, setTodoLists] = useState<Array<TodoListType>>([
            {id : toDoListID1, title : "What to learn", filter : "all"},
            {id : toDoListID2, title : "What to buy", filter : "all"}
        ]
    )

    const [tasks, setTasks] = useState<TaskStateType>(
        {
            [toDoListID1] : [
                {id : v1(), title : "JS", isDone : true},
                {id : v1(), title : "CSS", isDone : false},
                {id : v1(), title : "React", isDone : false},
                {id : v1(), title : "Angular", isDone : false},
                {id : v1(), title : "Java", isDone : true},
            ],
            [toDoListID2] : [
                {id : v1(), title : "Books", isDone : true},
                {id : v1(), title : "Cake", isDone : false},
            ]
        }
    )

    // const [filter, setFilter] = useState<FilterValuesType>("all")

    function removeTask(taskId: string, todoListID: string) {
        const todoListTasks = tasks[todoListID]
        tasks[todoListID] = todoListTasks.filter(t => t.id !== taskId)
        setTasks({...tasks})
    }

    function addTask(title: string, todoListID: string) {
        const newTask = {
            id : v1(),
            title : title,
            isDone : false
        }

        const updatedTasks = tasks[todoListID]
        tasks[todoListID] = [newTask, ...updatedTasks]
        setTasks({...tasks})
    }

    function changeFilter(newFilterValue: FilterValuesType, todoListID: string) {
        const todoList = todoLists.find(tl => tl.id === todoListID)
        if (todoList) todoList.filter = newFilterValue
        setTodoLists([...todoLists])
    }

    function changeStatus(taskId: string, isDone: boolean, todoListID: string) {
        // const task = tasks.find(t => t.id === taskId)
        //
        // if (task) {
        //     task.isDone = isDone
        // }
        // setTasks([...tasks])

        const newTasks = tasks[todoListID].map(t => {
                if (t.id === taskId) {
                    return {...t, isDone : isDone}
                } else {
                    return t
                }
            }
        )
        tasks[todoListID] = newTasks
        setTasks({...tasks})
    }

    function removeTodoList (todoListID: string) {
        setTodoLists(todoLists.filter(tl => tl.id !== todoListID))
        delete tasks[todoListID]
        setTasks({...tasks})
    }

    return (
        <div className="App">
            {

                todoLists.map(tl => {
                    let todoListTasks = tasks[tl.id];
                    if(tl.filter === "active") {
                        todoListTasks = tasks[tl.id].filter( t => !t.isDone)
                    } else if (tl.filter === "completed") {
                        todoListTasks = tasks[tl.id].filter( t => t.isDone)
                    }
                    return <Todolist key={tl.id}
                                     id={tl.id}
                                     title={tl.title}
                                     tasks={todoListTasks}
                                     removeTask={removeTask}
                                     addTask={addTask}
                                     changeFilter={changeFilter}
                                     changeStatus={changeStatus}
                                     filter={tl.filter}
                                     removeTodoList={removeTodoList}
                    />
                })
            }

        </div>
    )
}

export default App;
