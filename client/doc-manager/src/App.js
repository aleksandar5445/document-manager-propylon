import './App.css';
import FileVersions from './FileVersions'
import Login from './Login';
import { AuthContext } from './AuthContext';
import { useContext } from 'react';


function App() {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <div className="App">
      <div className="App-header">
        {
          isAuthenticated ? <FileVersions /> : <Login />
        }
      </div>
    </div>
  );
}

export default App;
