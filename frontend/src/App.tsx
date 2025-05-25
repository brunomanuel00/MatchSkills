import { RouterProvider } from "react-router-dom";
import { AuthProvider } from './components/context/AuthContext';
import { ThemeProvider } from './components/context/theme-context';
import { UserProvider } from './components/context/UserContext';
import router from './routes/router';
import { ChatProvider } from "./components/context/ChatContext";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        {/* <UserProvider> */}
        <ChatProvider>
          <RouterProvider router={router} />
        </ChatProvider>
        {/* </UserProvider> */}
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;