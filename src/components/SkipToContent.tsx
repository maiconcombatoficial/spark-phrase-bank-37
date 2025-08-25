import { forwardRef } from "react";

interface SkipToContentProps {
  targetId?: string;
  className?: string;
}

/**
 * Componente de link "Pular para o conteúdo principal"
 * Melhora a acessibilidade para usuários de teclado e leitores de tela
 */
const SkipToContent = forwardRef<HTMLAnchorElement, SkipToContentProps>(({
  targetId = "main-content",
  className = "",
  ...props
}, ref) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a
      ref={ref}
      href={`#${targetId}`}
      onClick={handleClick}
      className={`skip-to-content ${className}`}
      {...props}
    >
      Pular para o conteúdo principal
    </a>
  );
});

SkipToContent.displayName = "SkipToContent";

export default SkipToContent;