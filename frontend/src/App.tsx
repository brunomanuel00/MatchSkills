import './App.css'
import { RouterProvider } from "react-router-dom";
import router from './routes/router'
import { AuthProvider } from './components/context/AuthContext';
import { ThemeProvider } from './components/context/theme-context';
function App() {

  return (
    <AuthProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthProvider >
  )
}

export default App
