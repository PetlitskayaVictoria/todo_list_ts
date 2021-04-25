import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {IconButton, TextField} from "@material-ui/core";
import {AddBox} from "@material-ui/icons";

export type AddItemFormType = {
    createItem: (title: string) => void
}


const AddItemForm = React.memo((props: AddItemFormType) =>  {
    const [error, setError] = useState<string | null>(null)
    const [title, setTitle] = useState<string>("")

    const createItem = () => {
        if (title.trim()) {
            props.createItem(title)
            setTitle("")
        } else {
            setTitle("")
            setError("Name is required")
        }
    }

    const changeInputValue = (event: ChangeEvent<HTMLInputElement>) => {
        setTitle(event.currentTarget.value)
        // setError(null)
    }
    const onKeyPressAddTask = (event: KeyboardEvent<HTMLInputElement>) => {
        if (error !== null) setError(null)
        if (event.key === "Enter") createItem()
    }

    return (
        <div>
            <TextField variant={"outlined"}
                       value={title}
                       onChange={changeInputValue}
                       onKeyPress={onKeyPressAddTask}
                       onBlur={() => {setError(null)}}
                       helperText={error ? "Name is required" : ""}
                       label={"Title"}
                       error={!!error}
            />

            <IconButton onClick={createItem}>
                <AddBox/>
            </IconButton>
        </div>
    )
})

export default AddItemForm;
