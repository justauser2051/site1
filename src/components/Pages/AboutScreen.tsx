import React from 'react';
import { ArrowLeft, Heart, Shield, Target, Users, Star, CheckCircle, Moon, Brain, Zap } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface AboutScreenProps {
  onBack: () => void;
}

const AboutScreen: React.FC<AboutScreenProps> = ({ onBack }) => {
  const { isDark } = useTheme();

  const features = [
    {
      icon: Shield,
      title: 'Técnicas Militares Comprovadas',
      description: 'Métodos utilizados pelas forças armadas para dormir rapidamente em qualquer situação.',
      color: 'text-emerald-400'
    },
    {
      icon: Brain,
      title: 'Ciência do Sono',
      description: 'Baseado em pesquisas científicas sobre ciclos de sono e neurociência.',
      color: 'text-blue-400'
    },
    {
      icon: Target,
      title: 'Progresso Personalizado',
      description: 'Acompanhe sua evolução com métricas detalhadas e sugestões personalizadas.',
      color: 'text-purple-400'
    },
    {
      icon: Zap,
      title: 'Resultados Rápidos',
      description: 'Técnicas que podem ser aplicadas imediatamente para melhorar seu sono.',
      color: 'text-amber-400'
    }
  ];

  const benefits = [
    'Aprenda a dormir em 2 minutos com técnicas militares',
    'Melhore a qualidade do seu sono profundo',
    'Reduza o tempo para adormecer naturalmente',
    'Otimize seu ambiente de descanso',
    'Desenvolva uma rotina de sono saudável',
    'Monitore seu progresso de forma intuitiva'
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
              <Heart className="w-6 h-6 text-emerald-400" />
              <h1 className={`text-xl font-bold transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Sobre o Aplicativo</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="px-6 py-8 max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className={`text-center mb-12 transition-colors duration-300`}>
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Moon className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className={`text-2xl lg:text-3xl font-bold mb-4 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Sleep Protocol
          </h2>
          <p className={`text-lg leading-relaxed max-w-2xl mx-auto transition-colors duration-300 ${
            isDark ? 'text-slate-300' : 'text-gray-700'
          }`}>
            Transforme suas noites e desperte com mais energia através de técnicas militares 
            comprovadas e métodos científicos para um sono restaurador.
          </p>
        </div>

        {/* Main Description */}
        <div className={`backdrop-blur-sm rounded-2xl p-6 lg:p-8 border mb-12 transition-colors duration-300 ${
          isDark 
            ? 'bg-slate-900/50 border-slate-800' 
            : 'bg-white/80 border-gray-200 shadow-sm'
        }`}>
          <h3 className={`text-xl font-bold mb-6 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Nossa Missão
          </h3>
          <div className={`space-y-4 text-sm lg:text-base leading-relaxed transition-colors duration-300 ${
            isDark ? 'text-slate-300' : 'text-gray-700'
          }`}>
            <p>
              Este aplicativo foi desenvolvido com o objetivo de ajudar você a melhorar sua rotina de sono, 
              proporcionando técnicas e ferramentas práticas para um descanso mais profundo e restaurador.
            </p>
            <p>
              Através de módulos interativos e aulas, você aprenderá técnicas comprovadas, como a Técnica 
              Militar de Sono, exercícios de respiração, ajustes no ambiente e outros métodos para otimizar seu sono.
            </p>
            <p>
              Nosso objetivo é garantir que você tenha uma experiência personalizada, com acompanhamento do 
              seu progresso e sugestões baseadas em suas necessidades específicas para alcançar um sono de qualidade.
            </p>
            <p>
              Com o nosso aplicativo, você tem acesso a aulas, dicas de especialistas e ferramentas para 
              monitorar o seu sono, melhorando sua saúde física e mental.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-12">
          <h3 className={`text-xl font-bold mb-8 text-center transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Por que escolher o Sleep Protocol?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`backdrop-blur-sm rounded-2xl p-6 border transition-colors duration-300 ${
                  isDark 
                    ? 'bg-slate-900/50 border-slate-800' 
                    : 'bg-white/80 border-gray-200 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isDark ? 'bg-slate-800/50' : 'bg-gray-100/80'
                  }`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className={`text-lg font-bold mb-2 transition-colors duration-300 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {feature.title}
                    </h4>
                    <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                      isDark ? 'text-slate-300' : 'text-gray-700'
                    }`}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className={`border rounded-2xl p-6 lg:p-8 mb-12 transition-colors duration-300 ${
          isDark 
            ? 'bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border-emerald-500/30' 
            : 'bg-gradient-to-r from-emerald-100/80 to-emerald-200/60 border-emerald-300/50 shadow-sm'
        }`}>
          <div className="flex items-start gap-4 mb-6">
            <Star className="w-6 h-6 text-emerald-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                O que você vai conquistar
              </h3>
              <p className={`text-sm lg:text-base transition-colors duration-300 ${
                isDark ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Com o Sleep Protocol, você terá acesso a um conjunto completo de ferramentas e conhecimentos:
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className={`text-sm lg:text-base transition-colors duration-300 ${
                  isDark ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* App Stats */}
        <div className={`border rounded-2xl p-6 lg:p-8 mb-12 transition-colors duration-300 ${
          isDark 
            ? 'bg-slate-900/30 border-slate-800' 
            : 'bg-gray-100/80 border-gray-200 shadow-sm'
        }`}>
          <h3 className={`text-xl font-bold mb-6 text-center transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            📊 Estatísticas do Aplicativo
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className={`text-2xl lg:text-3xl font-bold mb-2 transition-colors duration-300 ${
                isDark ? 'text-emerald-400' : 'text-emerald-600'
              }`}>3</div>
              <div className={`text-sm transition-colors duration-300 ${
                isDark ? 'text-slate-400' : 'text-gray-600'
              }`}>Módulos Completos</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl lg:text-3xl font-bold mb-2 transition-colors duration-300 ${
                isDark ? 'text-emerald-400' : 'text-emerald-600'
              }`}>15</div>
              <div className={`text-sm transition-colors duration-300 ${
                isDark ? 'text-slate-400' : 'text-gray-600'
              }`}>Aulas Práticas</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl lg:text-3xl font-bold mb-2 transition-colors duration-300 ${
                isDark ? 'text-emerald-400' : 'text-emerald-600'
              }`}>2min</div>
              <div className={`text-sm transition-colors duration-300 ${
                isDark ? 'text-slate-400' : 'text-gray-600'
              }`}>Técnica Principal</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl lg:text-3xl font-bold mb-2 transition-colors duration-300 ${
                isDark ? 'text-emerald-400' : 'text-emerald-600'
              }`}>7</div>
              <div className={`text-sm transition-colors duration-300 ${
                isDark ? 'text-slate-400' : 'text-gray-600'
              }`}>Dias de Desafio</div>
            </div>
          </div>
        </div>

        {/* Team/Developer Section */}
        <div className={`border rounded-2xl p-6 lg:p-8 mb-12 transition-colors duration-300 ${
          isDark 
            ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30' 
            : 'bg-gradient-to-r from-blue-100/80 to-purple-100/60 border-blue-300/50 shadow-sm'
        }`}>
          <div className="flex items-start gap-4">
            <Users className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Desenvolvido com Cuidado
              </h3>
              <p className={`text-sm lg:text-base leading-relaxed transition-colors duration-300 ${
                isDark ? 'text-slate-300' : 'text-gray-700'
              }`}>
                O Sleep Protocol foi criado por uma equipe dedicada de especialistas em sono, 
                desenvolvedores e designers que acreditam no poder transformador de uma boa noite de sono. 
                Cada funcionalidade foi pensada para proporcionar a melhor experiência possível em sua 
                jornada rumo ao sono perfeito.
              </p>
            </div>
          </div>
        </div>

        {/* Version and Technical Info */}
        <div className={`text-center p-6 rounded-xl transition-colors duration-300 ${
          isDark 
            ? 'bg-slate-900/30 border border-slate-800' 
            : 'bg-gray-100/80 border border-gray-200 shadow-sm'
        }`}>
          <h3 className={`text-lg font-bold mb-4 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            ℹ️ Informações Técnicas
          </h3>
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 text-sm transition-colors duration-300 ${
            isDark ? 'text-slate-300' : 'text-gray-700'
          }`}>
            <div>
              <h4 className={`font-medium mb-2 transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Versão do App:</h4>
              <p>Sleep Protocol v1.0.0</p>
            </div>
            <div>
              <h4 className={`font-medium mb-2 transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Última Atualização:</h4>
              <p>Janeiro 2025</p>
            </div>
            <div>
              <h4 className={`font-medium mb-2 transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Compatibilidade:</h4>
              <p>Todos os navegadores modernos</p>
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

export default AboutScreen;