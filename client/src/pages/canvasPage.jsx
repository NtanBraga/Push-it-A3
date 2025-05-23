import React, { useEffect, useState,useRef } from "react";
import { Stage, Layer, Line} from 'react-konva'
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
            colour: colorfulPick.currentColour, // Cor do sticky de acordo com as funções de cores
            fontColour: fontColorfulPick.fontCurrentColour,
            idConnect: [] // Array de conexões do sticky
        };
        //Adiciona a nova sticky no array
        setStickyNotes([...stickyNotes,newSticky])
    };

    const selectedSticky = stickyNotes.filter((note) => note.selected);

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
        setConnectMode(false)
        setSelectMain(null);
    };

    //Deletará um stickynode
    const deleteStickyNode = (id) => {
        setConnections(connections.filter((conn) => conn.fromId !== id && conn.toId !== id));
        setStickyNotes(stickyNotes.filter(node => node.id !== id));
        if(arrowsLayer.current){
            arrowsLayer.current.batchDraw();
        }
    };


    //Logica para mudança de cores de um quadro de anotações
    //usando react-colorful para a melhor experiencia de usuario

    //variavel terá 3 estados, no qual verá se a paleta está aberta, o id do sticky e a cor atual
    const [ colorfulPick, setColorfulPick ] = useState({
        palletOpened: false, stickyID: null, currentColour: "#FFFF00"
    });

    const togglePallet = (id,colour) => {
        setColorfulPick({
            palletOpened: !colorfulPick.palletOpened,
            stickyID: id,
            currentColour: colour || "#FFFF00"
        })
        setFontColorfulPick({ ...fontColorfulPick, fontPalletOpened:false });
    }

    //Atualiza para a nova cor das stickies selecionadas
    const updatePalletSticky = (newColour) => {
        setStickyNotes((prev) =>
            prev.map((note) =>
                note.selected ? { ...note, colour: newColour } : note
            )
        );
        setColorfulPick({ ...colorfulPick, currentColour: newColour });
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
            fontCurrentColour: fontColour || "#000000"
        })
        setColorfulPick({ ...colorfulPick, palletOpened: false });
    }

    //Atualiza para a nova cor da font das stickies selecionadas 
    const updateFontPalletSticky = (newFontColour) => {
        setStickyNotes((prev) =>
            prev.map((note) =>
                note.selected ? { ...note, fontColour: newFontColour } : note
            )
        );
        setFontColorfulPick({...fontColorfulPick,fontCurrentColour: newFontColour,});
        
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
    
    // Logica para implementação de conexões entre uma anotação e outra
    // necessita que o começo da linha inicie no meio do quadro,e  o final no meio do segundo

    const [ connectMode, setConnectMode ] = useState(false);
    const [ connections, setConnections ] = useState([]);
    const [ selectMain, setSelectMain ] = useState(null);
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
        setDeleteMode(false)
        setSelectMain(null);
        setStickyNotes(stickyNotes.map((node) => ({ ...node, selected:false })));
        setColorfulPick({ ...colorfulPick, palletOpened: false });
        setFontColorfulPick({ ...fontColorfulPick, fontPalletOpened: false});
    }

    const handleSelectConnect = (id) => {
        if(connectMode) {
            if(!selectMain) {
                setSelectMain(id);
                setStickyNotes((prev) =>
                    prev.map((node) =>
                        node.id === id ? { ...node, selected: true } : { ...node, selected: false }
                    )
                );
            } else if (selectMain !== id) {
                setConnections([...connections, { fromId: selectMain, toId: id }]);
                setSelectMain(null);
                setStickyNotes((prev) =>
                    prev.map((node) =>
                        ({ ...node, selected: false})
                    )
                )
                setConnectMode(false);
            }
        } else if(deleteMode) {
            deleteStickyNode(id);
        }else {
            setStickyNotes((prev) => 
                prev.map((node) => {
                    if(node.id === id){
                        return { ...node, selected: !node.selected };
                        }
                    return pressedShift ? node : { ...node, selected: false };
                })
            );
        }
    };

    // Logica para a remoção das conexões dentre os quadros

    const removeConnectionAll = () => {
        if(selectedSticky.length === 0) return;
        const selectedId = selectedSticky.map((note) => note.id);
        setConnections(connections.filter((conn) => !selectedId.includes(conn.fromId) && !selectedId.includes(conn.toId)))
        if(arrowsLayer.current){
            arrowsLayer.current.batchDraw();
        }
    };

    const removeConnectionSpecific = () => {
        if (selectedSticky.length === 0) return;

        const [idFirst, idSecond] = selectedSticky.map((note) => note.id);
        setConnections(
            connections.filter(
                (conn) => !((conn.fromId === idFirst && conn.toId === idSecond) || 
                            (conn.fromId === idSecond && conn.toId === idFirst)
                           )
            )
        );
        if(arrowsLayer.current){
            arrowsLayer.current.batchDraw();
        }
    };

    //Verifica se tem conexão os quadros selecionados

    const verifyConnAny = selectedSticky.length > 0 && selectedSticky.some((note) =>
        connections.some((conn) => conn.fromId === note.id || conn.toId === note.id)
    );

    const verifyConnTwo = selectedSticky.length === 2 && (() => {
        const [ firstId,secondId ] = selectedSticky.map((note) => note.id);
        return connections.some(
            (conn) =>
                (conn.fromId === firstId && conn.toId === secondId) || (conn.fromId === secondId && conn.toId === firstId)
        );
    })();

    //TODO: Redimensionar o <Stage> automaticamente com o React para evitar bug de resolução

    
    //Ajusta o bug no qual deixa a peleta aberta apos todos os quadros serem deselecionados usando o SHIFT
    useEffect(() => {
        const anySelectioned = stickyNotes.some((note) => note.selected);
        if(!anySelectioned && !connectMode){
            setColorfulPick({ ...colorfulPick, palletOpened: false })
            setFontColorfulPick({ ...fontColorfulPick, fontPalletOpened: false})
        }
    },[connectMode,fontColorfulPick,colorfulPick,stickyNotes]);
    
    return(
        <main className="canvaspage_main" id ="canvaspage_main">
            {/* Botão que adiciona novo sticky para renderizar*/}
            <div className="canvaspage_div_buttons">
                <button className="canvaspage_button" onClick={() => takeScreenShot("canvaspage_main","canvasPrint.png")}>Tirar foto</button>
                <button className="canvaspage_button" onClick={addSticky}>Adicionar Quadro</button>
                <button className="canvaspage_button" onClick={toggleDelete}>{deleteMode ? "Sair do modo de deleção" : "Excluir Quadro"}</button>
                <button className="canvaspage_button" onClick={toggleConnect}>{connectMode ? "Sair do modo de conexão" : "Conectar"}</button>
                {selectedSticky.length > 0 && !deleteMode && !connectMode &&(
                    <>
                    <button 
                        className="canvaspage_button"  
                        onClick={() => togglePallet(selectedSticky[0].id, selectedSticky[0].colour)}
                    >
                        {colorfulPick.palletOpened && selectedSticky.some((select) => select.id === colorfulPick.stickyID)
                            ? "Fechar Paleta"
                            : "Mudar de cor do quadro"
                        }
                    </button>
                    <button
                        className="canvaspage_button"
                        onClick={() => toggleFontPallet(selectedSticky[0].id, selectedSticky[0].fontColour)}
                    >
                        {fontColorfulPick.fontPalletOpened && selectedSticky.some((select) => select.id === fontColorfulPick.fontStickyID)
                            ? "Fechar Paleta"
                            : "Mudar de cor da fonte"
                        }
                    </button>
                    {verifyConnTwo && (
                        <button className="canvaspage_button" onClick={removeConnectionSpecific}>Remover Duas Conexão</button>
                    )}
                    {verifyConnAny && (
                        <button className="canvaspage_button" onClick={removeConnectionAll}>Remover Todas Conexões</button>
                    )}
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
                        setStickyNotes(stickyNotes.map((note) => ({ ...note, selected: false})));
                        setColorfulPick({ ...colorfulPick, palletOpened: false });
                        setFontColorfulPick({ ...fontColorfulPick, fontPalletOpened: false});
                        setConnectMode(false);
                        setSelectMain(null);
                    }
                }}
            >
                <Layer ref={arrowsLayer}>
                    {connections.map((connectId, index) => {
                        const intersect = createArrowPos(connectId.fromId, connectId.toId);
                        return (
                            <Line
                                key={`arrow-${connectId.fromId}-${connectId.toId}-${index}`}
                                points={intersect}
                                stroke={"#000000"}
                                strokeWidth={2}
                                pointerLength={10}
                                pointerWidth={10}
                            />
                        );
                        })
                    }
                </Layer>
                <Layer>
                    {/*Coloca na tela os quadros de anotações armazenados no array*/}
                    {stickyNotes.map((objectNode) => (
                    <StickyNote
                        key={objectNode.id} // Chave unica
                        id={objectNode.id} // Passa o ID do stickynode
                        {...objectNode} // Passa todas as  propriedades do objeto de quadro de anotações
                        //Seleciona o stikynote clicado e deseleciona o restante
                        onClick={() => handleSelectConnect(objectNode.id)}
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
                                stickyNotes.map((n) =>
                                    n.id === objectNode.id ? { ...n, selected: newSelected } : pressedShift ? n : { ...n, selected: false }
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
                            if(arrowsLayer.current) {
                                arrowsLayer.current.batchDraw();
                            }
                        }}
                        onDragMove={() => {
                            if(arrowsLayer.current){
                                arrowsLayer.current.batchDraw();
                            }
                        }}
                        onDragEnd={(newX, newY) => {
                            setStickyNotes(
                                stickyNotes.map((n) => 
                                    n.id === objectNode.id ? { ...n, x: newX, y: newY} : n
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