import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Sparkles, 
  Heart, 
  Mail, 
  Info, 
  Github, 
  Twitter, 
  Linkedin,
  BookOpen,
  Search,
  Star
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    navigation: [
      { label: "Home", path: "/", icon: Sparkles },
      { label: "Frases", path: "/frases", icon: Star },
      { label: "Resumos", path: "/resumos", icon: BookOpen },
      { label: "Buscar", path: "/buscar", icon: Search },
    ],
    about: [
      { label: "Sobre o App", path: "/sobre", icon: Info },
      { label: "Contato", path: "/contato", icon: Mail },
    ],
    social: [
      { label: "GitHub", href: "https://github.com", icon: Github },
      { label: "Twitter", href: "https://twitter.com", icon: Twitter },
      { label: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
    ]
  };

  return (
    <footer className="bg-card/30 backdrop-blur-sm border-t border-border/30 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 group mb-4">
              <div className="p-2 bg-gradient-hero rounded-xl group-hover:animate-glow group-hover:scale-110 transition-all duration-500 shadow-md">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                Spark Phrase Bank
              </span>
            </Link>
            <p className="text-muted-foreground max-w-md mb-4">
              Sua fonte de inspiração diária. Descubra frases motivacionais e resumos 
              que transformam perspectivas e impulsionam o crescimento pessoal.
            </p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Feito com</span>
              <Heart className="h-4 w-4 text-accent animate-pulse" />
              <span>para inspirar pessoas</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Navegação</h3>
            <nav className="space-y-2">
              {footerLinks.navigation.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    <IconComponent className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* About & Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Sobre</h3>
            <nav className="space-y-2 mb-6">
              {footerLinks.about.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    <IconComponent className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            <h4 className="font-medium text-foreground mb-3 text-sm">Redes Sociais</h4>
            <div className="flex space-x-2">
              {footerLinks.social.map((social) => {
                const IconComponent = social.icon;
                return (
                  <Button
                    key={social.label}
                    variant="ghost"
                    size="icon"
                    asChild
                    className="h-8 w-8 hover:bg-accent/50"
                  >
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                    >
                      <IconComponent className="h-4 w-4" />
                    </a>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="text-sm text-muted-foreground">
            © {currentYear} Spark Phrase Bank. Todos os direitos reservados.
          </div>
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <span>Versão 1.0.0</span>
            <Separator orientation="vertical" className="h-4" />
            <span>Desenvolvido com React & TypeScript</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;