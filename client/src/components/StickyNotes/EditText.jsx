import React from "react";
import { EditTextInput } from "./EditTextInput";


const RETURN_KEY = 13;
const ESCAPE_KEY = 27;

export function EditText({
    x,
    y,
    isEditing,
    onToggleEdit,
    onChange,
    text,
    width,
    height
}) {
    function handleEscapeKeys(e) {
        if ((e.keyCode === RETURN_KEY && !e.shiftKey) || e.keyCode === ESCAPE_KEY) {
            onToggleEdit(e);
        }
    }

    function handleTextChange(e) {
        onChange(e.currentTarget.value)
    }

    if(isEditing) {
        return(
            <EditTextInput
                x={x}
                y={y}
                width={width}
                height={height}
                value={text}
                onChange={handleTextChange}
                onKeyDown={handleEscapeKeys}
            />
        );
    }
}