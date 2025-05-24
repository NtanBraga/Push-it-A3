import './styles/Pages.css';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { canvasGet,canvasPost } from './components/api/ApiHandler';
import { PageThemeButton } from './components/accessibility/pageThemeButton';

function App() {

  const navigate = useNavigate();
  const [ inputSearch, setInputSearch ] = React.useState('');
  const [ error, setError ] = React.useState('');


  //SUBMIT DO POST E GET
  const handleSubmit = async (event) => {
    
    event.preventDefault();
    setError('');

    try{ // Se canvas existe, ele ira tentar procura-lo

      await canvasGet(inputSearch);

      navigate('/canvas', { state: { code: inputSearch}});
      

    }catch(e){
      setError(e.message|| 'Canvas não encontrado. Tentando criar um novo...');
      try{ // Se canvas não existe, ele cria um novo do zero
        

        //TODO - Passar condicionais para não estourar variaveis


        await canvasPost({ //Parametros usados pela API para a criação do JSON
          Name: inputSearch, //String
          QuadrosAnotacoes: [], //Lista
          CreatedDateTime: new Date().toISOString() //DateTime
        });

        navigate('/canvas', { state: { code: inputSearch}});

      }catch(e){
        setError(e.message || 'Erro ao criar canvas.');
      }
    }

  }

  return (
    <>
      <PageThemeButton/>
      <main className='mainpage_main'>
        <h1 className='mainpage_h1'>
          Push-IT
        </h1>
        <section className='mainpage_section'>
          <form className='mainpage_form' onSubmit={handleSubmit}>
            <input 
              className='mainpage_input' 
              type="search" 
              placeholder='Digite um Código/Nome Do Canvas'
              value={inputSearch}
              onChange={(e) => setInputSearch(e.target.value)}
            ></input>
            <button className='mainpage_button' type='submit'>
              Acessar
            </button>
          </form>
          {error && <p style={{ color: 'red'}}>{error}</p>}
        </section>
        <h3 className='mainpage_h3'>Não é necessário login</h3>
      </main>
    </>
  );
}

export default App;
