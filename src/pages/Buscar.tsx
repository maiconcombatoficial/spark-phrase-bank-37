import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import PhraseCard from "@/components/PhraseCard";
import SummaryCard from "@/components/SummaryCard";
import Layout from "@/components/Layout";
import { Search, Filter, Calendar, User, Hash, Book, X, Info, Tags, Shield, Brain, Target, Heart, Zap, Clock, Mountain, Users, Star, Lightbulb, Briefcase, GraduationCap, Baby, Home, Plane, Trophy, HeartHandshake, TrendingUp, Activity, AlertCircle } from "lucide-react";
import phrasesData from "@/data/phrases.json";
import summariesData from "@/data/summaries.json";
import { validateSearchInput, normalizeForSearch } from "@/utils/inputValidation";
import { getSearchResultsAriaAttributes, screenReaderAnnouncer } from "@/utils/accessibility";
import { toast } from "@/hooks/use-toast";

const Buscar = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedAuthor, setSelectedAuthor] = useState<string>("");
  const [selectedBook, setSelectedBook] = useState<string>("");
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const [selectedMoments, setSelectedMoments] = useState<string[]>([]);
  
  // Get search term from URL parameters
  useEffect(() => {
    const queryParam = searchParams.get('q');
    if (queryParam) {
      setSearchTerm(queryParam);
    }
  }, [searchParams]);
  
  const phrases = phrasesData;
  const summaries = summariesData;

  // Define themes with descriptions for tooltips
  const availableThemes = [
    { id: "liderança", name: "Liderança", description: "Frases sobre comando, influência e gestão de pessoas" },
    { id: "resiliência", name: "Resiliência", description: "Capacidade de superar adversidades e se recuperar de desafios" },
    { id: "foco", name: "Foco", description: "Concentração, disciplina e direcionamento de energia para objetivos" },
    { id: "inovação", name: "Inovação", description: "Criatividade, novas ideias e pensamento disruptivo" },
    { id: "sucesso", name: "Sucesso", description: "Conquistas, realizações e alcance de objetivos" },
    { id: "crescimento", name: "Crescimento", description: "Desenvolvimento pessoal e profissional contínuo" },
    { id: "persistência", name: "Persistência", description: "Determinação e perseverança diante dos obstáculos" },
    { id: "inspiração", name: "Inspiração", description: "Motivação e estímulo para ação e mudança" },
    { id: "transformação", name: "Transformação", description: "Mudanças significativas e evolução pessoal" },
    { id: "excelência", name: "Excelência", description: "Busca pela qualidade superior e aperfeiçoamento" }
  ];

  // Define life challenges with icons and descriptions
  const lifeChallenges = [
    { id: "superar-medos", name: "Superar Medos", description: "Frases para enfrentar e vencer os medos", icon: Shield, tags: ["medo", "coragem", "ousadia"] },
    { id: "procrastinacao", name: "Lidar com Procrastinação", description: "Motivação para agir e parar de adiar", icon: Clock, tags: ["ação", "disciplina", "produtividade"] },
    { id: "autoestima", name: "Fortalecer Autoestima", description: "Construir confiança e amor próprio", icon: Heart, tags: ["autoestima", "confiança", "amor próprio"] },
    { id: "foco-objetivos", name: "Manter Foco nos Objetivos", description: "Concentração e direcionamento para metas", icon: Target, tags: ["foco", "objetivos", "metas"] },
    { id: "desenvolver-criatividade", name: "Desenvolver Criatividade", description: "Estimular pensamento criativo e inovador", icon: Lightbulb, tags: ["criatividade", "inovação", "inspiração"] },
    { id: "lidar-fracassos", name: "Lidar com Fracassos", description: "Aprender e crescer com os erros", icon: Mountain, tags: ["fracasso", "aprendizado", "crescimento"] },
    { id: "melhorar-relacionamentos", name: "Melhorar Relacionamentos", description: "Construir conexões mais profundas", icon: Users, tags: ["relacionamentos", "comunicação", "empatia"] },
    { id: "encontrar-proposito", name: "Encontrar Propósito", description: "Descobrir sentido e direção na vida", icon: Star, tags: ["propósito", "sentido", "direção"] },
    { id: "gerenciar-stress", name: "Gerenciar Stress", description: "Técnicas para lidar com pressão e ansiedade", icon: Brain, tags: ["stress", "ansiedade", "equilíbrio"] },
    { id: "aumentar-energia", name: "Aumentar Energia", description: "Motivação e vitalidade para o dia a dia", icon: Zap, tags: ["energia", "motivação", "vitalidade"] }
  ];

  // Define life moments with icons and descriptions
  const lifeMoments = [
    { id: "inicio-carreira", name: "Início de Carreira", description: "Primeiros passos profissionais e desenvolvimento", icon: Briefcase, tags: ["carreira", "trabalho", "início", "desenvolvimento"] },
    { id: "momentos-crise", name: "Momentos de Crise", description: "Superação de dificuldades e adversidades", icon: Mountain, tags: ["crise", "dificuldade", "superação", "resiliência"] },
    { id: "transicoes-vida", name: "Transições de Vida", description: "Mudanças importantes e novos capítulos", icon: TrendingUp, tags: ["mudança", "transição", "novo", "evolução"] },
    { id: "formacao-educacao", name: "Formação e Educação", description: "Aprendizado e desenvolvimento acadêmico", icon: GraduationCap, tags: ["educação", "aprendizado", "estudo", "conhecimento"] },
    { id: "relacionamentos-familia", name: "Relacionamentos e Família", description: "Conexões pessoais e vida familiar", icon: HeartHandshake, tags: ["família", "relacionamentos", "amor", "conexão"] },
    { id: "inicio-familia", name: "Início da Família", description: "Casamento, filhos e formação familiar", icon: Baby, tags: ["família", "filhos", "casamento", "paternidade"] },
    { id: "aposentadoria", name: "Aposentadoria", description: "Nova fase da vida e reflexões", icon: Home, tags: ["aposentadoria", "descanso", "reflexão", "maturidade"] },
    { id: "viagens-aventuras", name: "Viagens e Aventuras", description: "Exploração e descobertas pelo mundo", icon: Plane, tags: ["viagem", "aventura", "descoberta", "experiência"] },
    { id: "conquistas-sucessos", name: "Conquistas e Sucessos", description: "Momentos de vitória e realização", icon: Trophy, tags: ["sucesso", "vitória", "conquista", "realização"] },
    { id: "saude-bem-estar", name: "Saúde e Bem-estar", description: "Cuidados com corpo e mente", icon: Activity, tags: ["saúde", "bem-estar", "cuidado", "vida"] }
  ];

  // Extract unique authors and books for dropdowns
  const uniqueAuthors = Array.from(new Set(phrases.map(p => p.author))).sort();
  const uniqueBooks = Array.from(new Set(phrases.map(p => p.book))).sort();

  // Advanced search results with combined filters
  const searchResults = useMemo(() => {
    let filteredPhrases = phrases;
    let filteredSummaries = summaries;

    // Apply author filter
    if (selectedAuthor && selectedAuthor !== "all") {
      filteredPhrases = filteredPhrases.filter(phrase => phrase.author === selectedAuthor);
    }

    // Apply book filter
    if (selectedBook && selectedBook !== "all") {
      filteredPhrases = filteredPhrases.filter(phrase => phrase.book === selectedBook);
    }

    // Apply theme filters
    if (selectedThemes.length > 0) {
      filteredPhrases = filteredPhrases.filter(phrase => 
        selectedThemes.some(theme => 
          phrase.tags.some(tag => tag.toLowerCase().includes(theme.toLowerCase())) ||
          phrase.category.toLowerCase().includes(theme.toLowerCase())
        )
      );
    }

    // Apply challenge filters
    if (selectedChallenges.length > 0) {
      filteredPhrases = filteredPhrases.filter(phrase => 
        selectedChallenges.some(challengeId => {
          const challenge = lifeChallenges.find(c => c.id === challengeId);
          return challenge && challenge.tags.some(tag => 
            phrase.tags.some(phraseTag => phraseTag.toLowerCase().includes(tag.toLowerCase())) ||
            phrase.category.toLowerCase().includes(tag.toLowerCase()) ||
            phrase.text.toLowerCase().includes(tag.toLowerCase())
          );
        })
      );
    }

    // Apply life moments filters
    if (selectedMoments.length > 0) {
      filteredPhrases = filteredPhrases.filter(phrase => 
        selectedMoments.some(momentId => {
          const moment = lifeMoments.find(m => m.id === momentId);
          return moment && moment.tags.some(tag => 
            phrase.tags.some(phraseTag => phraseTag.toLowerCase().includes(tag.toLowerCase())) ||
            phrase.category.toLowerCase().includes(tag.toLowerCase()) ||
            phrase.text.toLowerCase().includes(tag.toLowerCase())
          );
        })
      );
    }

    // Apply text search if provided
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      
      filteredPhrases = filteredPhrases.filter(phrase => 
        phrase.text.toLowerCase().includes(term) ||
        phrase.author.toLowerCase().includes(term) ||
        phrase.book.toLowerCase().includes(term) ||
        phrase.category.toLowerCase().includes(term) ||
        phrase.tags.some(tag => tag.toLowerCase().includes(term))
      );

      filteredSummaries = filteredSummaries.filter(summary =>
        summary.title.toLowerCase().includes(term) ||
        summary.content.toLowerCase().includes(term) ||
        summary.category.toLowerCase().includes(term)
      );
    }

    // If no search term but filters are applied, show filtered results
    // If no search term and no filters, show empty results
    if (!searchTerm.trim() && (!selectedAuthor || selectedAuthor === "all") && (!selectedBook || selectedBook === "all") && selectedThemes.length === 0 && selectedChallenges.length === 0 && selectedMoments.length === 0) {
      return {
        phrases: [],
        summaries: [],
        authors: [],
        tags: [],
        categories: []
      };
    }

    const matchedAuthors = Array.from(new Set(filteredPhrases.map(p => p.author)));
    const matchedTags = Array.from(new Set(filteredPhrases.flatMap(p => p.tags)));
    const matchedCategories = Array.from(new Set([
      ...filteredPhrases.map(p => p.category),
      ...filteredSummaries.map(s => s.category)
    ]));

    return {
      phrases: filteredPhrases,
      summaries: filteredSummaries,
      authors: matchedAuthors,
      tags: matchedTags,
      categories: matchedCategories
    };
  }, [searchTerm, selectedAuthor, selectedBook, selectedThemes, selectedChallenges, selectedMoments, phrases, summaries]);

  const totalResults = searchResults.phrases.length + searchResults.summaries.length;

  // Validação e atualização do termo de busca
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const validation = validateSearchInput(value);
    
    if (validation.isValid) {
      setSearchTerm(validation.sanitized);
    } else if (validation.error) {
      toast({
        title: "Entrada inválida",
        description: validation.error,
        variant: "destructive"
      });
    }
  }, []);

  // Atributos de acessibilidade para resultados
  const resultsAriaAttributes = useMemo(() => 
    getSearchResultsAriaAttributes(totalResults, searchTerm),
    [totalResults, searchTerm]
  );

  const hasActiveFilters = searchTerm || (selectedAuthor && selectedAuthor !== "all") || (selectedBook && selectedBook !== "all") || selectedThemes.length > 0 || selectedChallenges.length > 0 || selectedMoments.length > 0;
  
  const handleQuickSearch = useCallback((term: string) => {
    setSearchTerm(term);
    screenReaderAnnouncer.announce(`Buscando por: ${term}`, 'polite');
  }, []);

  // Anunciar mudanças nos resultados
  useEffect(() => {
    if (hasActiveFilters && totalResults >= 0) {
      const message = totalResults === 0 
        ? `Nenhum resultado encontrado`
        : `${totalResults} resultado${totalResults !== 1 ? 's' : ''} encontrado${totalResults !== 1 ? 's' : ''}`;
      
      screenReaderAnnouncer.announce(message, 'polite');
    }
  }, [totalResults, hasActiveFilters]);

  const clearAllFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedAuthor("all");
    setSelectedBook("all");
    setSelectedThemes([]);
    setSelectedChallenges([]);
    setSelectedMoments([]);
    screenReaderAnnouncer.announce("Todos os filtros foram limpos", 'polite');
  }, []);

  const handleThemeChange = (themeId: string, checked: boolean) => {
    if (checked) {
      setSelectedThemes(prev => [...prev, themeId]);
    } else {
      setSelectedThemes(prev => prev.filter(t => t !== themeId));
    }
  };

  const handleChallengeChange = (challengeId: string, checked: boolean) => {
    if (checked) {
      setSelectedChallenges(prev => [...prev, challengeId]);
    } else {
      setSelectedChallenges(prev => prev.filter(c => c !== challengeId));
    }
  };

  const handleMomentChange = (momentId: string, checked: boolean) => {
    if (checked) {
      setSelectedMoments(prev => [...prev, momentId]);
    } else {
      setSelectedMoments(prev => prev.filter(m => m !== momentId));
    }
  };


  return (
    <Layout>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Busca Avançada
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Encontre exatamente o que você procura em nossa base de conhecimento
          </p>
        </div>

        {/* Search */}
        <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6 mb-8 shadow-elegant">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="search"
              placeholder="Digite sua busca aqui... (autor, frase, tag, categoria, livro)"
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-12 text-lg h-12"
              aria-label="Campo de busca avançada"
              aria-describedby="search-help"
              autoComplete="off"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Filtrar por Autor
              </label>
              <Select value={selectedAuthor} onValueChange={setSelectedAuthor}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os autores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os autores</SelectItem>
                  {uniqueAuthors.map(author => (
                    <SelectItem key={author} value={author}>{author}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 flex items-center">
                <Book className="h-4 w-4 mr-2" />
                Filtrar por Livro
              </label>
              <Select value={selectedBook} onValueChange={setSelectedBook}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os livros" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os livros</SelectItem>
                  {uniqueBooks.map(book => (
                    <SelectItem key={book} value={book}>{book}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              {hasActiveFilters && (
                <Button 
                  variant="outline" 
                  onClick={clearAllFilters}
                  className="w-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  Limpar Filtros
                </Button>
              )}
            </div>
          </div>

          {/* Advanced Filters Accordion */}
          <Accordion type="multiple" className="w-full mb-4">
            <AccordionItem value="themes">
              <AccordionTrigger className="text-sm font-medium">
                <div className="flex items-center">
                  <Tags className="h-4 w-4 mr-2" />
                  Filtrar por Temas {selectedThemes.length > 0 && `(${selectedThemes.length})`}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  <TooltipProvider>
                    {availableThemes.map(theme => (
                      <div key={theme.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`theme-${theme.id}`}
                          checked={selectedThemes.includes(theme.id)}
                          onCheckedChange={(checked) => handleThemeChange(theme.id, checked as boolean)}
                        />
                        <label 
                          htmlFor={`theme-${theme.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center"
                        >
                          {theme.name}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3 w-3 ml-1 text-muted-foreground hover:text-foreground transition-colors" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">{theme.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </label>
                      </div>
                    ))}
                  </TooltipProvider>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="challenges">
              <AccordionTrigger className="text-sm font-medium">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Filtrar por Desafios de Vida {selectedChallenges.length > 0 && `(${selectedChallenges.length})`}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  <TooltipProvider>
                    {lifeChallenges.map(challenge => {
                      const IconComponent = challenge.icon;
                      return (
                        <div key={challenge.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`challenge-${challenge.id}`}
                            checked={selectedChallenges.includes(challenge.id)}
                            onCheckedChange={(checked) => handleChallengeChange(challenge.id, checked as boolean)}
                          />
                          <label 
                            htmlFor={`challenge-${challenge.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center"
                          >
                            <IconComponent className="h-3 w-3 mr-1 text-primary" />
                            {challenge.name}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-3 w-3 ml-1 text-muted-foreground hover:text-foreground transition-colors" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">{challenge.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          </label>
                        </div>
                      );
                    })}
                  </TooltipProvider>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="moments">
              <AccordionTrigger className="text-sm font-medium">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Filtrar por Momentos de Vida {selectedMoments.length > 0 && `(${selectedMoments.length})`}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  <TooltipProvider>
                    {lifeMoments.map(moment => {
                      const IconComponent = moment.icon;
                      return (
                        <div key={moment.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`moment-${moment.id}`}
                            checked={selectedMoments.includes(moment.id)}
                            onCheckedChange={(checked) => handleMomentChange(moment.id, checked as boolean)}
                          />
                          <label 
                            htmlFor={`moment-${moment.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center"
                          >
                            <IconComponent className="h-3 w-3 mr-1 text-primary" />
                            {moment.name}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-3 w-3 ml-1 text-muted-foreground hover:text-foreground transition-colors" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">{moment.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          </label>
                        </div>
                      );
                    })}
                  </TooltipProvider>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Active filters display */}
          {(selectedThemes.length > 0 || selectedChallenges.length > 0 || selectedMoments.length > 0) && (
            <div className="mb-4 space-y-3">
              {selectedThemes.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-foreground mb-2">Temas Selecionados:</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedThemes.map(themeId => {
                      const theme = availableThemes.find(t => t.id === themeId);
                      return (
                        <Badge key={themeId} variant="secondary" className="cursor-pointer" onClick={() => handleThemeChange(themeId, false)}>
                          <Tags className="h-3 w-3 mr-1" />
                          {theme?.name}
                          <X className="h-3 w-3 ml-1" />
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {selectedChallenges.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-foreground mb-2">Desafios Selecionados:</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedChallenges.map(challengeId => {
                      const challenge = lifeChallenges.find(c => c.id === challengeId);
                      const IconComponent = challenge?.icon;
                      return (
                        <Badge key={challengeId} variant="secondary" className="cursor-pointer" onClick={() => handleChallengeChange(challengeId, false)}>
                          {IconComponent && <IconComponent className="h-3 w-3 mr-1" />}
                          {challenge?.name}
                          <X className="h-3 w-3 ml-1" />
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedMoments.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-foreground mb-2">Momentos Selecionados:</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedMoments.map(momentId => {
                      const moment = lifeMoments.find(m => m.id === momentId);
                      const IconComponent = moment?.icon;
                      return (
                        <Badge key={momentId} variant="secondary" className="cursor-pointer" onClick={() => handleMomentChange(momentId, false)}>
                          {IconComponent && <IconComponent className="h-3 w-3 mr-1" />}
                          {moment?.name}
                          <X className="h-3 w-3 ml-1" />
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Results count */}
          {hasActiveFilters && (
            <div className="text-sm text-muted-foreground flex items-center justify-between">
              <span>
                {totalResults > 0 ? (
                  <>
                    {totalResults} resultado(s) encontrado(s)
                    {searchTerm && ` para "${searchTerm}"`}
                    {selectedAuthor && selectedAuthor !== "all" && ` • Autor: ${selectedAuthor}`}
                    {selectedBook && selectedBook !== "all" && ` • Livro: ${selectedBook}`}
                    {selectedThemes.length > 0 && ` • Temas: ${selectedThemes.map(id => availableThemes.find(t => t.id === id)?.name).join(', ')}`}
                    {selectedChallenges.length > 0 && ` • Desafios: ${selectedChallenges.map(id => lifeChallenges.find(c => c.id === id)?.name).join(', ')}`}
                    {selectedMoments.length > 0 && ` • Momentos: ${selectedMoments.map(id => lifeMoments.find(m => m.id === id)?.name).join(', ')}`}
                  </>
                ) : (
                  <>
                    Nenhum resultado encontrado
                    {searchTerm && ` para "${searchTerm}"`}
                    {selectedAuthor && selectedAuthor !== "all" && ` com autor: ${selectedAuthor}`}
                    {selectedBook && selectedBook !== "all" && ` no livro: ${selectedBook}`}
                    {selectedThemes.length > 0 && ` nos temas: ${selectedThemes.map(id => availableThemes.find(t => t.id === id)?.name).join(', ')}`}
                    {selectedChallenges.length > 0 && ` nos desafios: ${selectedChallenges.map(id => lifeChallenges.find(c => c.id === id)?.name).join(', ')}`}
                    {selectedMoments.length > 0 && ` nos momentos: ${selectedMoments.map(id => lifeMoments.find(m => m.id === id)?.name).join(', ')}`}
                  </>
                )}
              </span>
            </div>
          )}
        </div>

        {/* Suggested Results / Quick Search Suggestions */}
        {!hasActiveFilters && (
          <div className="space-y-8">
            {/* Quick Search Suggestions */}
            <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6 shadow-elegant">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Sugestões de Busca Rápida
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Autores Populares
                  </h4>
                  <div className="space-y-1">
                    {["Einstein", "Steve Jobs", "Darwin"].map(author => (
                      <Button
                        key={author}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQuickSearch(author)}
                        className="justify-start h-auto py-1 px-2 text-sm"
                      >
                        {author}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-foreground mb-2 flex items-center">
                    <Hash className="h-4 w-4 mr-2" />
                    Tags Populares
                  </h4>
                  <div className="space-y-1">
                    {["inspiração", "sucesso", "criatividade"].map(tag => (
                      <Button
                        key={tag}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQuickSearch(tag)}
                        className="justify-start h-auto py-1 px-2 text-sm"
                      >
                        #{tag}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-foreground mb-2 flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    Categorias
                  </h4>
                  <div className="space-y-1">
                    {["trabalho", "sonhos", "adaptação"].map(category => (
                      <Button
                        key={category}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQuickSearch(category)}
                        className="justify-start h-auto py-1 px-2 text-sm"
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-foreground mb-2 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Termos Gerais
                  </h4>
                  <div className="space-y-1">
                    {["futuro", "mudança", "excelência"].map(term => (
                      <Button
                        key={term}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQuickSearch(term)}
                        className="justify-start h-auto py-1 px-2 text-sm"
                      >
                        {term}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Suggested Results */}
            <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6 shadow-elegant">
              <h3 className="text-lg font-semibold text-foreground mb-6">
                Resultados Sugeridos
              </h3>
              
              <Tabs defaultValue="popular" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="popular">Populares</TabsTrigger>
                  <TabsTrigger value="challenges">Desafios</TabsTrigger>
                  <TabsTrigger value="moments">Momentos</TabsTrigger>
                  <TabsTrigger value="themes">Temas</TabsTrigger>
                </TabsList>

                <TabsContent value="popular" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {phrases.slice(0, 6).map((phrase) => (
                      <PhraseCard key={phrase.id} phrase={phrase} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="challenges" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {lifeChallenges.slice(0, 6).map(challenge => {
                      const IconComponent = challenge.icon;
                      return (
                        <div 
                          key={challenge.id}
                          className="p-4 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 transition-colors cursor-pointer"
                          onClick={() => handleChallengeChange(challenge.id, true)}
                        >
                          <div className="flex items-center mb-2">
                            <IconComponent className="h-5 w-5 mr-2 text-primary" />
                            <h4 className="font-medium text-foreground">{challenge.name}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground">{challenge.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="moments" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {lifeMoments.slice(0, 6).map(moment => {
                      const IconComponent = moment.icon;
                      return (
                        <div 
                          key={moment.id}
                          className="p-4 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 transition-colors cursor-pointer"
                          onClick={() => handleMomentChange(moment.id, true)}
                        >
                          <div className="flex items-center mb-2">
                            <IconComponent className="h-5 w-5 mr-2 text-primary" />
                            <h4 className="font-medium text-foreground">{moment.name}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground">{moment.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="themes" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {availableThemes.slice(0, 6).map(theme => (
                      <div 
                        key={theme.id}
                        className="p-4 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 transition-colors cursor-pointer"
                        onClick={() => handleThemeChange(theme.id, true)}
                      >
                        <div className="flex items-center mb-2">
                          <Tags className="h-5 w-5 mr-2 text-primary" />
                          <h4 className="font-medium text-foreground">{theme.name}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">{theme.description}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}

        {/* Search Results */}
        {hasActiveFilters && totalResults > 0 && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="all">
                Todos ({totalResults})
              </TabsTrigger>
              <TabsTrigger value="phrases">
                Frases ({searchResults.phrases.length})
              </TabsTrigger>
              <TabsTrigger value="summaries">
                Resumos ({searchResults.summaries.length})
              </TabsTrigger>
              <TabsTrigger value="meta">
                Meta ({searchResults.authors.length + searchResults.tags.length + searchResults.categories.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              {/* Phrases */}
              {searchResults.phrases.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    Frases ({searchResults.phrases.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {searchResults.phrases.slice(0, 6).map((phrase) => (
                      <PhraseCard key={phrase.id} phrase={phrase} />
                    ))}
                  </div>
                </div>
              )}

              {/* Summaries */}
              {searchResults.summaries.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    Resumos ({searchResults.summaries.length})
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {searchResults.summaries.slice(0, 4).map((summary) => (
                      <SummaryCard key={summary.id} summary={summary} />
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="phrases">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.phrases.map((phrase) => (
                  <PhraseCard key={phrase.id} phrase={phrase} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="summaries">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {searchResults.summaries.map((summary) => (
                  <SummaryCard key={summary.id} summary={summary} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="meta">
              <div className="space-y-6">
                {/* Authors */}
                {searchResults.authors.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Autores Encontrados
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {searchResults.authors.map(author => (
                        <Badge key={author} variant="outline" className="cursor-pointer">
                          {author}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {searchResults.tags.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                      <Hash className="h-5 w-5 mr-2" />
                      Tags Encontradas
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {searchResults.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="cursor-pointer">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Categories */}
                {searchResults.categories.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                      <Filter className="h-5 w-5 mr-2" />
                      Categorias Encontradas
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {searchResults.categories.map(category => (
                        <Badge key={category} variant="outline" className="cursor-pointer">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Empty state */}
        {hasActiveFilters && totalResults === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Nenhum resultado encontrado
            </h3>
            <p className="text-muted-foreground mb-4">
              Tente usar termos diferentes ou verifique a ortografia
            </p>
            <Button variant="outline" onClick={clearAllFilters}>
              Limpar filtros
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Buscar;