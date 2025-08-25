import { useState, useEffect, useMemo, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PhraseCard from "@/components/PhraseCard";
import Layout from "@/components/Layout";
import { Search, Filter, Plus, Grid, List, Share2, X, Menu, Shield, Brain, Heart, Target, Users, Lightbulb, Mountain, Briefcase, TrendingUp, Home, Calendar, Plane, Trophy, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import phrasesData from "@/data/phrases.json";

const ITEMS_PER_PAGE = 9;

const Frases = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("dateAdded");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [activeNavigationTab, setActiveNavigationTab] = useState("temas");
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const [selectedMoments, setSelectedMoments] = useState<string[]>([]);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const phrases = phrasesData;
  
  // Get unique categories and tags
  const categories = Array.from(new Set(phrases.map(p => p.category))).sort();
  const allTags = Array.from(new Set(phrases.flatMap(p => p.tags))).sort();

  // Define navigation categories
  const availableThemes = [
    { id: "criatividade", name: "Criatividade", icon: Lightbulb, tags: ["criatividade", "inovação", "inspiração"] },
    { id: "lideranca", name: "Liderança", icon: Users, tags: ["liderança", "gestão", "equipe"] },
    { id: "sucesso", name: "Sucesso", icon: Target, tags: ["sucesso", "conquista", "objetivo"] },
    { id: "motivacao", name: "Motivação", icon: Heart, tags: ["motivação", "energia", "entusiasmo"] },
    { id: "sabedoria", name: "Sabedoria", icon: Brain, tags: ["sabedoria", "conhecimento", "aprendizado"] },
    { id: "coragem", name: "Coragem", icon: Shield, tags: ["coragem", "bravura", "ousadia"] }
  ];

  const lifeChallenges = [
    { id: "superar-medos", name: "Superar Medos", icon: Shield, tags: ["medo", "coragem", "ousadia"] },
    { id: "procrastinacao", name: "Lidar com Procrastinação", icon: Target, tags: ["procrastinação", "foco", "disciplina"] },
    { id: "autoestima", name: "Fortalecer Autoestima", icon: Heart, tags: ["autoestima", "confiança", "valor"] },
    { id: "ansiedade", name: "Controlar Ansiedade", icon: Brain, tags: ["ansiedade", "calma", "tranquilidade"] },
    { id: "relacionamentos", name: "Melhorar Relacionamentos", icon: Users, tags: ["relacionamento", "comunicação", "empatia"] },
    { id: "proposito", name: "Encontrar Propósito", icon: Lightbulb, tags: ["propósito", "significado", "missão"] }
  ];

  const lifeMoments = [
    { id: "inicio-carreira", name: "Início de Carreira", icon: Briefcase, tags: ["carreira", "trabalho", "início"] },
    { id: "momentos-crise", name: "Momentos de Crise", icon: Mountain, tags: ["crise", "dificuldade", "superação"] },
    { id: "transicoes-vida", name: "Transições de Vida", icon: TrendingUp, tags: ["mudança", "transição", "evolução"] },
    { id: "aposentadoria", name: "Aposentadoria", icon: Home, tags: ["aposentadoria", "descanso", "nova fase"] },
    { id: "casamento-familia", name: "Casamento e Família", icon: Heart, tags: ["família", "casamento", "união"] },
    { id: "conquistas-sucessos", name: "Conquistas e Sucessos", icon: Trophy, tags: ["sucesso", "vitória", "conquista"] }
  ];
  
  // Common search suggestions
  const commonSuggestions = [
    "liderança", "motivação", "sucesso", "inspiração", "foco",
    "persistência", "crescimento", "inovação", "criatividade", "coragem",
    "disciplina", "excelência", "mudança", "oportunidade", "sonhos"
  ];
  
  // Generate search suggestions based on current input
  const searchSuggestions = useMemo(() => {
    if (!searchTerm.trim()) return commonSuggestions.slice(0, 8);
    
    const term = searchTerm.toLowerCase();
    const suggestions = new Set<string>();
    
    // Add matching categories
    categories.forEach(cat => {
      if (cat.toLowerCase().includes(term)) {
        suggestions.add(cat);
      }
    });
    
    // Add matching tags
    allTags.forEach(tag => {
      if (tag.toLowerCase().includes(term)) {
        suggestions.add(tag);
      }
    });
    
    // Add matching authors
    phrases.forEach(phrase => {
      if (phrase.author.toLowerCase().includes(term)) {
        suggestions.add(phrase.author);
      }
    });
    
    // Add common suggestions that match
    commonSuggestions.forEach(suggestion => {
      if (suggestion.toLowerCase().includes(term)) {
        suggestions.add(suggestion);
      }
    });
    
    return Array.from(suggestions).slice(0, 8);
  }, [searchTerm, categories, allTags, phrases]);

  // Filter and sort phrases
  const filteredAndSortedPhrases = useMemo(() => {
    let filtered = phrases.filter(phrase => {
      const matchesSearch = phrase.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           phrase.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || phrase.category === selectedCategory;
      const matchesTag = !selectedTag || phrase.tags.includes(selectedTag);
      
      // Check theme filters
      const matchesThemes = selectedThemes.length === 0 || 
        selectedThemes.some(themeId => {
          const theme = availableThemes.find(t => t.id === themeId);
          return theme && theme.tags.some(tag => 
            phrase.tags.includes(tag) || phrase.category === themeId
          );
        });

      // Check challenge filters
      const matchesChallenges = selectedChallenges.length === 0 || 
        selectedChallenges.some(challengeId => {
          const challenge = lifeChallenges.find(c => c.id === challengeId);
          return challenge && challenge.tags.some(tag => 
            phrase.tags.includes(tag) || phrase.text.toLowerCase().includes(tag)
          );
        });

      // Check moment filters
      const matchesMoments = selectedMoments.length === 0 || 
        selectedMoments.some(momentId => {
          const moment = lifeMoments.find(m => m.id === momentId);
          return moment && moment.tags.some(tag => 
            phrase.tags.includes(tag) || phrase.category === tag
          );
        });
      
      return matchesSearch && matchesCategory && matchesTag && matchesThemes && matchesChallenges && matchesMoments;
    });

    // Sort phrases
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "author":
          return a.author.localeCompare(b.author);
        case "category":
          return a.category.localeCompare(b.category);
        case "dateAdded":
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [phrases, searchTerm, selectedCategory, selectedTag, selectedThemes, selectedChallenges, selectedMoments, sortBy]);

  // Paginate phrases
  const paginatedPhrases = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedPhrases.slice(0, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedPhrases, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedPhrases.length / ITEMS_PER_PAGE);
  const hasMorePages = currentPage < totalPages;

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedTag, selectedThemes, selectedChallenges, selectedMoments, sortBy]);
  
  // Load search history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("phrase-search-history");
    if (saved) {
      try {
        setSearchHistory(JSON.parse(saved));
      } catch (error) {
        console.error("Error loading search history:", error);
      }
    }
  }, []);
  
  // Save search to history
  const saveSearchToHistory = (search: string) => {
    if (!search.trim()) return;
    
    const newHistory = [search, ...searchHistory.filter(h => h !== search)].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem("phrase-search-history", JSON.stringify(newHistory));
  };
  
  // Handle search input changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setShowSuggestions(value.length > 0);
  };
  
  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    saveSearchToHistory(suggestion);
    searchInputRef.current?.blur();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
    setSelectedTag(null);
    setSelectedThemes([]);
    setSelectedChallenges([]);
    setSelectedMoments([]);
    setSortBy("dateAdded");
    setCurrentPage(1);
    setShowSuggestions(false);
  };

  const handleThemeToggle = (themeId: string) => {
    setSelectedThemes(prev => 
      prev.includes(themeId) 
        ? prev.filter(id => id !== themeId)
        : [...prev, themeId]
    );
  };

  const handleChallengeToggle = (challengeId: string) => {
    setSelectedChallenges(prev => 
      prev.includes(challengeId) 
        ? prev.filter(id => id !== challengeId)
        : [...prev, challengeId]
    );
  };

  const handleMomentToggle = (momentId: string) => {
    setSelectedMoments(prev => 
      prev.includes(momentId) 
        ? prev.filter(id => id !== momentId)
        : [...prev, momentId]
    );
  };

  const loadMore = () => {
    if (hasMorePages) {
      setCurrentPage(prev => prev + 1);
      toast({
        title: "Carregando mais frases...",
        description: `Página ${currentPage + 1} de ${totalPages}`,
      });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Spark Phrase Bank',
      text: `Confira essas ${filteredAndSortedPhrases.length} frases inspiradoras!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copiado!",
          description: "O link da página foi copiado para a área de transferência.",
        });
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  // Category Navigation Sidebar Component
  const CategoryNavigation = ({ isMobile = false }) => (
    <div className={`${isMobile ? 'p-4' : ''}`}>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Navegar por Categorias</h3>
          <Tabs value={activeNavigationTab} onValueChange={setActiveNavigationTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="temas">Temas</TabsTrigger>
              <TabsTrigger value="desafios">Desafios</TabsTrigger>
              <TabsTrigger value="momentos">Momentos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="temas" className="mt-4">
              <div className="space-y-2">
                {availableThemes.map(theme => {
                  const IconComponent = theme.icon;
                  const isSelected = selectedThemes.includes(theme.id);
                  return (
                    <Button
                      key={theme.id}
                      variant={isSelected ? "default" : "ghost"}
                      className="w-full justify-start h-auto p-3"
                      onClick={() => handleThemeToggle(theme.id)}
                    >
                      <IconComponent className="h-4 w-4 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">{theme.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {theme.tags.join(', ')}
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="desafios" className="mt-4">
              <div className="space-y-2">
                {lifeChallenges.map(challenge => {
                  const IconComponent = challenge.icon;
                  const isSelected = selectedChallenges.includes(challenge.id);
                  return (
                    <Button
                      key={challenge.id}
                      variant={isSelected ? "default" : "ghost"}
                      className="w-full justify-start h-auto p-3"
                      onClick={() => handleChallengeToggle(challenge.id)}
                    >
                      <IconComponent className="h-4 w-4 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">{challenge.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {challenge.tags.join(', ')}
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="momentos" className="mt-4">
              <div className="space-y-2">
                {lifeMoments.map(moment => {
                  const IconComponent = moment.icon;
                  const isSelected = selectedMoments.includes(moment.id);
                  return (
                    <Button
                      key={moment.id}
                      variant={isSelected ? "default" : "ghost"}
                      className="w-full justify-start h-auto p-3"
                      onClick={() => handleMomentToggle(moment.id)}
                    >
                      <IconComponent className="h-4 w-4 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">{moment.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {moment.tags.join(', ')}
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
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
                Banco de Frases
              </h1>
              <div className="lg:hidden w-20" />
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore nossa coleção de frases inspiradoras de grandes pensadores e líderes
            </p>
            
            {/* Active Filters Display */}
            {(selectedThemes.length > 0 || selectedChallenges.length > 0 || selectedMoments.length > 0) && (
              <div className="mt-4 p-4 bg-accent/20 rounded-lg">
                <div className="text-sm font-medium text-foreground mb-2">Filtros ativos:</div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {selectedThemes.map(themeId => {
                    const theme = availableThemes.find(t => t.id === themeId);
                    return theme && (
                      <Badge key={themeId} variant="secondary" className="text-xs">
                        {theme.name}
                        <X 
                          className="h-3 w-3 ml-1 cursor-pointer" 
                          onClick={() => handleThemeToggle(themeId)}
                        />
                      </Badge>
                    );
                  })}
                  {selectedChallenges.map(challengeId => {
                    const challenge = lifeChallenges.find(c => c.id === challengeId);
                    return challenge && (
                      <Badge key={challengeId} variant="secondary" className="text-xs">
                        {challenge.name}
                        <X 
                          className="h-3 w-3 ml-1 cursor-pointer" 
                          onClick={() => handleChallengeToggle(challengeId)}
                        />
                      </Badge>
                    );
                  })}
                  {selectedMoments.map(momentId => {
                    const moment = lifeMoments.find(m => m.id === momentId);
                    return moment && (
                      <Badge key={momentId} variant="secondary" className="text-xs">
                        {moment.name}
                        <X 
                          className="h-3 w-3 ml-1 cursor-pointer" 
                          onClick={() => handleMomentToggle(momentId)}
                        />
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        {/* Search and Filters - Fixed on mobile */}
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50 md:static md:bg-card/50 md:rounded-xl md:border md:mb-8 md:shadow-elegant mb-4">
          <div className="p-4 md:p-6">
            <div className="flex flex-col space-y-4">
              {/* Enhanced Search with Autocomplete */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 z-10" />
                <Input
                  ref={searchInputRef}
                  placeholder="Buscar frases, autores ou temas..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => setShowSuggestions(searchTerm.length > 0)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="pl-10 pr-10"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchTerm("");
                      setShowSuggestions(false);
                    }}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                
                {/* Search Suggestions Dropdown */}
                {showSuggestions && (searchSuggestions.length > 0 || searchHistory.length > 0) && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                    {searchHistory.length > 0 && (
                      <div className="p-2 border-b border-border">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Buscas recentes</p>
                        <div className="space-y-1">
                          {searchHistory.map((item, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionSelect(item)}
                              className="w-full text-left px-2 py-1 text-sm hover:bg-accent rounded text-foreground"
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="p-2">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Sugestões</p>
                      <div className="space-y-1">
                        {searchSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionSelect(suggestion)}
                            className="w-full text-left px-2 py-1 text-sm hover:bg-accent rounded text-foreground"
                          >
                            <Search className="h-3 w-3 inline mr-2 text-muted-foreground" />
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Filters - Always visible on desktop, collapsible on mobile */}
              <div className="md:block">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Categorias populares
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {categories.slice(0, 6).map(category => (
                        <Badge
                          key={category}
                          variant={selectedCategory === category ? "default" : "outline"}
                          className="cursor-pointer transition-all hover:scale-105 text-xs"
                          onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1">
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Tags em destaque
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {allTags.slice(0, 6).map(tag => (
                        <Badge
                          key={tag}
                          variant={selectedTag === tag ? "default" : "outline"}
                          className="cursor-pointer transition-all hover:scale-105 text-xs"
                          onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="flex items-center gap-4">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dateAdded">Mais recentes</SelectItem>
                      <SelectItem value="author">Por autor</SelectItem>
                      <SelectItem value="category">Por categoria</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="flex border rounded-lg overflow-hidden">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="rounded-none"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="rounded-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {filteredAndSortedPhrases.length} frases encontradas
                </p>
              </div>
              
              {/* Filter actions */}
              <div className="flex items-center justify-between">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartilhar página
                </Button>
                {(selectedCategory || selectedTag || searchTerm || selectedThemes.length > 0 || selectedChallenges.length > 0 || selectedMoments.length > 0) && (
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    <Filter className="h-4 w-4 mr-2" />
                    Limpar filtros
                  </Button>
                )}
              </div>
            </div>
            </div>
          </div>

          {/* Add Phrase Button */}
          <div className="flex justify-end mb-6">
            <Button variant="hero" className="shadow-glow">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Frase
            </Button>
          </div>

          {/* Phrases Grid/List */}
          <div className={`${viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-4"
          }`}>
            {paginatedPhrases.map((phrase) => (
              <div key={phrase.id} className="animate-fade-in">
                <PhraseCard phrase={phrase} />
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {hasMorePages && (
            <div className="text-center mt-8">
              <Button 
                variant="outline" 
                size="lg" 
                onClick={loadMore}
                className="hover:bg-primary/10"
              >
                Carregar mais frases ({filteredAndSortedPhrases.length - paginatedPhrases.length} restantes)
              </Button>
            </div>
          )}

          {/* Empty state */}
          {filteredAndSortedPhrases.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Nenhuma frase encontrada
              </h3>
              <p className="text-muted-foreground">
                Tente ajustar seus filtros ou termos de busca
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Frases;