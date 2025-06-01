
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
export async function canvasGet(canvasName) {
    try{
    //Estabelece comunicação do com canvas salvo
        const response = await fetch(`${APILOCAL}/${encodeURIComponent(canvasName)}`, {
            headers: { Accept: 'application/json'},
        });

        if(!response.ok) {
            const text = await response.text();
            throw new Error(`Erro ao buscar canvas: ${response.status} - ${text}`);
        }
        
        return await response.json();
    }catch(e) {
        throw new Error(e.message || "Canvas não encontrado.");
    }
}

//Adicionar os quadros no armazenamento do quadro
export async function addStickyNote(canvasName, stickynote) {
    try{
        const response = await fetch(`${APILOCAL}/${encodeURIComponent(canvasName)}/quadros`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(stickynote),
        });
        if(!response.ok) {
            const text = await response.text();
            throw new Error(`Erro ao buscar canvas: ${response.status} - ${text}`);
        }

        return await response.json();
    }catch(e) {
        throw new Error(e.message || "Não foi possivel criar o quadro.");
    }
}

//Função para pegar todos pegar todos os quadros do canvas

export async function getStickys(canvasName) {
    try{
        const response = await fetch(`${APILOCAL}/${encodeURIComponent(canvasName)}/quadros`, {
            headers: { Accept: 'application/json' },
        });

        if(!response.ok) {
            const text = await response.text();
            throw new Error(`Erro ao buscar os quadros: ${response.status} - ${text}`);
        }
        return await response.json();
    }catch(e) {
        throw new Error(e.message || 'Não foi possivel pegar os quadros.');
    }
}

//Função para atualizar um quadro no canvas

export async function updateSticky(canvasName, id, sticky) {
    try{
        const response = await fetch(`${APILOCAL}/${encodeURIComponent(canvasName)}/quadros/${encodeURIComponent(id)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(sticky),
        });

        if(!response.ok) {
            const text = await response.text();
            throw new Error(`Erro ao atualizar quadro: ${response.status} - ${text}`);
        }

        return true;
    }catch(e){
        throw new Error(e.message || 'Não foi possivel atualizar o quadro.');
    }
}

//Função para conectar dois quadros

export async function createConnection(canvasName, fromId, toId) {
    try{
        const response = await fetch(`${APILOCAL}/${encodeURIComponent(canvasName)}/quadros/${encodeURIComponent(fromId)}/conexoes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ IdQuadroDestino: toId})
        });

        if(!response.ok) {
            const text = await response.text();
            throw new Error(`Erro ao criar conexão: ${response.status} - ${text}`);
        }

        return await response.json();
    }catch(e) {
        throw new Error('Erro ao tentar criar conexão:', e.message);
    }
}

//Função para deletar conexões

export async function deleteConnection(canvasName, fromId, toId) {
    try{
        const response = await fetch(`${APILOCAL}/${encodeURIComponent(canvasName)}/quadros/${encodeURIComponent(fromId)}/conexoes/${encodeURIComponent(toId)}`, {
            method: 'DELETE',
        });

        if(!response.ok) {
            const text = await response.text();
            throw new Error(`Erro ao deletar conexão: ${response.status} - ${text}`);
        }

        return true;
    }catch(e) {
        throw new Error('Erro ao tentar deletar conexão:', e.message);
    }
}

//função de DELETE do canvas -- NÃO IMPLEMENTADA

export async function deleteSticky(canvasName, id) {
    try{
        const response = await fetch(`${APILOCAL}/${encodeURIComponent(canvasName)}/quadros/${encodeURIComponent(id)}`, {
            method: 'DELETE',
        });

        if(!response.ok){
            const text = await response.text();
            throw new Error(`Erro ao deletar: ${response.status} - ${text}`);
        }

        return true;
    }catch(e) {
        throw new Error('Erro ao tentar deletar conexão:', e.message);
    }
}
    