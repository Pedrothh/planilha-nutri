import { QrCode, Copy, CheckCircle2, Download, Loader2, Mail, User, CreditCard as CardIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

declare global {
  interface Window {
    MercadoPago: any;
  }
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const PUBLIC_KEY = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY;

export default function PaymentModal({ isOpen, onClose }: PaymentModalProps) {
  const [step, setStep] = useState<'form' | 'method' | 'qr' | 'card-form' | 'processing' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<{ id: string; qr_code?: string; qr_code_base64?: string } | null>(null);
  const [userData, setUserData] = useState({ name: '', email: '' });
  const [error, setError] = useState<string | null>(null);

  // Inicializar Mercado Pago Brick para Cartão
  useEffect(() => {
    let controller: any = null;

    if (step === 'card-form' && PUBLIC_KEY && PUBLIC_KEY !== 'SUA_PUBLIC_KEY_AQUI') {
      const mp = new window.MercadoPago(PUBLIC_KEY);
      const bricksBuilder = mp.bricks();

      const renderCardBrick = async (bricksBuilder: any) => {
        const settings = {
          initialization: {
            amount: 20,
            payer: {
              email: userData.email,
            },
          },
          customization: {
            paymentMethods: {
              creditCard: 'all',
              installments: 12
            },
          },
          callbacks: {
            onReady: () => {
              console.log('Brick Pronto');
              setLoading(false);
            },
            onSubmit: (formData: any) => {
              console.log('Botão Pay clicado! Dados do Brick:', formData);
              
              return new Promise((resolve, reject) => {
                const dataToSend = {
                  ...userData,
                  payment_method_id: formData.payment_method_id,
                  token: formData.token,
                  installments: formData.installments,
                  issuer_id: formData.issuer_id,
                  identificationNumber: formData.payer?.identification?.number
                };

                console.log('Enviando para o backend:', dataToSend);

                axios.post(`${API_URL}/create-payment`, dataToSend)
                    .then((response) => {
                      console.log('Resposta do backend:', response.data);
                      setPaymentData({ id: response.data.id }); // Armazena o ID para o polling

                      if (response.data.status === 'approved') {
                        setStep('success');
                        resolve(null);
                      } else if (response.data.status === 'in_process' || response.data.status === 'pending') {
                        setStep('processing'); // Vai para tela de processamento
                        resolve(null);
                      } else {
                        setError(`Pagamento ${response.data.status}: ${response.data.status_detail}`);
                        reject();
                      }
                    })
                  .catch((error) => {
                    console.error('Erro na chamada axios:', error);
                    setError('Erro ao processar pagamento no servidor.');
                    reject();
                  });
              });
            },
            onError: (error: any) => {
              console.error('Erro crítico no Brick:', error);
              setError('Erro no formulário de pagamento.');
            },
          },
        };
        controller = await bricksBuilder.create('payment', 'paymentBrick_container', settings);
      };

      renderCardBrick(bricksBuilder);
    }

    return () => {
      if (controller) {
        controller.unmount?.();
      }
      const container = document.getElementById('paymentBrick_container');
      if (container) container.innerHTML = '';
    };
  }, [step]);

  // Criar pagamento PIX no backend
  const handleCreatePixPayment = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/create-payment`, {
        ...userData,
        payment_method_id: 'pix'
      });
      setPaymentData(response.data);
      setStep('qr');
    } catch (err: any) {
      setError('Erro ao gerar pagamento PIX.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('method');
  };

  // Verificar status do pagamento (Polling para PIX e Cartão Pendente)
  useEffect(() => {
    let interval: number;
    if ((step === 'qr' || step === 'processing') && paymentData?.id) {
      interval = setInterval(async () => {
        try {
          const response = await axios.get(`${API_URL}/payment-status/${paymentData.id}`);
          if (response.data.status === 'approved') {
            setStep('success');
            clearInterval(interval);
          } else if (response.data.status === 'rejected') {
            setError('Pagamento recusado pelo banco.');
            setStep('method');
            clearInterval(interval);
          }
        } catch (err) {
          console.error('Erro ao verificar status:', err);
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [step, paymentData]);

  const copyToClipboard = () => {
    if (paymentData?.qr_code) {
      navigator.clipboard.writeText(paymentData.qr_code);
      alert('Código PIX copiado!');
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = 'https://docs.google.com/spreadsheets/d/1example/edit?usp=sharing';
    link.download = 'Planilha_Nutricionista_Premium.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm text-gray-900">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden overflow-y-auto max-h-[90vh]">
        
        {step === 'form' && (
          <div className="p-8">
            <h3 className="mb-2 text-2xl font-bold text-gray-900 text-center">Dados de Acesso</h3>
            <p className="mb-6 text-gray-600 text-center">Informe seus dados para receber o acesso à planilha.</p>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input 
                    required
                    type="text"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                    placeholder="Seu nome"
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input 
                    required
                    type="email"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                    placeholder="seu@email.com"
                    value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  />
                </div>
              </div>
              
              <button 
                type="submit"
                className="w-full py-4 font-bold text-white transition bg-green-600 rounded-lg hover:bg-green-700 flex items-center justify-center"
              >
                Próximo passo
              </button>
              
              <button 
                type="button"
                onClick={onClose}
                className="w-full py-2 text-sm font-medium text-gray-400 hover:text-gray-600 transition"
              >
                Cancelar
              </button>
            </form>
          </div>
        )}

        {step === 'method' && (
          <div className="p-8">
            <h3 className="mb-2 text-2xl font-bold text-gray-900 text-center">Forma de Pagamento</h3>
            <p className="mb-6 text-gray-600 text-center">Escolha como deseja pagar os R$ 20,00.</p>
            
            <div className="space-y-4">
              <button 
                onClick={() => {
                  handleCreatePixPayment();
                }}
                disabled={loading}
                className="w-full p-4 flex items-center border-2 border-gray-100 rounded-xl hover:border-green-500 hover:bg-green-50 transition group"
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-4 group-hover:bg-green-600 group-hover:text-white transition">
                  <QrCode size={24} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900">PIX</p>
                  <p className="text-sm text-gray-500">Aprovação imediata</p>
                </div>
              </button>

              <button 
                onClick={() => setStep('card-form')}
                className="w-full p-4 flex items-center border-2 border-gray-100 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition group"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-4 group-hover:bg-blue-600 group-hover:text-white transition">
                  <CardIcon size={24} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900">Cartão de Crédito</p>
                  <p className="text-sm text-gray-500">Parcele em até 12x</p>
                </div>
              </button>

              <button 
                type="button"
                onClick={() => setStep('form')}
                className="w-full py-2 text-sm font-medium text-gray-400 hover:text-gray-600 transition"
              >
                Voltar
              </button>
            </div>
            {loading && (
              <div className="mt-4 flex justify-center">
                <Loader2 className="animate-spin text-green-600" />
              </div>
            )}
          </div>
        )}

        {step === 'card-form' && (
          <div className="p-8">
            <h3 className="mb-6 text-2xl font-bold text-gray-900 text-center">Cartão de Crédito</h3>
            
            {(!PUBLIC_KEY || PUBLIC_KEY === 'SUA_PUBLIC_KEY_AQUI') ? (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-amber-800 text-sm">
                <p className="font-bold mb-1">Atenção!</p>
                Você precisa configurar sua <strong>Public Key</strong> no arquivo <code>.env</code> para habilitar o pagamento com cartão.
              </div>
            ) : (
              <div id="paymentBrick_container"></div>
            )}

            {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
            
            <button 
              type="button"
              onClick={() => setStep('method')}
              className="w-full mt-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-600 transition"
            >
              Escolher outra forma
            </button>
          </div>
        )}

        {step === 'processing' && (
          <div className="p-8 text-center">
            <h3 className="mb-2 text-2xl font-bold text-gray-900">Processando...</h3>
            <p className="mb-8 text-gray-600">Seu pagamento está sendo analisado pelo banco. Isso geralmente leva alguns segundos.</p>
            
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center text-blue-600 font-medium animate-pulse">
                <Loader2 className="animate-spin mr-2" size={24} />
                Aguardando aprovação...
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 text-left w-full">
                <p><strong>Nota:</strong> Assim que o banco confirmar, o download será liberado automaticamente nesta tela.</p>
              </div>

              <button 
                onClick={() => setStep('method')}
                className="text-sm text-gray-400 hover:text-gray-600 underline mt-4"
              >
                Voltar e tentar outra forma
              </button>
            </div>
          </div>
        )}

        {step === 'qr' && paymentData && (
          <div className="p-8 text-center">
            <h3 className="mb-2 text-2xl font-bold text-gray-900">Escaneie o QR Code</h3>
            <p className="mb-6 text-gray-600">A confirmação é instantânea e o download será liberado automaticamente.</p>
            
            <div className="flex justify-center p-4 mb-6 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <div className="relative p-2 bg-white rounded-lg shadow-sm">
                <img 
                  src={`data:image/jpeg;base64,${paymentData.qr_code_base64}`} 
                  alt="QR Code PIX" 
                  className="w-48 h-48"
                />
              </div>
            </div>

            <div className="mb-8 text-left">
              <p className="mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">PIX Copia e Cola</p>
              <div className="flex items-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <code className="flex-1 text-xs text-gray-600 truncate">{paymentData.qr_code}</code>
                <button 
                  onClick={copyToClipboard}
                  className="p-2 ml-2 text-green-600 transition hover:bg-green-50 rounded-md shrink-0"
                >
                  <Copy size={18} />
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center text-green-600 font-medium animate-pulse">
                <Loader2 className="animate-spin mr-2" size={18} />
                Aguardando confirmação do banco...
              </div>
              <button 
                onClick={() => setStep('method')}
                className="text-sm text-gray-400 hover:text-gray-600 underline"
              >
                Voltar
              </button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="p-10 text-center animate-in fade-in zoom-in duration-300">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-green-100 rounded-full">
              <CheckCircle2 size={48} className="text-green-600" />
            </div>
            <h3 className="mb-2 text-3xl font-bold text-gray-900">Pagamento Confirmado!</h3>
            <p className="mb-8 text-gray-600 text-lg">
              Obrigado, {userData.name.split(' ')[0]}! Sua planilha já está disponível.
            </p>
            
            <button 
              onClick={handleDownload}
              className="inline-flex items-center justify-center w-full px-8 py-5 mb-4 text-xl font-bold text-white transition bg-green-600 rounded-xl hover:bg-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Download className="mr-3" size={24} />
              Baixar Planilha Agora
            </button>
            
            <button 
              onClick={onClose}
              className="mt-8 text-sm font-medium text-gray-400 hover:text-gray-600 underline"
            >
              Fechar janela
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
