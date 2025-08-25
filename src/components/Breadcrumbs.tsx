import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home, Search, Heart, BookOpen, Star, Info, Mail } from "lucide-react";

interface BreadcrumbConfig {
  label: string;
  icon?: any;
}

const breadcrumbConfig: Record<string, BreadcrumbConfig> = {
  "/": { label: "Home", icon: Home },
  "/frases": { label: "Frases", icon: Star },
  "/resumos": { label: "Resumos", icon: BookOpen },
  "/favoritos": { label: "Favoritos", icon: Heart },
  "/buscar": { label: "Buscar", icon: Search },
  "/sobre": { label: "Sobre", icon: Info },
  "/contato": { label: "Contato", icon: Mail },
};

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Don't show breadcrumbs on home page or simple pages
  if (location.pathname === "/" || pathnames.length === 0) {
    return null;
  }

  const generateBreadcrumbs = () => {
    const breadcrumbs = [
      { path: "/", label: "Home", icon: Home }
    ];

    let currentPath = "";
    pathnames.forEach((segment) => {
      currentPath += `/${segment}`;
      const config = breadcrumbConfig[currentPath];
      
      if (config) {
        breadcrumbs.push({
          path: currentPath,
          label: config.label,
          icon: config.icon
        });
      } else {
        // Fallback for dynamic routes
        const formattedLabel = segment
          .split("-")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        
        breadcrumbs.push({
          path: currentPath,
          label: formattedLabel,
          icon: null
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((breadcrumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            const IconComponent = breadcrumb.icon;

            return (
              <div key={breadcrumb.path} className="flex items-center">
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className="flex items-center space-x-2 font-medium text-foreground">
                      {IconComponent && (
                        <IconComponent className="h-4 w-4" />
                      )}
                      <span>{breadcrumb.label}</span>
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link 
                        to={breadcrumb.path}
                        className="flex items-center space-x-2 hover:text-foreground transition-colors"
                      >
                        {IconComponent && (
                          <IconComponent className="h-4 w-4" />
                        )}
                        <span>{breadcrumb.label}</span>
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </div>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default Breadcrumbs;