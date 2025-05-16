import React, { useEffect, useState } from "react";
import { Stage, Layer} from 'react-konva'
import { StickyNote } from "../components/StickyNotes/StickyNote";
import { HexColorPicker } from "react-colorful"

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
            colour: "#FFFF00" // Cor do sticky de acordo com as funções de cores
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
        setColorfulPick({ ...colorfulPick, PalletOpened: false});
    };

    //Deletará um stickynode
    const deleteStickyNode = (id) => {
        setStickyNotes(stickyNotes.filter(node => node.id !== id));
    };

    //Logica para mudança de cores de um quadro de anotações
    //usando react-colorful para a melhor experiencia de usuario

    //variavel terá 3 estados, no qual verá se a paleta está aberta, o id do sticky e a cor atual
    const [ colorfulPick, setColorfulPick ] = useState({
        PalletOpened: false, stickyID: null, currentColour: stickyNotes.colour 
    });

    const togglePallet = (id,colour) => {
        setColorfulPick({
            PalletOpened: !colorfulPick.PalletOpened,
            stickyID: id,
            currentColour: colour
        })
    }

    //Atualiza para a nova cor das stickies 
    const updatePalletSticky = (id, newColour) => {
        setStickyNotes(prev =>
            prev.map(note => 
                note.selected ? { ...note, colour: newColour } : note
            )
        );
    };

    //Função para selecionar mais de um stickynote quando pressionar o SHIFT

    const [ pressedShift, setPressedShift ] = useState(false);

    useEffect(() => {

        function handleShiftDown(e) {
            if(e.key === "Shift") {
                setPressedShift(true);
            }
        }
        function handleShiftUp(e) {
            if(e.key === "Shift") {
                setPressedShift(false);
            }
        }
        window.addEventListener("keydown", handleShiftDown);
        window.addEventListener("keyup", handleShiftUp);
        return () => {
            window.removeEventListener("keydown", handleShiftDown);
            window.removeEventListener("keyup", handleShiftUp);
        };

    }, []);

    //Ajusta o bug no qual deixa a peleta aberta apos todos os quadros serem deselecionados usando o SHIFT
    useEffect(() => {
        const anySelectioned = stickyNotes.some(note => note.selected);
        if(!anySelectioned && colorfulPick.PalletOpened){
            setColorfulPick({ ...colorfulPick, PalletOpened: false })
        }
    },[colorfulPick,stickyNotes]);

    const selectedSticky = stickyNotes.find(note => note.selected);

    //TODO: Redimensionar o <Stage> automaticamente com o React para evitar bug de resolução

    return(
        <main className="canvaspage_main">
            {/* Botão que adiciona novo sticky para renderizar*/}
            <div className="canvaspage_div_buttons">
                <button className="canvaspage_button" onClick={addSticky}>Adicionar Quadro</button>
                <button className="canvaspage_button" onClick={toggleDelete}>{deleteMode ? "Sair do modo de deleção" : "Excluir Quadro"}</button>
                {selectedSticky && !deleteMode && (
                    <button 
                        className="canvaspage-button"  
                        onClick={() => togglePallet(selectedSticky.id, selectedSticky.colour)}
                    >
                        {colorfulPick.PalletOpened && colorfulPick.stickyID === selectedSticky.id
                            ? "Fechar Paleta"
                            : "Mudar de cor"
                        }
                    </button>
                )}
            </div>
            {/*Função de pagina para mudançade cor dos stickies*/}
            {colorfulPick.PalletOpened && (
                <div className="colorful-model">
                    <div className="colorful-content" onClick={(e) => e.stopPropagation()}>
                        <h3 className="canvaspage_h3">Escolha uma cor</h3>
                        <HexColorPicker
                            color={colorfulPick.currentColour}
                            onChange={(newColour) => updatePalletSticky(colorfulPick.stickyID, newColour)}
                        />
                        <input
                        className="canvaspage_input"
                            type="text"
                            value={colorfulPick.currentColour}
                            onChange={(e) => {
                                const newColour = e.target.value;
                                updatePalletSticky(colorfulPick.stickyID, newColour);
                                setColorfulPick({ ...colorfulPick, currentColour: newColour});
                            }}
                            placeholder={colorfulPick.currentColour}
                        />
                    </div>
                </div>
            )}
            <Stage 
                width={window.innerWidth} 
                height={window.innerHeight}
                //Função evento para deseleciona todas stickynotes do canvas
                onClick={(e) => {
                    if(e.currentTarget._id ===  e.target._id){
                        setStickyNotes(stickyNotes.map(note => ({ ...note, selected: false})))
                        setColorfulPick({ ...colorfulPick, PalletOpened: false });
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
                            if(deleteMode){
                                deleteStickyNode(objectNode.id);
                            }else{
                                setStickyNotes(prev =>
                                    prev.map(node => {
                                        if(node.id === objectNode.id) {
                                            return { ...node, selected: !node.selected };
                                        }else if(pressedShift){
                                            return node;
                                        }else{
                                            return { ...node, selected: false};
                                        }
                                    })
                                );
                            }
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
                        //Este escopo possui o serviço de redimensionamento do
                        // quadro de acordo com as preferencias do usuario
                        onResize={(newWidth, newHeight) => {
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