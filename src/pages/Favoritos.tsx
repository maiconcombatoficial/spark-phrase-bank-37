import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import PhraseCard from "@/components/PhraseCard";
import useFavorites from "@/hooks/useFavorites";
import { Heart, Calendar, Trash2, Share2 } from "lucide-react";
import { useState } from "react";

const Favoritos = () => {
  const { favorites, removeFavorite, favoritesCount } = useFavorites();
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'author'>('recent');

  // Sort favorites based on selected option
  const sortedFavorites = [...favorites].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.favoritedAt).getTime() - new Date(a.favoritedAt).getTime();
      case 'oldest':
        return new Date(a.favoritedAt).getTime() - new Date(b.favoritedAt).getTime();
      case 'author':
        return a.author.localeCompare(b.author);
      default:
        return 0;
    }
  });

  const handleShareAll = () => {
    const favoritesText = favorites
      .map(fav => `"${fav.text}" - ${fav.author}`)
      .join('\n\n');
    
    if (navigator.share) {
      navigator.share({
        title: 'Minhas Frases Favoritas',
        text: favoritesText,
      });
    } else {
      navigator.clipboard.writeText(favoritesText);
    }
  };

  const clearAllFavorites = () => {
    if (window.confirm('Tem certeza que deseja remover todas as frases favoritas?')) {
      favorites.forEach(fav => removeFavorite(fav.id));
    }
  };

  return (
    <Layout>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Frases Favoritas
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {favoritesCount > 0 
              ? `Suas ${favoritesCount} frases inspiradoras salvas` 
              : "Você ainda não favoritou nenhuma frase"
            }
          </p>
        </div>

        {favoritesCount > 0 && (
          <>
            {/* Controls */}
            <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6 mb-8 shadow-elegant">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-foreground">
                    Ordenar por:
                  </label>
                  <div className="flex gap-2">
                    <Button
                      variant={sortBy === 'recent' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSortBy('recent')}
                    >
                      Mais recentes
                    </Button>
                    <Button
                      variant={sortBy === 'oldest' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSortBy('oldest')}
                    >
                      Mais antigas
                    </Button>
                    <Button
                      variant={sortBy === 'author' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSortBy('author')}
                    >
                      Por autor
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleShareAll}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartilhar todas
                  </Button>
                  <Button variant="destructive" size="sm" onClick={clearAllFavorites}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Limpar tudo
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gradient-bg border border-border/50 shadow-elegant">
                <CardContent className="p-6 text-center">
                  <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-foreground">{favoritesCount}</h3>
                  <p className="text-muted-foreground">Frases Favoritas</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-bg border border-border/50 shadow-elegant">
                <CardContent className="p-6 text-center">
                  <div className="h-8 w-8 text-primary mx-auto mb-2 text-2xl">👤</div>
                  <h3 className="text-2xl font-bold text-foreground">
                    {new Set(favorites.map(f => f.author)).size}
                  </h3>
                  <p className="text-muted-foreground">Autores Únicos</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-bg border border-border/50 shadow-elegant">
                <CardContent className="p-6 text-center">
                  <div className="h-8 w-8 text-accent mx-auto mb-2 text-2xl">🏷️</div>
                  <h3 className="text-2xl font-bold text-foreground">
                    {new Set(favorites.map(f => f.category)).size}
                  </h3>
                  <p className="text-muted-foreground">Categorias</p>
                </CardContent>
              </Card>
            </div>

            {/* Favorites Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedFavorites.map((favorite) => (
                <div key={`fav-${favorite.id}`} className="animate-fade-in">
                  <Card className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 bg-gradient-bg border border-border/50 relative">
                    <CardContent className="p-6">
                      {/* Favorite indicator */}
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-red-50 text-red-600 border-red-200">
                          <Heart className="h-3 w-3 mr-1 fill-current" />
                          Favorita
                        </Badge>
                      </div>
                      
                      <div className="space-y-4 mt-6">
                        {/* Quote */}
                        <blockquote className="text-lg leading-relaxed font-medium text-foreground italic">
                          "{favorite.text}"
                        </blockquote>
                        
                        {/* Author */}
                        <div className="flex items-center justify-between">
                          <cite className="text-sm font-semibold text-muted-foreground not-italic">
                            — {favorite.author}
                          </cite>
                          <Badge variant="secondary" className="text-xs">
                            {favorite.category}
                          </Badge>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {favorite.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-border/30">
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            Favoritada em {new Date(favorite.favoritedAt).toLocaleDateString("pt-BR")}
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFavorite(favorite.id)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Empty state */}
        {favoritesCount === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">💖</div>
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              Suas frases favoritas aparecerão aqui
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Comece a favoritar frases clicando no ícone de coração em qualquer frase que inspirar você
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" onClick={() => window.history.back()}>
                <Heart className="h-4 w-4 mr-2" />
                Explorar Frases
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Favoritos;