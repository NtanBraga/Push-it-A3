import React from "react";
import { Group, Rect } from "react-konva";


//COMPONENTE RESPONSAVEL PELA CRIAÇÃO DOS QUADROS DE ANOTAÇÕES PADRAO DO PROJETO


//PARAMETROS PARA A INICIALIZAÇÃO DO QUADRO DE ANOTAÇÃO
export function StickyNote({
    id, // Identificação do sticky
    colour, //Selecionar cor
    x, //Posição
    y, //Posição
    width, //Largura
    height, // Altura
}) {
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
        </Group>
    )
}
