import React, { useEffect, useState,useRef } from "react";
import { Stage, Layer, Arrow} from 'react-konva'
import { StickyNote } from "../components/StickyNotes/StickyNote";
import { HexColorPicker } from "react-colorful"
import { takeScreenShot } from "../components/screenshot/screenshot";

function CanvasPage(){

    //Lógica para gerar Quadro de anotações em volta do canvas
    //E fazer as suas edições de texto dentro dos retangulos

    //Armazena os stickynotes
    const [ stickyNotes, setStickyNotes ] = useState([])

    const addSticky = () => {
        const newSticky = {
            id: Date.now(), // ID unico de criação
            x: 20, //Posição fixa
            y: 20, //Posição fixa
            width: 250, // Largura do sticky
            height: 230, // Altura do sticky
            text: "Insira seu texto!!", // Texto default
            selected: false, // Estado de seleção inicial
            colour: "#FFFF00", // Cor do sticky de acordo com as funções de cores
            fontColour: "#000000",
            idConnect: [] // Array de conexões do sticky
        };
        //Adiciona a nova sticky no array
        setStickyNotes([...stickyNotes,newSticky])
    };

    const selectedSticky = stickyNotes.find(note => note.selected);

    //Lógica para ativar o modo de exclusão através de um botão
    //realizando a deleção de um stickynote especifico ao click
    //Estado de exclusão
    const [ deleteMode, setDeleteMode ] = useState(false);

    //Alterar para modo de exclusão
    function toggleDelete(){
        setDeleteMode(!deleteMode);
        setStickyNotes(stickyNotes.map(nodes => ({ ...nodes, selected: false})));
        setColorfulPick({ ...colorfulPick, palletOpened: false});
        setFontColorfulPick({ ...fontColorfulPick, fontPalletOpened: false})
    };

    //Deletará um stickynode
    const deleteStickyNode = (id) => {
        setStickyNotes(stickyNotes.filter(node => node.id !== id));
    };


    //Logica para mudança de cores de um quadro de anotações
    //usando react-colorful para a melhor experiencia de usuario

    //variavel terá 3 estados, no qual verá se a paleta está aberta, o id do sticky e a cor atual
    const [ colorfulPick, setColorfulPick ] = useState({
        palletOpened: false, stickyID: null, currentColour: stickyNotes.colour 
    });

    const togglePallet = (id,colour) => {
        setColorfulPick({
            palletOpened: !colorfulPick.palletOpened,
            stickyID: id,
            currentColour: colour
        })
        setFontColorfulPick({ ...fontColorfulPick, fontPalletOpened:false });
    }

    //Atualiza para a nova cor das stickies selecionadas
    const updatePalletSticky = (newColour) => {
        setStickyNotes(prev =>
            prev.map(note => 
                note.selected ? { ...note, colour: newColour } : note
            )
        );
    };


    //Logica para aplicar mudança de cor na fonte dos Quadros
    //Terá que ser feita na mesma branch do RF010, 
    // pois usuario poderá mudar para uma cor que não torne a fonte atual visivel

    const [ fontColorfulPick, setFontColorfulPick ] = useState({
        fontPalletOpened: false, fontStickyID: null, fontCurrentColour: "#000000"
    });

        const toggleFontPallet = (id,fontColour) => {
        setFontColorfulPick({
            fontPalletOpened: !fontColorfulPick.fontPalletOpened,
            fontStickyID: id,
            fontCurrentColour: fontColour
        })
        setColorfulPick({ ...colorfulPick, palletOpened:false });
    }

    //Atualiza para a nova cor da font das stickies selecionadas 
    const updateFontPalletSticky = (newFontColour) => {
        setStickyNotes(prev =>
            prev.map(note => 
                note.selected ? { ...note, fontColour: newFontColour } : note
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
        if(!anySelectioned && colorfulPick.palletOpened){
            setColorfulPick({ ...colorfulPick, palletOpened: false })
        }
    },[colorfulPick,stickyNotes]);

    
    // Logica para implementação de conexões entre uma anotação e outra
    // necessita que o começo da linha inicie no meio do quadro,e  o final no meio do segundo

    const [ connectMode, setConnectMode ] = useState(false);
    const arrowsLayer = useRef(null);

    const createArrowPos = (idMain, idSecond) => {
        const fromId = stickyNotes.find((node) => node.id === idMain);
        const toId = stickyNotes.find((node) => node.id === idSecond);
        if(!fromId || !toId) return[0,0,0,0];

        const mainX = fromId.x + fromId.width / 2 + 20;
        const mainY = fromId.y + fromId.height / 2 + 30;
        const secondX = toId.x + toId.width / 2 + 20;
        const secondY = toId.y + toId.height / 2 + 30;

        return [mainX, mainY, secondX, secondY];

    }

    const toggleConnect = () => {
        setConnectMode(!connectMode)
        setDeleteMode(!deleteMode)
        setStickyNotes(stickyNotes.map((node) => ({ ...node, selected:false })));
        setColorfulPick({ ...colorfulPick, palletOpened: false });
        setFontColorfulPick({ ...fontColorfulPick, fontCurrentColour: false});
    }


    //TODO: Redimensionar o <Stage> automaticamente com o React para evitar bug de resolução

    return(
        <main className="canvaspage_main" id ="canvaspage_main">
            {/* Botão que adiciona novo sticky para renderizar*/}
            <div className="canvaspage_div_buttons">
                <button className="canvaspage_button" onClick={() => takeScreenShot("canvaspage_main","canvasPrint.png")}>Tirar foto</button>
                <button className="canvaspage_button" onClick={addSticky}>Adicionar Quadro</button>
                <button className="canvaspage_button" onClick={toggleDelete}>{deleteMode ? "Sair do modo de deleção" : "Excluir Quadro"}</button>
                <button className="canvaspage_button" onClick={toggleConnect}>{connectMode ? "Sair do modo de conexão" : "Conectar"}</button>
                {selectedSticky && !deleteMode && (
                    <>
                    <button 
                        className="canvaspage_button"  
                        onClick={() => togglePallet(selectedSticky.id, selectedSticky.colour)}
                    >
                        {colorfulPick.palletOpened && colorfulPick.stickyID === selectedSticky.id
                            ? "Fechar Paleta"
                            : "Mudar de cor do quadro"
                        }
                    </button>
                    <button
                        className="canvaspage_button"
                        onClick={() => toggleFontPallet(selectedSticky.id, selectedSticky.colour)}
                    >
                        {fontColorfulPick.fontPalletOpened && fontColorfulPick.fontStickyID === selectedSticky.id
                            ? "Fechar Paleta"
                            : "Mudar de cor da fonte"
                        }
                    </button>

                    </>
                )}

            </div>
            {/*Função de pagina para mudança de cor dos stickies*/}
            {colorfulPick.palletOpened && (
                <div className="colorful-model">
                    <div className="colorful-content" onClick={(e) => e.stopPropagation()}>
                        <h3 className="canvaspage_h3">Cor para o Pushit</h3>
                        <HexColorPicker
                            className="colorful-palletpicker"
                            color={colorfulPick.currentColour}
                            onChange={(newColour) => {
                                setColorfulPick({ ...colorfulPick, currentColour: newColour});
                                updatePalletSticky(newColour)
                            }}
                        />
                        <input
                        className="canvaspage_input"
                            type="text"
                            value={colorfulPick.currentColour}
                            onChange={(e) => {
                                const newColour = e.target.value;
                                updatePalletSticky(newColour);
                                setColorfulPick({ ...colorfulPick, currentColour: newColour});
                            }}
                            placeholder={colorfulPick.currentColour}
                        />
                    </div>
                </div>
            )}
            {fontColorfulPick.fontPalletOpened && (
                <div className="colorful-model">
                    <div className="colorful-content" onClick={(e) => e.stopPropagation}>
                        <h3 className="canvaspage_h3">Cor para a fonte</h3>
                        <HexColorPicker
                            className="colorful-palletpicker"
                            color={fontColorfulPick.fontCurrentColour}
                            onChange={(changeFontColour) => {
                                setFontColorfulPick({ ...fontColorfulPick, fontCurrentColour: changeFontColour});
                                updateFontPalletSticky(changeFontColour)
                            }}
                        />
                        <input
                            className="canvaspage_input"
                            type="text"
                            value={fontColorfulPick.fontCurrentColour}
                            onChange={(e) => {
                                const inputNewFontColour = e.target.value;
                                updateFontPalletSticky(fontColorfulPick.fontStickyID, inputNewFontColour)
                                setFontColorfulPick({ ...fontColorfulPick, fontCurrentColour: inputNewFontColour});
                            }}
                            placeholder="#000000"
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
                        setStickyNotes(stickyNotes.map(note => ({ ...note, selected: false})));
                        setColorfulPick({ ...colorfulPick, palletOpened: false });
                        setFontColorfulPick({ ...fontColorfulPick, fontPalletOpened: false});
                        setConnectMode(false);
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