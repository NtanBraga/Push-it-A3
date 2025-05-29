import './styles/Pages.css';
import { useNavigate,useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';
import { canvasGet,canvasPost } from './components/api/ApiHandler';
import { PageThemeButton } from './components/accessibility/pageThemeButton';

function App() {

  const navigate = useNavigate();
  const location = useLocation();
  const [ inputSearch, setInputSearch ] = React.useState('');
  const [ error, setError ] = React.useState('');

//Efeito que evita bug de loop infinito no canvasPage forçando o usuario ficar na App.jsx
useEffect(() => {

  // Prende o usuario no App.jsx
  const handlePopState = () => {
    window.history.pushState(null, '', '/');
  };

  window.addEventListener('popstate', handlePopState);
  window.history.pushState(null, '', '/');

  return () => {
    window.removeEventListener('popstate', handlePopState);
  };
}, [location, navigate]);

  //SUBMIT DO POST E GET
  const handleSubmit = async (event) => {
  
    const formatInput = inputSearch.trim();

    event.preventDefault();
    setError('');

    //Obrigatório ter algo no input antes de prosseguir
    if(!formatInput) {
      setError("Insira um nome no canvas para prosseguir!!")
      return;
    }

    // Limita os caracteres para 32 
    if(formatInput.length > 32) {
      setError('O nome não pode conter mais de 32 caracteres.');
      return;
    }

    try{ // Se canvas existe, ele ira tentar procura-lo

      const canvasData = await canvasGet(formatInput);
      navigate('/canvas', { state: { code: formatInput, canvasData}});

    }catch(e){
      setError(e.message|| 'Canvas não encontrado. Tentando criar um novo...');
      try{ // Se canvas não existe, ele cria um novo do zero

        const createCanvas = await canvasPost({ //Parametros usados pela API para a criação do JSON
          Name: formatInput, //String
          QuadrosAnotacoes: [], //Lista
          CreatedDateTime: new Date().toISOString() //DateTime
        });

        navigate('/canvas', { state: { code: formatInput, canvasData: createCanvas }});

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
