import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SkipToContent from "./SkipToContent";
import Breadcrumbs from "./Breadcrumbs";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-bg flex flex-col">
      <SkipToContent />
      <Navbar />
      <Breadcrumbs />
      <main id="main-content" className="page-transition flex-1" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;