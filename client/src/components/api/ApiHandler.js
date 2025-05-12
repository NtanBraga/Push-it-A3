
const APILOCAL = 'http://localhost:5176/canvas' //Direcionamento local do canvas


//função POST que fará a criação do canvas
export async function canvasPost(loadParam) {

    //Se os parametros da API forem passadas de forma inválida, esse erro é passado
    if(!loadParam || typeof loadParam !== 'object'){
        throw new Error('Erro na criação do canvas: payload');
    }

    //Criação do JSON com os dados do canvas para a API
    try{
        const response = await fetch(APILOCAL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(loadParam),
        });

        //Falha ao passar os dados do JSON para a API
        if(!response.ok) {
            const text = await response.text();
            throw new Error(`Erro ao criar canvas: ${response.status} - ${text}`);
        }

        return await response.json();
    }catch(error) {
        throw new Error(error.message || 'Não foi possivel criar o canvas');
    }
}


//função GET que procurará o canvas pelo nome via memoria local.
export async function canvasGet(name) {

    //Estabelece comunicação do com canvas salvo
    const response = await fetch(`${APILOCAL}/${name}`, {
        headers: { Accept: 'application/json'},
    });

    //Sempre apresentará mensagem de erro quando criar um canvas novo.
    /*
    if(!response.ok) {
        const text = await response.text();
        throw new Error(`Erro ao buscar canvas: ${response.status} - ${text}`);
    }
    */
    return await response.json();
}


//função de DELETE do canvas -- NÃO IMPLEMENTADA
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