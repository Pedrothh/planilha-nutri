import { ArrowRight } from 'lucide-react';

export default function Hero() {
  const scrollToPricing = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative py-20 overflow-hidden bg-white">
      <div className="container px-4 mx-auto">
        <div className="flex flex-wrap items-center -mx-4">
          <div className="w-full px-4 mb-12 lg:w-1/2 lg:mb-0">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold text-green-600 bg-green-100 rounded-full">
              FERRAMENTA EXCLUSIVA PARA NUTRICIONISTAS
            </span>
            <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
              Transforme o <span className="text-green-600">atendimento</span> dos seus pacientes com nossa planilha premium
            </h1>
            <p className="mb-8 text-lg text-gray-600 md:text-xl">
              Simplifique o acompanhamento nutricional, gere relatórios automáticos e encante seus clientes com uma experiência profissional e organizada.
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <button 
                onClick={scrollToPricing}
                className="inline-flex items-center justify-center px-8 py-4 text-white transition bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300"
              >
                Quero garantir a minha
                <ArrowRight className="ml-2" size={20} />
              </button>
              <button className="inline-flex items-center justify-center px-8 py-4 text-gray-700 transition bg-gray-100 rounded-lg hover:bg-gray-200">
                Ver demonstração
              </button>
            </div>
            <div className="mt-8 flex items-center space-x-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 border-2 border-white rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/40?img=${i + 10}`} alt="User avatar" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                <span className="font-bold text-gray-900">+500 nutricionistas</span> já estão usando
              </p>
            </div>
          </div>
          <div className="w-full px-4 lg:w-1/2">
            <div className="relative mx-auto lg:mr-0 max-w-lg">
              <img 
                src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Planilha de Nutrição" 
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg hidden md:block">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Economia de tempo</p>
                    <p className="text-xs text-gray-500">Até 2h por dia</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
