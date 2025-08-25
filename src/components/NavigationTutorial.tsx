import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, ArrowRight, BookOpen, Search, Heart, TrendingUp, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NavigationTutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

const NavigationTutorial = ({ isOpen, onClose }: NavigationTutorialProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const tutorialSteps = [
    {
      title: "Bem-vindo ao Spark Phrase Bank! 🎉",
      content: "Sua jornada de crescimento pessoal começa aqui. Este é seu companheiro diário para inspiração e desenvolvimento.",
      icon: <Sparkles className="h-8 w-8 text-primary" />,
      action: null
    },
    {
      title: "Explore o Banco de Frases",
      content: "Acesse centenas de frases inspiradoras organizadas por categoria, autor e tema para encontrar exatamente o que precisa.",
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      action: { label: "Ver Frases", path: "/frases" }
    },
    {
      title: "Busque Inspiração Específica",
      content: "Use nossa busca avançada para encontrar frases por palavra-chave, autor ou categoria que ressoe com seu momento atual.",
      icon: <Search className="h-8 w-8 text-accent" />,
      action: { label: "Buscar", path: "/buscar" }
    },
    {
      title: "Salve Seus Favoritos",
      content: "Marque as frases que mais tocam seu coração e crie sua coleção pessoal de motivação diária.",
      icon: <Heart className="h-8 w-8 text-red-500" />,
      action: { label: "Favoritos", path: "/favoritos" }
    },
    {
      title: "Insights e Reflexões",
      content: "Explore análises profundas e reflexões baseadas nas frases mais impactantes para aprofundar seu crescimento.",
      icon: <TrendingUp className="h-8 w-8 text-primary-glow" />,
      action: { label: "Ver Insights", path: "/resumos" }
    }
  ];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleActionClick = (path: string) => {
    navigate(path);
    onClose();
  };

  if (!isOpen) return null;

  const currentStepData = tutorialSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gradient-bg border border-border/50 shadow-glow animate-fade-in">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-2 top-2 h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              {currentStepData.icon}
            </div>
          </div>
          
          <CardTitle className="text-center text-xl font-bold text-foreground">
            {currentStepData.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground leading-relaxed">
            {currentStepData.content}
          </p>
          
          {currentStepData.action && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => handleActionClick(currentStepData.action!.path)}
                className="hover:bg-primary/10"
              >
                {currentStepData.action.label}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
          
          {/* Progress indicators */}
          <div className="flex justify-center space-x-2">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          
          {/* Navigation buttons */}
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="text-sm"
            >
              Anterior
            </Button>
            
            <Badge variant="secondary" className="text-xs">
              {currentStep + 1} de {tutorialSteps.length}
            </Badge>
            
            <Button
              onClick={handleNext}
              className="text-sm"
            >
              {currentStep === tutorialSteps.length - 1 ? 'Começar!' : 'Próximo'}
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NavigationTutorial;