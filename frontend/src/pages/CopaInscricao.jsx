import { Link } from 'react-router-dom'; 
import { Trophy, Users, User, Calendar, MapPin } from 'lucide-react';


const CopaInscricao = () => {
  return (
    <section id="copa" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Trophy className="h-16 w-16 text-purple-600" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Copa Passa a Bola 2025
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A maior competição de futebol feminino do país está chegando! 
            Inscreva-se agora e faça parte desta história.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-8">
            {/* Informações da Competição */}
            <div className="bg-purple-50 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Informações da Competição
              </h3>
              <div className="space-y-4 text-left">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-purple-600 mr-3" />
                  <div>
                    <p className="font-semibold">Período</p>
                    <p className="text-gray-600">01/10/2024 a 30/11/2024</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-purple-600 mr-3" />
                  <div>
                    <p className="font-semibold">Local</p>
                    <p className="text-gray-600">Estádios em todo o Brasil</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-purple-600 mr-3" />
                  <div>
                    <p className="font-semibold">Categorias</p>
                    <p className="text-gray-600">Sub-16, Sub-18, Sub-20, Profissional</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tipos de Inscrição */}
            <div className="bg-gray-50 rounded-lg p-8">
              <h4 className="text-xl font-bold text-gray-900 mb-4">
                Tipos de Inscrição
              </h4>
              <div className="space-y-4 text-left">
                <div className="flex items-start">
                  <User className="h-5 w-5 text-purple-600 mr-3 mt-1" />
                  <div>
                    <p className="font-semibold">Individual</p>
                    <p className="text-gray-600 text-sm">
                      Para jogadoras que buscam um time ou querem participar individualmente
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Users className="h-5 w-5 text-purple-600 mr-3 mt-1" />
                  <div>
                    <p className="font-semibold">Time Completo</p>
                    <p className="text-gray-600 text-sm">
                      Para times já formados que querem participar da competição
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link
              to="/inscricao"
              className="inline-block bg-purple-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-purple-700 transition-transform transform hover:scale-105"
            >
              Inscreva-se Agora
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CopaInscricao;