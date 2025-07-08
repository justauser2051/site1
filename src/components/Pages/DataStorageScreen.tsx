import React from 'react';
import { ArrowLeft, Database, Shield, Lock, Eye, CheckCircle, HardDrive, Smartphone } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface DataStorageScreenProps {
  onBack: () => void;
}

const DataStorageScreen: React.FC<DataStorageScreenProps> = ({ onBack }) => {
  const { isDark } = useTheme();

  const dataPoints = [
    {
      icon: HardDrive,
      title: 'Armazenamento Local',
      description: 'Os dados de progresso (como aulas assistidas e módulos completados) são armazenados localmente em seu dispositivo, garantindo que você possa retomar seu progresso a qualquer momento, mesmo sem conexão com a internet.',
      color: 'text-emerald-400'
    },
    {
      icon: Smartphone,
      title: 'Configurações Seguras',
      description: 'Além disso, mantemos informações de configuração (como preferências de tema e notificações) armazenadas de maneira segura e protegida, para que você tenha a melhor experiência sempre que usar o aplicativo.',
      color: 'text-blue-400'
    },
    {
      icon: Shield,
      title: 'Proteção de Dados',
      description: 'Nenhuma informação pessoal sensível (como dados bancários ou documentos privados) é coletada ou armazenada pelo aplicativo.',
      color: 'text-purple-400'
    },
    {
      icon: Eye,
      title: 'Transparência Total',
      description: 'Os dados são salvos localmente no seu dispositivo, e não compartilhamos suas informações com terceiros sem o seu consentimento explícito.',
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
              <Database className="w-6 h-6 text-emerald-400" />
              <h1 className={`text-xl font-bold transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Dados e Armazenamento</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="px-6 py-8 max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className={`text-center mb-12 transition-colors duration-300`}>
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Database className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className={`text-2xl lg:text-3xl font-bold mb-4 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Como Tratamos Seus Dados
          </h2>
          <p className={`text-lg leading-relaxed max-w-2xl mx-auto transition-colors duration-300 ${
            isDark ? 'text-slate-300' : 'text-gray-700'
          }`}>
            Nós levamos a sua privacidade a sério. No nosso aplicativo, os dados coletados incluem informações relacionadas ao seu progresso e preferências de uso para proporcionar uma experiência personalizada e eficiente.
          </p>
        </div>

        {/* Data Points */}
        <div className="space-y-8 mb-12">
          {dataPoints.map((point, index) => (
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

        {/* User Control Section */}
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
                Controle Total dos Seus Dados
              </h3>
              <p className={`text-sm lg:text-base leading-relaxed mb-4 transition-colors duration-300 ${
                isDark ? 'text-slate-300' : 'text-gray-700'
              }`}>
                A qualquer momento, você pode acessar, alterar ou apagar os dados armazenados diretamente nas configurações do aplicativo.
              </p>
              <div className={`space-y-2 text-sm lg:text-base transition-colors duration-300 ${
                isDark ? 'text-slate-300' : 'text-gray-700'
              }`}>
                <p className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  <span>Visualizar todo o seu progresso de aprendizado</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  <span>Modificar suas preferências de tema e notificações</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  <span>Resetar completamente seu progresso quando desejar</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  <span>Limpar todos os dados locais através do navegador</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Commitment */}
        <div className={`border rounded-2xl p-6 lg:p-8 mb-8 transition-colors duration-300 ${
          isDark 
            ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30' 
            : 'bg-gradient-to-r from-blue-100/80 to-purple-100/60 border-blue-300/50 shadow-sm'
        }`}>
          <div className="flex items-start gap-4">
            <Lock className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className={`text-lg font-bold mb-3 transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Compromisso com a Segurança
              </h3>
              <p className={`text-sm lg:text-base leading-relaxed transition-colors duration-300 ${
                isDark ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Estamos comprometidos em manter seus dados seguros e privados. Nosso sistema segue as melhores práticas de segurança e criptografia para proteger suas informações.
              </p>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className={`text-center p-6 rounded-xl transition-colors duration-300 ${
          isDark 
            ? 'bg-slate-900/30 border border-slate-800' 
            : 'bg-gray-100/80 border border-gray-200 shadow-sm'
        }`}>
          <h3 className={`text-lg font-bold mb-4 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            📋 Detalhes Técnicos
          </h3>
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 text-sm transition-colors duration-300 ${
            isDark ? 'text-slate-300' : 'text-gray-700'
          }`}>
            <div className="text-left">
              <h4 className={`font-medium mb-2 transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Dados Armazenados:</h4>
              <ul className="space-y-1">
                <li>• Progresso das aulas</li>
                <li>• Configurações de tema</li>
                <li>• Preferências de notificação</li>
                <li>• Histórico de visualização</li>
              </ul>
            </div>
            <div className="text-left">
              <h4 className={`font-medium mb-2 transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Localização:</h4>
              <ul className="space-y-1">
                <li>• LocalStorage do navegador</li>
                <li>• Apenas no seu dispositivo</li>
                <li>• Não enviado para servidores</li>
                <li>• Controle total do usuário</li>
              </ul>
            </div>
          </div>
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

export default DataStorageScreen;