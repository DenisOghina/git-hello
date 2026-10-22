// --- Consigli per programmatori (Pixel Café) ---
const consigli = [
  "Fai un commit ogni volta che qualcosa funziona.",
  "Scrivi messaggi di commit che capiresti anche tra sei mesi.",
  "Prima di chiedere aiuto, lancia git status.",
  "Non salvare mai password e chiavi nel repository.",
  "Il caffè non risolve i bug, ma aiuta a cercarli.",
  "Non testare in produzione il venerdì pomeriggio.",
  "Se funziona al primo colpo, controlla meglio: c'è un trucco.",
  "Un buon caffè fa risparmiare ore di debugging."
];

const bottone = document.getElementById("quote-btn");
const testo = document.getElementById("quote");

if (bottone && testo) {
  bottone.addEventListener("click", function () {
    const indice = Math.floor(Math.random() * consigli.length);
    testo.textContent = consigli[indice];
  });
}

// --- Gestione Prenotazione Tavolo ---
document.addEventListener("DOMContentLoaded", function () {
  const dataInput = document.getElementById("data");
  const bookingForm = document.getElementById("booking-form");
  const successBox = document.getElementById("booking-success");
  const summaryBox = document.getElementById("booking-summary");
  const resetBtn = document.getElementById("reset-booking-btn");

  // Imposta la data minima a oggi (formato YYYY-MM-DD)
  if (dataInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const formattedToday = `${yyyy}-${mm}-${dd}`;

    dataInput.min = formattedToday;
    dataInput.value = formattedToday;
  }

  // Invio del form di prenotazione
  if (bookingForm) {
    bookingForm.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!bookingForm.checkValidity()) {
        bookingForm.reportValidity();
        return;
      }

      const nome = document.getElementById("nome").value.trim();
      const email = document.getElementById("email").value.trim();
      const telefono = document.getElementById("telefono").value.trim();
      const ospitiSelect = document.getElementById("ospiti");
      const ospitiText = ospitiSelect.options[ospitiSelect.selectedIndex].text;
      const dataVal = document.getElementById("data").value;
      const oraSelect = document.getElementById("ora");
      const oraText = oraSelect.options[oraSelect.selectedIndex].text;
      const postazioneSelect = document.getElementById("postazione");
      const postazioneText = postazioneSelect ? postazioneSelect.options[postazioneSelect.selectedIndex].text : "Standard";
      const note = document.getElementById("note").value.trim();

      // Formatta la data per una lettura amichevole in italiano
      let dataLeggibile = dataVal;
      try {
        const [y, m, d] = dataVal.split("-");
        const dateObj = new Date(y, m - 1, d);
        dataLeggibile = dateObj.toLocaleDateString("it-IT", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric"
        });
        // Capitalizza la prima lettera del giorno
        dataLeggibile = dataLeggibile.charAt(0).toUpperCase() + dataLeggibile.slice(1);
      } catch (err) {
        dataLeggibile = dataVal;
      }

      // Costruisci il riepilogo
      if (summaryBox) {
        summaryBox.innerHTML = `
          <div class="summary-item">
            <span class="summary-label">Nominativo</span>
            <span class="summary-value">${escapeHtml(nome)}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Persone</span>
            <span class="summary-value">${escapeHtml(ospitiText)}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Data</span>
            <span class="summary-value">${escapeHtml(dataLeggibile)}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Orario</span>
            <span class="summary-value">${escapeHtml(oraText)}</span>
          </div>
          <div class="summary-item full-span">
            <span class="summary-label">Postazione richiesta</span>
            <span class="summary-value">${escapeHtml(postazioneText)}</span>
          </div>
          <div class="summary-item full-span">
            <span class="summary-label">Contatti di conferma</span>
            <span class="summary-value">${escapeHtml(email)} • ${escapeHtml(telefono)}</span>
          </div>
          ${
            note
              ? `<div class="summary-item full-span">
                  <span class="summary-label">Note speciali</span>
                  <span class="summary-value">${escapeHtml(note)}</span>
                </div>`
              : ""
          }
        `;
      }

      // Mostra la schermata di successo
      bookingForm.style.display = "none";
      if (successBox) {
        successBox.style.display = "block";
        successBox.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }

  // Permetti di effettuare una nuova prenotazione
  if (resetBtn && bookingForm && successBox) {
    resetBtn.addEventListener("click", function () {
      bookingForm.reset();
      // Reimposta la data minima a oggi
      if (dataInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const dd = String(today.getDate()).padStart(2, "0");
        dataInput.value = `${yyyy}-${mm}-${dd}`;
      }
      successBox.style.display = "none";
      bookingForm.style.display = "flex";
      bookingForm.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
});

// Funzione helper per sicurezza contro inserimento di codice nei campi
function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
