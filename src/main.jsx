import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './tailwind.css';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { LoanProvider } from './context/LoanContext.jsx';
import { SnackbarProvider } from './components/feedback/SnackbarProvider.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <SnackbarProvider>
        <AuthProvider>
          <LoanProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </LoanProvider>
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  </React.StrictMode>
);
