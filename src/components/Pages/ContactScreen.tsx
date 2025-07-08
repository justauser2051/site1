import React from 'react';
import { ArrowLeft, Mail, MessageCircle, Send, Phone } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface ContactScreenProps {
  onBack: () => void;
}

const ContactScreen: React.FC<ContactScreenProps> = ({ onBack }) => {
  const { isDark } = useTheme();

  const handleEmailClick = () => {
    window.location.href = 'mailto:suporte@expertcursos.top';
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
              <MessageCircle className="w-6 h-6 text-emerald-400" />
              <h1 className={`text-xl font-bold transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Entre em Contato</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className={`text-center mb-12 transition-colors duration-300`}>
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className={`text-2xl lg:text-3xl font-bold mb-4 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Entre em Contato
          </h2>
          <p className={`text-lg leading-relaxed max-w-2xl mx-auto transition-colors duration-300 ${
            isDark ? 'text-slate-300' : 'text-gray-700'
          }`}>
            O aplicativo Sleep Protocol está em constante melhoria para proporcionar a melhor experiência de sono. 
            Para dúvidas, sugestões ou reclamações, entre em contato conosco!
          </p>
        </div>

        {/* Contact Information */}
        <div className={`backdrop-blur-sm rounded-2xl p-6 lg:p-8 border mb-8 transition-colors duration-300 ${
          isDark 
            ? 'bg-slate-900/50 border-slate-800' 
            : 'bg-white/80 border-gray-200 shadow-sm'
        }`}>
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-emerald-400" />
              <h3 className={`text-xl font-bold transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Estamos Aqui para Ajudar!
              </h3>
            </div>
            <p className={`text-sm lg:text-base mb-6 transition-colors duration-300 ${
              isDark ? 'text-slate-300' : 'text-gray-700'
            }`}>
              Estamos sempre prontos para ajudar! Entre em contato conosco através do e-mail abaixo:
            </p>
          </div>

          {/* Email Contact Card */}
          <div className={`border rounded-2xl p-6 lg:p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
            isDark 
              ? 'bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border-emerald-500/30 hover:border-emerald-500/50' 
              : 'bg-gradient-to-r from-emerald-100/80 to-emerald-200/60 border-emerald-300/50 hover:border-emerald-400/60 shadow-sm'
          }`}>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-emerald-400" />
              </div>
              
              <h4 className={`text-lg font-bold mb-3 transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                E-mail de Suporte
              </h4>
              
              <div className="flex justify-center mb-4">
                <button
                  onClick={handleEmailClick}
                  className={`inline-flex items-center gap-3 px-4 sm:px-6 lg:px-8 py-4 rounded-xl border transition-all duration-300 hover:scale-105 active:scale-95 max-w-full ${
                    isDark 
                      ? 'bg-slate-800/50 border-slate-700 text-white hover:bg-slate-700/50 hover:border-slate-600' 
                      : 'bg-white/90 border-gray-200 text-gray-900 hover:bg-gray-50/90 hover:border-gray-300 shadow-sm'
                  }`}
                >
                  <Mail className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="font-bold text-sm sm:text-base lg:text-lg text-center break-all">
                    suporte@expertcursos.top
                  </span>
                </button>
              </div>
              
              <p className={`text-sm transition-colors duration-300 ${
                isDark ? 'text-slate-400' : 'text-gray-600'
              }`}>
                Clique no botão acima para abrir seu cliente de e-mail
              </p>
            </div>
          </div>
        </div>

        {/* Support Information */}
        <div className={`border rounded-2xl p-6 lg:p-8 mb-8 transition-colors duration-300 ${
          isDark 
            ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30' 
            : 'bg-gradient-to-r from-blue-100/80 to-purple-100/60 border-blue-300/50 shadow-sm'
        }`}>
          <div className="flex items-start gap-4">
            <Phone className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className={`text-lg font-bold mb-3 transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Como Podemos Ajudar
              </h3>
              <div className={`space-y-2 text-sm lg:text-base transition-colors duration-300 ${
                isDark ? 'text-slate-300' : 'text-gray-700'
              }`}>
                <p className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Dúvidas sobre o funcionamento do aplicativo</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Sugestões para melhorias e novos recursos</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Problemas técnicos ou bugs encontrados</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Feedback sobre sua experiência com o Sleep Protocol</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Reclamações ou questões relacionadas ao suporte</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Response Time Info */}
        <div className={`text-center p-6 rounded-xl transition-colors duration-300 ${
          isDark 
            ? 'bg-slate-900/30 border border-slate-800' 
            : 'bg-gray-100/80 border border-gray-200 shadow-sm'
        }`}>
          <h3 className={`text-lg font-bold mb-2 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            ⏰ Tempo de Resposta
          </h3>
          <p className={`text-sm transition-colors duration-300 ${
            isDark ? 'text-slate-400' : 'text-gray-600'
          }`}>
            Nossa equipe responde em até 24 horas durante dias úteis. 
            Agradecemos sua paciência e estamos ansiosos para ajudá-lo!
          </p>
        </div>

        {/* Back Button */}
        <div className="flex justify-center mt-12">
          <button
            onClick={onBack}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors duration-200 flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactScreen;