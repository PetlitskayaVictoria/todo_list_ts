import React, {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../app/store";
import {
    changeFilterAC,
    createTodoListTC,
    FilterValuesType,
    getTodoListsTC,
    TodolistDomainType
} from "./TodoList/tl-reducer";
import {deleteTaskTC} from "./TodoList/Task/tasks-reducer";
import {Grid, Paper} from "@material-ui/core";
import AddItemForm from "../../components/AddItemForm/AddItemForm";
import Todolist from "./TodoList/Todolist";
import App, {TaskStateType} from "../../app/App";

const TodolistsList: React.FC = () => {
    const todoLists = useSelector<AppRootStateType, TodolistDomainType[]>(state => state.todoLists)
    const tasks = useSelector<AppRootStateType, TaskStateType>(state => state.tasks)

    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getTodoListsTC())
    }, [])

    const removeTask = useCallback((taskId: string, todoListID: string) => {
        dispatch(deleteTaskTC(todoListID, taskId))
    }, [dispatch])

    const changeFilter = useCallback((newFilterValue: FilterValuesType, todoListID: string) => {
        dispatch(changeFilterAC(todoListID, newFilterValue))
    }, [dispatch])


    const createTodoList = useCallback((title: string) => {
        dispatch(createTodoListTC(title))
    }, [dispatch])

    return (
        <>
            <Grid container style={{padding : "30px 0"}}>
                <AddItemForm createItem={createTodoList}/>
            </Grid>
            <Grid container spacing={4}>
                {
                    todoLists.map(tl => {
                        let allToDoListTasks = tasks[tl.id];

                        return <Grid item key={tl.id}>
                            <Paper elevation={3} style={{padding : "25px"}}>
                                <Todolist id={tl.id}
                                          title={tl.title}
                                          tasks={allToDoListTasks}
                                          removeTask={removeTask}
                                          changeFilter={changeFilter}
                                          filter={tl.filter}
                                />
                            </Paper>
                        </Grid>
                    })}
            </Grid>
        </>
    )
}

export default TodolistsList;
