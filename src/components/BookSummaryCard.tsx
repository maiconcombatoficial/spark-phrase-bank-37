import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, BookOpen, Star, ChevronDown, ChevronUp } from "lucide-react";
import TagWithTooltip from "./TagWithTooltip";

interface BookSummary {
  id: number;
  title: string;
  author: string;
  category: string;
  publisher: string;
  publishYear: number;
  summary: string;
  fullSummary: string;
  keyTakeaways: string[];
  rating: number;
  pages: number;
  dateAdded: string;
  relatedPhrases: number[];
  tags: string[];
}

interface BookSummaryCardProps {
  summary: BookSummary;
}

const BookSummaryCard = ({ summary }: BookSummaryCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 bg-gradient-bg border border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-1">
              {summary.title}
            </CardTitle>
            <p className="text-muted-foreground text-sm">por {summary.author}</p>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <Badge variant="secondary">
              {summary.category}
            </Badge>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium ml-1">{summary.rating}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Book info */}
        <div className="flex items-center text-sm text-muted-foreground space-x-4">
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1" />
            <span>{summary.pages} páginas</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{summary.publishYear}</span>
          </div>
        </div>

        {/* Summary content */}
        <div className="space-y-3">
          <p className="text-muted-foreground leading-relaxed">
            {isExpanded ? summary.fullSummary : summary.summary}
          </p>

          {/* Key takeaways - only show when expanded */}
          {isExpanded && (
            <div className="bg-accent/10 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-foreground">Principais Ensinamentos:</h4>
              <ul className="space-y-2">
                {summary.keyTakeaways.map((takeaway, index) => (
                  <li key={index} className="flex items-start text-sm text-muted-foreground">
                    <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                    {takeaway}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {summary.tags.slice(0, isExpanded ? summary.tags.length : 3).map(tag => (
            <TagWithTooltip key={tag} tag={tag} variant="outline" />
          ))}
          {!isExpanded && summary.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{summary.tags.length - 3} mais
            </Badge>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border/30">
          <div className="flex items-center text-xs text-muted-foreground">
            <BookOpen className="h-3 w-3 mr-1" />
            <span>{summary.relatedPhrases.length} frases relacionadas</span>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-3 w-3 mr-1" />
                Ler menos
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3 mr-1" />
                Ler mais
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookSummaryCard;