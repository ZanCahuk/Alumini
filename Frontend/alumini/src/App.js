// import logo from './logo.svg';
import './App.css';
import Routing from './components/Routing/Routing';
import { BrowserRouter } from 'react-router';

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routing />
      </BrowserRouter>
    </div>
  );
}

export default App;
