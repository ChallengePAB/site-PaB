import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-purple-950 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div>
            <h3 className="text-lg font-bold mb-4">
              Passa a Bola
            </h3>
            <p className="text-gray-300 mb-6">
              A plataforma que conecta o futebol feminino brasileiro, 
              promovendo oportunidades e valorizando talentos.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-violet-600 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-violet-600 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-violet-600 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-violet-600 transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <a href="#noticias" className="text-gray-300 hover:text-violet-600 transition-colors">
                  Notícias
                </a>
              </li>
              <li>
                <a href="#copa" className="text-gray-300 hover:text-violet-600 transition-colors">
                  Copa Passa a Bola
                </a>
              </li>
              <li>
                <a href="#peneiras" className="text-gray-300 hover:text-violet-600 transition-colors">
                  Peneiras
                </a>
              </li>
              <li>
                <a href="#login" className="text-gray-300 hover:text-violet-600 transition-colors">
                  Login
                </a>
              </li>
            </ul>
          </div>

          {/* Serviços */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Serviços</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-violet-600 transition-colors">
                  Inscrições
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-violet-600 transition-colors">
                  Peneiras
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-violet-600 transition-colors">
                  Competições
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-violet-600 transition-colors">
                  Podcast
                </a>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail size={16} className="mr-2 text-violet-600" />
                <span className="text-gray-300 text-sm">contato@passaabola.com.br</span>
              </div>
              <div className="flex items-center">
                <Phone size={16} className="mr-2 text-violet-600" />
                <span className="text-gray-300 text-sm">(11) 9999-9999</span>
              </div>
              <div className="flex items-center">
                <MapPin size={16} className="mr-2 text-violet-600" />
                <span className="text-gray-300 text-sm">São Paulo, SP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Linha divisória */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 Passa a Bola. Todos os direitos reservados.
            </p>
            
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

