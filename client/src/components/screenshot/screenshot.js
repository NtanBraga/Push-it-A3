import html2canvas from "html2canvas";


/**
 * @param {string} id - O ID do elemento HTML que será capturado.
 * @param {string} nomeDoArquivo - O nome do arquivo PNG que será salvo.
 */

export function takeScreenShot(id, nomeDoArquivo) {
    const element = document.getElementById(id);
    if(!element) {
        console.log("Não foi possivel identificar o elemento.");
        return;
    }


    html2canvas(element).then(canvas => {
        const dataURL = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = nomeDoArquivo;
        link.click();
    });
}