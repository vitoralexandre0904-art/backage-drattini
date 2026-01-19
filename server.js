import express from "express";
import cors from "cors";
import mercadopago from "mercadopago";

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 COLOQUE SEU TOKEN AQUI (depois vamos esconder no Railway)
mercadopago.configure({
  access_token: process.env.MP_TOKEN
});

// Criar pagamento
app.post("/create-payment", async (req, res) => {
  try {
    const { items } = req.body;

    const preference = {
      items: items.map(item => ({
        title: item.title,
        quantity: item.quantity,
        currency_id: "BRL",
        unit_price: item.price
      })),
      back_urls: {
        success: "https://drattini.netlify.app/sucesso.html",
        failure: "https://drattini.netlify.app/erro.html",
        pending: "https://drattini.netlify.app/pendente.html"
      },
      auto_return: "approved"
    };

    const response = await mercadopago.preferences.create(preference);
    res.json({ init_point: response.body.init_point });

  } catch (error) {
    res.status(500).json({ error: "Erro ao criar pagamento" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor rodando na porta", PORT));