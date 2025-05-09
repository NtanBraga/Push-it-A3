import React, { useRef,useEffect } from "react";
import { Html } from "react-konva-utils";

//Arquivo para a edição do texto via componente HTML <textarea>
//Correção de ajuste para navegador tipo firefox que tem um deslinhamento na margin-top

function setStyle(width,height) {
    const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
    //Base para o estilo do textarea
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
    // caso usuario esteja usando outro usuario que ñ tenha semelhanças ao firefox
    // a margin top é desavançada 4 pixels
    return {
        ...baseStyle,
        margintop: "-4px"
    };
}

export function EditTextInput({
    x, // Posição
    y, // Posição
    width, // Largura
    height, // Altura
    value, //  Conteudo do texto
    onChange, // Evento para mudar texto
    onKeydown // Evento para registrar Enter e Esc
}) {
    const style = setStyle(width,height); // Estilo usado
    const textAreaRef = useRef(null); //Referencia para o foco

    //Foca no textArea quando componente é  montado
    useEffect(() => {
        if(textAreaRef.current) {
            textAreaRef.current.focus();
        }
    }, [])

    return(
        //Renderizar componente HTML dentro do konva para a edição do texto
        <Html groupProps={{ x,y }} divProps={{ style: { opacity:1 } }}>
            {/*Edição do texto*/}
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