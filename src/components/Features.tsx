import { Layout, Clock, Download, FileCheck, Share2, BarChart3 } from 'lucide-react';

const features = [
  {
    title: 'Cálculos Automáticos',
    description: 'Basta preencher os dados do paciente e a planilha calcula tudo: IMC, TMB, Macronutrientes e muito mais.',
    icon: <BarChart3 className="text-green-600" size={24} />
  },
  {
    title: 'Interface Intuitiva',
    description: 'Design limpo e fácil de usar, desenvolvido pensando no fluxo de atendimento do nutricionista.',
    icon: <Layout className="text-green-600" size={24} />
  },
  {
    title: 'Economia de Tempo',
    description: 'Gere planos alimentares em minutos em vez de horas. Mais tempo para focar no seu paciente.',
    icon: <Clock className="text-green-600" size={24} />
  },
  {
    title: 'Relatórios em PDF',
    description: 'Exporte relatórios profissionais e personalizados com a sua logo para enviar aos seus clientes.',
    icon: <FileCheck className="text-green-600" size={24} />
  },
  {
    title: 'Compartilhamento Fácil',
    description: 'Envie por WhatsApp ou e-mail com apenas um clique. Praticidade para você e seu paciente.',
    icon: <Share2 className="text-green-600" size={24} />
  },
  {
    title: 'Download Imediato',
    description: 'Após a confirmação do pagamento por PIX, você recebe o link de download na hora.',
    icon: <Download className="text-green-600" size={24} />
  }
];

export default function Features() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container px-4 mx-auto">
        <div className="max-w-2xl mx-auto mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Tudo o que você precisa em uma única ferramenta
          </h2>
          <p className="text-lg text-gray-600">
            Nossa planilha foi validada por dezenas de profissionais para garantir que você tenha a melhor experiência possível.
          </p>
        </div>
        <div className="flex flex-wrap -mx-4">
          {features.map((feature, index) => (
            <div key={index} className="w-full px-4 mb-8 md:w-1/2 lg:w-1/3">
              <div className="h-full p-8 transition bg-white border border-gray-100 rounded-2xl hover:shadow-xl hover:border-green-100 group">
                <div className="inline-flex items-center justify-center p-3 mb-6 transition bg-green-50 rounded-lg group-hover:bg-green-100">
                  {feature.icon}
                </div>
                <h3 className="mb-4 text-xl font-bold text-gray-900">{feature.title}</h3>
                <p className="leading-relaxed text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
