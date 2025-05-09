import React, { useState, useEffect } from "react";
import { Group, Rect } from "react-konva";
import { EditText } from "./EditText";


//COMPONENTE RESPONSAVEL PELA CRIAÇÃO DOS QUADROS DE ANOTAÇÕES PADRAO DO PROJETO


//PARAMETROS PARA A INICIALIZAÇÃO DO QUADRO DE ANOTAÇÃO
export function StickyNote({
    id, // Identificação do sticky
    text, // Eexto
    colour, //Selecionar cor
    x, //Posição
    y, //Posição
    width, //Largura
    height, // Altura
    onClick, // Estado
    selected, // Booleano
    onTextChange, // Estado
    onTextClick // Estado
}) {

    //Verificar estado de edição do quadro de anotações
    const [isEditing, setIsEditing] = useState(false);

    //Efeito para desativar edição quando o quadro não estiver selecionado
    useEffect(() => {
        if(!selected && isEditing) {
            setIsEditing(false);
        }
    }, [selected, isEditing]);

    // Mudança no estado de edição
    function toggleEdit() {
        setIsEditing(!isEditing);
        onTextClick(!isEditing);
    }

    // Formatação do Quadro de anotações agrupado em dois retangulos e um quadro de texto
    return(
        <Group x={x} y={y}>
            {/*Retangulo visual*/}
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
            {/*Retangulo de interação*/}
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
            {/*Componente para visualização,edição do texto*/}
            <EditText
                x={20}
                y={20}
                text={text}
                width={width}
                height={height + 40}
                isEditing={isEditing}
                onToggleEdit={toggleEdit}
                onChange={onTextChange}
            />
        </Group>
    )
}
