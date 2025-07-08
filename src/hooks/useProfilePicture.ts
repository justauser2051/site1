import { useState, useEffect } from 'react';

export const useProfilePicture = () => {
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Carregar foto de perfil salva
    const savedPicture = localStorage.getItem('sleep-app-profile-picture');
    if (savedPicture) {
      setProfilePicture(savedPicture);
    }
  }, []);

  const updateProfilePicture = async (file: File): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        throw new Error('Por favor, selecione apenas arquivos de imagem');
      }

      // Validar tamanho do arquivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('A imagem deve ter no máximo 5MB');
      }

      // Converter para base64
      const base64 = await fileToBase64(file);
      
      // Salvar no localStorage
      localStorage.setItem('sleep-app-profile-picture', base64);
      setProfilePicture(base64);
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar foto de perfil:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeProfilePicture = () => {
    localStorage.removeItem('sleep-app-profile-picture');
    setProfilePicture(null);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  return {
    profilePicture,
    isLoading,
    updateProfilePicture,
    removeProfilePicture,
    hasProfilePicture: !!profilePicture
  };
};