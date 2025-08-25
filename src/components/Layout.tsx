import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Breadcrumbs from "./Breadcrumbs";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-bg flex flex-col">
      <Navbar />
      <Breadcrumbs />
      <main className="page-transition flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;