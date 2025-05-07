import React, { useRef,useEffect } from "react";
import { Html } from "react-konva-utils";

function setStyle(width,height) {
    const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
    const baseStyle = {
        width: `${width}px`,
        height: `${height}px`,
        border: "none",
        padding: "5px",
        margin: "0px",
        background: "none",
        outline: "none",
        resize: "none",
        colour: "black",
        fontSize: "24px",
        overflow: "auto",
        boxSizing: "border-box",
        fontFamily: "sans-serif"
    };
    if(isFirefox){
        return baseStyle;
    }
    return {
        ...baseStyle,
        margintop: "-4px"
    };
}

export function EditTextInput({
    x,
    y,
    width,
    height,
    value,
    onChange,
    onKeydown
}) {
    const style = setStyle(width,height);
    const textAreaRef = useRef(null);

    useEffect(() => {
        if(textAreaRef.current) {
            textAreaRef.current.focus();
        }
    }, [])

    return(
        <Html groupProps={{ x,y }} divProps={{ style: { opacity:1 } }}>
            <textarea
                ref={textAreaRef}
                value={value}
                onChange={onChange}
                onKeyDown={onKeydown}
                style={style}
            />
        </Html>
    );
}