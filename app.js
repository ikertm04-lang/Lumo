/* ============================================================
   LUMO — app.js
   Lógica completa de onboarding, dashboard, ejercicio y perfil.
   Incluye el tope de déficit calórico seguro (CDC/OMS/NHS/AHA):
     - Ritmo saludable: 0.5–1 kg/semana
     - Déficit máximo permitido: 750–1000 kcal/día o 1% del peso
       corporal por semana (lo que sea menor)
     - Piso de calorías mínimas por sexo para nunca bajar de un
       consumo inseguro
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Perfiles fijos de la pareja ---------- */
  const PROFILE_META = {
    elena: { key: "elena", name: "Liss", sex: "female", badge: "Perfil A" },
    lucas: { key: "lucas", name: "Iker", sex: "male", badge: "Perfil B" },
  };

  // Mascotas SVG ya incluidas en el HTML (rosa = Liss, azul = Iker)
  const MASCOT_SRC = {
    elena:
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwgNSkiPgogICAgPGVsbGlwc2UgY3g9IjEwMCIgY3k9IjE4MCIgcng9IjY1IiByeT0iMTIiIGZpbGw9IiNGMUQ3REYiIC8+CiAgICA8cGF0aCBkPSJNNTIgMTQ1IEMzNSAxMjUgMzUgNzUgNjAgNDUgQzgyIDIwIDEyMCAyMCAxNDIgNDUgQzE2NSA3MiAxNjUgMTI1IDE0OCAxNDUgQzEzMiAxNjYgNjggMTY2IDUyIDE0NSBaIiBmaWxsPSIjRDQ1MzdFIiAvPgogICAgPHBhdGggZD0iTTY4IDEzNSBDNTggMTE1IDYyIDgwIDgwIDYwIEM5MiA0OCAxMTAgNDggMTIyIDYwIEMxMzUgNzUgMTQwIDExNSAxMzIgMTM1IEMxMjIgMTUyIDc4IDE1MiA2OCAxMzUgWiIgZmlsbD0iI0RFNjg4RiIgb3BhY2l0eT0iMC40IiAvPgogICAgPGNpcmNsZSBjeD0iNjgiIGN5PSI5OCIgcj0iMTAiIGZpbGw9IiNGNDk1QjIiIG9wYWNpdHk9IjAuOCIgLz4KICAgIDxjaXJjbGUgY3g9IjEzMiIgY3k9Ijk4IiByPSIxMCIgZmlsbD0iI0Y0OTVCMiIgb3BhY2l0eT0iMC44IiAvPgogICAgPGNpcmNsZSBjeD0iODIiIGN5PSI4NSIgcj0iNyIgZmlsbD0iIzFGMTUxOCIgLz4KICAgIDxjaXJjbGUgY3g9IjExOCIgY3k9Ijg1IiByPSI3IiBmaWxsPSIjMUYxNTE4IiAvPgogICAgPGNpcmNsZSBjeD0iODAiIGN5PSI4MiIgcj0iMi41IiBmaWxsPSIjRkZGRkZGIiAvPgogICAgPGNpcmNsZSBjeD0iMTE2IiBjeT0iODIiIHI9IjIuNSIgZmlsbD0iI0ZGRkZGRiIgLz4KICAgIDxwYXRoIGQ9Ik05MiA5OCBRMTAwIDEwNiAxMDggOTgiIHN0cm9rZT0iIzFGMTUxOCIgc3Ryb2tlLXdpZHRoPSIzLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgZmlsbD0ibm9uZSIgLz4KICAgIDxjaXJjbGUgY3g9IjEwMCIgY3k9IjIyIiByPSI1IiBmaWxsPSIjRUY5RjI3IiAvPgogICAgPHBhdGggZD0iTTEwMCAyNyBRMTAwIDM0IDEwMCAzOCIgc3Ryb2tlPSIjRUY5RjI3IiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgZmlsbD0ibm9uZSIgLz4KICA8L2c+Cjwvc3ZnPgo=",
    lucas:
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwgNSkiPgogICAgPGVsbGlwc2UgY3g9IjEwMCIgY3k9IjE4MCIgcng9IjY1IiByeT0iMTIiIGZpbGw9IiNEM0U0RjQiIC8+CiAgICA8cGF0aCBkPSJNNTUgOTAgQzM1IDEyNSA0MCAxNjAgMzAgMTcwIEM1NSAxNjUgNzUgMTYwIDg1IDE1NSBaIiBmaWxsPSIjRUY5RjI3IiAvPgogICAgPHBhdGggZD0iTTE0NSA5MCBDMTY1IDEyNSAxNjAgMTYwIDE3MCAxNzAgQzE0NSAxNjUgMTI1IDE2MCAxMTUgMTU1IFoiIGZpbGw9IiNEOThBMTkiIC8+CiAgICA8cGF0aCBkPSJNNTIgMTQ1IEMzNSAxMjIgMzYgNzAgNjIgNDIgQzg0IDE4IDExOCAxOCAxNDAgNDIgQzE2NCA3MCAxNjUgMTIyIDE0OCAxNDUgQzEzMiAxNjYgNjggMTY2IDUyIDE0NSBaIiBmaWxsPSIjMzc4QUREIiAvPgogICAgPHBhdGggZD0iTTY4IDEzNSBDNTggMTE1IDYyIDgwIDgwIDYwIEM5MiA0OCAxMTAgNDggMTIyIDYwIEMxMzUgNzUgMTQwIDExNSAxMzIgMTM1IEMxMjIgMTUyIDc4IDE1MiA2OCAxMzUgWiIgZmlsbD0iIzU4OUZFNSIgb3BhY2l0eT0iMC40IiAvPgogICAgPHBhdGggZD0iTTY0IDc2IEM3NiA3MCA5MiA3NCAxMDAgODAgQzEwOCA3NCAxMjQgNzAgMTM2IDc2IEMxNDQgODAgMTQ0IDk0IDEzNSA5NiBDMTI0IDk4IDEwOCA5MiAxMDAgODUgQzkyIDkyIDc2IDk4IDY1IDk2IEM1NiA5NCA1NiA4MCA2NCA3NiBaIiBmaWxsPSIjMUM0RjgyIiAvPgogICAgPGNpcmNsZSBjeD0iODIiIGN5PSI4NSIgcj0iNiIgZmlsbD0iI0ZGRkZGRiIgLz4KICAgIDxjaXJjbGUgY3g9IjExOCIgY3k9Ijg1IiByPSI2IiBmaWxsPSIjRkZGRkZGIiAvPgogICAgPGNpcmNsZSBjeD0iODMiIGN5PSI4NSIgcj0iMy41IiBmaWxsPSIjMEUyODQ0IiAvPgogICAgPGNpcmNsZSBjeD0iMTE5IiBjeT0iODUiIHI9IjMuNSIgZmlsbD0iIzBFMjg0NCIgLz4KICAgIDxjaXJjbGUgY3g9Ijg0IiBjeT0iODMiIHI9IjEuNSIgZmlsbD0iI0ZGRkZGRiIgLz4KICAgIDxjaXJjbGUgY3g9IjEyMCIgY3k9IjgzIiByPSIxLjUiIGZpbGw9IiNGRkZGRkYiIC8+CiAgICA8cGF0aCBkPSJNOTQgMTAyIFExMDIgMTA4IDExMCAxMDIiIHN0cm9rZT0iIzBFMjg0NCIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0icm91bmQiIGZpbGw9Im5vbmUiIC8+CiAgPC9nPgo8L3N2Zz4K",
  };

  function setMascot(id, key) {
    const el = $(id);
    if (el && MASCOT_SRC[key]) el.src = MASCOT_SRC[key];
  }

  /* ============================================================
     FIREBASE — sincronización "Dúo Lumo" entre los dos celulares
     Cada perfil (elena/lucas) es un documento en la colección
     "profiles". localStorage sigue siendo la caché instantánea y
     offline; Firestore es la fuente compartida entre los dos
     teléfonos. Se usa Auth anónimo (dos personas, sin login real).
     ============================================================ */

  const firebaseConfig = {
    apiKey: "AIzaSyAK8kgsokYeTBQ0ed_aop6FeouwrSwfV-A",
    authDomain: "lumo-f6c68.firebaseapp.com",
    projectId: "lumo-f6c68",
    storageBucket: "lumo-f6c68.firebasestorage.app",
    messagingSenderId: "808895466924",
    appId: "1:808895466924:web:67b134b779e77382a5be09",
  };

  let db = null;
  let cloudReady = false;

  function setSyncStatus(text, icon) {
    const el = $("sync-status");
    if (!el) return;
    el.innerHTML =
      '<span class="material-symbols-outlined text-[14px]">' +
      (icon || "sync") +
      "</span>" +
      text;
  }

  function initCloud() {
    if (typeof firebase === "undefined") {
      setSyncStatus("Sin conexión", "cloud_off");
      return;
    }
    try {
      firebase.initializeApp(firebaseConfig);
      db = firebase.firestore();
      // Permite seguir funcionando offline y sincronizar al recuperar señal
      db.enablePersistence({ synchronizeTabs: true }).catch(() => {
        // Falla en modo privado / varias pestañas sin sync — la app sigue
        // funcionando, solo sin caché offline de Firestore.
      });

      firebase
        .auth()
        .signInAnonymously()
        .then(() => {
          cloudReady = true;
          setSyncStatus("En vivo", "sync");
          listenProfile("elena");
          listenProfile("lucas");
        })
        .catch((err) => {
          console.warn("No se pudo autenticar con Firebase:", err);
          setSyncStatus("Sin conexión", "cloud_off");
        });
    } catch (err) {
      console.warn("No se pudo inicializar Firebase:", err);
      setSyncStatus("Sin conexión", "cloud_off");
    }
  }

  // Escucha en tiempo real los cambios del documento de cada perfil.
  // Si el cambio viene de una escritura propia (hasPendingWrites), se
  // ignora para no procesar el eco de lo que este mismo dispositivo
  // acaba de mandar.
  function listenProfile(key) {
    if (!db) return;
    db.collection("profiles")
      .doc(key)
      .onSnapshot(
        (snap) => {
          if (!snap.exists) return;
          if (snap.metadata.hasPendingWrites) return; // eco de nuestra propia escritura
          const cloudData = snap.data();
          delete cloudData.updatedAt;
          state.profiles[key] = cloudData;
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
          } catch (e) {}
          setSyncStatus("En vivo", "sync");
          if (document.readyState !== "loading" && state.currentProfile) {
            renderAll();
          }
        },
        (err) => {
          console.warn("Error escuchando el perfil " + key + ":", err);
          setSyncStatus("Sin conexión", "cloud_off");
        }
      );
  }

  // Sube el perfil activo a Firestore. Se llama automáticamente cada
  // vez que se guarda estado local (checkin, comida, peso, Strava...).
  function pushProfileToCloud(key) {
    if (!db || !cloudReady || !state.profiles[key]) return;
    const payload = Object.assign({}, state.profiles[key], {
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    db.collection("profiles")
      .doc(key)
      .set(payload, { merge: false })
      .catch((err) => {
        console.warn("No se pudo sincronizar con Dúo Lumo:", err);
        setSyncStatus("Sin conexión", "cloud_off");
      });
  }

  const STORAGE_KEY = "lumo_state_v1";

  const MUSCLE_GROUPS = [
    { id: "pecho", label: "Pecho", icon: "fitness_center",
      ejercicios: ["Press de banca — 4x10", "Flexiones — 3x15", "Aperturas con mancuerna — 3x12"] },
    { id: "espalda", label: "Espalda", icon: "sports_gymnastics",
      ejercicios: ["Remo con barra — 4x10", "Jalón al pecho — 3x12", "Dominadas asistidas — 3x8"] },
    { id: "piernas", label: "Piernas", icon: "directions_run",
      ejercicios: ["Sentadilla — 4x10", "Zancadas — 3x12 por pierna", "Peso muerto rumano — 3x10"] },
    { id: "hombros", label: "Hombros", icon: "sports_martial_arts",
      ejercicios: ["Press militar — 4x10", "Elevaciones laterales — 3x15", "Face pull — 3x12"] },
    { id: "brazos", label: "Brazos", icon: "sports_kabaddi",
      ejercicios: ["Curl de bíceps — 3x12", "Fondos de tríceps — 3x12", "Curl martillo — 3x12"] },
    { id: "core", label: "Core", icon: "self_improvement",
      ejercicios: ["Plancha — 3x40s", "Abdominales bicicleta — 3x20", "Elevación de piernas — 3x15"] },
  ];

  /* ============================================================
     NUTRICIÓN — momento del día, base de alimentos e IA
     ============================================================ */

  // Detecta el momento del día según la hora local del dispositivo.
  //   06:00–11:59 → desayuno | 12:00–16:59 → comida
  //   17:00–20:59 → cena     | 21:00–05:59 → snack
  function getMealTypeByHour(date) {
    const h = (date || new Date()).getHours();
    if (h >= 6 && h < 12) return "desayuno";
    if (h >= 12 && h < 17) return "comida";
    if (h >= 17 && h < 21) return "cena";
    return "snack";
  }

  const MEAL_TYPE_LABELS = {
    desayuno: "Desayuno",
    comida: "Comida",
    cena: "Cena",
    snack: "Snack",
  };

  // Base de alimentos comunes con calorías/macros precalculados por porción.
  // (valores de referencia aproximados, pensados para selección rápida —
  // Opción B del registro de comidas)
  const FOOD_DATABASE = [
    { name: "Huevo (1 pieza, cocido)", kcal: 78, protein: 6.3, carbs: 0.6, fat: 5.3 },
    { name: "Pan de caja integral (1 rebanada)", kcal: 80, protein: 4, carbs: 14, fat: 1 },
    { name: "Avena cocida (1 taza)", kcal: 166, protein: 6, carbs: 28, fat: 3.6 },
    { name: "Plátano (1 pieza mediana)", kcal: 105, protein: 1.3, carbs: 27, fat: 0.4 },
    { name: "Manzana (1 pieza mediana)", kcal: 95, protein: 0.5, carbs: 25, fat: 0.3 },
    { name: "Yogur natural (1 taza)", kcal: 149, protein: 8.5, carbs: 11.4, fat: 8 },
    { name: "Leche entera (1 taza)", kcal: 149, protein: 8, carbs: 12, fat: 8 },
    { name: "Café con leche (1 taza)", kcal: 60, protein: 3, carbs: 5, fat: 3 },
    { name: "Arroz blanco cocido (1 taza)", kcal: 206, protein: 4.3, carbs: 45, fat: 0.4 },
    { name: "Frijoles cocidos (1 taza)", kcal: 245, protein: 15, carbs: 45, fat: 1 },
    { name: "Pechuga de pollo asada (100 g)", kcal: 165, protein: 31, carbs: 0, fat: 3.6 },
    { name: "Carne de res molida cocida (100 g)", kcal: 250, protein: 26, carbs: 0, fat: 17 },
    { name: "Filete de pescado a la plancha (100 g)", kcal: 140, protein: 26, carbs: 0, fat: 4 },
    { name: "Tortilla de maíz (1 pieza)", kcal: 52, protein: 1.4, carbs: 11, fat: 0.5 },
    { name: "Taco de pollo (1 pieza)", kcal: 180, protein: 12, carbs: 16, fat: 8 },
    { name: "Ensalada verde con aderezo ligero (1 tazón)", kcal: 90, protein: 2, carbs: 8, fat: 6 },
    { name: "Aguacate (1/2 pieza)", kcal: 120, protein: 1.5, carbs: 6, fat: 11 },
    { name: "Queso panela (30 g)", kcal: 70, protein: 6, carbs: 1, fat: 5 },
    { name: "Pasta cocida (1 taza)", kcal: 220, protein: 8, carbs: 43, fat: 1.3 },
    { name: "Pizza (1 rebanada mediana)", kcal: 285, protein: 12, carbs: 36, fat: 10 },
    { name: "Ensalada de atún (1 tazón)", kcal: 220, protein: 24, carbs: 6, fat: 11 },
    { name: "Sopa de verduras (1 tazón)", kcal: 120, protein: 4, carbs: 18, fat: 3 },
    { name: "Almendras (25 g / puñado)", kcal: 145, protein: 5.3, carbs: 5.4, fat: 12.5 },
    { name: "Barra de granola (1 pieza)", kcal: 120, protein: 3, carbs: 20, fat: 4 },
    { name: "Agua de limón sin azúcar (1 vaso)", kcal: 10, protein: 0, carbs: 2.5, fat: 0 },
    { name: "Refresco (1 lata)", kcal: 140, protein: 0, carbs: 39, fat: 0 },
    { name: "Chocolate amargo (1 cuadro, 70%)", kcal: 45, protein: 0.6, carbs: 4, fat: 3 },
  ];

  /* ------------------------------------------------------------
     Integración con IA multimodal (foto y texto)
     ------------------------------------------------------------
     Conecta aquí la API que elijan (OpenAI Vision, Gemini, etc.).
     ⚠️ IMPORTANTE: nunca dejes tu apiKey real en este archivo si el
     sitio se sirve como estático en GitHub Pages — cualquiera puede
     leer el código fuente y robarla. Lo correcto en producción es
     llamar a un pequeño backend/proxy propio (p. ej. una Cloud
     Function) que guarde la key de forma segura y reciba aquí solo
     la foto/texto. Estos placeholders están listos para conectarse
     a ese proxy o, temporalmente en desarrollo, a la API directa.
     ------------------------------------------------------------ */
  const AI_CONFIG = {
    // "openai" | "gemini" | "proxy" (tu propio backend)
    provider: "proxy",
    apiKey: "TU_API_KEY_AQUI", // <-- coloca aquí tu key (o bórrala si usas "proxy")
    endpoint: "https://TU-BACKEND-O-PROXY/analizar-comida", // <-- URL de tu proxy o de la API elegida
    visionModel: "gpt-4o-mini", // ejemplo si usaran OpenAI directo
    textModel: "gpt-4o-mini",
  };

  function aiIsConfigured() {
    return (
      AI_CONFIG.apiKey &&
      AI_CONFIG.apiKey !== "TU_API_KEY_AQUI" &&
      AI_CONFIG.endpoint &&
      !AI_CONFIG.endpoint.includes("TU-BACKEND")
    );
  }

  // Estima kcal/macros a partir de una foto (base64 sin el prefijo data:).
  // Placeholder: intenta llamar a AI_CONFIG.endpoint; si no está configurado
  // (caso por defecto), devuelve una estimación simulada para poder seguir
  // probando el flujo completo de la UI sin una key real.
  async function analyzeImageWithAI(base64Image) {
    if (!aiIsConfigured()) {
      return mockEstimate("foto");
    }
    try {
      const res = await fetch(AI_CONFIG.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "foto",
          modelo: AI_CONFIG.visionModel,
          imagenBase64: base64Image,
          instrucciones:
            "Analiza esta foto de un platillo. Devuelve SOLO un JSON con: " +
            '{"descripcion": string, "calorias": number, "proteinas": number, "carbohidratos": number, "grasas": number}. ' +
            "Los valores nutricionales son estimados en gramos (proteínas/carbohidratos/grasas) y kcal totales.",
        }),
      });
      if (!res.ok) throw new Error("Respuesta no válida del servicio de IA (" + res.status + ")");
      const data = await res.json();
      return normalizeAIResult(data, "foto");
    } catch (err) {
      console.warn("No se pudo analizar la foto con IA:", err);
      const fallback = mockEstimate("foto");
      fallback.note =
        "No se pudo contactar al servicio de IA — mostrando una estimación de ejemplo. Ajusta los valores manualmente.";
      return fallback;
    }
  }

  // Estima kcal/macros a partir de una descripción de texto libre.
  async function analyzeTextWithAI(texto) {
    if (!aiIsConfigured()) {
      return mockEstimate("texto", texto);
    }
    try {
      const res = await fetch(AI_CONFIG.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "texto",
          modelo: AI_CONFIG.textModel,
          descripcion: texto,
          instrucciones:
            "Interpreta esta descripción de una comida y estima su valor nutricional. Devuelve SOLO un JSON con: " +
            '{"descripcion": string, "calorias": number, "proteinas": number, "carbohidratos": number, "grasas": number}.',
        }),
      });
      if (!res.ok) throw new Error("Respuesta no válida del servicio de IA (" + res.status + ")");
      const data = await res.json();
      return normalizeAIResult(data, "texto");
    } catch (err) {
      console.warn("No se pudo analizar el texto con IA:", err);
      const fallback = mockEstimate("texto", texto);
      fallback.note =
        "No se pudo contactar al servicio de IA — mostrando una estimación de ejemplo. Ajusta los valores manualmente.";
      return fallback;
    }
  }

  function normalizeAIResult(data, metodo) {
    return {
      descripcion: data.descripcion || (metodo === "foto" ? "Platillo detectado" : "Comida descrita"),
      calorias: Math.round(Number(data.calorias) || 0),
      proteinas: Math.round(Number(data.proteinas) || 0),
      carbohidratos: Math.round(Number(data.carbohidratos) || 0),
      grasas: Math.round(Number(data.grasas) || 0),
      note: "Estimación generada por IA — puedes ajustarla antes de guardar.",
    };
  }

  // Estimación simulada (usada mientras no haya una API key/proxy real
  // configurado en AI_CONFIG) para que el flujo completo de la app se
  // pueda probar de principio a fin.
  function mockEstimate(metodo, texto) {
    const opciones = [
      { descripcion: "Platillo mixto (estimado)", calorias: 420, proteinas: 22, carbohidratos: 45, grasas: 15 },
      { descripcion: "Comida ligera (estimado)", calorias: 260, proteinas: 14, carbohidratos: 30, grasas: 8 },
      { descripcion: "Comida abundante (estimado)", calorias: 620, proteinas: 30, carbohidratos: 65, grasas: 22 },
    ];
    const pick = opciones[Math.floor(Math.random() * opciones.length)];
    return {
      descripcion: metodo === "texto" && texto ? texto.slice(0, 60) : pick.descripcion,
      calorias: pick.calorias,
      proteinas: pick.proteinas,
      carbohidratos: pick.carbohidratos,
      grasas: pick.grasas,
      note:
        "Estimación DE EJEMPLO (IA no configurada aún — ver AI_CONFIG en app.js). Ajusta los valores antes de guardar.",
    };
  }

  /* ---------- Estado ---------- */
  let state = loadState() || {
    profiles: {
      elena: null, // { edad, estatura, peso, sexo, actividad, metaPeso, bmr, tdee, deficit, dailyCal, weightLog:[], foodLog:[{date, items:[]}], streak, lastCheckIn, stravaConnected }
      lucas: null,
    },
    currentProfile: null,
  };

  // Onboarding buffer (datos que se van llenando durante los 5 pasos)
  let ob = {
    profileKey: null,
    edad: null,
    estatura: null,
    peso: null,
    metaPeso: null,
    actividad: null,
  };

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("No se pudo guardar el estado de Lumo:", e);
    }
    if (state.currentProfile) pushProfileToCloud(state.currentProfile);
  }

  /* ============================================================
     CÁLCULOS DE SALUD — Mifflin-St Jeor + tope de déficit seguro
     ============================================================ */

  // BMR (Mifflin-St Jeor)
  function calcBMR(sexo, pesoKg, estaturaCm, edad) {
    const base = 10 * pesoKg + 6.25 * estaturaCm - 5 * edad;
    return sexo === "male" ? base + 5 : base - 161;
  }

  function calcBMI(pesoKg, estaturaCm) {
    const m = estaturaCm / 100;
    return pesoKg / (m * m);
  }

  function bmiLabel(bmi) {
    if (bmi < 18.5) return "Bajo peso";
    if (bmi < 25) return "Saludable";
    if (bmi < 30) return "Sobrepeso";
    return "Obesidad";
  }

  /**
   * Calcula el déficit calórico diario SEGURO, respetando:
   *  - Tope duro: 1000 kcal/día
   *  - Tope relativo: 1% del peso corporal por semana
   *    (1 kg de grasa ≈ 7700 kcal → 1% peso/semana en kcal/día)
   *  - Piso mínimo de calorías diarias por sexo (nunca se cruza,
   *    aunque eso signifique reducir el déficit solicitado)
   */
  function calcSafeDeficit(pesoKg, tdee, sexo, ritmoDeseadoKgSemana) {
    const KCAL_POR_KG_GRASA = 7700;
    const TOPE_DURO_DIA = 1000;
    const TOPE_MIN_DIA = 0; // nunca superávit forzado
    const FLOOR_CAL = sexo === "male" ? 1500 : 1200;

    // Tope por 1% del peso corporal a la semana
    const topePorPeso = (pesoKg * 0.01 * KCAL_POR_KG_GRASA) / 7;

    // Déficit deseado según el ritmo que pidió el usuario (o 0.75 kg/sem por defecto)
    const ritmo = ritmoDeseadoKgSemana || 0.75;
    const deficitDeseado = (ritmo * KCAL_POR_KG_GRASA) / 7;

    // Aplicar el tope MÁS ESTRICTO de los dos (nunca dejar que el usuario
    // elija un ritmo más agresivo, sin importar qué tan motivado esté)
    let deficit = Math.min(deficitDeseado, TOPE_DURO_DIA, topePorPeso);
    deficit = Math.max(deficit, TOPE_MIN_DIA);

    // Verificar el piso de calorías mínimas: si el déficit deja el consumo
    // diario por debajo del piso seguro, se recorta el déficit (nunca el piso)
    let dailyCal = tdee - deficit;
    if (dailyCal < FLOOR_CAL) {
      dailyCal = FLOOR_CAL;
      deficit = tdee - dailyCal;
      if (deficit < 0) deficit = 0; // por si el TDEE ya es muy bajo
    }

    return {
      deficit: Math.round(deficit),
      dailyCal: Math.round(dailyCal),
      floor: FLOOR_CAL,
      capped: deficit < deficitDeseado - 1,
    };
  }

  function weeksToGoal(pesoActual, pesoMeta, deficitDia) {
    const diffKg = Math.abs(pesoActual - pesoMeta);
    if (diffKg < 0.05 || deficitDia <= 0) return 0;
    const kcalTotales = diffKg * 7700;
    const semanas = kcalTotales / (deficitDia * 7);
    return Math.max(1, Math.round(semanas));
  }

  function weighSuggestionText(sexo) {
    return "Pésate a la misma hora, idealmente en ayunas, 1 o 2 veces por semana. El peso fluctúa día a día por agua y digestión — lo que importa es la tendencia, no el número de hoy.";
  }

  /* ============================================================
     UTILIDADES DE UI
     ============================================================ */

  function $(id) {
    return document.getElementById(id);
  }
  function $$(sel, ctx) {
    return Array.from((ctx || document).querySelectorAll(sel));
  }

  function showScreen(id) {
    $$(".screen").forEach((s) => s.classList.remove("active"));
    $(id).classList.add("active");
  }

  function showObStep(step) {
    $$(".ob-step").forEach((s) => s.classList.remove("active"));
    const target = document.querySelector('.ob-step[data-step="' + step + '"]');
    if (target) target.classList.add("active");
  }

  function showView(name) {
    $$(".view").forEach((v) => v.classList.remove("active"));
    const target = document.querySelector('.view[data-view="' + name + '"]');
    if (target) target.classList.add("active");
    $$(".tab-btn").forEach((b) => {
      const active = b.getAttribute("data-view") === name;
      b.classList.toggle("text-primary", active);
      b.classList.toggle("font-bold", active);
      b.classList.toggle("text-on-surface-variant", !active);
    });
    const labels = { inicio: "Inicio", ejercicio: "Ejercicio", perfil: "Perfil" };
    $("header-label").textContent = labels[name] || "Lumo";
  }

  function todayKey() {
    return new Date().toISOString().slice(0, 10);
  }

  function fmt(n, decimals) {
    if (n === null || n === undefined || isNaN(n)) return "—";
    return Number(n).toFixed(decimals === undefined ? 1 : decimals).replace(/\.0$/, "");
  }

  /* ============================================================
     PASO 1 — Selección de perfil
     ============================================================ */

  function selectOnboardingProfile(key) {
    ob.profileKey = key;
    ["elena", "lucas"].forEach((k) => {
      const selected = k === key;
      // Liss (elena) usa el tema rosa (primary); Iker (lucas) usa el tema azul (secondary)
      const colorBg = k === "elena" ? "bg-primary" : "bg-secondary";
      const colorText = k === "elena" ? "text-on-primary" : "text-on-secondary";

      $("icon-" + k).textContent = selected ? "check_circle" : "radio_button_unchecked";
      $("text-" + k).textContent = selected ? "Seleccionado" : "Seleccionar";
      $("strip-" + k).classList.toggle("hidden", !selected);
      const card = $("profile-card-" + k);
      card.classList.toggle("opacity-80", !selected);
      card.classList.toggle("profile-card-selected", selected);

      const btn = $("btn-" + k);
      btn.classList.toggle(colorBg, selected);
      btn.classList.toggle(colorText, selected);
      btn.classList.toggle("bg-surface-container", !selected);
      btn.classList.toggle("text-on-surface", !selected);
    });
    const submitBtn = $("submit-profile-btn");
    submitBtn.disabled = false;
    submitBtn.classList.remove("bg-surface-container", "text-on-surface-variant");
    submitBtn.classList.add("bg-primary", "text-on-primary");
  }

  /* ============================================================
     PASO 2 — Datos esenciales
     ============================================================ */

  function enterStep2() {
    const meta = PROFILE_META[ob.profileKey];
    $("ob2-config-name").textContent = "Configurando perfil de " + meta.name;
    setMascot("ob2-avatar", ob.profileKey);
    showObStep(2);
  }

  function submitDatos() {
    const edad = parseFloat($("edad-input").value);
    const estatura = parseFloat($("estatura-input").value);
    const peso = parseFloat($("peso-input").value);

    if (!edad || !estatura || !peso) {
      shake($("submit-datos-btn"));
      return;
    }
    ob.edad = edad;
    ob.estatura = estatura;
    ob.peso = peso;
    ob.metaPeso = Math.round((peso - 5) * 2) / 2; // sugerencia inicial: -5kg

    enterStep3();
  }

  function shake(el) {
    el.animate(
      [
        { transform: "translateX(0)" },
        { transform: "translateX(-6px)" },
        { transform: "translateX(6px)" },
        { transform: "translateX(0)" },
      ],
      { duration: 250 }
    );
  }

  /* ============================================================
     PASO 3 — IMC y meta de peso
     ============================================================ */

  function enterStep3() {
    const bmi = calcBMI(ob.peso, ob.estatura);
    $("ob3-bmi-value").textContent = fmt(bmi, 1);
    $("ob3-bmi-label").textContent = bmiLabel(bmi);
    $("ob3-current-weight-label").textContent = "Peso actual: " + fmt(ob.peso, 1) + " kg";
    setMascot("ob3-avatar", ob.profileKey);
    updateStep3Target();
    showObStep(3);
  }

  function updateStep3Target() {
    $("target-weight-val").textContent = fmt(ob.metaPeso, 1);
    const diff = ob.metaPeso - ob.peso;
    if (Math.abs(diff) < 0.05) {
      $("diff-text").textContent = "Mantener peso actual";
      $("mascot-speech").textContent =
        "Mantener tu peso también es una meta válida. Vamos a enfocarnos en energía y hábitos.";
    } else if (diff < 0) {
      $("diff-text").textContent = fmt(diff, 1) + " kg";
      $("mascot-speech").textContent =
        "Iremos a tu propio ritmo, sin prisas ni restricciones extremas. Cada semana cuenta.";
    } else {
      $("diff-text").textContent = "+" + fmt(diff, 1) + " kg";
      $("mascot-speech").textContent =
        "Ganar peso de forma saludable también se planea con calma. Vamos paso a paso.";
    }
  }

  function adjustTarget(delta) {
    ob.metaPeso = Math.round((ob.metaPeso + delta) * 2) / 2;
    updateStep3Target();
  }

  /* ============================================================
     PASO 4 — Nivel de actividad
     ============================================================ */

  function selectActivity(card) {
    $$(".activity-card").forEach((c) => {
      c.classList.remove("ring-2", "ring-primary");
      c.querySelector(".check-badge").classList.add("opacity-0");
      c.querySelector(".icon-box").classList.remove("bg-primary-fixed", "text-primary");
    });
    card.classList.add("ring-2", "ring-primary");
    card.querySelector(".check-badge").classList.remove("opacity-0");
    card.querySelector(".icon-box").classList.add("bg-primary-fixed", "text-primary");
    ob.actividad = parseFloat(card.getAttribute("data-val"));

    const btn = $("submit-actividad-btn");
    btn.disabled = false;
    btn.classList.remove("bg-surface-container", "text-on-surface-variant");
    btn.classList.add("bg-primary", "text-on-primary");
  }

  /* ============================================================
     PASO 5 — Resumen del plan (aquí se aplica el tope de déficit)
     ============================================================ */

  function enterStep5() {
    const meta = PROFILE_META[ob.profileKey];
    const bmr = calcBMR(meta.sex, ob.peso, ob.estatura, ob.edad);
    const tdee = bmr * ob.actividad;
    const bmi = calcBMI(ob.peso, ob.estatura);

    const { deficit, dailyCal, capped } = calcSafeDeficit(ob.peso, tdee, meta.sex, 0.75);
    const weeks = weeksToGoal(ob.peso, ob.metaPeso, ob.metaPeso < ob.peso ? deficit : 0);

    $("ob5-bmi").textContent = fmt(bmi, 1);
    $("ob5-bmi-label").textContent = bmiLabel(bmi);
    $("ob5-tdee").textContent = Math.round(tdee);
    $("ob5-daily-cal").textContent = Math.round(dailyCal);
    $("ob5-deficit").textContent = ob.metaPeso < ob.peso ? deficit : 0;
    $("ob5-weeks").textContent = ob.metaPeso < ob.peso ? weeks : "—";

    // Guardar todo para cuando se pulse "Ir a mi dashboard"
    ob._computed = { bmr, tdee, bmi, deficit, dailyCal, capped, weeks };

    showObStep(5);
  }

  function finishOnboarding() {
    const key = ob.profileKey;
    const c = ob._computed;
    state.profiles[key] = {
      edad: ob.edad,
      estatura: ob.estatura,
      sexo: PROFILE_META[key].sex,
      peso: ob.peso,
      pesoInicial: ob.peso,
      metaPeso: ob.metaPeso,
      actividad: ob.actividad,
      bmr: c.bmr,
      tdee: c.tdee,
      deficit: c.deficit,
      dailyCal: c.dailyCal,
      weightLog: [{ date: todayKey(), peso: ob.peso }],
      // { "YYYY-MM-DD": [{ tipo, metodo, descripcion, calorias, proteinas,
      //                     carbohidratos, grasas, timestamp }] }
      foodLog: {},
      streak: 0,
      lastCheckIn: null,
      stravaConnected: false,
    };
    state.currentProfile = key;
    saveState();
    enterApp(key);
  }

  /* ============================================================
     APP — pantalla principal
     ============================================================ */

  function enterApp(key) {
    state.currentProfile = key;
    saveState();
    $("tabbar").classList.remove("hidden");
    showScreen("screen-app");
    showView("inicio");
    renderAll();
  }

  function currentData() {
    return state.profiles[state.currentProfile];
  }

  function renderAll() {
    renderHeader();
    renderHome();
    renderEjercicio();
    renderPerfil();
  }

  function renderHeader() {
    const meta = PROFILE_META[state.currentProfile];
    $("header-avatar").alt = "Avatar de " + meta.name;
    setMascot("header-avatar", state.currentProfile);
  }

  function renderHome() {
    const data = currentData();
    const meta = PROFILE_META[state.currentProfile];
    if (!data) return;

    $("home-greeting").textContent = "¡Hola, " + meta.name + "!";
    setMascot("home-avatar", state.currentProfile);
    setMascot("progress-avatar", state.currentProfile);
    $("streak-count").textContent = data.streak;

    const checkedToday = data.lastCheckIn === todayKey();
    $("streak-hint").textContent = checkedToday
      ? "¡Ya cumpliste tu meta de hoy! Nos vemos mañana."
      : "Cumple tu meta de hoy para mantenerla.";
    $("streakLabel").textContent = checkedToday ? "Cumplido hoy" : "Marcar hoy como cumplido";
    $("streakIcon").textContent = checkedToday ? "check_circle" : "done";
    $("check-in-btn").classList.toggle("opacity-60", checkedToday);

    // Progreso hacia la meta
    const totalDist = Math.abs(data.pesoInicial - data.metaPeso) || 1;
    const avanzado = Math.abs(data.pesoInicial - data.peso);
    const pct = Math.min(100, Math.round((avanzado / totalDist) * 100));
    $("progress-pct").textContent = pct;
    $("progress-fill").style.width = pct + "%";
    $("mascot-runner").style.left = pct + "%";
    $("mascot-bubble").textContent = fmt(data.peso, 1) + " kg";
    $("progress-current").textContent = "Inicio: " + fmt(data.pesoInicial, 1) + " kg";
    $("progress-goal").textContent = "Meta: " + fmt(data.metaPeso, 1) + " kg";
    $("stat-current-weight").textContent = fmt(data.peso, 1) + " kg";
    $("stat-lost").textContent = fmt(Math.abs(data.pesoInicial - data.peso), 1) + " kg";

    // Comparativa de pareja (Dúo Lumo) — slot A siempre Liss (mascota rosa fija
    // en el HTML), slot B siempre Iker (mascota azul fija), para que coincidan
    // con las imágenes ya incrustadas en esa sección
    const lissData = state.profiles.elena;
    const ikerData = state.profiles.lucas;
    $("vs-name-a").textContent = PROFILE_META.elena.name;
    $("vs-streak-a").textContent = lissData
      ? lissData.streak + (lissData.streak === 1 ? " día" : " días")
      : "Sin datos";
    $("vs-name-b").textContent = PROFILE_META.lucas.name;
    $("vs-streak-b").textContent = ikerData
      ? ikerData.streak + (ikerData.streak === 1 ? " día" : " días")
      : "Sin datos";

    renderFoodLog();
  }

  const MEAL_TYPE_ICONS = {
    desayuno: "wb_twilight",
    comida: "lunch_dining",
    cena: "dinner_dining",
    snack: "cookie",
  };

  function renderFoodLog() {
    const data = currentData();
    if (!data) return;
    const today = todayKey();
    const items = data.foodLog[today] || [];
    const consumed = items.reduce((sum, i) => sum + (i.calorias ?? i.kcal ?? 0), 0);
    const remaining = Math.max(0, data.dailyCal - consumed);
    const pct = Math.min(100, Math.round((consumed / data.dailyCal) * 100));

    $("cal-remaining").textContent = remaining + " kcal restantes";
    $("cal-fill").style.width = pct + "%";

    const list = $("food-log");
    list.innerHTML = "";
    if (items.length === 0) {
      const li = document.createElement("li");
      li.className = "font-body-sm text-body-sm text-on-surface-variant text-center py-2";
      li.textContent = "Aún no registras comidas hoy.";
      list.appendChild(li);
    } else {
      items.forEach((item, idx) => {
        // Compatibilidad con registros antiguos (formato { name, kcal })
        const desc = item.descripcion ?? item.name ?? "Comida";
        const kcal = item.calorias ?? item.kcal ?? 0;
        const tipo = item.tipo || "snack";
        const icon = MEAL_TYPE_ICONS[tipo] || "restaurant";
        const li = document.createElement("li");
        li.className =
          "flex items-center gap-space-xs bg-surface-container-low rounded-DEFAULT px-3 py-2";
        li.innerHTML =
          '<span class="material-symbols-outlined text-[18px] text-on-surface-variant shrink-0">' +
          icon +
          '</span><span class="font-body-sm text-body-sm text-on-surface flex-1 truncate">' +
          escapeHtml(desc) +
          '</span><span class="font-label-md text-label-md text-on-surface-variant shrink-0">' +
          Math.round(kcal) +
          '</span>' +
          '<div class="flex items-center gap-0.5 shrink-0">' +
          '<button type="button" class="w-7 h-7 rounded-full flex items-center justify-center text-on-surface-variant" data-action="edit" data-index="' +
          idx +
          '" aria-label="Editar"><span class="material-symbols-outlined text-[16px]">edit</span></button>' +
          '<button type="button" class="w-7 h-7 rounded-full flex items-center justify-center text-on-surface-variant" data-action="delete" data-index="' +
          idx +
          '" aria-label="Eliminar"><span class="material-symbols-outlined text-[16px]">delete</span></button>' +
          "</div>";
        list.appendChild(li);
      });
    }
  }

  function handleFoodLogClick(e) {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const index = parseInt(btn.getAttribute("data-index"), 10);
    const action = btn.getAttribute("data-action");
    if (action === "edit") openFoodModalForEdit(index);
    else if (action === "delete") deleteFoodEntry(index);
  }

  function deleteFoodEntry(index) {
    const data = currentData();
    const today = todayKey();
    const items = data.foodLog[today] || [];
    const item = items[index];
    if (!item) return;
    const desc = item.descripcion ?? item.name ?? "este registro";
    if (!confirm('¿Eliminar "' + desc + '" de tu registro de hoy?')) return;
    items.splice(index, 1);
    saveState();
    renderFoodLog();
  }

  function escapeHtml(s) {
    const div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  /* ============================================================
     MODAL DE REGISTRO DE COMIDA (Foto IA / Lista / Texto IA)
     ============================================================ */

  let foodModal = {
    mealType: "desayuno",
    method: "lista",
    photoBase64: null, // sin el prefijo data:...;base64,
    draft: null, // { descripcion, calorias, proteinas, carbohidratos, grasas }
    editingIndex: null, // índice dentro de foodLog[today] si se está editando, o null si es nuevo
  };

  function openFoodModal(defaultMethod) {
    foodModal.mealType = getMealTypeByHour();
    foodModal.method = defaultMethod || "lista";
    foodModal.photoBase64 = null;
    foodModal.draft = null;
    foodModal.editingIndex = null;
    $("food-modal-mode-label").textContent = "Registrar comida";
    $("food-save-label").textContent = "Guardar registro";

    selectMealType(foodModal.mealType);
    selectFoodMethod(foodModal.method);
    resetPhotoPanel();
    $("food-text-input").value = "";
    $("text-analyze-btn").disabled = true;
    $("food-search-input").value = "";
    renderFoodListResults("");
    hideResultCard();

    $("food-modal-backdrop").classList.add("active");
    $("food-modal-backdrop").classList.remove("hidden");
  }

  // Abre el modal directamente sobre la tarjeta de resultado, con los
  // datos de un registro ya existente cargados para poder ajustarlos.
  function openFoodModalForEdit(index) {
    const data = currentData();
    const items = data.foodLog[todayKey()] || [];
    const item = items[index];
    if (!item) return;

    foodModal.mealType = item.tipo || getMealTypeByHour();
    foodModal.method = item.metodo || "lista";
    foodModal.photoBase64 = null;
    foodModal.editingIndex = index;
    $("food-modal-mode-label").textContent = "Editar comida";
    $("food-save-label").textContent = "Guardar cambios";

    selectMealType(foodModal.mealType);
    selectFoodMethod(foodModal.method);
    resetPhotoPanel();
    $("food-text-input").value = "";
    $("text-analyze-btn").disabled = true;
    $("food-search-input").value = "";
    renderFoodListResults("");

    showResultCard(
      {
        descripcion: item.descripcion ?? item.name ?? "",
        calorias: item.calorias ?? item.kcal ?? 0,
        proteinas: item.proteinas ?? 0,
        carbohidratos: item.carbohidratos ?? 0,
        grasas: item.grasas ?? 0,
        note: "Editando un registro ya guardado. Ajusta lo que necesites.",
      },
      "Editando registro"
    );

    $("food-modal-backdrop").classList.add("active");
    $("food-modal-backdrop").classList.remove("hidden");
  }

  function closeFoodModal() {
    $("food-modal-backdrop").classList.remove("active");
    $("food-modal-backdrop").classList.add("hidden");
  }

  function selectMealType(tipo) {
    foodModal.mealType = tipo;
    $("food-modal-title").textContent = MEAL_TYPE_LABELS[tipo];
    $$(".meal-type-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-meal") === tipo);
    });
  }

  function selectFoodMethod(method) {
    foodModal.method = method;
    $$(".food-method-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-method") === method);
    });
    $$(".food-method-panel").forEach((panel) => {
      const active = panel.getAttribute("data-method-panel") === method;
      panel.classList.toggle("hidden", !active);
      panel.classList.toggle("flex", active);
    });
    hideResultCard();
  }

  function resetPhotoPanel() {
    $("photo-preview").classList.add("hidden");
    $("photo-preview").src = "";
    $("photo-placeholder-icon").classList.remove("hidden");
    $("photo-placeholder-text").classList.remove("hidden");
    $("photo-placeholder-text").textContent = "Toma o sube una foto de tu platillo";
    $("photo-analyze-btn").disabled = true;
    $("photo-input").value = "";
    $("photo-size-info").classList.add("hidden");
    $("photo-size-info").classList.remove("flex");
  }

  // Redimensiona y comprime la imagen en el navegador (canvas) antes de
  // convertirla a base64. Esto evita mandar fotos de varios MB (las que
  // salen directo de la cámara del celular) a la API de IA — son más
  // lentas de subir, cuestan más tokens/cuota, y no aportan mejor
  // estimación que una versión más chica.
  function compressImage(file, maxDim, quality) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > height && width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else if (height >= width && height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.onerror = () => reject(new Error("No se pudo leer la imagen"));
        img.src = reader.result;
      };
      reader.onerror = () => reject(new Error("No se pudo leer el archivo"));
      reader.readAsDataURL(file);
    });
  }

  function estimateKBFromBase64(base64) {
    return Math.round(((base64.length * 3) / 4) / 1024);
  }

  async function handlePhotoSelected(file) {
    if (!file) return;
    $("photo-placeholder-text").textContent = "Comprimiendo imagen…";
    $("photo-placeholder-icon").classList.remove("hidden");
    $("photo-placeholder-text").classList.remove("hidden");
    $("photo-preview").classList.add("hidden");
    $("photo-size-info").classList.add("hidden");

    try {
      // Máx. 1024px en el lado más largo, calidad JPEG 72% — de sobra
      // para que un modelo de visión reconozca ingredientes y porciones.
      const dataUrl = await compressImage(file, 1024, 0.72);
      const base64 = String(dataUrl).split(",")[1] || null;
      foodModal.photoBase64 = base64;

      $("photo-preview").src = dataUrl;
      $("photo-preview").classList.remove("hidden");
      $("photo-placeholder-icon").classList.add("hidden");
      $("photo-placeholder-text").classList.add("hidden");
      $("photo-analyze-btn").disabled = false;

      const kb = base64 ? estimateKBFromBase64(base64) : 0;
      $("photo-size-text").textContent = "Imagen lista para analizar (~" + kb + " KB)";
      $("photo-size-info").classList.remove("hidden");
      $("photo-size-info").classList.add("flex");
    } catch (err) {
      console.warn("No se pudo procesar la imagen:", err);
      $("photo-placeholder-text").textContent =
        "No se pudo procesar esa imagen. Intenta con otra foto.";
      $("photo-placeholder-icon").classList.remove("hidden");
      $("photo-placeholder-text").classList.remove("hidden");
      $("photo-analyze-btn").disabled = true;
    }
  }

  async function runPhotoAnalysis() {
    if (!foodModal.photoBase64) return;
    const btn = $("photo-analyze-btn");
    const label = $("photo-analyze-label");
    btn.disabled = true;
    const original = label.textContent;
    label.textContent = "Analizando…";
    try {
      const result = await analyzeImageWithAI(foodModal.photoBase64);
      showResultCard(result, "Estimado por IA (foto)");
    } finally {
      label.textContent = original;
      btn.disabled = false;
    }
  }

  async function runTextAnalysis() {
    const texto = $("food-text-input").value.trim();
    if (!texto) return;
    const btn = $("text-analyze-btn");
    const label = $("text-analyze-label");
    btn.disabled = true;
    const original = label.textContent;
    label.textContent = "Estimando…";
    try {
      const result = await analyzeTextWithAI(texto);
      showResultCard(result, "Estimado por IA (texto)");
    } finally {
      label.textContent = original;
      btn.disabled = false;
    }
  }

  function renderFoodListResults(filterText) {
    const list = $("food-list-results");
    const filtered = FOOD_DATABASE.filter((f) =>
      f.name.toLowerCase().includes((filterText || "").toLowerCase())
    );
    list.innerHTML = "";
    if (filtered.length === 0) {
      const empty = document.createElement("div");
      empty.className = "font-body-sm text-body-sm text-on-surface-variant text-center py-3";
      empty.textContent = "No se encontraron alimentos con ese nombre.";
      list.appendChild(empty);
      return;
    }
    filtered.forEach((food) => {
      const row = document.createElement("button");
      row.type = "button";
      row.className =
        "food-list-item w-full flex items-center justify-between gap-space-sm bg-surface-container-low rounded-DEFAULT px-3 py-2.5 text-left";
      row.innerHTML =
        '<span class="font-body-sm text-body-sm text-on-surface flex-1">' +
        escapeHtml(food.name) +
        '</span><span class="font-label-md text-label-md text-on-surface-variant shrink-0">' +
        food.kcal +
        " kcal</span>";
      row.addEventListener("click", () => {
        showResultCard(
          {
            descripcion: food.name,
            calorias: food.kcal,
            proteinas: food.protein,
            carbohidratos: food.carbs,
            grasas: food.fat,
            note: "Valor de referencia de la base de alimentos de Lumo.",
          },
          "De la lista de alimentos"
        );
      });
      list.appendChild(row);
    });
  }

  function showResultCard(result, sourceLabel) {
    foodModal.draft = result;
    $("food-result-source").textContent = sourceLabel || "Estimación";
    $("result-name-input").value = result.descripcion || "";
    $("result-kcal-input").value = result.calorias || 0;
    $("result-protein-input").value = result.proteinas || 0;
    $("result-carbs-input").value = result.carbohidratos || 0;
    $("result-fat-input").value = result.grasas || 0;
    $("food-result-note").textContent = result.note || "";
    const card = $("food-result-card");
    card.classList.remove("hidden");
    card.classList.add("flex");
    card.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function hideResultCard() {
    foodModal.draft = null;
    const card = $("food-result-card");
    card.classList.add("hidden");
    card.classList.remove("flex");
  }

  function saveFoodEntry() {
    const descripcion = $("result-name-input").value.trim();
    const calorias = parseInt($("result-kcal-input").value, 10);
    if (!descripcion || !calorias || calorias <= 0) {
      shake($("food-save-btn"));
      return;
    }

    const data = currentData();
    const today = todayKey();
    if (!data.foodLog[today]) data.foodLog[today] = [];

    const macros = {
      proteinas: parseInt($("result-protein-input").value, 10) || 0,
      carbohidratos: parseInt($("result-carbs-input").value, 10) || 0,
      grasas: parseInt($("result-fat-input").value, 10) || 0,
    };

    if (foodModal.editingIndex !== null && data.foodLog[today][foodModal.editingIndex]) {
      // Edición de un registro existente: se conserva su timestamp original.
      const existing = data.foodLog[today][foodModal.editingIndex];
      data.foodLog[today][foodModal.editingIndex] = Object.assign({}, existing, {
        tipo: foodModal.mealType,
        metodo: foodModal.method,
        descripcion: descripcion,
        calorias: calorias,
        proteinas: macros.proteinas,
        carbohidratos: macros.carbohidratos,
        grasas: macros.grasas,
      });
    } else {
      data.foodLog[today].push({
        tipo: foodModal.mealType,
        metodo: foodModal.method,
        descripcion: descripcion,
        calorias: calorias,
        proteinas: macros.proteinas,
        carbohidratos: macros.carbohidratos,
        grasas: macros.grasas,
        timestamp: new Date().toISOString(),
      });
    }

    saveState();
    renderFoodLog();
    closeFoodModal();
  }

  function toggleCheckIn() {
    const data = currentData();
    const today = todayKey();
    if (data.lastCheckIn === today) return; // ya marcado
    data.streak += 1;
    data.lastCheckIn = today;
    saveState();
    renderHome();
  }

  /* ---------- Vista Ejercicio ---------- */

  function renderEjercicio() {
    const data = currentData();
    if (!data) return;
    $("strava-status").textContent = data.stravaConnected ? "Conectado" : "No conectado";
    $("strava-btn").textContent = data.stravaConnected ? "Desconectar" : "Conectar";

    const grid = $("muscle-grid");
    grid.innerHTML = "";
    MUSCLE_GROUPS.forEach((g) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className =
        "muscle-card flex flex-col items-center gap-1.5 bg-surface-container-lowest rounded-lg p-space-sm shadow-sm";
      card.setAttribute("data-muscle", g.id);
      card.innerHTML =
        '<div class="w-11 h-11 rounded-full bg-surface-container flex items-center justify-center text-primary"><span class="material-symbols-outlined text-[22px]">' +
        g.icon +
        '</span></div><span class="font-label-lg text-label-lg text-on-surface">' +
        g.label +
        "</span>";
      card.addEventListener("click", () => showRoutine(g.id));
      grid.appendChild(card);
    });
  }

  function showRoutine(muscleId) {
    const group = MUSCLE_GROUPS.find((g) => g.id === muscleId);
    const box = $("routine-detail");
    if (!group) {
      box.classList.add("hidden");
      return;
    }
    box.classList.remove("hidden");
    box.classList.add("flex");
    box.innerHTML =
      '<div class="bg-surface-container-lowest rounded-lg p-space-md shadow-sm flex flex-col gap-space-xs"><h4 class="font-headline-sm text-headline-sm text-on-surface mb-1">' +
      group.label +
      "</h4>" +
      group.ejercicios
        .map(
          (e) =>
            '<div class="flex items-center gap-space-xs bg-surface-container-low rounded-DEFAULT px-3 py-2"><span class="material-symbols-outlined text-primary text-[18px]">check_circle</span><span class="font-body-sm text-body-sm text-on-surface">' +
            e +
            "</span></div>"
        )
        .join("") +
      "</div>";
  }

  function toggleStrava() {
    const data = currentData();
    data.stravaConnected = !data.stravaConnected;
    saveState();
    renderEjercicio();
    if (data.stravaConnected) {
      alert(
        "Conexión con Strava simulada. En producción, este botón inicia el flujo OAuth real de la API pública de Strava."
      );
    }
  }

  /* ---------- Vista Perfil ---------- */

  let pesoDraft = null;

  function renderPerfil() {
    const data = currentData();
    const meta = PROFILE_META[state.currentProfile];
    if (!data) return;

    $("profile-name").textContent = meta.name;
    $("profile-badge").textContent = meta.badge;
    setMascot("profile-avatar", state.currentProfile);
    $("stat-weight").textContent = fmt(data.peso, 1) + " kg";
    $("stat-goal").textContent = fmt(data.metaPeso, 1) + " kg";
    $("stat-bmi").textContent = fmt(calcBMI(data.peso, data.estatura), 1);
    $("stat-cal").textContent = data.dailyCal + " kcal";
    $("weigh-suggestion").textContent = weighSuggestionText(data.sexo);

    if (pesoDraft === null) pesoDraft = data.peso;
    $("weight-value").textContent = fmt(pesoDraft, 1);
  }

  function adjustWeightDraft(delta) {
    pesoDraft = Math.round((pesoDraft + delta) * 10) / 10;
    $("weight-value").textContent = fmt(pesoDraft, 1);
  }

  function saveWeight() {
    const data = currentData();
    data.peso = pesoDraft;
    data.weightLog.push({ date: todayKey(), peso: pesoDraft });

    // Recalcular TDEE / déficit / meta calórica con el nuevo peso
    const meta = PROFILE_META[state.currentProfile];
    const tdee = calcBMR(meta.sex, data.peso, data.estatura, data.edad) * data.actividad;
    const { deficit, dailyCal } = calcSafeDeficit(data.peso, tdee, meta.sex, 0.75);
    data.tdee = tdee;
    data.deficit = deficit;
    data.dailyCal = dailyCal;

    saveState();

    const btn = $("save-weight-btn");
    const label = $("save-text");
    const original = label.textContent;
    label.textContent = "¡Guardado!";
    setTimeout(() => {
      label.textContent = original;
    }, 1500);

    renderAll();
  }

  function resetApp() {
    if (!confirm("Esto borrará todos los datos de prueba de ambos perfiles (en este celular y en la nube). ¿Continuar?")) return;
    localStorage.removeItem(STORAGE_KEY);
    if (db) {
      Promise.all(
        ["elena", "lucas"].map((k) => db.collection("profiles").doc(k).delete().catch(() => {}))
      ).finally(() => location.reload());
    } else {
      location.reload();
    }
  }

  /* ---------- Cambiar de perfil ---------- */

  function switchProfile() {
    const other = state.currentProfile === "elena" ? "lucas" : "elena";
    if (state.profiles[other]) {
      pesoDraft = null;
      enterApp(other);
    } else {
      // El otro perfil no tiene onboarding hecho: lo mandamos a crearlo
      ob = { profileKey: null, edad: null, estatura: null, peso: null, metaPeso: null, actividad: null };
      showScreen("screen-onboarding");
      showObStep(1);
      selectOnboardingProfile(other);
    }
  }

  /* ============================================================
     WIRING DE EVENTOS
     ============================================================ */

  function init() {
    // Paso 1
    $("profile-card-elena").addEventListener("click", () => selectOnboardingProfile("elena"));
    $("profile-card-lucas").addEventListener("click", () => selectOnboardingProfile("lucas"));
    $("submit-profile-btn").addEventListener("click", () => {
      if (!ob.profileKey) return;
      enterStep2();
    });

    // Paso 2
    $("submit-datos-btn").addEventListener("click", submitDatos);

    // Paso 3
    $("btn-decrease").addEventListener("click", () => adjustTarget(-0.5));
    $("btn-increase").addEventListener("click", () => adjustTarget(0.5));
    $("submit-meta-btn").addEventListener("click", () => showObStep(4));

    // Paso 4
    $$(".activity-card").forEach((card) => {
      card.addEventListener("click", () => selectActivity(card));
    });
    $("submit-actividad-btn").addEventListener("click", () => {
      if (!ob.actividad) return;
      enterStep5();
    });

    // Paso 5
    $("finish-onboarding").addEventListener("click", finishOnboarding);

    // Botones "Atrás"
    $$(".back-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        showObStep(btn.getAttribute("data-back"));
      });
    });

    // Tabbar
    $$(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => showView(btn.getAttribute("data-view")));
    });

    // Home
    $("check-in-btn").addEventListener("click", toggleCheckIn);
    $("add-food-manual").addEventListener("click", () => openFoodModal("lista"));
    $("add-food-photo").addEventListener("click", () => openFoodModal("foto"));
    $("switch-profile").addEventListener("click", switchProfile);
    $("food-log").addEventListener("click", handleFoodLogClick);

    // Modal de registro de comida
    $("food-modal-close").addEventListener("click", closeFoodModal);
    $("food-modal-backdrop").addEventListener("click", (e) => {
      if (e.target === $("food-modal-backdrop")) closeFoodModal();
    });
    $$(".meal-type-btn").forEach((btn) => {
      btn.addEventListener("click", () => selectMealType(btn.getAttribute("data-meal")));
    });
    $$(".food-method-btn").forEach((btn) => {
      btn.addEventListener("click", () => selectFoodMethod(btn.getAttribute("data-method")));
    });
    // Opción A: Foto + IA
    $("photo-dropzone").addEventListener("click", () => $("photo-input").click());
    $("photo-pick-btn").addEventListener("click", () => $("photo-input").click());
    $("photo-input").addEventListener("change", (e) => handlePhotoSelected(e.target.files[0]));
    $("photo-analyze-btn").addEventListener("click", runPhotoAnalysis);
    // Opción B: Lista / base de alimentos
    $("food-search-input").addEventListener("input", (e) => renderFoodListResults(e.target.value));
    // Opción C: Descripción en texto
    $("food-text-input").addEventListener("input", (e) => {
      $("text-analyze-btn").disabled = e.target.value.trim().length === 0;
    });
    $("text-analyze-btn").addEventListener("click", runTextAnalysis);
    // Guardar registro (compartido por las 3 opciones)
    $("food-save-btn").addEventListener("click", saveFoodEntry);

    // Ejercicio
    $("strava-btn").addEventListener("click", toggleStrava);

    // Perfil
    $("btn-minus").addEventListener("click", () => adjustWeightDraft(-0.1));
    $("btn-plus").addEventListener("click", () => adjustWeightDraft(0.1));
    $("save-weight-btn").addEventListener("click", saveWeight);
    $("reset-app").addEventListener("click", resetApp);

    // Quitar el splash del flujo de accesibilidad tras la animación
    setTimeout(() => {
      const splash = $("splash-screen");
      if (splash) splash.style.pointerEvents = "none";
    }, 1400);

    // Conectar con Firebase para la sincronización Dúo Lumo
    initCloud();

    // ¿Ya hay un perfil con onboarding completado? entrar directo a la app
    if (state.currentProfile && state.profiles[state.currentProfile]) {
      $("tabbar").classList.remove("hidden");
      showScreen("screen-app");
      showView("inicio");
      renderAll();
    } else {
      showScreen("screen-onboarding");
      showObStep(1);
    }
  }

  // El script se carga al final del <body>, así que el DOM ya está listo,
  // pero por seguridad esperamos DOMContentLoaded si aún no disparó.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
