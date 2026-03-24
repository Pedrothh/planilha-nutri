import Hero from './components/Hero'
import Features from './components/Features'
import Pricing from './components/Pricing'
import { CheckCircle2, Star, ShieldCheck, HeartPulse } from 'lucide-react'

function App() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 antialiased">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <HeartPulse className="text-green-600" size={32} />
            <span className="text-2xl font-black tracking-tight text-gray-900">Nutri<span className="text-green-600">Spread</span></span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-semibold text-gray-600 hover:text-green-600 transition">Benefícios</a>
            <a href="#testimonials" className="text-sm font-semibold text-gray-600 hover:text-green-600 transition">Depoimentos</a>
            <a href="#pricing" className="px-6 py-3 text-sm font-bold text-white bg-green-600 rounded-full hover:bg-green-700 transition shadow-md hover:shadow-lg">Começar Agora</a>
          </div>
        </div>
      </nav>

      <main>
        <Hero />
        
        {/* Trusted By Section */}
        <section className="py-12 bg-gray-50 border-y border-gray-100">
          <div className="container mx-auto px-4">
            <p className="text-center text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Utilizado e Recomendado por</p>
            <div className="flex flex-wrap items-center justify-center gap-12 opacity-40 grayscale">
              {/* Placeholders for partner logos */}
              <div className="text-xl font-bold italic">NutriHealth</div>
              <div className="text-xl font-bold italic">BioClinic</div>
              <div className="text-xl font-bold italic">VitaForma</div>
              <div className="text-xl font-bold italic">PowerFit</div>
            </div>
          </div>
        </section>

        <section id="features">
          <Features />
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-24 bg-white overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">O que dizem os nutricionistas</h2>
              <div className="flex justify-center space-x-1">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="text-yellow-400 fill-yellow-400" size={20} />)}
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Dra. Ana Silva",
                  role: "Nutricionista Clínica",
                  content: "Essa planilha mudou meu atendimento. Ganhei pelo menos 2 horas por dia que antes perdia em cálculos manuais. Meus pacientes amam os relatórios!"
                },
                {
                  name: "Dr. Carlos Mendes",
                  role: "Nutricionista Esportivo",
                  content: "A precisão nos cálculos de macros é impressionante. Já usei vários softwares caros, mas a simplicidade e eficácia dessa planilha ganharam meu coração."
                },
                {
                  name: "Dra. Beatriz Oliveira",
                  role: "Nutricionista Funcional",
                  content: "Interface super intuitiva. Consegui personalizar tudo com minha logo e identidade visual. Vale cada centavo do investimento!"
                }
              ].map((testimonial, idx) => (
                <div key={idx} className="p-8 bg-gray-50 rounded-2xl border border-gray-100 relative">
                  <div className="absolute -top-4 -left-4 p-3 bg-white rounded-full shadow-md">
                    <CheckCircle2 className="text-green-600" size={24} />
                  </div>
                  <p className="text-gray-600 italic mb-6">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center font-bold text-green-700">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-green-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-8">Pronto para elevar o nível do seu consultório?</h2>
            <p className="text-green-100 text-xl mb-12 max-w-2xl mx-auto">Junte-se a centenas de profissionais que já otimizaram seus resultados.</p>
            <a href="#pricing" className="inline-flex items-center px-10 py-5 text-xl font-bold text-green-700 bg-white rounded-2xl hover:bg-green-50 transition shadow-2xl transform hover:-translate-y-1">
              Quero Garantir Meu Acesso
            </a>
          </div>
        </section>

        <Pricing />

        {/* Security / FAQ */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-12">
              <div className="flex items-center space-x-3 text-gray-600">
                <ShieldCheck size={32} className="text-green-600" />
                <span className="font-semibold text-lg uppercase tracking-tight">Compra 100% Segura</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <CheckCircle2 size={32} className="text-green-600" />
                <span className="font-semibold text-lg uppercase tracking-tight">Garantia de 7 Dias</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <HeartPulse size={32} className="text-green-600" />
                <span className="font-semibold text-lg uppercase tracking-tight">Aprovado por Nutris</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <HeartPulse className="text-green-600" size={24} />
            <span className="text-xl font-black tracking-tight text-gray-900">Nutri<span className="text-green-600">Spread</span></span>
          </div>
          <p className="text-gray-500 text-sm">© 2026 NutriSpread. Todos os direitos reservados.</p>
          <div className="mt-4 flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-green-600 text-sm">Termos de Uso</a>
            <a href="#" className="text-gray-400 hover:text-green-600 text-sm">Privacidade</a>
            <a href="#" className="text-gray-400 hover:text-green-600 text-sm">Contato</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
