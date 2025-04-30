import './styles/App.css';

function App() {
  return (
    <>
      <main className='mainpage_main'>
        <h1 className='mainpage_h1'>
          Push-IT
        </h1>
        <section className='mainpage_section'>
          <form className='mainpage_form'>
            <input className='mainpage_input' type="search" placeholder='Digite um Código/Nome Do Canvas'>

            </input>
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
