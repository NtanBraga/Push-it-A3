import React, { useState } from "react";
import { Stage, Layer} from 'react-konva'
import { StickyNote } from "../components/StickyNotes/StickyNote";

function CanvasPage(){

    //Lógica para gerar Quadro de anotações em volta do canvas
    //E fazer as suas edições de texto dentro dos retangulos

    //Armazena os stickynotes
    const [ stickyNotes, setStickyNotes ] = useState([])

    const addSticky = () => {
        const newSticky = {
            id: Date.now(), // ID unico de criação
            x: 20, //Posição aleatoria
            y: 20, //Posição aleatoria
            width: 250, // Largura do sticky
            height: 230, // Altura do sticky
            text: "Insira seu texto!!", // Texto default
            selected: false, // Estado de seleção inicial
            colour: "Yellow" // Cor do sticky
        };
        //Adiciona a nova sticky no array
        setStickyNotes([...stickyNotes,newSticky])
    };

    //Lógica para ativar o modo de exclusão através de um botão
    //realizando a deleção de um stickynote especifico ao click
    //Estado de exclusão
    const [ deleteMode, setDeleteMode ] = useState(false);

    //Alterar para modo de exclusão
    function toggleDelete(){
        setDeleteMode(!deleteMode);
        setStickyNotes(stickyNotes.map(nodes => ({ ...nodes, selected: false})));
    };

    //Deletará um stickynode
    const deleteStickyNode = (id) => {
        setStickyNotes(stickyNotes.filter(node => node.id !== id));
    };


    //TODO: Redimensionar o <Stage> automaticamente com o React para evitar bug de resolução

    return(
        <main className="canvaspage_main">
            {/* Botão que adiciona novo sticky para renderizar*/}
            <div className="canvaspage_div_buttons">
                <button className="canvaspage_button" onClick={addSticky}>Adicionar Quadro</button>
                <button className="canvaspage_button" onClick={toggleDelete}>{deleteMode ? "Sair do modo de deleção" : "Excluir Quadro"}</button>
            </div>
            <Stage 
                width={window.innerWidth} 
                height={window.innerHeight}
                //Função evento para deseleciona todas stickynotes do canvas
                onClick={(e) => {
                    if(e.currentTarget._id ===  e.target._id){
                        setStickyNotes(stickyNotes.map(note => ({ ...note, selected: false})))
                    }
                }}
            >
                <Layer>
                    {/*Coloca na tela os quadros de anotações armazenados no array*/}
                    {stickyNotes.map((objectNode) => (
                    <StickyNote
                        key={objectNode.id} // Chave unica
                        id={objectNode.id} // Passa o ID do stickynode
                        {...objectNode} // Passa todas as  propriedades do objeto de quadro de anotações
                        //Seleciona o stikynote clicado e deseleciona o restante
                        onClick={() => {
                            setStickyNotes(
                                stickyNotes.map(n =>
                                    n.id === objectNode.id ? { ...n, selected: !n.selected } : { ...n, selected: false }
                                )
                            );
                        }}
                        //Atualiza o texto no quadro selecionado
                        onTextChange={(value) => {
                            setStickyNotes(
                                stickyNotes.map(n =>
                                    n.id === objectNode.id ? { ...n, text: value } : n
                                )
                            );
                        }}
                        //Atualiza o estado de seleção para a edição de texto
                        // (sair e entrar no modo de edição do quadro)
                        onTextClick={(newSelected) => {
                            setStickyNotes(
                                stickyNotes.map(n =>
                                    n.id === objectNode.id ? { ...n, selected: newSelected } : n
                                )
                            );
                        }}
                        //Mantem o texto dentro do quadro de anotações 
                        // no qual possa ter um texto fora do escopo da margem
                        onTextResize={(newWidth, newHeight) => {
                            setStickyNotes(
                                stickyNotes.map(n =>
                                    n.id === objectNode.id ? { ...n, width: newWidth, height: newHeight } : n
                                )
                            );
                        }}
                    />
                    ))}
                </Layer>
            </Stage>
        </main>
    )
}

export default CanvasPage;