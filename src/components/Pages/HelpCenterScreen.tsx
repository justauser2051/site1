import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, ChevronDown, Shield, Bell, Settings, Play, Monitor, RefreshCw, Palette, LogOut, Moon, BarChart3, Smartphone, Wifi, Mail } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface HelpCenterScreenProps {
  onBack: () => void;
}

interface HelpItem {
  id: string;
  question: string;
  answer: string;
  icon: React.ComponentType<any>;
  category: string;
}

const HelpCenterScreen: React.FC<HelpCenterScreenProps> = ({ onBack }) => {
  const { isDark } = useTheme();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const helpItems: HelpItem[] = [
    {
      id: 'military-technique',
      question: 'Como funciona a técnica militar de sono?',
      answer: 'A técnica militar de sono é um método desenvolvido pelas forças armadas para adormecer rapidamente em qualquer situação. Ela combina relaxamento muscular progressivo, controle da respiração e visualização mental. O processo envolve: 1) Relaxar completamente o rosto e músculos; 2) Soltar os ombros e braços; 3) Respirar profundamente; 4) Relaxar as pernas; 5) Limpar a mente por 10 segundos. Com prática, você pode adormecer em até 2 minutos.',
      icon: Shield,
      category: 'Técnicas'
    },
    {
      id: 'monitor-progress',
      question: 'Como posso monitorar meu progresso?',
      answer: 'Seu progresso é automaticamente salvo conforme você assiste às aulas. Você pode acompanhar: 1) Na aba "Continuar" - veja módulos em andamento; 2) Em cada módulo - barra de progresso mostra % concluído; 3) Nas configurações - estatísticas gerais como dias ativos e aulas assistidas. O app salva automaticamente qual aula você parou e quantas já completou em cada módulo.',
      icon: BarChart3,
      category: 'Progresso'
    },
    {
      id: 'notifications',
      question: 'Como ativar/desativar notificações?',
      answer: 'Para gerenciar notificações: 1) Vá em "Configurações" na barra inferior; 2) Encontre a seção "Notificações"; 3) Use o botão deslizante ao lado de "Notificações de Progresso"; 4) Se for a primeira vez, o navegador pedirá permissão; 5) Você pode testar as notificações usando o botão de teste. As notificações incluem lembretes de progresso e alertas de inatividade após 24h.',
      icon: Bell,
      category: 'Configurações'
    },
    {
      id: 'profile-settings',
      question: 'Onde posso alterar minhas configurações de perfil?',
      answer: 'Suas configurações estão na aba "Configurações" (ícone de engrenagem na barra inferior). Lá você encontra: 1) Informações da conta; 2) Configurações de notificações; 3) Tema do aplicativo (escuro/claro); 4) Privacidade e dados; 5) Central de ajuda; 6) Sobre o app. Suas estatísticas de progresso também são exibidas no topo da tela de configurações.',
      icon: Settings,
      category: 'Configurações'
    },
    {
      id: 'access-lessons',
      question: 'Como acessar as aulas?',
      answer: 'Para acessar as aulas: 1) Na tela inicial, escolha um dos 3 módulos disponíveis; 2) Toque em "Acessar" no módulo desejado; 3) Você verá a lista de aulas do módulo; 4) Toque em qualquer aula para assistir; 5) Use as setas no player para navegar entre aulas; 6) Seu progresso é salvo automaticamente. Você também pode continuar de onde parou usando a aba "Continuar".',
      icon: Play,
      category: 'Navegação'
    },
    {
      id: 'app-not-loading',
      question: 'O que fazer se o aplicativo não estiver carregando?',
      answer: 'Se o app não carregar: 1) Verifique sua conexão com a internet; 2) Atualize a página (F5 ou Ctrl+R); 3) Limpe o cache do navegador; 4) Tente usar outro navegador (Chrome, Firefox, Safari); 5) Verifique se JavaScript está habilitado; 6) Se o problema persistir, tente acessar em modo anônimo/privado. O app funciona melhor em navegadores atualizados.',
      icon: RefreshCw,
      category: 'Problemas Técnicos'
    },
    {
      id: 'change-theme',
      question: 'Como faço para mudar o tema do aplicativo?',
      answer: 'Para alterar o tema: 1) Vá em "Configurações" na barra inferior; 2) Procure a seção "Aparência"; 3) Encontre "Tema do Aplicativo"; 4) Use o botão deslizante para alternar entre modo escuro e claro; 5) A mudança é aplicada imediatamente; 6) Sua preferência é salva automaticamente. O modo escuro é ideal para uso noturno, enquanto o claro é melhor para ambientes iluminados.',
      icon: Palette,
      category: 'Configurações'
    },
    {
      id: 'logout',
      question: 'Onde posso encontrar a opção de logout?',
      answer: 'Para sair da conta: 1) Vá em "Configurações" na barra inferior; 2) Role até o final da página; 3) Toque no botão vermelho "Sair da Conta"; 4) Confirme a ação na tela que aparecer; 5) Seu progresso será salvo automaticamente antes do logout; 6) Você será redirecionado para a tela de login. Não se preocupe - todos os seus dados ficam salvos para quando voltar!',
      icon: LogOut,
      category: 'Conta'
    },
    {
      id: 'sleep-calculator',
      question: 'Como usar a calculadora de sono?',
      answer: 'A calculadora de sono está em "Mais conteúdos": 1) Toque em "Calculadora de Sono"; 2) Escolha se quer calcular hora de dormir ou acordar; 3) Defina o horário desejado; 4) Selecione quantos ciclos de sono (recomendamos 5 ciclos = 7h30); 5) Toque em "Calcular"; 6) Veja seu horário ideal e hora de preparação. A calculadora considera ciclos de 90 minutos para otimizar seu descanso.',
      icon: Moon,
      category: 'Ferramentas'
    },
    {
      id: 'mobile-usage',
      question: 'Posso usar o app no celular?',
      answer: 'Sim! O Sleep Protocol é totalmente responsivo: 1) Funciona perfeitamente em smartphones e tablets; 2) A interface se adapta automaticamente ao tamanho da tela; 3) Todos os recursos estão disponíveis na versão mobile; 4) Para melhor experiência, use em modo retrato; 5) Recomendamos adicionar à tela inicial do seu celular para acesso rápido. O app funciona como um aplicativo nativo!',
      icon: Smartphone,
      category: 'Compatibilidade'
    },
    {
      id: 'offline-usage',
      question: 'O app funciona sem internet?',
      answer: 'O Sleep Protocol precisa de conexão para: 1) Fazer login inicial; 2) Carregar os vídeos das aulas; 3) Sincronizar progresso. Porém: 1) Seu progresso fica salvo localmente; 2) As configurações funcionam offline; 3) A calculadora de sono funciona sem internet; 4) Você pode revisar aulas já carregadas. Para melhor experiência, mantenha conexão estável durante as aulas.',
      icon: Wifi,
      category: 'Compatibilidade'
    },
    {
      id: 'video-quality',
      question: 'Como melhorar a qualidade dos vídeos?',
      answer: 'Para otimizar a qualidade dos vídeos: 1) Verifique sua velocidade de internet; 2) Nos vídeos do YouTube, clique na engrenagem (configurações); 3) Selecione "Qualidade" e escolha a resolução desejada; 4) Para conexões lentas, use 480p ou 720p; 5) Para melhor experiência, use 1080p com boa internet; 6) Pause o vídeo por alguns segundos para carregar completamente se necessário.',
      icon: Monitor,
      category: 'Problemas Técnicos'
    }
  ];

  const categories = ['Todas', 'Técnicas', 'Progresso', 'Configurações', 'Navegação', 'Problemas Técnicos', 'Ferramentas', 'Conta', 'Compatibilidade'];
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const filteredItems = selectedCategory === 'Todas' 
    ? helpItems 
    : helpItems.filter(item => item.category === selectedCategory);

  const toggleExpanded = (itemId: string) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
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
              <HelpCircle className="w-6 h-6 text-emerald-400" />
              <h1 className={`text-xl font-bold transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Central de Ajuda</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="px-6 py-8 max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className={`text-center mb-8 transition-colors duration-300`}>
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className={`text-2xl lg:text-3xl font-bold mb-4 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Como podemos ajudar?
          </h2>
          <p className={`text-lg leading-relaxed max-w-2xl mx-auto transition-colors duration-300 ${
            isDark ? 'text-slate-300' : 'text-gray-700'
          }`}>
            Encontre respostas rápidas para as dúvidas mais comuns sobre o Sleep Protocol. 
            Selecione uma categoria ou navegue por todas as perguntas.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : isDark
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Help Items */}
        <div className="space-y-4 mb-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`backdrop-blur-sm rounded-2xl border transition-all duration-300 overflow-hidden ${
                isDark 
                  ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700' 
                  : 'bg-white/80 border-gray-200 hover:border-gray-300 shadow-sm'
              }`}
            >
              <button
                onClick={() => toggleExpanded(item.id)}
                className="w-full p-6 text-left transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isDark ? 'bg-slate-800/50' : 'bg-gray-100/80'
                    }`}>
                      <item.icon className="w-6 h-6 text-emerald-400" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-lg font-bold mb-1 transition-colors duration-300 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {item.question}
                      </h3>
                      <span className={`text-sm px-3 py-1 rounded-full transition-colors duration-300 ${
                        isDark 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : 'bg-emerald-500/20 text-emerald-600'
                      }`}>
                        {item.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className={`transition-transform duration-200 ${
                    expandedItem === item.id ? 'rotate-180' : ''
                  }`}>
                    <ChevronDown className={`w-5 h-5 transition-colors duration-300 ${
                      isDark ? 'text-slate-400' : 'text-gray-600'
                    }`} />
                  </div>
                </div>
              </button>
              
              {/* Expanded Answer */}
              {expandedItem === item.id && (
                <div className={`px-6 pb-6 border-t transition-colors duration-300 ${
                  isDark ? 'border-slate-700' : 'border-gray-200'
                }`}>
                  <div className="pt-4">
                    <p className={`text-sm lg:text-base leading-relaxed transition-colors duration-300 ${
                      isDark ? 'text-slate-300' : 'text-gray-700'
                    }`}>
                      {item.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle className={`w-16 h-16 mx-auto mb-4 transition-colors duration-300 ${
              isDark ? 'text-slate-600' : 'text-gray-400'
            }`} />
            <h3 className={`text-lg font-bold mb-2 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Nenhuma pergunta encontrada
            </h3>
            <p className={`transition-colors duration-300 ${
              isDark ? 'text-slate-400' : 'text-gray-600'
            }`}>
              Tente selecionar uma categoria diferente
            </p>
          </div>
        )}

        {/* Contact Section */}
        <div className={`border rounded-2xl p-6 lg:p-8 mb-8 transition-colors duration-300 ${
          isDark 
            ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30' 
            : 'bg-gradient-to-r from-blue-100/80 to-purple-100/60 border-blue-300/50 shadow-sm'
        }`}>
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-blue-400" />
              <h3 className={`text-xl font-bold transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Ainda precisa de ajuda?
              </h3>
            </div>
            <p className={`text-sm lg:text-base mb-6 transition-colors duration-300 ${
              isDark ? 'text-slate-300' : 'text-gray-700'
            }`}>
              Se você não encontrou a resposta que procurava, nossa equipe está pronta para ajudar. 
              Entre em contato conosco através do email abaixo:
            </p>
            <div className={`inline-flex items-center gap-3 px-6 py-4 rounded-xl border transition-colors duration-300 ${
              isDark 
                ? 'bg-slate-800/50 border-slate-700 text-white' 
                : 'bg-white/90 border-gray-200 text-gray-900 shadow-sm'
            }`}>
              <Mail className="w-5 h-5 text-emerald-400" />
              <span className="font-medium text-sm sm:text-base lg:text-lg break-all">suporte@expertcursos.top</span>
            </div>
            
            <button
              onClick={() => window.location.href = 'mailto:suporte@expertcursos.top'}
              className={`mt-3 px-6 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:scale-105 ${
                isDark 
                  ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' 
                  : 'bg-emerald-500/20 text-emerald-600 hover:bg-emerald-500/30'
              }`}
            >
              Enviar Email
            </button>
          </div>
        </div>

        {/* Quick Tips */}
        <div className={`border rounded-2xl p-6 lg:p-8 mb-8 transition-colors duration-300 ${
          isDark 
            ? 'bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border-emerald-500/30' 
            : 'bg-gradient-to-r from-emerald-100/80 to-emerald-200/60 border-emerald-300/50 shadow-sm'
        }`}>
          <h3 className={`text-xl font-bold mb-6 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            💡 Dicas Rápidas
          </h3>
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 text-sm transition-colors duration-300 ${
            isDark ? 'text-slate-300' : 'text-gray-700'
          }`}>
            <div className="flex items-start gap-3">
              <span className="text-emerald-400 mt-1">•</span>
              <span>Seu progresso é salvo automaticamente a cada aula assistida</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-emerald-400 mt-1">•</span>
              <span>Use fones de ouvido para melhor experiência com as aulas</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-emerald-400 mt-1">•</span>
              <span>Pratique as técnicas regularmente para melhores resultados</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-emerald-400 mt-1">•</span>
              <span>Ative as notificações para lembretes personalizados</span>
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

export default HelpCenterScreen;