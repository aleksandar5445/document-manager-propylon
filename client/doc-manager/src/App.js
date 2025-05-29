import './App.css';
import FileVersions from './FileVersions'
import Login from './Login';
import { AppContext } from './AppContext';
import { useContext } from 'react';


function App() {
  // Use the AppContext to access the authentication status
  const { isAuthenticated } = useContext(AppContext);
  return (
    <div className="App">
      <div className="App-header">
        {
          // Render FileVersions if authenticated, otherwise render Login
          // This is a simple conditional rendering based on authentication status
          isAuthenticated ? <FileVersions /> : <Login />
        }
      </div>
    </div>
  );
}

export default App;
