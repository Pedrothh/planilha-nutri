const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Payment } = require('mercadopago');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configurar Mercado Pago
const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
console.log('Iniciando Mercado Pago com token:', accessToken ? `${accessToken.substring(0, 8)}...` : 'NENHUM TOKEN ENCONTRADO');

if (accessToken && accessToken.startsWith('APP_USR')) {
  console.warn('AVISO: Você está usando um token de PRODUÇÃO (APP_USR). Se sua conta não estiver homologada, ocorrerá erro 401.');
} else if (accessToken && accessToken.startsWith('TEST')) {
  console.log('INFO: Usando token de TESTE (Sandbox).');
}

const client = new MercadoPagoConfig({ 
  accessToken: accessToken 
});
const payment = new Payment(client);

// Rota para criar pagamento (PIX ou Cartão)
app.post('/api/create-payment', async (req, res) => {
  try {
    const { email, name, payment_method_id, token, installments, issuer_id, identificationNumber } = req.body;

    const paymentData = {
      body: {
        transaction_amount: 1.00,
        description: 'Planilha NutriPremium',
        payment_method_id: payment_method_id || 'pix',
        payer: {
          email: email || 'comprador@email.com',
          first_name: name || 'Comprador',
          last_name: 'Teste',
          identification: {
            type: 'CPF',
            number: identificationNumber || '12345678909'
          }
        },
      },
      requestOptions: { 
        idempotencyKey: crypto.randomUUID() 
      }
    };

    // Se for cartão, adiciona os campos específicos
    if (payment_method_id !== 'pix') {
      paymentData.body.token = token;
      paymentData.body.installments = Number(installments) || 1;
      paymentData.body.issuer_id = issuer_id;
    }

    const result = await payment.create(paymentData);
    
    // Resposta padrão
    const response = {
      id: result.id,
      status: result.status,
      status_detail: result.status_detail
    };

    // Se for PIX, inclui os dados do QR Code
    if (payment_method_id === 'pix' && result.point_of_interaction) {
      response.qr_code = result.point_of_interaction.transaction_data.qr_code;
      response.qr_code_base64 = result.point_of_interaction.transaction_data.qr_code_base64;
    }

    res.json(response);
  } catch (error) {
    if (error.status === 401) {
      console.error('\n❌ ERRO DE AUTORIZAÇÃO (401):');
      console.error('Mesmo começando com APP_USR, o Mercado Pago bloqueia o uso de credenciais de produção se a conta não estiver Homologada.');
      console.error('Para testar sem homologação, você DEVE usar o token que começa com "TEST-" na aba "Credenciais de teste".\n');
    } else {
      console.error('Erro ao criar pagamento:', error);
    }
    res.status(error.status || 500).json({ 
      error: error.message,
      detail: error.status === 401 ? 'Troque o token no arquivo .env por um que comece com TEST-.' : error.cause
    });
  }
});

// Rota para verificar status do pagamento
app.get('/api/payment-status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await payment.get({ id });
    res.json({ status: result.status });
  } catch (error) {
    console.error('Erro ao buscar status:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
