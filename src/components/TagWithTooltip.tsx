import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface TagWithTooltipProps {
  tag: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
}

// Definições de conceitos para tooltips/modals
const conceptDefinitions: Record<string, { 
  definition: string; 
  expanded?: string; 
  examples?: string[];
  needsModal?: boolean;
}> = {
  "pnl": {
    definition: "Programação Neurolinguística - Estuda padrões de comportamento e comunicação",
    expanded: "A Programação Neurolinguística (PNL) é uma abordagem psicológica que examina as estratégias utilizadas por indivíduos bem-sucedidos e as ensina a outros. Baseia-se na ideia de que existe uma conexão entre processos neurológicos, linguagem e padrões comportamentais aprendidos através da experiência.",
    examples: [
      "Modelagem de comportamentos de sucesso",
      "Técnicas de comunicação persuasiva", 
      "Mudança de crenças limitantes",
      "Ancoragem de estados emocionais positivos"
    ],
    needsModal: true
  },
  "coaching": {
    definition: "Processo que visa desenvolver competências e alcançar objetivos específicos",
    expanded: "O Coaching é um processo de desenvolvimento no qual uma pessoa experiente, chamada coach, apoia um aprendiz ou cliente na conquista de um objetivo específico pessoal ou profissional, fornecendo treinamento e orientação. Foca no presente e futuro, ajudando a pessoa a descobrir suas próprias respostas.",
    examples: [
      "Definição de metas claras e alcançáveis",
      "Desenvolvimento de competências específicas",
      "Superação de bloqueios e limitações",
      "Melhoria da performance pessoal/profissional"
    ],
    needsModal: true
  },
  "mindfulness": {
    definition: "Prática de atenção plena no momento presente",
    expanded: "Mindfulness é a prática de prestar atenção ao momento presente de forma intencional e sem julgamento. Origina-se de tradições meditativas budistas, mas foi adaptada para contextos seculares como ferramenta de bem-estar mental e redução do estresse.",
    examples: [
      "Meditação de atenção plena",
      "Respiração consciente",
      "Observação de pensamentos sem julgamento",
      "Prática da gratidão diária"
    ],
    needsModal: true
  },
  "inteligência emocional": {
    definition: "Capacidade de reconhecer, compreender e gerenciar emoções",
    expanded: "A Inteligência Emocional refere-se à habilidade de identificar, usar, compreender e gerenciar emoções de forma eficaz. Inclui cinco componentes principais: autoconsciência, autorregulação, motivação, empatia e habilidades sociais.",
    needsModal: true
  },
  "neurociência": {
    definition: "Estudo científico do sistema nervoso e do cérebro",
    expanded: "A Neurociência é o campo científico que estuda o sistema nervoso, incluindo estrutura, função, desenvolvimento, genética, bioquímica, fisiologia, farmacologia e patologia do sistema nervoso. No contexto do desenvolvimento pessoal, ajuda a entender como o cérebro processa informações e forma hábitos."
  },
  "produtividade": {
    definition: "Capacidade de produzir, criar ou realizar trabalho de forma eficiente"
  },
  "liderança": {
    definition: "Habilidade de influenciar e guiar outros em direção a objetivos comuns"
  },
  "comunicação": {
    definition: "Processo de troca de informações, ideias e sentimentos"
  },
  "relacionamentos": {
    definition: "Conexões e interações entre pessoas baseadas em confiança e respeito"
  },
  "hábitos": {
    definition: "Comportamentos automáticos repetidos regularmente"
  },
  "crescimento": {
    definition: "Processo contínuo de desenvolvimento e melhoria pessoal"
  },
  "motivação": {
    definition: "Força interna que impulsiona ações em direção a objetivos"
  }
};

const TagWithTooltip = ({ tag, variant = "outline", className = "" }: TagWithTooltipProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const normalizedTag = tag.toLowerCase().trim();
  const concept = conceptDefinitions[normalizedTag];

  // Se não há definição para a tag, retorna badge normal
  if (!concept) {
    return (
      <Badge variant={variant} className={`text-xs ${className}`}>
        {tag}
      </Badge>
    );
  }

  // Se precisa de modal (conceito complexo), usa Dialog
  if (concept.needsModal && concept.expanded) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Badge 
            variant={variant} 
            className={`text-xs cursor-pointer hover:bg-primary/10 transition-colors group ${className}`}
          >
            {tag}
            <Info className="ml-1 h-3 w-3 opacity-60 group-hover:opacity-100 transition-opacity" />
          </Badge>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl capitalize">{tag}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              {concept.expanded}
            </p>
            {concept.examples && (
              <div>
                <h4 className="font-semibold text-foreground mb-2">Aplicações Práticas:</h4>
                <ul className="space-y-2">
                  {concept.examples.map((example, index) => (
                    <li key={index} className="flex items-start text-sm text-muted-foreground">
                      <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Para conceitos simples, usa Tooltip
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant={variant} 
            className={`text-xs cursor-help hover:bg-primary/10 transition-colors ${className}`}
          >
            {tag}
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-sm">{concept.definition}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TagWithTooltip;