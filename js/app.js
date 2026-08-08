/* =========================================================
   BOM DEMAIS VINIL — Configuración
   Para reutilizar esta página en una futura promoción, edita
   ÚNICAMENTE este objeto. Los textos del cartel (eyebrow,
   título, Valencia, fechas, Instagram) son imágenes fijas:
   para cambiarlos, sustituye los archivos en assets/.
   ========================================================= */
const CONFIG = {
  estado: "activa",              // "activa" | "cerrada"
  codigo: "BOMD+FOLE",
  evento: "Bom Demais Vinil",
  urlEntradas: "https://entradium.com/es",
  urlWhatsapp: "https://chat.whatsapp.com/JyMJoG2I4E84xzDUrPU4Dh",
  proximoLote: {
    es: "13 de septiembre",
    en: "September 13th",
    pt: "13 de setembro"
  }
};

/* =========================================================
   Diccionario de textos (ES / EN / PT) — solo tarjetas y modal
   ========================================================= */
const I18N = {
  es: {
    "tickets.title": "Comprar entradas",
    "tickets.text": "Introduce el código promocional para acceder al lote.",
    "tickets.cta": "ACCEDER",
    "whatsapp.title": "Grupo oficial de WhatsApp",
    "whatsapp.text": "Recibe avisos, novedades y toda la información del evento.",
    "whatsapp.cta": "UNIRME",
    "soldOut.title": "Lote agotado",
    "soldOut.text": "Las entradas promocionales ya no están disponibles.",
    "soldOut.next": `Siguiente lote early bird: <strong>${CONFIG.proximoLote.es}</strong>, info en nuestro <a href="${CONFIG.urlWhatsapp}" target="_blank" rel="noopener">grupo de WhatsApp</a>.`,
    "modal.title": "Código promocional",
    "modal.label": "Introducir código",
    "modal.cancel": "Cancelar",
    "modal.continue": "Continuar",
    "modal.error": "Código incorrecto. Inténtalo de nuevo.",
    "modal.placeholder": "Tu código"
  },
  en: {
    "tickets.title": "Buy tickets",
    "tickets.text": "Enter the promo code to access the batch.",
    "tickets.cta": "ENTER",
    "whatsapp.title": "Official WhatsApp group",
    "whatsapp.text": "Get alerts, updates and all the event information.",
    "whatsapp.cta": "JOIN",
    "soldOut.title": "Sold out",
    "soldOut.text": "Promotional tickets are no longer available.",
    "soldOut.next": `Next early bird batch: <strong>${CONFIG.proximoLote.en}</strong>, info in our <a href="${CONFIG.urlWhatsapp}" target="_blank" rel="noopener">WhatsApp group</a>.`,
    "modal.title": "Promo code",
    "modal.label": "Enter code",
    "modal.cancel": "Cancel",
    "modal.continue": "Continue",
    "modal.error": "Incorrect code. Please try again.",
    "modal.placeholder": "Your code"
  },
  pt: {
    "tickets.title": "Comprar bilhetes",
    "tickets.text": "Introduz o código promocional para aceder ao lote.",
    "tickets.cta": "ACEDER",
    "whatsapp.title": "Grupo oficial de WhatsApp",
    "whatsapp.text": "Recebe avisos, novidades e toda a informação do evento.",
    "whatsapp.cta": "JUNTAR-ME",
    "soldOut.title": "Lote esgotado",
    "soldOut.text": "Os bilhetes promocionais já não estão disponíveis.",
    "soldOut.next": `Próximo lote early bird: <strong>${CONFIG.proximoLote.pt}</strong>, info no nosso <a href="${CONFIG.urlWhatsapp}" target="_blank" rel="noopener">grupo de WhatsApp</a>.`,
    "modal.title": "Código promocional",
    "modal.label": "Introduzir código",
    "modal.cancel": "Cancelar",
    "modal.continue": "Continuar",
    "modal.error": "Código incorreto. Tenta novamente.",
    "modal.placeholder": "O teu código"
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

  const promoInput = document.getElementById("promo-input");
  if(promoInput) promoInput.placeholder = I18N[lang]["modal.placeholder"];

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

  const whatsappBtn = document.getElementById("whatsapp-btn");
  if(whatsappBtn){
    whatsappBtn.href = CONFIG.urlWhatsapp || "#";
    if(!CONFIG.urlWhatsapp){
      whatsappBtn.setAttribute("aria-disabled", "true");
    }
  }
}

/* =========================================================
   Modal de código promocional
   ========================================================= */
const overlay = document.getElementById("modal-overlay");
const modal = document.getElementById("modal");
const promoInput = document.getElementById("promo-input");
const modalError = document.getElementById("modal-error");
let lastFocused = null;

function openModal(){
  lastFocused = document.activeElement;
  overlay.hidden = false;
  modalError.hidden = true;
  promoInput.value = "";
  promoInput.focus();
  document.addEventListener("keydown", onModalKeydown);
}

function closeModal(){
  overlay.hidden = true;
  document.removeEventListener("keydown", onModalKeydown);
  if(lastFocused) lastFocused.focus();
}

function onModalKeydown(e){
  if(e.key === "Escape"){
    closeModal();
    return;
  }
  if(e.key === "Tab"){
    const focusable = modal.querySelectorAll("button, input");
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if(e.shiftKey && document.activeElement === first){
      e.preventDefault(); last.focus();
    } else if(!e.shiftKey && document.activeElement === last){
      e.preventDefault(); first.focus();
    }
  }
}

function submitCode(){
  const value = promoInput.value.trim().toUpperCase();
  if(value === CONFIG.codigo.toUpperCase()){
    window.open(CONFIG.urlEntradas, "_blank", "noopener");
    closeModal();
  } else {
    modalError.hidden = false;
    promoInput.focus();
    promoInput.select();
  }
}

document.getElementById("open-modal-btn").addEventListener("click", openModal);
document.getElementById("modal-cancel").addEventListener("click", closeModal);
document.getElementById("modal-continue").addEventListener("click", submitCode);
overlay.addEventListener("click", (e) => { if(e.target === overlay) closeModal(); });
promoInput.addEventListener("keydown", (e) => { if(e.key === "Enter") submitCode(); });

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
