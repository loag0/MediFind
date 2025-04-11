import logo from './logo.png';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />      
      </header>

      <p className="headerText">LOGIN</p>

      <div className="inputContainer">
        <input
          type="email"
          placeholder="Email"
          className="inputField"
          required>

        </input>
        <input
          type="email"
          placeholder="Email"
          className="inputField"
          required>

        </input>
      </div>
    </div>

    
  );
}

export default App;
