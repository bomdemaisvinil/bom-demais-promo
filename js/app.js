/* =========================================================
   BOM DEMAIS VINIL — Configuración
   Para reutilizar esta página en una futura promoción, edita
   ÚNICAMENTE este objeto. Los textos del cartel (eyebrow,
   título, Valencia, fechas, Instagram) son imágenes fijas:
   para cambiarlos, sustituye los archivos en assets/.
   ========================================================= */
const CONFIG = {
  estado: "cerrada",              // "activa" | "cerrada"
  evento: "Bom Demais Vinil",
  urlEntradas: "https://entradium.com/es/events/bom-demais-vinil-2027-valencia-lote-fole",
  urlWhatsapp: "https://chat.whatsapp.com/JyMJoG2I4E84xzDUrPU4Dh",
  proximoLote: {
    es: "13 de septiembre",
    en: "September 13th",
    pt: "13 de setembro"
  }
};

/* =========================================================
   Diccionario de textos (ES / EN / PT) — tarjetas
   ========================================================= */
const I18N = {
  es: {
    "tickets.title": "Comprar entradas",
    "tickets.text": "Accede a la venta de entradas en Entradium.",
    "tickets.cta": "ACCEDER",
    "whatsapp.title": "Grupo oficial de WhatsApp",
    "whatsapp.text": "Recibe avisos, novedades y toda la información del evento.",
    "whatsapp.cta": "UNIRME",
    "soldOut.title": "Lote agotado",
    "soldOut.text": "Las entradas promocionales ya no están disponibles.",
    "soldOut.next": `Siguiente lote early bird: <strong>${CONFIG.proximoLote.es}</strong>, info en nuestro <a href="${CONFIG.urlWhatsapp}" target="_blank" rel="noopener">grupo de WhatsApp</a>.`
  },
  en: {
    "tickets.title": "Buy tickets",
    "tickets.text": "Access ticket sales on Entradium.",
    "tickets.cta": "ENTER",
    "whatsapp.title": "Official WhatsApp group",
    "whatsapp.text": "Get alerts, updates and all the event information.",
    "whatsapp.cta": "JOIN",
    "soldOut.title": "Sold out",
    "soldOut.text": "Promotional tickets are no longer available.",
    "soldOut.next": `Next early bird batch: <strong>${CONFIG.proximoLote.en}</strong>, info in our <a href="${CONFIG.urlWhatsapp}" target="_blank" rel="noopener">WhatsApp group</a>.`
  },
  pt: {
    "tickets.title": "Comprar bilhetes",
    "tickets.text": "Acede à venda de bilhetes na Entradium.",
    "tickets.cta": "ACEDER",
    "whatsapp.title": "Grupo oficial de WhatsApp",
    "whatsapp.text": "Recebe avisos, novidades e toda a informação do evento.",
    "whatsapp.cta": "JUNTAR-ME",
    "soldOut.title": "Lote esgotado",
    "soldOut.text": "Os bilhetes promocionais já não estão disponíveis.",
    "soldOut.next": `Próximo lote early bird: <strong>${CONFIG.proximoLote.pt}</strong>, info no nosso <a href="${CONFIG.urlWhatsapp}" target="_blank" rel="noopener">grupo de WhatsApp</a>.`
  }
};

/* =========================================================
   Estado de idioma
   ========================================================= */
function detectLang(){
  const nav = (navigator.language || "en").toLowerCase();
  if(nav.startsWith("es")) return "es";
  if(nav.startsWith("pt")) return "pt";
  return "en";
}

let currentLang = detectLang();

function applyLang(lang){
  currentLang = lang;
  document.documentElement.setAttribute("lang", lang);

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    const text = I18N[lang][key];
    if(text === undefined) return;
    if(el.hasAttribute("data-i18n-html")){
      el.innerHTML = text;
    } else {
      el.textContent = text;
    }
  });

  document.querySelectorAll(".lang-btn").forEach(btn => {
    const active = btn.dataset.lang === lang;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-pressed", String(active));
  });
}

/* =========================================================
   Estado de la promoción
   ========================================================= */
function applyPromoState(){
  const ticketsCard = document.querySelector('[data-state-card="tickets"]');
  const soldOutCard = document.querySelector('[data-state-card="sold-out"]');
  const whatsappCard = document.querySelector('[data-state-card="whatsapp"]');

  if(CONFIG.estado === "activa"){
    ticketsCard.hidden = false;
    soldOutCard.hidden = true;
    whatsappCard.hidden = false;
  } else {
    ticketsCard.hidden = true;
    soldOutCard.hidden = false;
    whatsappCard.hidden = false; // el WhatsApp se mantiene visible siempre
  }

  const ticketsBtn = document.getElementById("tickets-btn");
  if(ticketsBtn){
    ticketsBtn.href = CONFIG.urlEntradas;
  }

  const whatsappBtn = document.getElementById("whatsapp-btn");
  if(whatsappBtn){
    whatsappBtn.href = CONFIG.urlWhatsapp || "#";
    if(!CONFIG.urlWhatsapp){
      whatsappBtn.setAttribute("aria-disabled", "true");
    }
  }
}

/* =========================================================
   Selector de idioma
   ========================================================= */
document.querySelectorAll(".lang-btn").forEach(btn => {
  btn.addEventListener("click", () => applyLang(btn.dataset.lang));
});

/* =========================================================
   Inicialización
   ========================================================= */
applyLang(currentLang);
applyPromoState();
