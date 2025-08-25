import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  Target, 
  Users, 
  Heart, 
  BookOpen, 
  Star,
  Lightbulb,
  TrendingUp,
  Shield,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";

const Sobre = () => {
  const features = [
    {
      icon: Star,
      title: "Frases Inspiracionais",
      description: "Coleção curada de frases motivacionais de grandes pensadores e líderes"
    },
    {
      icon: BookOpen,
      title: "Resumos Poderosos",
      description: "Sínteses de conceitos importantes para desenvolvimento pessoal e profissional"
    },
    {
      icon: Heart,
      title: "Sistema de Favoritos",
      description: "Salve e organize seu conteúdo favorito para fácil acesso"
    },
    {
      icon: Target,
      title: "Busca Inteligente",
      description: "Encontre exatamente o que precisa com filtros avançados por tema, autor e categoria"
    }
  ];

  const stats = [
    { number: "500+", label: "Frases Inspiracionais" },
    { number: "100+", label: "Resumos Exclusivos" },
    { number: "50+", label: "Autores Renomados" },
    { number: "∞", label: "Possibilidades de Crescimento" }
  ];

  const values = [
    {
      icon: Lightbulb,
      title: "Inspiração Diária",
      description: "Acreditamos que pequenas doses de inspiração podem transformar vidas inteiras."
    },
    {
      icon: TrendingUp,
      title: "Crescimento Contínuo",
      description: "Promovemos o desenvolvimento pessoal e profissional através do conhecimento."
    },
    {
      icon: Shield,
      title: "Qualidade Garantida",
      description: "Todo conteúdo é cuidadosamente selecionado e verificado por nossa equipe."
    },
    {
      icon: Zap,
      title: "Impacto Real",
      description: "Focamos em conteúdo que gera transformações concretas na vida das pessoas."
    }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-gradient-hero rounded-2xl shadow-glow animate-glow">
              <Sparkles className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
            Sobre o Spark Phrase Bank
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Uma plataforma dedicada a inspirar e transformar vidas através do poder das palavras. 
            Combinamos tecnologia moderna com sabedoria atemporal para criar uma experiência única 
            de desenvolvimento pessoal.
          </p>
        </div>

        {/* Mission */}
        <Card className="mb-16 p-8 glass border-border/50 shadow-elegant">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">Nossa Missão</h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Democratizar o acesso ao conhecimento transformador, oferecendo uma plataforma intuitiva 
              onde pessoas de todas as idades possam encontrar inspiração, motivação e ferramentas 
              práticas para seu crescimento pessoal e profissional. Acreditamos que as palavras certas, 
              no momento certo, podem mudar trajetórias.
            </p>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 text-center glass hover:shadow-glow transition-all duration-300 group">
              <div className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                {stat.number}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.label}
              </div>
            </Card>
          ))}
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Principais Funcionalidades</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="p-6 glass hover:shadow-lg transition-all duration-300 group">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gradient-accent rounded-lg group-hover:scale-110 transition-transform">
                      <IconComponent className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Nossos Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="p-6 glass hover:shadow-lg transition-all duration-300 group">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gradient-hero rounded-lg group-hover:scale-110 transition-transform">
                      <IconComponent className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                      <p className="text-muted-foreground">{value.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Technology */}
        <Card className="mb-16 p-8 glass border-border/50 shadow-elegant">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">Tecnologia Moderna</h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto mb-6 leading-relaxed">
              Desenvolvido com as mais modernas tecnologias web, oferecemos uma experiência rápida, 
              responsiva e intuitiva. Nossa plataforma é otimizada para funcionar perfeitamente 
              em todos os dispositivos.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {["React", "TypeScript", "Tailwind CSS", "Vite", "Lucide Icons"].map((tech) => (
                <Badge key={tech} variant="secondary" className="px-3 py-1">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Pronto para se Inspirar?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de pessoas que já transformaram suas vidas com nossa plataforma.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="hero" size="lg">
              <Link to="/frases">
                <Star className="h-5 w-5 mr-2" />
                Explorar Frases
              </Link>
            </Button>
            <Button asChild variant="accent" size="lg">
              <Link to="/resumos">
                <BookOpen className="h-5 w-5 mr-2" />
                Ver Resumos
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Sobre;