import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { X, ArrowRight, ArrowLeft, Sparkles, BookOpen, Search, Heart, Share2, Star, Calendar, Tag, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WelcomeTutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomeTutorial = ({ isOpen, onClose }: WelcomeTutorialProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const tutorialSteps = [
    {
      title: "Descubra Frases Diárias",
      subtitle: "Inspiração na palma da sua mão",
      content: "Comece cada dia com uma dose de motivação! Explore nossa coleção curada de frases inspiradoras que chegam até você com uma frase especial do dia.",
      icon: <Calendar className="h-12 w-12 text-blue-500" />,
      features: [
        "Frase do dia personalizada",
        "Centenas de frases organizadas",
        "Citações de grandes pensadores"
      ],
      action: { label: "Ver Frases", path: "/frases" },
      bgGradient: "from-blue-500/10 to-cyan-500/10",
      iconBg: "bg-blue-500/10"
    },
    {
      title: "Busque por Temas",
      subtitle: "Encontre exatamente o que precisa",
      content: "Use nossa busca inteligente para encontrar frases específicas por tema, autor ou palavra-chave. Navegue por categorias como motivação, liderança, criatividade e muito mais.",
      icon: <Search className="h-12 w-12 text-green-500" />,
      features: [
        "Busca avançada por tema e autor",
        "Filtros inteligentes",
        "Categorias organizadas"
      ],
      action: { label: "Buscar Agora", path: "/buscar" },
      bgGradient: "from-green-500/10 to-emerald-500/10",
      iconBg: "bg-green-500/10"
    },
    {
      title: "Favorite e Compartilhe",
      subtitle: "Guarde o que mais inspira você",
      content: "Salve suas frases favoritas para acessar rapidamente e compartilhe inspiração com amigos e família. Crie sua biblioteca pessoal de motivação.",
      icon: <Heart className="h-12 w-12 text-red-500" />,
      features: [
        "Sistema de favoritos personalizado",
        "Compartilhamento fácil",
        "Acesso rápido às suas frases"
      ],
      action: { label: "Meus Favoritos", path: "/favoritos" },
      bgGradient: "from-red-500/10 to-pink-500/10",
      iconBg: "bg-red-500/10"
    },
    {
      title: "Explore Resumos",
      subtitle: "Aprofunde seu conhecimento",
      content: "Descubra resumos detalhados dos melhores livros de desenvolvimento pessoal, com insights organizados por categorias como PNL, Coaching e Autoajuda.",
      icon: <FileText className="h-12 w-12 text-purple-500" />,
      features: [
        "Resumos de livros essenciais",
        "Organizados por categoria",
        "Insights práticos e aplicáveis"
      ],
      action: { label: "Ver Resumos", path: "/resumos" },
      bgGradient: "from-purple-500/10 to-indigo-500/10",
      iconBg: "bg-purple-500/10"
    }
  ];

  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    localStorage.setItem('spark-tutorial-completed', 'true');
    onClose();
  };

  const handleActionClick = (path: string) => {
    localStorage.setItem('spark-tutorial-completed', 'true');
    navigate(path);
    onClose();
  };

  if (!isOpen) return null;

  const currentStepData = tutorialSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-2xl animate-scale-in">
        <Card className={`bg-gradient-to-br ${currentStepData.bgGradient} border border-border/50 shadow-2xl backdrop-blur-sm`}>
          <CardHeader className="relative pb-4">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="secondary" className="text-xs">
                Tutorial Inicial
              </Badge>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Pular Tutorial
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSkip}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Progress value={progress} className="mb-6" />
            
            <div className="text-center">
              <div className={`inline-flex items-center justify-center p-4 ${currentStepData.iconBg} rounded-2xl mb-4 animate-fade-in`}>
                {currentStepData.icon}
              </div>
              
              <CardTitle className="text-2xl font-bold text-foreground mb-2">
                {currentStepData.title}
              </CardTitle>
              
              <p className="text-primary font-medium">
                {currentStepData.subtitle}
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <p className="text-center text-muted-foreground leading-relaxed text-lg">
              {currentStepData.content}
            </p>
            
            {/* Features list */}
            <div className="space-y-3">
              {currentStepData.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="h-2 w-2 bg-primary rounded-full flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>
            
            {/* Action button */}
            <div className="text-center">
              <Button
                variant="hero"
                size="lg"
                onClick={() => handleActionClick(currentStepData.action.path)}
                className="animate-scale-in shadow-glow"
              >
                {currentStepData.action.label}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
            
            {/* Step indicators */}
            <div className="flex justify-center space-x-2">
              {tutorialSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`h-3 w-3 rounded-full transition-all duration-300 ${
                    index === currentStep 
                      ? 'bg-primary scale-125' 
                      : index < currentStep 
                        ? 'bg-primary/60' 
                        : 'bg-muted hover:bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
            
            {/* Navigation */}
            <div className="flex justify-between items-center pt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="transition-all"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>
              
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {currentStep + 1} de {tutorialSteps.length}
                </span>
              </div>
              
              <Button
                onClick={handleNext}
                className="bg-primary hover:bg-primary/90 transition-all"
              >
                {currentStep === tutorialSteps.length - 1 ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Começar Jornada!
                  </>
                ) : (
                  <>
                    Próximo
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WelcomeTutorial;