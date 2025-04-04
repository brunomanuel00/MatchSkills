import './App.css'
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from './components/context/AuthContext';
import { ThemeProvider } from './components/context/theme-context';
import router from './routes/router';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App

