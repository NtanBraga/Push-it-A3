
const APILOCAL = 'http://localhost:5176/canvas' //Direcionamento local do canvas


//função que fará a criação do canvas via metodo POST
export async function canvasPost(loadParam) {

    const response = await fetch(APILOCAL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(loadParam),
    });

    if(!response.ok) {
        const text = await response.text();
        throw new Error(`Erro ao buscar canvas: ${response.status} - ${text}`);
    }

    return await response.json();
}


//função que procurará o canvas pelo nome via memoria local.
export async function canvasGet(name) {

    const response = await fetch(`${APILOCAL}/${name}`, {
        headers: { Accept: 'application/json'},
    });

    if(!response.ok) {
        const text = await response.text();
        throw new Error(`Erro ao buscar canvas: ${response.status} - ${text}`);
    }

    return await response.json();
}


//função de deleção do canvas -- NÃO IMPLEMENTADA
export async function canvasDelete(name) {

    const response = await fetch(`${APILOCAL}/${name}`, {
        method: 'DELETE',
    })

    if(!response.ok){
        const text = await response.text();
        throw new Error(`Erro ao deletar: ${response.status} = ${text}`)
    }

    return await response.text();
}