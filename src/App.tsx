import React from 'react';
import { useAuth } from './hooks/useAuth';
import LoginScreen from './components/Auth/LoginScreen';
import Layout from './components/Layout/Layout';

function App() {
  const { isAuthenticated, isLoading, login } = useAuth();

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, mostrar tela de login
  if (!isAuthenticated()) {
    return <LoginScreen onLogin={login} />;
  }

  // Se estiver autenticado, mostrar o app principal
  return <Layout />;
}

export default App;