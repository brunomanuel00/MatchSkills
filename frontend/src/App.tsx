import { RouterProvider } from "react-router-dom";
import { AuthProvider } from './components/context/AuthContext';
import { ThemeProvider } from './components/context/theme-context';
import { UserProvider } from './components/context/UserContext';
import router from './routes/router';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <UserProvider>
          <RouterProvider router={router} />
        </UserProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;