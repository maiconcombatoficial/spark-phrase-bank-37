import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

interface Summary {
  id: number;
  title: string;
  content: string;
  relatedPhrases: number[];
  category: string;
  dateCreated: string;
}

interface SummaryCardProps {
  summary: Summary;
}

const SummaryCard = ({ summary }: SummaryCardProps) => {
  return (
    <Card className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 bg-gradient-bg border border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            {summary.title}
          </CardTitle>
          <Badge variant="secondary" className="ml-2">
            {summary.category}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Content preview */}
        <p className="text-muted-foreground leading-relaxed">
          {summary.content.length > 150 
            ? `${summary.content.substring(0, 150)}...` 
            : summary.content
          }
        </p>

        {/* Related phrases indicator */}
        <div className="flex items-center text-sm text-muted-foreground">
          <BookOpen className="h-4 w-4 mr-2" />
          <span>{summary.relatedPhrases.length} frases relacionadas</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border/30">
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            {new Date(summary.dateCreated).toLocaleDateString("pt-BR")}
          </div>
          
          <Link to={`/resumos/${summary.id}`}>
            <Button variant="outline" size="sm" className="text-xs">
              <ExternalLink className="h-3 w-3 mr-1" />
              Ler mais
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;