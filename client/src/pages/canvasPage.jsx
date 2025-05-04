import React, { useState } from "react";
import { Stage, Layer} from 'react-konva'
import { StickyNote } from "../components/StickyNote";

function CanvasPage(){

    //Lógica para gerar Quadro de anotações em volta do canvas

    //Armazena os stickynotes
    const [ stickyNote, setStickyNote ] = useState([])

    const addSticky = () => {
        const newSticky = {
            x: Math.random() * (window.innerWidth - 100), //Posição aleatoria
            y: Math.random() * (window.innerHeight - 100), //Posição aleatoria
            width: 250, // Largura do sticky
            height: 230, // Altura do sticky
            colour: "Yellow" // Cor do sticky
        };
        //Adiciona a nova sticky no array
        setStickyNote([...stickyNote,newSticky])
    }



    return(
        <main className="canvaspage_main">
            {/* Botão que adiciona novo sticky para renderizar*/}
            <button className="canvaspage_button" onClick={addSticky}>Adicionar Quadro</button>
            <Stage width={window.innerWidth} height={window.innerHeight}>
                <Layer>
                    {/*Coloca na tela os quadros armazenados*/}
                    {stickyNote.map((stickyNote,i) => (
                        <StickyNote id={i} {...stickyNote}></StickyNote>
                    ))}
                </Layer>
            </Stage>
        </main>
    )
}

export default CanvasPage;