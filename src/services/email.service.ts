import nodemailer from "nodemailer";
import cons from "consolidate";

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_SMTP_HOST,
      secure: true,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    // Verificación de conexión SMTP
    this.transporter.verify((error) => {
      if (error) {
        console.error("Error al conectar con el servidor SMTP:", error);
      }
    });
  }

  /**
   * Enviar un correo genérico.
   */
  async sendGenericEmail(
    to: string | string[],
    subject: string,
    body: string,
    isHtml = true
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM || "noreply@example.com",
        to,
        subject,
        [isHtml ? "html" : "text"]: body,
      });
      console.log(`Correo enviado a ${to}`);
    } catch (error) {
      console.error("Error al enviar el correo:", error);
      throw error;
    }
  }

  /**
   * Enviar un correo basado en una plantilla.
   */
  async sendTemplateEmail(
    to: string | string[],
    subject: string,
    templatePath: string,
    templateData: Record<string, any>
  ): Promise<void> {
    try {
      // Renderizar plantilla
      const html = await cons.swig(templatePath, templateData);

      // Enviar correo
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM || "noreply@example.com",
        to,
        subject,
        html,
      });
      console.log(`Correo basado en plantilla enviado a ${to}`);
    } catch (error) {
      console.error("Error al enviar correo con plantilla:", error);
      throw error;
    }
  }
}
