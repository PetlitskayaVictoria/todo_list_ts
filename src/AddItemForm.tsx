import React, {ChangeEvent, KeyboardEvent, useState} from 'react';

type AddItemFormType = {
    createItem: (title: string) => void
}


function AddItemForm(props: AddItemFormType) {
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
        setError(null)
    }
    const onKeyPressAddTask = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") createItem()
    }

    return (
        <div>
            <input className={error ? "error" : ""}
                   value={title}
                   onChange={changeInputValue}
                   onKeyPress={onKeyPressAddTask}
                   onBlur={() => {setError(null)}}

            />
            <button onClick={createItem}>+</button>
            { error && <div className={"errorMessage"}>{error}</div>}
        </div>
    )
}

export default AddItemForm;
