import { useState } from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, 
  MessageSquare, 
  Send, 
  Phone, 
  MapPin, 
  Clock,
  Github,
  Twitter,
  Linkedin,
  Heart,
  Lightbulb,
  HelpCircle,
  Bug
} from "lucide-react";

const Contato = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    type: "geral"
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const contactTypes = [
    { id: "geral", label: "Contato Geral", icon: MessageSquare },
    { id: "sugestao", label: "Sugestão", icon: Lightbulb },
    { id: "duvida", label: "Dúvida", icon: HelpCircle },
    { id: "bug", label: "Reportar Bug", icon: Bug },
  ];

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "contato@sparkphrasebank.com",
      description: "Resposta em até 24h"
    },
    {
      icon: Phone,
      title: "Telefone",
      content: "+55 (11) 9999-9999",
      description: "Segunda a Sexta, 9h às 18h"
    },
    {
      icon: MapPin,
      title: "Localização",
      content: "São Paulo, Brasil",
      description: "Atendimento remoto"
    },
    {
      icon: Clock,
      title: "Suporte",
      content: "24/7 Online",
      description: "Comunidade ativa"
    }
  ];

  const socialLinks = [
    { icon: Github, label: "GitHub", href: "https://github.com", color: "text-gray-600" },
    { icon: Twitter, label: "Twitter", href: "https://twitter.com", color: "text-blue-500" },
    { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com", color: "text-blue-700" }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Mensagem enviada com sucesso!",
        description: "Obrigado pelo contato. Responderemos em breve.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        type: "geral"
      });
    } catch (error) {
      toast({
        title: "Erro ao enviar mensagem",
        description: "Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
            Entre em Contato
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Tem alguma dúvida, sugestão ou feedback? Adoraríamos ouvir você! 
            Nossa equipe está sempre pronta para ajudar e melhorar sua experiência.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-8 glass border-border/50 shadow-elegant">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-hero rounded-lg">
                  <Send className="h-5 w-5 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-bold">Envie sua Mensagem</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Type */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">
                    Tipo de Contato
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {contactTypes.map((type) => {
                      const IconComponent = type.icon;
                      return (
                        <Button
                          key={type.id}
                          type="button"
                          variant={formData.type === type.id ? "hero" : "outline"}
                          size="sm"
                          onClick={() => setFormData(prev => ({ ...prev, type: type.id }))}
                          className="flex flex-col items-center p-3 h-auto"
                        >
                          <IconComponent className="h-4 w-4 mb-1" />
                          <span className="text-xs">{type.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Name and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="text-sm font-medium text-foreground mb-2 block">
                      Nome *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="text-sm font-medium text-foreground mb-2 block">
                      Email *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="text-sm font-medium text-foreground mb-2 block">
                    Assunto *
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Resumo do seu contato"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="text-sm font-medium text-foreground mb-2 block">
                    Mensagem *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Descreva sua mensagem detalhadamente..."
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Mensagem
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {/* Contact Details */}
            <Card className="p-6 glass border-border/50 shadow-elegant">
              <h3 className="text-xl font-bold mb-6">Informações de Contato</h3>
              <div className="space-y-4">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="p-2 bg-gradient-accent rounded-lg">
                        <IconComponent className="h-4 w-4 text-accent-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{info.title}</h4>
                        <p className="text-sm text-foreground">{info.content}</p>
                        <p className="text-xs text-muted-foreground">{info.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Social Links */}
            <Card className="p-6 glass border-border/50 shadow-elegant">
              <h3 className="text-xl font-bold mb-6">Redes Sociais</h3>
              <div className="space-y-3">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/10 transition-colors group"
                    >
                      <IconComponent className={`h-5 w-5 ${social.color} group-hover:scale-110 transition-transform`} />
                      <span className="font-medium">{social.label}</span>
                    </a>
                  );
                })}
              </div>
            </Card>

            {/* FAQ Prompt */}
            <Card className="p-6 glass border-border/50 shadow-elegant">
              <div className="text-center">
                <div className="p-3 bg-gradient-hero rounded-lg w-fit mx-auto mb-4">
                  <HelpCircle className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-bold mb-2">Dúvidas Rápidas?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Talvez sua pergunta já tenha sido respondida em nossa seção de ajuda.
                </p>
                <Badge variant="secondary" className="text-xs">
                  Em breve: FAQ completo
                </Badge>
              </div>
            </Card>

            {/* Thank You Note */}
            <Card className="p-6 glass border-border/50 shadow-elegant">
              <div className="text-center">
                <div className="p-3 bg-gradient-accent rounded-lg w-fit mx-auto mb-4">
                  <Heart className="h-6 w-6 text-accent-foreground" />
                </div>
                <h3 className="text-lg font-bold mb-2">Obrigado!</h3>
                <p className="text-sm text-muted-foreground">
                  Sua opinião é fundamental para continuarmos melhorando e 
                  oferecendo a melhor experiência possível.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contato;