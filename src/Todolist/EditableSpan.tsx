import React, {ChangeEvent, KeyboardEvent, useState} from 'react';

type EditableSpanType = {
    title: string
    changeTitle: (title: string) => void
}

function EditableSpan (props: EditableSpanType) {
    const [editMode, setEditMode] = useState<boolean>(false)
    const [title, setTitle] = useState<string>(props.title)
    const editModeOn = () => {
        setEditMode(true)
    }
    const editModeOff = () => {
        props.changeTitle(title)
        setEditMode(false)
    }

    const saveOnClick = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            editModeOff()
        }
    }

    const changeInputValue = (event: ChangeEvent<HTMLInputElement>) => {
        setTitle(event.currentTarget.value)
    }


    return (
        editMode ? <input value={title}
                          onChange={changeInputValue}
                          onBlur={editModeOff}
                          autoFocus={true}
                          onKeyPress={saveOnClick}
            /> :
            <span onDoubleClick={editModeOn}>{props.title}</span>
    )
}

export default EditableSpan
