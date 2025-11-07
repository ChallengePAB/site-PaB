import { Instagram, Youtube} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-purple-950 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">

          <div className="mb-4 md:mb-0 flex space-x-4">
            <h3 className="text-lg font-bold mb-2">
              PaB
            </h3>
              <a href="https://www.instagram.com/passaabola/" className="text-gray-400 hover:text-violet-600 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://www.youtube.com/@passabola" className="text-gray-400 hover:text-violet-600 transition-colors">
                <Youtube size={20} />
              </a>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Passa a Bola. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

