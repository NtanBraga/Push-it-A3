import './styles/App.css';
import { useNavigate } from 'react-router-dom';
import React from 'react';

function App() {

  const navigate = useNavigate();
  const [ inputSearch, setInputSearch ] = React.useState('');
  const handleSubmit = (event) => {
    
    event.preventDefault();

    navigate('/canvas', { state: { code: inputSearch }});

  }

  return (
    <>
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
        </section>
        <h3 className='mainpage_h3'>Não é necessário login</h3>
      </main>
    </>
  );
}

export default App;
