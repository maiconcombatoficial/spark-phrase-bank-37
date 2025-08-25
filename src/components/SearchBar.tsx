import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, AlertCircle } from "lucide-react";
import { validateSearchInput, useValidatedSearch } from "@/utils/inputValidation";
import { getSearchAriaAttributes, screenReaderAnnouncer } from "@/utils/accessibility";
import { toast } from "@/hooks/use-toast";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
}

const SearchBar = ({ 
  className = "", 
  placeholder = "Buscar frases, resumos...", 
  size = "sm" 
}: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [validationError, setValidationError] = useState<string>("");
  const navigate = useNavigate();

  // Validação em tempo real do input
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const validation = validateSearchInput(value);
    
    setSearchTerm(validation.sanitized);
    setIsValid(validation.isValid);
    setValidationError(validation.error || "");
    
    if (!validation.isValid && validation.error) {
      // Não mostra toast para cada caractere inválido, apenas salva o erro
      console.warn('Entrada inválida:', validation.error);
    }
  }, []);

  // Busca com validação
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateSearchInput(searchTerm);
    
    if (!validation.isValid) {
      toast({
        title: "Erro na busca",
        description: validation.error || "Entrada inválida",
        variant: "destructive"
      });
      setValidationError(validation.error || "");
      return;
    }
    
    if (validation.sanitized.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(validation.sanitized.trim())}`);
      setSearchTerm("");
      setValidationError("");
      
      // Anunciar busca para leitores de tela
      screenReaderAnnouncer.announce(
        `Buscando por: ${validation.sanitized.trim()}`,
        'polite'
      );
    }
  }, [searchTerm, navigate]);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setIsValid(true);
    setValidationError("");
    screenReaderAnnouncer.announce("Busca limpa", 'polite');
  }, []);

  // Atributos de acessibilidade
  const ariaAttributes = useMemo(() => getSearchAriaAttributes(
    0, // resultsCount - não aplicável aqui
    false, // isLoading
    !isValid // hasError
  ), [isValid]);

  const sizeClasses = {
    sm: "h-9 text-sm",
    md: "h-10 text-base",
    lg: "h-12 text-lg"
  };

  return (
    <form 
      onSubmit={handleSearch} 
      className={`relative flex items-center ${className}`}
      role="search"
      aria-label="Buscar conteúdo"
    >
      <div className="relative flex-1">
        <Search 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" 
          aria-hidden="true"
        />
        <Input
          type="search"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          className={`pl-10 pr-10 ${sizeClasses[size]} bg-background/50 backdrop-blur-sm border-border/50 focus:bg-background/80 transition-all duration-300 ${
            !isValid ? 'border-destructive focus:border-destructive' : ''
          }`}
          {...ariaAttributes}
          aria-describedby={validationError ? "search-error" : undefined}
          autoComplete="off"
          spellCheck="false"
        />
        
        {/* Botão de limpar */}
        {searchTerm && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
            aria-label="Limpar busca"
            tabIndex={0}
          >
            <X className="h-3 w-3" aria-hidden="true" />
          </Button>
        )}
        
        {/* Indicador de erro */}
        {!isValid && validationError && (
          <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
            <AlertCircle 
              className="h-4 w-4 text-destructive" 
              aria-hidden="true"
            />
          </div>
        )}
      </div>
      
      {/* Botão de buscar */}
      {searchTerm && isValid && (
        <Button
          type="submit"
          variant="hero"
          size="sm"
          className="ml-2 px-4"
          aria-label="Executar busca"
        >
          Buscar
        </Button>
      )}
      
      {/* Mensagem de erro acessível */}
      {validationError && (
        <div 
          id="search-error"
          className="sr-only"
          role="alert"
          aria-live="polite"
        >
          {validationError}
        </div>
      )}
      
      {/* Instruções para leitores de tela */}
      <div id="search-instructions" className="sr-only">
        Digite termos de busca para encontrar frases, resumos e conteúdo relacionado. 
        Use Enter para buscar ou Escape para limpar.
      </div>
    </form>
  );
};

export default SearchBar;