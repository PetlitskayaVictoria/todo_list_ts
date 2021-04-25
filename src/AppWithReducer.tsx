import React, {useReducer, useState} from 'react';
import './App.css';
import Todolist from "./Todolist/Todolist";
import {v1} from "uuid";
import AddItemForm from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {
    addTodolistAC,
    changeFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC,
    todoListReducer
} from "./reducers/tl-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "./reducers/tasks-reducer";


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

function AppWithReducer() {

    const toDoListID1 = v1()
    const toDoListID2 = v1()
    const [todoLists, dispatchToTodoLists] = useReducer(todoListReducer, [
            {id : toDoListID1, title : "What to learn", filter : "all"},
            {id : toDoListID2, title : "What to buy", filter : "all"}
        ]
    )

    const [tasks, dispatchToTasks] = useReducer(tasksReducer,
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
        dispatchToTasks(removeTaskAC(taskId, todoListID))
    }

    function addTask(title: string, todoListID: string) {
        dispatchToTasks(addTaskAC(title, todoListID))
    }

    function changeFilter(newFilterValue: FilterValuesType, todoListID: string) {
        dispatchToTodoLists(changeFilterAC(todoListID, newFilterValue))
    }

    function changeStatus(taskId: string, isDone: boolean, todoListID: string) {
        dispatchToTasks(changeTaskStatusAC(taskId, isDone, todoListID))
    }

    function removeTodoList(todoListID: string) {
        let action = removeTodolistAC(todoListID)
        dispatchToTodoLists(action)
        dispatchToTasks(action)
    }

    function createTodoList(title: string) {
        let action = addTodolistAC(title)
        dispatchToTodoLists(action)
        dispatchToTasks(action)
    }

    function changeTaskTitle(title: string, taskId: string, todoListId: string) {
        dispatchToTasks(changeTaskTitleAC(taskId, title, todoListId))
    }

    function changeTodoListTitle(title: string, todoListId: string) {
        dispatchToTodoLists(changeTodolistTitleAC(todoListId, title))
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

export default AppWithReducer;
