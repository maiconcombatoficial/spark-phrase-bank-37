import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import BookSummaryCard from "@/components/BookSummaryCard";
import Layout from "@/components/Layout";
import { Search, Plus, BookOpen, Star, Filter, Menu, Brain, Users, Heart, TrendingUp, DollarSign, Target, Globe, Briefcase } from "lucide-react";
import bookSummariesData from "@/data/book-summaries.json";

const Resumos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("dateAdded");
  const [activeNavigationTab, setActiveNavigationTab] = useState("categorias");
  const [selectedSpecialCategories, setSelectedSpecialCategories] = useState<string[]>([]);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const summaries = bookSummariesData;
  
  // Get unique categories
  const categories = Array.from(new Set(summaries.map(s => s.category)));

  // Define special category sections with explanations
  const specialCategories = [
    {
      id: "pnl",
      name: "PNL - Programação Neurolinguística",
      icon: Brain,
      description: "Técnicas para reprogramar padrões mentais e alcançar resultados extraordinários através da compreensão da mente humana.",
      tags: ["pnl", "neurociência", "programação", "mente"],
      color: "text-blue-500"
    },
    {
      id: "coaching",
      name: "Coaching & Desenvolvimento",
      icon: Target,
      description: "Metodologias e ferramentas para acelerar o desenvolvimento pessoal e profissional através de processos estruturados.",
      tags: ["coaching", "desenvolvimento pessoal", "liderança", "mentoria"],
      color: "text-green-500"
    },
    {
      id: "autoajuda",
      name: "Autoajuda & Crescimento",
      icon: Heart,
      description: "Livros fundamentais para transformação pessoal, construção de hábitos positivos e superação de limitações.",
      tags: ["autoajuda", "crescimento", "transformação", "hábitos"],
      color: "text-pink-500"  
    },
    {
      id: "financas",
      name: "Educação Financeira",
      icon: DollarSign,
      description: "Conceitos essenciais sobre dinheiro, investimentos e construção de riqueza para independência financeira.",
      tags: ["finanças", "investimentos", "dinheiro", "riqueza"],
      color: "text-yellow-500"
    },
    {
      id: "negocios",
      name: "Negócios & Empreendedorismo",
      icon: Briefcase,
      description: "Estratégias e princípios para criar, gerenciar e escalar negócios de sucesso no mundo empresarial.",
      tags: ["negócios", "empreendedorismo", "estratégia", "inovação"],
      color: "text-purple-500"
    },
    {
      id: "relacionamentos",
      name: "Relacionamentos & Comunicação",
      icon: Users,
      description: "Habilidades interpessoais, comunicação eficaz e construção de relacionamentos sólidos e duradouros.",
      tags: ["relacionamentos", "comunicação", "influência", "empatia"],
      color: "text-orange-500"
    }
  ];

  // Filter and sort summaries
  const filteredAndSortedSummaries = useMemo(() => {
    let filtered = summaries.filter(summary => {
      const matchesSearch = summary.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           summary.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           summary.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           summary.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = !selectedCategory || summary.category === selectedCategory;
      
      // Check special category filters
      const matchesSpecialCategories = selectedSpecialCategories.length === 0 || 
        selectedSpecialCategories.some(specialCatId => {
          const specialCat = specialCategories.find(c => c.id === specialCatId);
          return specialCat && (
            specialCat.tags.some(tag => 
              summary.tags.includes(tag) || 
              summary.category.toLowerCase().includes(tag) ||
              summary.title.toLowerCase().includes(tag) ||
              summary.summary.toLowerCase().includes(tag)
            )
          );
        });
      
      return matchesSearch && matchesCategory && matchesSpecialCategories;
    });

    // Sort summaries
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "author":
          return a.author.localeCompare(b.author);
        case "rating":
          return b.rating - a.rating;
        case "year":
          return b.publishYear - a.publishYear;
        case "dateAdded":
        default:
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      }
    });

    return filtered;
  }, [summaries, searchTerm, selectedCategory, selectedSpecialCategories, sortBy]);

  const handleSpecialCategoryToggle = (categoryId: string) => {
    setSelectedSpecialCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
    setSelectedSpecialCategories([]);
    setSortBy("dateAdded");
  };

  // Category Navigation Sidebar Component
  const CategoryNavigation = ({ isMobile = false }) => (
    <div className={`${isMobile ? 'p-4' : 'p-6'}`}>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Navegar por Categorias</h3>
          <Tabs value={activeNavigationTab} onValueChange={setActiveNavigationTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="categorias">Categorias</TabsTrigger>
              <TabsTrigger value="especiais">Especiais</TabsTrigger>
            </TabsList>
            
            <TabsContent value="categorias" className="mt-4">
              <div className="space-y-2">
                <Button
                  variant={selectedCategory === null ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory(null)}
                >
                  <BookOpen className="h-4 w-4 mr-3" />
                  Todas as Categorias
                </Button>
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "ghost"}
                    className="w-full justify-start capitalize"
                    onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                  >
                    <div className="h-4 w-4 mr-3 rounded-full bg-primary/20" />
                    {category}
                  </Button>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="especiais" className="mt-4">
              <div className="space-y-3">
                {specialCategories.map(category => {
                  const IconComponent = category.icon;
                  const isSelected = selectedSpecialCategories.includes(category.id);
                  return (
                    <div key={category.id} className="space-y-2">
                      <Button
                        variant={isSelected ? "default" : "ghost"}
                        className="w-full justify-start h-auto p-3"
                        onClick={() => handleSpecialCategoryToggle(category.id)}
                      >
                        <IconComponent className={`h-5 w-5 mr-3 ${category.color}`} />
                        <div className="text-left flex-1">
                          <div className="font-medium text-sm">{category.name}</div>
                        </div>
                      </Button>
                      {isSelected && (
                        <div className="ml-8 p-3 bg-accent/10 rounded-lg">
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {category.description}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Active Filters */}
        {(selectedCategory || selectedSpecialCategories.length > 0) && (
          <div className="p-4 bg-accent/20 rounded-lg">
            <div className="text-sm font-medium text-foreground mb-2">Filtros ativos:</div>
            <div className="space-y-2">
              {selectedCategory && (
                <Badge variant="secondary" className="text-xs capitalize">
                  {selectedCategory}
                </Badge>
              )}
              {selectedSpecialCategories.map(catId => {
                const cat = specialCategories.find(c => c.id === catId);
                return cat && (
                  <Badge key={catId} variant="secondary" className="text-xs">
                    {cat.name}
                  </Badge>
                );
              })}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearFilters}
              className="mt-2 w-full"
            >
              Limpar filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Layout>
      
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-80 border-r border-border bg-card/50 backdrop-blur-sm">
          <div className="sticky top-0 h-screen overflow-y-auto">
            <CategoryNavigation />
          </div>
        </aside>

        {/* Mobile Sidebar */}
        <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
          <SheetContent side="left" className="w-80 p-0">
            <CategoryNavigation isMobile />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="h-4 w-4 mr-2" />
                Categorias
              </Button>
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mx-auto lg:mx-0">
                Resumos de Livros
              </h1>
              <div className="lg:hidden w-20" />
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Descubra os principais ensinamentos dos livros mais influentes sobre desenvolvimento pessoal e profissional
            </p>
          </div>

        {/* Search and Filters */}
        <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6 mb-8 shadow-elegant">
          <div className="flex flex-col space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por título, autor, conteúdo ou tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Categories */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Categorias
              </label>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={selectedCategory === null ? "default" : "outline"}
                  className="cursor-pointer transition-all hover:scale-105"
                  onClick={() => setSelectedCategory(null)}
                >
                  Todas
                </Badge>
                {categories.map(category => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className="cursor-pointer transition-all hover:scale-105"
                    onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Sort and filter controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dateAdded">Mais recentes</SelectItem>
                    <SelectItem value="title">Título A-Z</SelectItem>
                    <SelectItem value="author">Autor A-Z</SelectItem>
                    <SelectItem value="rating">Melhor avaliação</SelectItem>
                    <SelectItem value="year">Ano de publicação</SelectItem>
                  </SelectContent>
                </Select>
                
                {(selectedCategory || selectedSpecialCategories.length > 0 || searchTerm) && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearFilters}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Limpar filtros
                  </Button>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground">
                {filteredAndSortedSummaries.length} resumos encontrados
              </p>
            </div>
          </div>
        </div>

        {/* Add Summary Button */}
        <div className="flex justify-end mb-6">
          <Button variant="hero" className="shadow-glow">
            <Plus className="h-4 w-4 mr-2" />
            Sugerir Livro
          </Button>
        </div>

        {/* Summaries Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAndSortedSummaries.map((summary) => (
            <div key={summary.id} className="animate-fade-in">
              <BookSummaryCard summary={summary} />
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredAndSortedSummaries.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Nenhum resumo encontrado
            </h3>
            <p className="text-muted-foreground">
              Tente ajustar seus filtros ou termos de busca
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6 text-center shadow-elegant">
            <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-foreground">{summaries.length}</h3>
            <p className="text-muted-foreground">Livros Resumidos</p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6 text-center shadow-elegant">
            <div className="h-8 w-8 text-accent mx-auto mb-2 text-2xl">🏷️</div>
            <h3 className="text-2xl font-bold text-foreground">{categories.length}</h3>
            <p className="text-muted-foreground">Categorias</p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6 text-center shadow-elegant">
            <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-foreground">
              {(summaries.reduce((acc, s) => acc + s.rating, 0) / summaries.length).toFixed(1)}
            </h3>
            <p className="text-muted-foreground">Avaliação Média</p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6 text-center shadow-elegant">
            <div className="h-8 w-8 text-primary-glow mx-auto mb-2 text-2xl">🔗</div>
            <h3 className="text-2xl font-bold text-foreground">
              {summaries.reduce((acc, s) => acc + s.relatedPhrases.length, 0)}
            </h3>
            <p className="text-muted-foreground">Frases Conectadas</p>
          </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Resumos;