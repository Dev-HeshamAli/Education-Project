import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import AuthProvider from "./routes/AuthProvider";
import DirectionProvider from "./routes/DirectionProvider";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DirectionProvider>
          <AppRoutes />
        </DirectionProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
