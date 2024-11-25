import { MercadoPagoConfig, Preference } from "mercadopago";

(async () => {
  const client = new MercadoPagoConfig({
    accessToken: process.env.PRIVATE_KEY || "",
  });

  const preference = new Preference(client);

  // Valor total = 40 ARS

  const preferenceResponse = await preference.create({
    body: {
      items: [
        {
          id: "pepe-verdulero",
          title: "Remera de tabaco",
          quantity: 1,
          unit_price: 10,
        },
        {
          id: "pepe-carne",
          title: "Calzones de homunculo",
          quantity: 3,
          unit_price: 10,
        },
      ],
    },
  });

  console.log(preferenceResponse);
})();
