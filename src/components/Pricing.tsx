import { Check, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import PaymentModal from './PaymentModal';

export default function Pricing() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="container px-4 mx-auto">
        <div className="max-w-2xl mx-auto mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Escolha o melhor plano para o seu negócio
          </h2>
          <p className="text-lg text-gray-600">
            Comece hoje mesmo a transformar o seu atendimento nutricional.
          </p>
        </div>

        <div className="flex flex-wrap justify-center -mx-4">
          {/* Plan Premium */}
          <div className="w-full px-4 mb-8 md:w-1/2 lg:w-1/3 lg:mb-0">
            <div className="relative h-full p-8 transition bg-white border-2 border-green-600 rounded-3xl shadow-2xl scale-105">
              <span className="absolute top-0 right-0 px-4 py-1 mt-6 mr-6 text-xs font-bold text-white uppercase bg-green-600 rounded-full">
                MAIS VENDIDO
              </span>
              <div className="mb-6">
                <h3 className="mb-2 text-2xl font-bold text-gray-900">Premium Nutri</h3>
                <p className="text-gray-500">Planilha Completa + Suporte</p>
              </div>
              <div className="flex items-end mb-6">
                <span className="mb-2 mr-2 text-2xl font-bold text-gray-400 line-through">R$ 99,00</span>
                <span className="text-5xl font-bold text-green-600">R$ 1,00</span>
              </div>
              <ul className="mb-10 space-y-4">
                {[
                  'Cálculos automáticos de macros',
                  'Gerador de relatórios em PDF',
                  'Acompanhamento de evolução',
                  'Suporte VIP via WhatsApp',
                  'Atualizações gratuitas vitalícias',
                  'Acesso imediato após o PIX'
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="mr-3 text-green-600" size={20} />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center w-full px-8 py-4 text-xl font-bold text-white transition bg-green-600 rounded-xl hover:bg-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Garantir Desconto Agora
                <ArrowRight className="ml-2" size={24} />
              </button>
              <p className="mt-4 text-center text-xs text-gray-400">
                Pagamento único. Sem mensalidades.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 text-center">
          <p className="mb-6 text-sm text-gray-500">Garantia incondicional de 7 dias</p>
          <div className="flex flex-wrap items-center justify-center -mx-4 opacity-50 grayscale">
            {/* Payment Icons */}
            <div className="px-4 mb-4 lg:mb-0">
              <img src="https://logospng.org/download/pix/logo-pix-1024.png" alt="PIX" className="h-8" />
            </div>
            {/* Add other logos if needed */}
          </div>
        </div>
      </div>

      <PaymentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
