import React, { useEffect, useState,useRef } from "react";
import { useNavigate } from 'react-router-dom'
import { PageThemeButton } from "../components/accessibility/pageThemeButton";
import { Stage, Layer, Line} from 'react-konva'
import { StickyNote } from "../components/StickyNotes/StickyNote";
import { HexColorPicker } from "react-colorful"
import { takeScreenShot } from "../components/screenshot/screenshot";

function CanvasPage(){

    //Voltar para pagina anterior
    const navigate = useNavigate();







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
            currentColour: colour
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
            fontCurrentColour: fontColour
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
    
    const lineColorTheme = document.documentElement.classList.contains('darkmode') ? "#FFFFFF" : "#000000" 

    //Arranja as linhas para conexão
    const createArrowPos = (idMain, idSecond) => {
        const fromId = stickyNotes.find((node) => node.id === idMain);
        const toId = stickyNotes.find((node) => node.id === idSecond);
        if(!fromId || !toId) return[0,0,0,0];

        //Calculo do posicionamento da seta
        const mainX = fromId.x + fromId.width / 2 + 20;
        const mainY = fromId.y + fromId.height / 2 + 30;
        const secondX = toId.x + toId.width / 2 + 20;
        const secondY = toId.y + toId.height / 2 + 30;

        return [mainX, mainY, secondX, secondY];

    }

    //Ativa a o modo de conexão
    const toggleConnect = () => {
        setConnectMode(!connectMode)
        setDeleteMode(false)
        setSelectMain(null);
        setStickyNotes(stickyNotes.map((node) => ({ ...node, selected:false })));
        setColorfulPick({ ...colorfulPick, palletOpened: false });
        setFontColorfulPick({ ...fontColorfulPick, fontPalletOpened: false});
    }

    //Seleciona as conexões escolidas pelo usuario
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

    //Ao selecionar um quadro, todas as conexões com ele são removidas
    const removeConnectionAll = () => {
        if(selectedSticky.length === 0) return;
        const selectedId = selectedSticky.map((note) => note.id);
        setConnections(connections.filter((conn) => !selectedId.includes(conn.fromId) && !selectedId.includes(conn.toId)))
        if(arrowsLayer.current){
            arrowsLayer.current.batchDraw();
        }
    };

    // Ao selecionar dois quadros, a conexão entre eles é removida
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

    //Verifica em todos
    const verifyConnAny = selectedSticky.length > 0 && selectedSticky.some((note) =>
        connections.some((conn) => conn.fromId === note.id || conn.toId === note.id)
    );

    //Verifica em conexões de 2 quadros em especifico
    const verifyConnTwo = selectedSticky.length === 2 && (() => {
        const [ firstId,secondId ] = selectedSticky.map((note) => note.id);
        return connections.some(
            (conn) =>
                (conn.fromId === firstId && conn.toId === secondId) || (conn.fromId === secondId && conn.toId === firstId)
        );
    })();







    //Logica para redimensionar o <Stage> automaticamente com o React para evitar bug de resolução

    const [ canvaSize, setCanvaSize ] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    const upgradeCanvaSize = () => {
        setCanvaSize({
            width: window.innerWidth,
            height: window.innerHeight
        })
        if(arrowsLayer.current) {
            arrowsLayer.current.batchDraw();
        }
    };

    //Efeito para fazer o resize automatico
    useEffect(() =>  {
        let timer;
        const handleResize = () => {
            clearTimeout(timer);
            timer = setTimeout(upgradeCanvaSize, 100);
        }
        window.addEventListener("resize", handleResize);
        upgradeCanvaSize();
        return () => {
            window.removeEventListener("resize", handleResize);
            clearTimeout(timer);
        };
    }, []);

    //Aplicação da logica de zoom no canvas

    const [zoomPage, setZoomPage ] = useState(1);

    //Função que aproximará a camera
    const zoomIn = () => {
        setZoomPage((prev) => Math.min(prev + 0.1, 2));
        if(arrowsLayer.current) {
            arrowsLayer.current.batchDraw();
        }
    }
    //Função que afastará a camera
    const zoomOut = () => {
        setZoomPage((prev) => Math.max(prev - 0.1, 0.3));
        if(arrowsLayer.current) {
            arrowsLayer.current.batchDraw();
        }
    }






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
            <PageThemeButton/>
            <button className="canvaspage_back_button" onClick={() => navigate(-1)} aria-label="Voltar para a pagina anterior" title="Voltar para a pagina anterior">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>
            </button>
            {/* Botão que adiciona novo sticky para renderizar*/}
            <div className="canvaspage_div_buttons">
                <button className="canvaspage_button" onClick={zoomIn} aria-label="Aumentar zoom" title="Aumentar zoom">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Zm-40-60v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z"/></svg>
                </button>
                <button className="canvaspage_button" onClick={zoomOut} aria-label="Diminuir zoom" title="Diminuir zoom">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400ZM280-540v-80h200v80H280Z"/></svg>
                </button>
                <button className="canvaspage_button" onClick={() => takeScreenShot("canvaspage_main","canvasPrint.png")} aria-label="Tirar foto do canva" title="Tirar foto do canva">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M440-440ZM120-120q-33 0-56.5-23.5T40-200v-480q0-33 23.5-56.5T120-760h126l74-80h240v80H355l-73 80H120v480h640v-360h80v360q0 33-23.5 56.5T760-120H120Zm640-560v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80ZM440-260q75 0 127.5-52.5T620-440q0-75-52.5-127.5T440-620q-75 0-127.5 52.5T260-440q0 75 52.5 127.5T440-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29Z"/></svg>
                </button>
                <button className="canvaspage_button" onClick={addSticky} aria-label="Adicionar quadro de anotações" title="Adicionar quadro de anotações">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/></svg>
                </button>
                <button className={`canvaspage_button ${deleteMode ? 'canvaspage_button_cancel' : ''}`} onClick={toggleDelete} aria-label="Deletar quadro de anotações" title="Deletar quadro de anotações">
                    {deleteMode 
                        ? <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                        : <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z"/></svg>
                    }
                </button>
                <button className={`canvaspage_button ${connectMode ? 'canvaspage_button_cancel' : ''}`} onClick={toggleConnect} aria-label="Conectar quadros de anotações" title="Conectar quadros de anotações">
                    {connectMode 
                        ? <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                        : <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M600-80v-100L320-320H120v-240h172l108-124v-196h240v240H468L360-516v126l240 120v-50h240v240H600ZM480-720h80v-80h-80v80ZM200-400h80v-80h-80v80Zm480 240h80v-80h-80v80ZM520-760ZM240-440Zm480 240Z"/></svg>
                    }
                </button>
                {selectedSticky.length > 0 && !deleteMode && !connectMode &&(
                    <>
                    {verifyConnAny && (
                        <button className="canvaspage_button" onClick={removeConnectionAll} aria-label="Remove todas as conexões de um quadro" title="Remove todas as conexões de um quadro">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M680-160q17 0 28.5-11.5T720-200q0-17-11.5-28.5T680-240q-17 0-28.5 11.5T640-200q0 17 11.5 28.5T680-160Zm0-560q17 0 28.5-11.5T720-760q0-17-11.5-28.5T680-800q-17 0-28.5 11.5T640-760q0 17 11.5 28.5T680-720ZM80-470v-10q0-50 35-85t85-35q24 0 45 8.5t37 23.5l281-164q-2-7-2.5-13.5T560-760q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-24 0-45-8.5T598-672L318-509q-19-5-38.5-8t-39.5-3q-45 0-85.5 13T80-470ZM680-80q-50 0-85-35t-35-85q0-6 3-28l-43-26q-2-24-7-46.5T499-345l99 57q16-15 37-23.5t45-8.5q50 0 85 35t35 85q0 50-35 85t-85 35ZM240-40q-83 0-141.5-58.5T40-240q0-83 58.5-141.5T240-440q83 0 141.5 58.5T440-240q0 83-58.5 141.5T240-40Zm0-172 70 71 29-28-71-71 71-71-28-28-71 71-71-71-28 28 71 71-71 71 28 28 71-71Zm440 12Zm0-560Z"/></svg>
                        </button>
                    )}
                    {verifyConnTwo && (
                        <button className="canvaspage_button" onClick={removeConnectionSpecific} aria-label="Remove conexão especifica entre dois quadros de anotações" title="Remove conexão especifica entre dois quadros de anotações">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m770-302-60-62q40-11 65-42.5t25-73.5q0-50-35-85t-85-35H520v-80h160q83 0 141.5 58.5T880-480q0 57-29.5 105T770-302ZM634-440l-80-80h86v80h-6ZM792-56 56-792l56-56 736 736-56 56ZM440-280H280q-83 0-141.5-58.5T80-480q0-69 42-123t108-71l74 74h-24q-50 0-85 35t-35 85q0 50 35 85t85 35h160v80ZM320-440v-80h65l79 80H320Z"/></svg>
                        </button>
                    )}
                    <button 
                        className={`canvaspage_button ${colorfulPick.palletOpened ? 'canvaspage_button_cancel' : ''}`} 
                        onClick={() => togglePallet(selectedSticky[0].id, selectedSticky[0].colour)}
                        aria-label="Colorir quadro de anotações"
                        title="Colorir quadro de anotações"
                    >
                        {colorfulPick.palletOpened && selectedSticky.some((select) => select.id === colorfulPick.stickyID)
                            ? <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                            : <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m247-904 57-56 343 343q23 23 23 57t-23 57L457-313q-23 23-57 23t-57-23L153-503q-23-23-23-57t23-57l190-191-96-96Zm153 153L209-560h382L400-751Zm360 471q-33 0-56.5-23.5T680-360q0-21 12.5-45t27.5-45q9-12 19-25t21-25q11 12 21 25t19 25q15 21 27.5 45t12.5 45q0 33-23.5 56.5T760-280ZM80 0v-160h800V0H80Z"/></svg>
                        }
                    </button>
                    <button
                        className={`canvaspage_button ${fontColorfulPick.fontPalletOpened ? 'canvaspage_button_cancel' : ''}`} 
                        onClick={() => toggleFontPallet(selectedSticky[0].id, selectedSticky[0].fontColour)}
                        aria-label="Colorir fonte do quadro de anotações"
                        title="Colorir fonte do quadro de anotações"
                    >
                        {fontColorfulPick.fontPalletOpened && selectedSticky.some((select) => select.id === fontColorfulPick.fontStickyID)
                            ? <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                            : <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M80 0v-160h800V0H80Zm140-280 210-560h100l210 560h-96l-50-144H368l-52 144h-96Zm176-224h168l-82-232h-4l-82 232Z"/></svg>
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
                width={canvaSize.width} 
                height={canvaSize.height}
                scaleX={zoomPage}
                scaleY={zoomPage}
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
                                stroke={lineColorTheme}
                                strokeWidth={2 / zoomPage}
                                pointerLength={10/ zoomPage}
                                pointerWidth={10/ zoomPage}
                            />
                        );
                        })
                    }
                </Layer>
                <Layer>
                    {/*Coloca na tela os quadros de anotações armazenados no array*/}
                    {stickyNotes.map((objectNode) => {
                        const updatePos = (e) => {
                            if(e.target && typeof e.target.x === 'function') {
                                setStickyNotes((prev) =>
                                    prev.map((n) => (
                                        n.id === objectNode.id ? { ...n, x: e.target.x(),y: e.target.y() } : n
                                    ))
                                )
                                if(arrowsLayer.current) {
                                    arrowsLayer.current.batchDraw();
                                }
                            }   
                        }
                    return (
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
                        onDragMove={updatePos}
                        onDragEnd={updatePos}
                    />
                    );
                    })}
                </Layer>
            </Stage>
        </main>
    )
}

export default CanvasPage;