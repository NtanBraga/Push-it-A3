import React, { useState, useEffect } from "react";
import { Group, Rect, Transformer } from "react-konva";
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
    onTextClick, // Estado
    OnResize // Estado
}) {

    //Verificar estado de edição do quadro de anotações
    const [isEditing, setIsEditing] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    //Variaveis de referencia para redimensionamento dos quadros
    const groupRef = useRef(null);
    const transformerRef = useRef(null);

    //Efeito para desativar edição quando o quadro não estiver selecionado
    useEffect(() => {
        if(!selected && isEditing) {
            setIsEditing(false);
        }
    }, [selected, isEditing]);

    useEffect(() => {
        if(selected && tranformerRef.current && groupRef.current){
            transformerRef.current.nodes([groupRef.current]);
            transformerRef.current.getLayer().batchDraw();
        }
    }, [selected])

    // Mudança no estado de edição
    function toggleEdit() {
        if(!isDragging){
            setIsEditing(!isEditing);
            onTextClick(!isEditing);
        }
    }
    //Função de começo de movimento que tambem sairá modo de edição quando ativado
    function handleStartDragging() {
        setIsDragging(true);
        setIsEditing(false);
    }
    //Função de fim de movimento do quadro.
    function handleStopDragging() {
        setIsDragging(false);
    }

    function handleTransform(e) {
        const node = groupRef.current;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();


        node.scaleX(1);
        node.scaleY(1);

        
        const newWidth = Math.max(100, width * scaleX);
        const newHeight = Math.max(100, height * scaleY);

        OnResize(newWidth, newHeight);

    }

    // Formatação do Quadro de anotações agrupado em dois retangulos e um quadro de texto
    return(
        <>
            {/*Inicialização do agrupamento com parametros de movimentação*/}
            <Group 
                x={x} 
                y={y} 
                draggable={true} 
                onDragStart={handleStartDragging} 
                onDragEnd={handleStopDragging}
                onClick={onClick}
                onTap={onClick}
                ref={groupRef}
                onTransform={handleTransform}
            >
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
            {selected && !isEditing && (
                <Transformer
                    ref={transformerRef}
                    boundBoxFunc={(oldBox, newBox) => {
                        if(newBox.width < 100 || newBox.height < 100) {
                            return oldBox;
                        }
                        return oldBox;
                    }}
                />
            )}
        </>
    );
}
