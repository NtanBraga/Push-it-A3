import React from "react";
import { Stage, Layer,Rect } from 'react-konva'

function CanvasPage(){
    return(
        <main className="canvaspage_main">
            <Stage width={window.innerWidth} height={window.innerHeight}>
                <Layer>
                    <Rect
                        x={20}
                        y={20}
                        width={100}
                        height={50}
                        fill="green"
                        stroke="black"
                        strokeWidth={4}
                        />
                </Layer>
            </Stage>
        </main>
    )
}

export default CanvasPage;