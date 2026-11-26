import './App.css';
import Routing from './components/Routing/Routing';
import { BrowserRouter } from 'react-router';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <div className='App'>
      <AuthProvider>
        <BrowserRouter>
          <Routing />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;