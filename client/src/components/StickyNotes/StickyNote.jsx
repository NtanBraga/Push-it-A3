import React, { useState, useEffect, useRef } from "react";
import { Group, Rect, Transformer } from "react-konva";
import { EditText } from "./EditText";


//COMPONENTE RESPONSAVEL PELA CRIAÇÃO DOS QUADROS DE ANOTAÇÕES PADRAO DO PROJETO


//PARAMETROS PARA A INICIALIZAÇÃO DO QUADRO DE ANOTAÇÃO
export function StickyNote({
    id, // Identificação do sticky
    text, // Texto
    colour, //Selecionar cor
    fontColour,
    x, //Posição
    y, //Posição
    width, //Largura
    height, // Altura
    onClick, // Estado
    selected, // Booleano
    onTextChange, // Estado
    onTextClick, // Estado
    onResize, // Estado
    onDragEnd, // Estado
    onDragMove, // Estado
    idConnect // Vetor
}) {

    //Verificar estado de edição do quadro de anotações
    const [isEditing, setIsEditing] = useState(false);
    const [isDragging, setIsDragging] = useState(false);


    //Variaveis de referencia para redimensionamento dos quadros
    const groupRef = useRef(null);
    const transformerRef = useRef(null);

    //Inicialização dos tamanhos maximos dos quadros
    const defaultMaxWidth = 1000;
    const defaultMaxHeight = 900;


    //Efeito para desativar edição quando o quadro não estiver selecionado
    useEffect(() => {
        if(!selected && isEditing) {
            setIsEditing(false);
        }
    }, [selected, isEditing]);

        //Efeito para Transformar um <Stickynote>
    //Ele irá selecionar o agrupamento do framework do sticky e fara referencia ao Transformer
    useEffect(() => {
        if(selected && transformerRef.current && groupRef.current){
            transformerRef.current.nodes([groupRef.current]);
            transformerRef.current.getLayer().batchDraw();
        }
    }, [selected])

    // Mudança no estado de edição
    function toggleEdit() {
        if(!isDragging){
            setIsEditing(true);
            onTextClick(true);
        }
    }
    //Função de começo de movimento que tambem sairá modo de edição quando ativado
    const handleStartDragging = () => {
        setIsDragging(true);
        setIsEditing(false);
    }
    //Função de fim de movimento do quadro.
    const handleStopDragging = (e) => {
        setIsDragging(false);
        onDragEnd(e.target.x(), e.target.y());
    }

        //Função de redimensionamento dos quadros
    function handleTransform() {
        const node = groupRef.current;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        //Resetar escalas para evitar bugs
        node.scaleX(1);
        node.scaleY(1);

        //Calculo das novas dimensões do quadro
        const newWidth = Math.max(100, Math.min(defaultMaxWidth, width * scaleX));
        const newHeight = Math.max(100, Math.min(defaultMaxHeight, height * scaleY));

        //Callback com o dimensionamento novo
        onResize(newWidth, newHeight);

    }

    // Formatação do Quadro de anotações agrupado em dois retangulos e um quadro de texto
    return(
        <>
            {/*Inicialização do agrupamento com parametros de movimentação e click*/}
            <Group 
                x={x} 
                y={y} 
                draggable={!isEditing} 
                onDragStart={handleStartDragging} 
                onDragEnd={handleStopDragging}
                onDragMove={(e) => {
                    if(onDragMove){
                        onDragMove(e);
                    }
                }}
                onClick={onClick}
                onTap={onClick}
                ref={groupRef}
                onTransform={handleTransform}
            >
            {/*Retangulo visual 1*/}
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
            {/*Retangulo visual 2*/}
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
                fontColour={fontColour}
            />
        </Group>

            {/*Transformer de redimensionamento*/}
            {selected && !isEditing && (
                <Transformer
                    ref={transformerRef}
                    boundBoxFunc={(oldBox, newBox) => {
                        if(newBox.width < 100 || newBox.height < 100) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                />
            )}
        </>
    );
}
