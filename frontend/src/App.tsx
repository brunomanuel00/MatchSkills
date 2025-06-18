import { RouterProvider } from "react-router-dom";
import { AuthProvider } from './components/context/AuthContext';
import { ThemeProvider } from './components/context/theme-context';
import router from './routes/router';
import { ChatProvider } from "./components/context/ChatContext";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>

        <ChatProvider>
          <RouterProvider router={router} />
        </ChatProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;