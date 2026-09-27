import { BrowserRouter } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import { StoreProvider, useStore } from "./context/StoreContext";
import AIAssistant from "./components/common/AIAssistant";

function Notice(){const{notice}=useStore();return notice?<div className="fixed bottom-5 right-5 z-[100] rounded-2xl bg-navy-900 px-5 py-3 text-sm font-semibold text-white shadow-2xl vip-reveal">✓ {notice}</div>:null}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <StoreProvider>
            <AppRoutes /><AIAssistant /><Notice />
          </StoreProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
