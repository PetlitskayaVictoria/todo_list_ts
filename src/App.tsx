import React, {useCallback, useEffect, useReducer, useState} from 'react';
import './App.css';
import Todolist from "./Todolist/Todolist";

import AddItemForm from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {
    addTodolistAC,
    changeFilterAC,
    changeTodolistTitleAC, createTodoListTC, FilterValuesType, getTodoListsTC,
    removeTodolistAC, TodolistDomainType,
} from "./reducers/tl-reducer";
import {
    addTaskAC,
    changeTaskTitleAC, deleteTaskTC,
    removeTaskAC, TaskType,
} from "./reducers/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import {TaskStatuses} from "./api/todolist-api";

export type TaskStateType = {
    [key: string]: Array<TaskType>
}

function App() {

    const todoLists = useSelector<AppRootStateType, TodolistDomainType[]>(state => state.todoLists)
    const tasks = useSelector<AppRootStateType, TaskStateType>(state => state.tasks)

    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getTodoListsTC())
    }, [])

   const removeTask = useCallback((taskId: string, todoListID: string) => {
        dispatch(deleteTaskTC(todoListID, taskId))
    }, [dispatch])

    // const addTask = useCallback((title: string, todoListID: string) => {
    //     dispatch(addTaskAC(title, todoListID))
    // }, [dispatch])

    const changeFilter = useCallback((newFilterValue: FilterValuesType, todoListID: string) => {
        dispatch(changeFilterAC(todoListID, newFilterValue))
    }, [dispatch])

    // const changeStatus = useCallback((taskId: string, status: TaskStatuses, todoListID: string) => {
    //     dispatch(changeTaskStatusAC(taskId, status, todoListID))
    // }, [dispatch])

    const removeTodoList = useCallback((todoListID: string) => {
        let action = removeTodolistAC(todoListID)
        dispatch(action)
    }, [dispatch])

    const createTodoList = useCallback((title: string) => {
        dispatch(createTodoListTC(title))
    }, [dispatch])

    // const changeTaskTitle = useCallback((title: string, taskId: string, todoListId: string) => {
    //     dispatch(changeTaskTitleAC(taskId, title, todoListId))
    // }, [dispatch])
    //
    // const changeTodoListTitle = useCallback((title: string, todoListId: string) => {
    //     dispatch(changeTodolistTitleAC(todoListId, title))
    // }, [dispatch])

    const lists = todoLists.map(tl => {
        let allToDoListTasks = tasks[tl.id];

        return <Grid item key={tl.id}>
            <Paper elevation={3} style={{padding : "25px"}}>
                <Todolist id={tl.id}
                          title={tl.title}
                          tasks={allToDoListTasks}
                          removeTask={removeTask}
                          // addTask={addTask}
                          changeFilter={changeFilter}
                          // changeStatus={changeStatus}
                          filter={tl.filter}
                          removeTodoList={removeTodoList}
                          // changeTaskTitle={changeTaskTitle}
                          // changeTodoListTitle={changeTodoListTitle}
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
            <Container fixed>
                <Grid container style={{padding : "30px 0"}}>
                    <AddItemForm createItem={createTodoList}/>
                </Grid>
                <Grid container spacing={4}>
                    {lists}
                </Grid>

            </Container>
        </div>
    )
}

export default App;
