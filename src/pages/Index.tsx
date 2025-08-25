import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import PhraseCard from "@/components/PhraseCard";
import SummaryCard from "@/components/SummaryCard";
import QuoteOfTheDay from "@/components/QuoteOfTheDay";
import ShareDemo from "@/components/ShareDemo";
import NavigationTutorial from "@/components/NavigationTutorial";
import WelcomeTutorial from "@/components/WelcomeTutorial";
import NotificationPrompt from "@/components/NotificationPrompt";
import { Sparkles, BookOpen, Search, TrendingUp, Heart, Star, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import phrasesData from "@/data/phrases.json";
import summariesData from "@/data/summaries.json";

const Index = () => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  
  // Check if user is visiting for the first time
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('spark-tutorial-completed');
    if (!hasSeenTutorial) {
      // Show welcome tutorial after a brief delay for better UX
      const timer = setTimeout(() => {
        setShowWelcome(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);
  
  // Get recent phrases and summaries for preview
  const recentPhrases = phrasesData.slice(0, 3);
  const recentSummaries = summariesData.slice(0, 2);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8 animate-fade-up">
            <div className="inline-flex items-center justify-center p-4 bg-gradient-hero rounded-2xl mb-8 animate-glow shadow-lg">
              <Sparkles className="h-10 w-10 text-primary-foreground animate-float" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-6 leading-tight">
              Bem-vindo ao Spark Phrase Bank
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-4 font-medium">
              🌱 Seu app de crescimento pessoal diário
            </p>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Desperte sua criatividade com uma coleção curada de frases inspiradoras, 
              insights profundos e reflexões transformadoras que impulsionam sua evolução
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link to="/frases" className="group">
                <Button variant="hero" size="lg" className="w-full sm:w-auto group-hover:animate-pulse">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Explorar Frases
                </Button>
              </Link>
              <Link to="/buscar" className="group">
                <Button variant="accent" size="lg" className="w-full sm:w-auto">
                  <Search className="h-5 w-5 mr-2" />
                  Buscar Inspiração
                </Button>
              </Link>
            </div>
            <Button 
              variant="glass" 
              size="sm" 
              onClick={() => setShowTutorial(true)}
              className="text-sm animate-scale-in hover:shadow-md"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Como usar este app?
            </Button>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse-gentle"></div>
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-pulse-gentle"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-hero opacity-5 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 lg:py-16 glass border-y border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="text-center group">
              <div className="text-2xl lg:text-3xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">{phrasesData.length}</div>
              <div className="text-sm lg:text-base text-muted-foreground">Frases Inspiradoras</div>
            </div>
            <div className="text-center group">
              <div className="text-2xl lg:text-3xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">{summariesData.length}</div>
              <div className="text-sm lg:text-base text-muted-foreground">Resumos Detalhados</div>
            </div>
            <div className="text-center group">
              <div className="text-2xl lg:text-3xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                {new Set(phrasesData.map(p => p.author)).size}
              </div>
              <div className="text-sm lg:text-base text-muted-foreground">Autores Únicos</div>
            </div>
            <div className="text-center group">
              <div className="text-2xl lg:text-3xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                {new Set(phrasesData.map(p => p.category)).size}
              </div>
              <div className="text-sm lg:text-base text-muted-foreground">Categorias</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16 animate-fade-up">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Recursos Principais
            </h2>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Descubra ferramentas poderosas para organizar e encontrar a inspiração que você precisa
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <Card className="group glass hover:shadow-lg transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] animate-fade-in">
              <CardContent className="p-6 lg:p-8 text-center">
                <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-xl mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl lg:text-2xl font-semibold text-foreground mb-4">
                  Banco de Frases
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Acesse centenas de frases inspiradoras organizadas por categoria, autor e tags
                </p>
              </CardContent>
            </Card>
            
            <Card className="group glass hover:shadow-lg transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <CardContent className="p-6 lg:p-8 text-center">
                <div className="inline-flex items-center justify-center p-4 bg-accent/10 rounded-xl mb-6 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                  <TrendingUp className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl lg:text-2xl font-semibold text-foreground mb-4">
                  Insights e Resumos
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Análises profundas e reflexões baseadas nas frases mais impactantes
                </p>
              </CardContent>
            </Card>
            
            <Card className="group glass hover:shadow-lg transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] animate-fade-in md:col-span-2 lg:col-span-1" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-6 lg:p-8 text-center">
                <div className="inline-flex items-center justify-center p-4 bg-primary-light/10 rounded-xl mb-6 group-hover:bg-primary-light/20 group-hover:scale-110 transition-all duration-300">
                  <Search className="h-8 w-8 text-primary-light" />
                </div>
                <h3 className="text-xl lg:text-2xl font-semibold text-foreground mb-4">
                  Busca Avançada
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Encontre exatamente o que procura com filtros inteligentes e busca semântica
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Notification Prompt */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <NotificationPrompt />
        </div>
      </section>

      {/* Quote of the Day */}
      <QuoteOfTheDay phrases={phrasesData} />

      {/* Share Demo */}
      <ShareDemo />

      {/* Recent Content Preview */}
      <section className="py-16 lg:py-24 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Recent Phrases */}
          <div className="mb-16 lg:mb-20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 lg:mb-12 gap-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                Frases em Destaque
              </h2>
              <Link to="/frases">
                <Button variant="glass" className="w-full sm:w-auto">
                  Ver Todas
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {recentPhrases.map((phrase, index) => (
                <div 
                  key={phrase.id} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <PhraseCard phrase={phrase} />
                </div>
              ))}
            </div>
          </div>

          {/* Recent Summaries */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 lg:mb-12 gap-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                Insights Recentes
              </h2>
              <Link to="/resumos">
                <Button variant="glass" className="w-full sm:w-auto">
                  Ver Todos
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {recentSummaries.map((summary, index) => (
                <div 
                  key={summary.id} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <SummaryCard summary={summary} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-hero p-8 lg:p-12 rounded-3xl shadow-glow animate-glow relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='7' cy='7' r='7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
                Pronto para se inspirar?
              </h2>
              <p className="text-lg lg:text-xl text-primary-foreground/90 mb-8 lg:mb-10 max-w-3xl mx-auto leading-relaxed">
                Junte-se à nossa comunidade e descubra frases que transformam perspectivas e impulsionam seu crescimento
              </p>
              <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center">
                <Link to="/frases" className="group">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto group-hover:scale-105 transition-transform duration-300">
                    <Heart className="h-5 w-5 mr-2 group-hover:animate-bounce" />
                    Começar Agora
                  </Button>
                </Link>
                <Link to="/resumos" className="group">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground group-hover:scale-105 transition-all duration-300"
                  >
                    <Star className="h-5 w-5 mr-2 group-hover:animate-spin" />
                    Explorar Insights
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Welcome Tutorial for First-time Users */}
      <WelcomeTutorial 
        isOpen={showWelcome} 
        onClose={() => setShowWelcome(false)} 
      />
      
      {/* Navigation Tutorial */}
      <NavigationTutorial 
        isOpen={showTutorial} 
        onClose={() => setShowTutorial(false)} 
      />
    </Layout>
  );
};

export default Index;
