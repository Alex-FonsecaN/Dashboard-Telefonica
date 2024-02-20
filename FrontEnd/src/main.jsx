import ReactDOM from 'react-dom/client'
import { AuthProvider } from './contexts/AuthContext'
import MainComponent from './MainComponent'
import { BrowserRouter as Router } from 'react-router-dom';



ReactDOM.createRoot(document.getElementById('root')).render(
<Router>
  <AuthProvider>
    <MainComponent />
  </AuthProvider>
</Router>

,
)
