import React from "react";
import { Stage, Layer} from 'react-konva'
import { StickyNote } from "../components/StickyNote";

function CanvasPage(){
    return(
        <main className="canvaspage_main">
            <Stage width={window.innerWidth} height={window.innerHeight}>
                <Layer>
                    <StickyNote
                        x={50}
                        y={50}
                        colour="Yellow"
                        width={250}
                        height={230}
                    />
                </Layer>
            </Stage>
        </main>
    )
}

export default CanvasPage;