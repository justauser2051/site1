import { useState, useEffect } from 'react';

interface User {
  email: string;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Credenciais válidas
  const VALID_EMAIL = 'cliente713@sonomilitar.com';
  const VALID_PASSWORD = 'c713';

  useEffect(() => {
    // Verificar se há uma sessão salva
    const savedAuth = localStorage.getItem('sleep-app-auth');
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth);
        if (authData.isAuthenticated && authData.email === VALID_EMAIL) {
          setUser(authData);
        }
      } catch (error) {
        // Se houver erro ao parsear, limpar o localStorage
        localStorage.removeItem('sleep-app-auth');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string): boolean => {
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      // Salvar data de primeiro acesso se não existir
      const firstAccess = localStorage.getItem('sleep-app-first-access');
      if (!firstAccess) {
        localStorage.setItem('sleep-app-first-access', new Date().toISOString());
      }
      
      // Incrementar contador de logins ANTES de criar userData
      const newLoginCount = incrementLoginCount();
      
      const userData = {
        email: VALID_EMAIL,
        isAuthenticated: true
      };
      
      setUser(userData);
      localStorage.setItem('sleep-app-auth', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const isFirstLogin = (): boolean => {
    const loginCount = localStorage.getItem('sleep-app-login-count');
    return !loginCount || parseInt(loginCount) === 1;
  };

  const incrementLoginCount = (): number => {
    const currentCount = localStorage.getItem('sleep-app-login-count');
    const newCount = currentCount ? parseInt(currentCount) + 1 : 1;
    localStorage.setItem('sleep-app-login-count', newCount.toString());
    return newCount;
  };

  const isReturningUser = (): boolean => {
    const loginCount = localStorage.getItem('sleep-app-login-count');
    return loginCount && parseInt(loginCount) >= 2;
  };
    
  const logout = () => {
    console.log('Iniciando processo de logout...');
    
    // Limpar o estado do usuário imediatamente
    setUser(null);
    
    // Remover dados de autenticação do localStorage
    localStorage.removeItem('sleep-app-auth');
    
    // Forçar uma re-renderização completa
    setTimeout(() => {
      console.log('Logout concluído - usuário deve ver tela de login');
      // Forçar reload da página se necessário
      window.location.reload();
    }, 100);
  };

  const isAuthenticated = (): boolean => {
    return user?.isAuthenticated || false;
  };

  return {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated,
    isFirstLogin,
    isReturningUser
  };
};