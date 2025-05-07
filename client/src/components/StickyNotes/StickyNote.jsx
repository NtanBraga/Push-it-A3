import React, { useState, useEffect } from "react";
import { Group, Rect } from "react-konva";
import { EditText } from "./EditText";


//COMPONENTE RESPONSAVEL PELA CRIAÇÃO DOS QUADROS DE ANOTAÇÕES PADRAO DO PROJETO


//PARAMETROS PARA A INICIALIZAÇÃO DO QUADRO DE ANOTAÇÃO
export function StickyNote({
    id, // Identificação do sticky
    text,
    colour, //Selecionar cor
    x, //Posição
    y, //Posição
    width, //Largura
    height, // Altura
    onClick,
    selected,
    onTextChange
}) {

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if(!selected && isEditing) {
            setIsEditing(false);
        }
    }, [selected, isEditing]);

    return(
        <Group x={x} y={y}>
            <Rect
                x={20}
                y={20}
                width={width}
                height={height + 40}
                fill={colour}
                shadowColor="black"
                shadowOffsetX={0}
                shadowOffsetY={10}
                shadowBlur={30}
                shadowOpacity={0.6}
                perfectDrawEnabled={false}
            />
            <Rect
                x={0}
                y={0}
                width={width + 40}
                height={height + 60}
                fill={colour}
                perfectDrawEnabled={false}
                onClick={onClick}
                onTap={onClick}
            />
            <EditText
                x={20}
                y={20}
                text={text}
                width={width}
                height={height + 40}
                isEditing={isEditing}
                onChange={onTextChange}
            />
        </Group>
    )
}
