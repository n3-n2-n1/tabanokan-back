import crypto from "crypto";
import MercadoPagoConfig from "mercadopago";

function parseSignature(signature: string) {
  const parsedSignature: { ts: string; signature: string } = {
    ts: "",
    signature: "",
  };

  const splitedSignature = signature.split(",");

  splitedSignature.forEach((part) => {
    const [key, value] = part.split("=");
    if (key === "ts") {
      parsedSignature.ts = value;
    } else if (key === "v1") {
      parsedSignature.signature = value;
    }
  });

  return parsedSignature;
}

export const mercadopagoClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || "",
});

export function verifySignature(
  id: string,
  signature: string,
  requestId: string
) {
  const secretToken = process.env.MP_SECRET_TOKEN || "";
  const parsedSignature = parseSignature(signature);

  const manifest = `id:${id};request-id:${requestId};ts:${parsedSignature.ts};`;

  const hmac = crypto.createHmac("sha256", secretToken);
  hmac.update(manifest);

  const sha = hmac.digest("hex");

  if (sha !== parsedSignature.signature)
    throw new Error(
      "The calculated signature does not match the expected signature"
    );

  return true;
}
