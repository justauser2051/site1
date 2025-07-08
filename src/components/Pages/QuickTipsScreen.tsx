import React from 'react';
import { ArrowLeft, Lightbulb, Clock, Coffee, Smartphone, Bed, Dumbbell, Moon, Heart } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface QuickTipsScreenProps {
  onBack: () => void;
}

const QuickTipsScreen: React.FC<QuickTipsScreenProps> = ({ onBack }) => {
  const { isDark } = useTheme();

  const tips = [
    {
      id: 1,
      icon: Clock,
      title: 'Crie uma rotina consistente',
      description: 'Vá para a cama e acorde sempre no mesmo horário, inclusive nos fins de semana.',
      color: 'text-emerald-400'
    },
    {
      id: 2,
      icon: Coffee,
      title: 'Evite cafeína e alimentos pesados antes de dormir',
      description: 'Eles podem dificultar seu descanso.',
      color: 'text-amber-400'
    },
    {
      id: 3,
      icon: Smartphone,
      title: 'Reduza o uso de telas antes de dormir',
      description: 'A luz azul dos dispositivos pode interferir na produção de melatonina.',
      color: 'text-blue-400'
    },
    {
      id: 4,
      icon: Bed,
      title: 'Mantenha o ambiente de sono confortável',
      description: 'Use roupas confortáveis, ajuste a temperatura e minimize o ruído.',
      color: 'text-purple-400'
    },
    {
      id: 5,
      icon: Dumbbell,
      title: 'Faça exercícios regulares, mas não próximos da hora de dormir',
      description: 'O exercício é excelente para o sono, mas deve ser feito durante o dia.',
      color: 'text-red-400'
    },
    {
      id: 6,
      icon: Moon,
      title: 'Evite sonecas longas durante o dia',
      description: 'Se precisar dormir durante o dia, limite o tempo de soneca a 20-30 minutos.',
      color: 'text-indigo-400'
    },
    {
      id: 7,
      icon: Heart,
      title: 'Pratique técnicas de relaxamento antes de dormir',
      description: 'Meditação, respiração profunda e alongamentos leves podem ajudar a acalmar sua mente.',
      color: 'text-pink-400'
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
              <Lightbulb className="w-6 h-6 text-emerald-400" />
              <h1 className={`text-xl font-bold transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Dicas Rápidas</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="px-6 py-8 max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className={`text-center mb-12 transition-colors duration-300`}>
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lightbulb className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className={`text-2xl lg:text-3xl font-bold mb-4 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Dicas Rápidas para Melhorar seu Sono e Bem-Estar
          </h2>
          <p className={`text-lg leading-relaxed max-w-2xl mx-auto transition-colors duration-300 ${
            isDark ? 'text-slate-300' : 'text-gray-700'
          }`}>
            Aqui estão algumas dicas simples e eficazes para melhorar a qualidade do seu sono e seu bem-estar geral. 
            Basta seguir estas sugestões para começar a perceber resultados rapidamente.
          </p>
        </div>

        {/* Tips List */}
        <div className="space-y-6 mb-12">
          {tips.map((tip, index) => (
            <div
              key={tip.id}
              className={`backdrop-blur-sm rounded-2xl p-6 lg:p-8 border transition-all duration-300 hover:scale-[1.02] ${
                isDark 
                  ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700' 
                  : 'bg-white/80 border-gray-200 hover:border-gray-300 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-4 lg:gap-6">
                <div className={`w-12 h-12 lg:w-16 lg:h-16 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isDark ? 'bg-slate-800/50' : 'bg-gray-100/80'
                }`}>
                  <tip.icon className={`w-6 h-6 lg:w-8 lg:h-8 ${tip.color}`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      isDark 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-emerald-500/30 text-emerald-600'
                    }`}>
                      {index + 1}
                    </div>
                    <h3 className={`text-lg lg:text-xl font-bold transition-colors duration-300 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {tip.title}
                    </h3>
                  </div>
                  <p className={`text-sm lg:text-base leading-relaxed transition-colors duration-300 ${
                    isDark ? 'text-slate-300' : 'text-gray-700'
                  }`}>
                    {tip.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className={`border rounded-2xl p-6 lg:p-8 mb-8 transition-colors duration-300 ${
          isDark 
            ? 'bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border-emerald-500/30' 
            : 'bg-gradient-to-r from-emerald-100/80 to-emerald-200/60 border-emerald-300/50 shadow-sm'
        }`}>
          <div className="text-center">
            <h3 className={`text-xl font-bold mb-4 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              💡 Lembre-se
            </h3>
            <p className={`text-sm lg:text-base leading-relaxed transition-colors duration-300 ${
              isDark ? 'text-slate-300' : 'text-gray-700'
            }`}>
              A consistência é a chave para o sucesso! Implemente essas dicas gradualmente e seja paciente consigo mesmo. 
              Mudanças pequenas e consistentes levam a grandes resultados ao longo do tempo.
            </p>
          </div>
        </div>

        {/* Back Button */}
        <div className="flex justify-center">
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

export default QuickTipsScreen;