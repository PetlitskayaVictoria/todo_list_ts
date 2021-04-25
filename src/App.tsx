import React, {useCallback, useState} from 'react';
import './App.css';
import Todolist from "./Todolist/Todolist";
import {v1} from "uuid";
import AddItemForm from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";


export type TaskType = {
    id: string,
    title: string,
    isDone: boolean
}

export type TodoListType = {
    id: string
    title: string
    filter: FilterValuesType
}

export type TaskStateType = {
    [key: string]: Array<TaskType>
}

export type FilterValuesType = "all" | "active" | "completed"

function App() {

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

    function removeTask(taskId: string, todoListID: string) {
        const todoListTasks = tasks[todoListID]
        tasks[todoListID] = todoListTasks.filter(t => t.id !== taskId)
        setTasks({...tasks})
    }

    const addTask = useCallback((title: string, todoListID: string) => {
        const newTask = {
            id : v1(),
            title : title,
            isDone : false
        }

        const updatedTasks = tasks[todoListID]
        tasks[todoListID] = [newTask, ...updatedTasks]
        setTasks({...tasks})
    }, [])

    function changeFilter(newFilterValue: FilterValuesType, todoListID: string) {
        const todoList = todoLists.find(tl => tl.id === todoListID)
        if (todoList) todoList.filter = newFilterValue
        setTodoLists([...todoLists])
    }

    function changeStatus(taskId: string, isDone: boolean, todoListID: string) {

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

    function removeTodoList(todoListID: string) {
        setTodoLists(todoLists.filter(tl => tl.id !== todoListID))
        delete tasks[todoListID]
        setTasks({...tasks})
    }

    const createTodoList = useCallback((title: string) => {
        const newTodoList: TodoListType = {
            id : v1(),
            title : title,
            filter : "all"
        }
        setTodoLists([newTodoList, ...todoLists])
        setTasks({...tasks, [newTodoList.id] : []})
    }, [])

    function changeTaskTitle(title: string, taskId: string, todoListId: string) {
        const task = tasks[todoListId].find(t => t.id === taskId)
        if (task) task.title = title
        setTasks({...tasks})
    }

    function changeTodoListTitle(title: string, todoListId: string) {
        const todoList = todoLists.find(tl => tl.id === todoListId)
        if (todoList) todoList.title = title
        setTodoLists([...todoLists])
    }

    const listTodos = todoLists.map(tl => {
        let todoListTasks = tasks[tl.id];
        if (tl.filter === "active") {
            todoListTasks = tasks[tl.id].filter(t => !t.isDone)
        } else if (tl.filter === "completed") {
            todoListTasks = tasks[tl.id].filter(t => t.isDone)
        }
        return <Grid item key={tl.id}>
            <Paper elevation={3} style={{padding: "25px"}}>
                <Todolist id={tl.id}
                         title={tl.title}
                         tasks={todoListTasks}
                         removeTask={removeTask}
                         addTask={addTask}
                         changeFilter={changeFilter}
                         changeStatus={changeStatus}
                         filter={tl.filter}
                         removeTodoList={removeTodoList}
                         changeTaskTitle={changeTaskTitle}
                         changeTodoListTitle={changeTodoListTitle}
            />
            </Paper>
        </Grid>
    })

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed >
                <Grid container style={{padding : "30px 0"}}>
                    <AddItemForm createItem={createTodoList}/>
                </Grid>
                <Grid container spacing={4}>
                    {listTodos}
                </Grid>

            </Container>
        </div>
    )
}

export default App;
