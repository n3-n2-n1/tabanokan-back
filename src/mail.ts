import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
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

transport.sendMail({
  from: "noreply@tabanokan.store",
  to: ["krystalloquartz@gmail.com", "santiagodenicolas@gmail.com"],
  subject: "Prueba de correo electrónico",
  text: "Este es un mensaje de prueba",
});
