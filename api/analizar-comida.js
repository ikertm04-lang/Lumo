// api/analizar-comida.js
// Función serverless de Vercel: recibe una foto o una descripción de comida
// desde app.js y le pregunta a Gemini cuántas calorías/macros tiene.

export const config = { runtime: "nodejs" };

const MODELO = "gemini-2.0-flash";

const INSTRUCCIONES = `Eres un nutriólogo. Analiza la comida y responde EXCLUSIVAMENTE
con un JSON con esta forma exacta, sin texto adicional, sin markdown, sin backticks:
{"descripcion": "string corto describiendo el platillo", "calorias": number, "proteinas": number, "carbohidratos": number, "grasas": number}
Los números son gramos (excepto calorias, que son kcal) y deben ser una estimación
razonable para la porción descrita o mostrada en la foto.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método no permitido" });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Falta la variable de entorno GEMINI_API_KEY en Vercel");
    res.status(500).json({ error: "Falta configurar GEMINI_API_KEY en el servidor" });
    return;
  }

  try {
    const { tipo, descripcion, imagenBase64 } = req.body || {};

    let parts;
    if (tipo === "foto" && imagenBase64) {
      const base64Data = imagenBase64.includes(",")
        ? imagenBase64.split(",")[1]
        : imagenBase64;
      parts = [
        { text: INSTRUCCIONES + "\n\nAnaliza la comida en esta foto." },
        { inline_data: { mime_type: "image/jpeg", data: base64Data } },
      ];
    } else if (tipo === "texto" && descripcion) {
      parts = [{ text: INSTRUCCIONES + "\n\nComida descrita: " + descripcion }];
    } else {
      res.status(400).json({ error: "Falta 'descripcion' o 'imagenBase64' en la petición" });
      return;
    }

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODELO}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Error de Gemini:", geminiRes.status, errText);
      res.status(502).json({ error: "Gemini respondió con un error (" + geminiRes.status + ")" });
      return;
    }

    const data = await geminiRes.json();
    const textoRespuesta = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textoRespuesta) {
      console.error("Respuesta de Gemini sin texto:", JSON.stringify(data));
      res.status(502).json({ error: "Gemini no devolvió una respuesta utilizable" });
      return;
    }

    let resultado;
    try {
      resultado = JSON.parse(textoRespuesta);
    } catch (e) {
      const match = textoRespuesta.match(/\{[\s\S]*\}/);
      resultado = match ? JSON.parse(match[0]) : null;
    }

    if (!resultado) {
      console.error("No se pudo interpretar el JSON de Gemini:", textoRespuesta);
      res.status(502).json({ error: "No se pudo interpretar la respuesta de Gemini" });
      return;
    }

    res.status(200).json(resultado);
  } catch (err) {
    console.error("Error en analizar-comida:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}