import React from "react";
import { Text } from "react-konva";


// COMPONENTE QUE FAZ O DISPLAY DO TEXTO

export function ResizableText({
    x, // Posição
    y, // Posição
    text, // Texto
    width, // Largura
    height, // Altura
    onDoubleClick // evento
}) {

    // Retorna o texto formatado para display
    return (
        <Text
            x={x}
            y={y}
            text={text}
            fill="black"
            fontFamily="sans-serif"
            fontSize={24}
            perfectDrawEnabled={false}
            onDblClick={onDoubleClick}
            onDblTap={onDoubleClick}
            width={width}
            height={height}
            wrap="word"
            align="left"
            ellipsis={true}
            lineHeight={1.2}
        />
    );
}