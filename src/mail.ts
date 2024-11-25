import nodemailer from "nodemailer";
import cons from "consolidate";
import previewEmail from "preview-email";

(async () => {
  const transport = nodemailer.createTransport({
    host: process.env.MAIL_SMTP_HOST,
    secure: true,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  transport.verify((error, success) => {
    if (error) {
      console.log(error);
      return;
    }
    console.log(
      "Verificación de conexión con el servidor de correo electrónico exitosa."
    );
    console.log(success);
  });

  const mailer = await cons.swig("src/views/client-order-recived.html", {
    name: "Santiago",
    products: [
      {
        name: "Producto 1",
        quantity: 2,
        price: 20,
      },
      {
        name: "Producto 2",
        quantity: 1,
        price: 15,
      },
    ],
    totalPrice: 55,
  });

  transport.sendMail({
    from: "noreply@tabanokan.store",
    to: ["santidenicolas@gmail.com"],
    subject: "Nuevo pedido recibido",
    html: mailer,
  });
})();
