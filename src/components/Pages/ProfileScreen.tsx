import React from 'react';
import { ArrowLeft, User, Mail, Calendar, Shield, Camera, X } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { useProfilePicture } from '../../hooks/useProfilePicture';

interface ProfileScreenProps {
  onBack: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onBack }) => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { 
    profilePicture, 
    isLoading, 
    updateProfilePicture, 
    removeProfilePicture,
    hasProfilePicture 
  } = useProfilePicture();

  // Função para obter ou definir a data de primeiro acesso
  const getFirstAccessDate = (): string => {
    const savedDate = localStorage.getItem('sleep-app-first-access');
    
    if (savedDate) {
      // Se já existe uma data salva, retornar ela formatada
      const date = new Date(savedDate);
      return date.toLocaleDateString('pt-BR');
    } else {
      // Se não existe, salvar a data atual como primeiro acesso
      const currentDate = new Date();
      localStorage.setItem('sleep-app-first-access', currentDate.toISOString());
      return currentDate.toLocaleDateString('pt-BR');
    }
  };

  const firstAccessDate = getFirstAccessDate();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const success = await updateProfilePicture(file);
      if (!success) {
        alert('Erro ao carregar a imagem. Verifique se é um arquivo de imagem válido e menor que 5MB.');
      }
    }
    // Limpar o input para permitir selecionar a mesma imagem novamente
    event.target.value = '';
  };
  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950' 
        : 'bg-gradient-to-br from-white via-emerald-50/80 to-emerald-100/60'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-sm border-b transition-colors duration-300 ${
        isDark 
          ? 'bg-slate-900/95 border-slate-800' 
          : 'bg-white/95 border-gray-200'
      }`}>
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className={`p-2 rounded-full transition-colors ${
                isDark 
                  ? 'hover:bg-slate-800 text-white' 
                  : 'hover:bg-gray-100 text-gray-900'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <User className="w-6 h-6 text-emerald-400" />
              <h1 className={`text-xl font-bold transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Meu Perfil</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="px-6 py-8 max-w-2xl mx-auto">
        {/* Profile Avatar Section */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg border-4 border-emerald-500/30">
              {hasProfilePicture ? (
                <img
                  src={profilePicture!}
                  alt="Foto de perfil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-emerald-500 flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
              )}
            </div>
            
            {/* Camera Button */}
            <button
              onClick={() => document.getElementById('profile-picture-input')?.click()}
              disabled={isLoading}
              className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 ${
                isDark 
                  ? 'bg-slate-800 hover:bg-slate-700 text-white border-2 border-slate-600' 
                  : 'bg-white hover:bg-gray-100 text-gray-700 border-2 border-gray-200'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
              ) : (
                <Camera className="w-5 h-5" />
              )}
            </button>
            
            {/* Remove Picture Button */}
            {hasProfilePicture && !isLoading && (
              <button
                onClick={removeProfilePicture}
                className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 ${
                  isDark 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
            
            {/* Hidden File Input */}
            <input
              id="profile-picture-input"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          
          <h2 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Cliente Sleep Protocol
          </h2>
          <p className={`text-lg transition-colors duration-300 ${
            isDark ? 'text-slate-300' : 'text-gray-700'
          }`}>
            Membro da comunidade Sleep Protocol
          </p>
          
          {/* Upload Instructions */}
          <p className={`text-sm mt-3 transition-colors duration-300 ${
            isDark ? 'text-slate-400' : 'text-gray-600'
          }`}>
            Clique no ícone da câmera para alterar sua foto de perfil
          </p>
        </div>

        {/* Profile Information Cards */}
        <div className="space-y-6 mb-12">
          {/* Email Card */}
          <div className={`backdrop-blur-sm rounded-2xl p-6 border transition-colors duration-300 ${
            isDark 
              ? 'bg-slate-900/50 border-slate-800' 
              : 'bg-white/80 border-gray-200 shadow-sm'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                isDark ? 'bg-slate-800/50' : 'bg-gray-100/80'
              }`}>
                <Mail className="w-6 h-6 text-emerald-400" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className={`text-lg font-bold mb-2 transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Email
                </h3>
                <p className={`text-sm lg:text-base break-all transition-colors duration-300 ${
                  isDark ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  {user?.email || 'Não disponível'}
                </p>
              </div>
            </div>
          </div>

          {/* Member Since Card */}
          <div className={`backdrop-blur-sm rounded-2xl p-6 border transition-colors duration-300 ${
            isDark 
              ? 'bg-slate-900/50 border-slate-800' 
              : 'bg-white/80 border-gray-200 shadow-sm'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                isDark ? 'bg-slate-800/50' : 'bg-gray-100/80'
              }`}>
                <Calendar className="w-6 h-6 text-blue-400" />
              </div>
              
              <div className="flex-1">
                <h3 className={`text-lg font-bold mb-2 transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Membro desde
                </h3>
                <p className={`text-sm lg:text-base transition-colors duration-300 ${
                  isDark ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  {firstAccessDate}
                </p>
              </div>
            </div>
          </div>

          {/* Account Type Card */}
          <div className={`backdrop-blur-sm rounded-2xl p-6 border transition-colors duration-300 ${
            isDark 
              ? 'bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border-emerald-500/30' 
              : 'bg-gradient-to-r from-emerald-100/80 to-emerald-200/60 border-emerald-300/50 shadow-sm'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                isDark ? 'bg-emerald-500/20' : 'bg-emerald-500/30'
              }`}>
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              
              <div className="flex-1">
                <h3 className={`text-lg font-bold mb-2 transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Tipo de Conta
                </h3>
                <p className={`text-sm lg:text-base transition-colors duration-300 ${
                  isDark ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  Acesso Premium ao Sleep Protocol
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span className={`text-sm font-medium transition-colors duration-300 ${
                    isDark ? 'text-emerald-400' : 'text-emerald-600'
                  }`}>
                    Conta Ativa
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className={`border rounded-2xl p-6 mb-8 transition-colors duration-300 ${
          isDark 
            ? 'bg-blue-500/10 border-blue-500/30' 
            : 'bg-blue-100/80 border-blue-300/50 shadow-sm'
        }`}>
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className={`font-medium mb-2 transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                🔒 Privacidade e Segurança
              </h3>
              <p className={`text-sm transition-colors duration-300 ${
                isDark ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Suas informações são armazenadas de forma segura e privada. 
                Não compartilhamos seus dados com terceiros e você tem controle 
                total sobre suas informações pessoais.
              </p>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="flex justify-center">
          <button
            onClick={onBack}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors duration-200 flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar às Configurações
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;