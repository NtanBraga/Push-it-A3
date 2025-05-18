import html2canvas from "html2canvas";

export function takeScreenShot(div, nomeDoArquivoString) {
    const element = document.getElementById(div);
    if(!element) {
        console.log("Não foi possivel identificar o elemento.");
        return;
    }


    html2canvas(element).then(canvas => {
        const dataURL = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = nomeDoArquivoString;
        link.click();
    });
}