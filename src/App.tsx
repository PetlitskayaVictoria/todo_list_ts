import React, {useCallback, useState} from 'react';
import './App.css';
import Todolist from "./Todolist/Todolist";
import {v1} from "uuid";
import AddItemForm from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {FilterValuesType, TodolistDomainType} from "./reducers/tl-reducer";
import {TaskType} from "./reducers/tasks-reducer";
import {TaskPriorities, TaskStatuses} from "./api/todolist-api";


export type TaskStateType = {
    [key: string]: Array<TaskType>
}


function App() {

    const toDoListID1 = v1()
    const toDoListID2 = v1()
    const [todoLists, setTodoLists] = useState<Array<TodolistDomainType>>([
            {id : toDoListID1, title : "What to learn", addedDate: '', order: 0, filter : "all"},
            {id : toDoListID2, title : "What to buy", addedDate: '', order: 0, filter : "all"}
        ]
    )

    const [tasks, setTasks] = useState<TaskStateType>(
        {
            [toDoListID1] : [
                {id: v1(), title: "JS", description: '', todoListId: toDoListID1, order: 0, status: TaskStatuses.Completed, priority: TaskPriorities.Middle, startDate: '', deadline: '', addedDate: ''},
                {id: v1(), title: "CSS", description: '', todoListId: toDoListID1, order: 0, status: TaskStatuses.New, priority: TaskPriorities.High, startDate: '', deadline: '', addedDate: ''},
                {id: v1(), title: "React", description: '', todoListId: toDoListID1, order: 0, status: TaskStatuses.New, priority: TaskPriorities.Later, startDate: '', deadline: '', addedDate: ''},
                {id: v1(), title: "Angular", description: '', todoListId: toDoListID1, order: 0, status: TaskStatuses.Completed, priority: TaskPriorities.Middle, startDate: '', deadline: '', addedDate: ''},
            ],
            [toDoListID2] : [
                {id: v1(), title: "Books", description: '', todoListId: toDoListID2, order: 0, status: TaskStatuses.Completed, priority: TaskPriorities.Middle, startDate: '', deadline: '', addedDate: ''},
                {id: v1(), title: "Cake", description: '', todoListId: toDoListID2, order: 0, status: TaskStatuses.New, priority: TaskPriorities.Middle, startDate: '', deadline: '', addedDate: ''},
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
            title: title,
            description: '',
            todoListId: todoListID,
            order: 0,
            status: TaskStatuses.New,
            priority: TaskPriorities.Middle,
            startDate: '',
            deadline: '',
            addedDate: ''
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

    function changeStatus(taskId: string, status: TaskStatuses, todoListID: string) {

        const newTasks = tasks[todoListID].map(t => {
                if (t.id === taskId) {
                    return {...t, status}
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
        const newTodoList: TodolistDomainType = {
            id: v1(),
            title,
            addedDate: '',
            order: 0,
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
            todoListTasks = tasks[tl.id].filter(t => t.status !== TaskStatuses.Completed)
        } else if (tl.filter === "completed") {
            todoListTasks = tasks[tl.id].filter(t => t.status === TaskStatuses.Completed)
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
