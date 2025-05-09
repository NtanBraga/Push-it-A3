import React from "react";
import { EditTextInput } from "./EditTextInput";
import { ResizableText } from "./ResizableText";

//Este arquivo é responsavel pela junção da edição de texto e o seu display.


//Representação ASCII das teclas Esc e Enter
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
    //Enter(sem shift) ou Esc para sair do modo de edição
    function handleEscapeKeys(e) {
        if ((e.keyCode === RETURN_KEY && !e.shiftKey) || e.keyCode === ESCAPE_KEY) {
            onToggleEdit(e);
        }
    }
    //Muda o texto no textarea
    function handleTextChange(e) {
        onChange(e.currentTarget.value)
    }

    //Modo de edição
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
    //Display do texto
    return (
        <ResizableText
        x={x}
        y={y}
        onDoubleClick={onToggleEdit}
        text={text}
        width={width}
        height={height}
    />
    );
}