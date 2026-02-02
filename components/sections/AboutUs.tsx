import React from 'react';
import { Users, Headphones, Trophy } from 'lucide-react';

export const AboutUs: React.FC = () => {
  return (
    <section id="sobre" className="py-24 bg-surface relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          <div className="lg:w-1/2">
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Equipe trabalhando" 
                  className="rounded-2xl shadow-lg w-full h-64 object-cover transform translate-y-8"
                />
                <img 
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Reunião de equipe" 
                  className="rounded-2xl shadow-lg w-full h-64 object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl border border-gray-100 max-w-xs hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-full text-green-600">
                    <Users size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">15+</p>
                    <p className="text-sm text-gray-500">Especialistas Dedicados</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Muito mais que um site,<br />
              <span className="text-primary">somos pessoas reais.</span>
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Sabemos que organizar uma viagem em grupo pode ser desafiador. Datas, pagamentos, preferências diferentes... É por isso que a ViajaFácil não é apenas um algoritmo de busca.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Por trás da nossa plataforma, contamos com um <strong>time de 15 especialistas de viagem</strong> apaixonados pelo que fazem. Eles estão prontos para assumir a burocracia, negociar tarifas exclusivas e garantir que seu único trabalho seja fazer as malas.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="bg-white p-3 h-12 w-12 rounded-full shadow-sm flex items-center justify-center shrink-0 text-primary border border-gray-100">
                  <Headphones size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Suporte Humanizado</h4>
                  <p className="text-gray-500 text-sm">Nada de robôs. Fale com alguém que entende sua necessidade.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-white p-3 h-12 w-12 rounded-full shadow-sm flex items-center justify-center shrink-0 text-primary border border-gray-100">
                  <Trophy size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Experiência Comprovada</h4>
                  <p className="text-gray-500 text-sm">Mais de 10.000 grupos já viajaram conosco com segurança total.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};