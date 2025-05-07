import React, { useRef } from "react";
import { Text } from "react-konva";

export function ResizableText({
    x,
    y,
    text,
    width,
    height,
    onDoubleClick
}) {
    const textRef = useRef(null);

    return (
        <Text
            x={x}
            y={y}
            ref={textRef}
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