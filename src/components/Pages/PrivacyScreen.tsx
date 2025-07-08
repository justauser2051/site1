import React from 'react';
import { ArrowLeft, Shield, Lock, Eye, UserCheck, CheckCircle } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface PrivacyScreenProps {
  onBack: () => void;
}

const PrivacyScreen: React.FC<PrivacyScreenProps> = ({ onBack }) => {
  const { isDark } = useTheme();

  const privacyPoints = [
    {
      icon: Shield,
      title: 'Compromisso com a Privacidade',
      description: 'Seu bem-estar e privacidade são a nossa prioridade. Todas as informações fornecidas são tratadas com o máximo de segurança.',
      color: 'text-emerald-400'
    },
    {
      icon: Lock,
      title: 'Armazenamento de Dados',
      description: 'Nenhum dado pessoal sensível é armazenado sem o seu consentimento explícito. Todos os dados são usados exclusivamente para melhorar sua experiência no aplicativo.',
      color: 'text-blue-400'
    },
    {
      icon: Eye,
      title: 'Segurança',
      description: 'Utilizamos tecnologia avançada para garantir que seus dados sejam protegidos. Seu progresso no aplicativo é salvo de maneira segura e não compartilhamos suas informações com terceiros.',
      color: 'text-purple-400'
    },
    {
      icon: UserCheck,
      title: 'Controle do Usuário',
      description: 'Você tem total controle sobre suas informações. Pode acessar e modificar suas preferências de privacidade a qualquer momento nas configurações.',
      color: 'text-amber-400'
    }
  ];

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
              <Shield className="w-6 h-6 text-emerald-400" />
              <h1 className={`text-xl font-bold transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Privacidade</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="px-6 py-8 max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className={`text-center mb-12 transition-colors duration-300`}>
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className={`text-2xl lg:text-3xl font-bold mb-4 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Sua Privacidade é Nossa Prioridade
          </h2>
          <p className={`text-lg leading-relaxed max-w-2xl mx-auto transition-colors duration-300 ${
            isDark ? 'text-slate-300' : 'text-gray-700'
          }`}>
            No Sleep Protocol, entendemos a importância de manter suas informações seguras. 
            Aqui está como protegemos e respeitamos sua privacidade.
          </p>
        </div>

        {/* Privacy Points */}
        <div className="space-y-8 mb-12">
          {privacyPoints.map((point, index) => (
            <div
              key={index}
              className={`backdrop-blur-sm rounded-2xl p-6 lg:p-8 border transition-colors duration-300 ${
                isDark 
                  ? 'bg-slate-900/50 border-slate-800' 
                  : 'bg-white/80 border-gray-200 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-4 lg:gap-6">
                <div className={`w-12 h-12 lg:w-16 lg:h-16 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isDark ? 'bg-slate-800/50' : 'bg-gray-100/80'
                }`}>
                  <point.icon className={`w-6 h-6 lg:w-8 lg:h-8 ${point.color}`} />
                </div>
                
                <div className="flex-1">
                  <h3 className={`text-lg lg:text-xl font-bold mb-3 transition-colors duration-300 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {point.title}
                  </h3>
                  <p className={`text-sm lg:text-base leading-relaxed transition-colors duration-300 ${
                    isDark ? 'text-slate-300' : 'text-gray-700'
                  }`}>
                    {point.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className={`border rounded-2xl p-6 lg:p-8 mb-8 transition-colors duration-300 ${
          isDark 
            ? 'bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border-emerald-500/30' 
            : 'bg-gradient-to-r from-emerald-100/80 to-emerald-200/60 border-emerald-300/50 shadow-sm'
        }`}>
          <div className="flex items-start gap-4">
            <CheckCircle className="w-6 h-6 text-emerald-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className={`text-lg font-bold mb-3 transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Transparência Total
              </h3>
              <div className={`space-y-2 text-sm lg:text-base transition-colors duration-300 ${
                isDark ? 'text-slate-300' : 'text-gray-700'
              }`}>
                <p className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  <span>Todos os dados são armazenados localmente no seu dispositivo</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  <span>Não coletamos informações pessoais identificáveis</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  <span>Seu progresso é salvo apenas no seu navegador</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  <span>Não utilizamos cookies de rastreamento</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  <span>Você pode limpar seus dados a qualquer momento</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className={`text-center p-6 rounded-xl transition-colors duration-300 ${
          isDark 
            ? 'bg-slate-900/30 border border-slate-800' 
            : 'bg-gray-100/80 border border-gray-200 shadow-sm'
        }`}>
          <h3 className={`text-lg font-bold mb-2 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Dúvidas sobre Privacidade?
          </h3>
          <p className={`text-sm transition-colors duration-300 ${
            isDark ? 'text-slate-400' : 'text-gray-600'
          }`}>
            Se você tiver alguma dúvida sobre como tratamos seus dados, 
            entre em contato conosco através das configurações do aplicativo.
          </p>
        </div>

        {/* Back Button */}
        <div className="flex justify-center mt-12">
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

export default PrivacyScreen;