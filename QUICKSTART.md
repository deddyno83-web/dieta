# 🚀 QUICKSTART - Dieta & Controlli App

Benvenuto! Ecco come iniziare in 2 minuti.

## 🎯 Opzione 1: Usa SUBITO (No installazione)

**Apri direttamente il file:**
```
standalone.html
```

👉 **Doppio click su `standalone.html`** e partenza! 🚀

Questo file contiene TUTTO quello che ti serve - no React, no npm, no build.

---

## 📦 Opzione 2: Pubblica su GitHub (Consigliato)

### Passaggio 1: Crea un account GitHub
Vai su https://github.com/signup

### Passaggio 2: Crea un nuovo repository
1. Clicca il `+` in alto a destra → "New repository"
2. Nome: `dieta-app`
3. Spunta "Public"
4. Clicca "Create repository"

### Passaggio 3: Carica i file
```bash
cd dieta-app
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/TUONOME/dieta-app.git
git push -u origin main
```

### Passaggio 4: Abilita GitHub Pages
1. Vai su Settings → Pages
2. Source: `main` branch
3. Folder: `/root`
4. Clicca "Save"

✅ Done! La tua app sarà disponibile a:
```
https://TUONOME.github.io/dieta-app/standalone.html
```

---

## 🔧 Opzione 3: Sviluppo locale con Node.js

Se vuoi modificare il codice:

```bash
# Installa dipendenze
npm install

# Avvia server di sviluppo
npm run dev

# Build per produzione
npm run build
```

---

## 📱 Caratteristiche dell'app

✅ 7 giorni di menu dieta pronti  
✅ Calorie calcolate automaticamente  
✅ Confronto baseline vs controllo attuale  
✅ Grafici di andamento  
✅ Profilo personale  
✅ Design colorato tipo Fitbit  
✅ Bottom navigation iOS style  
✅ Fully responsive (mobile, tablet, desktop)

---

## 🔄 Come aggiornare i dati

### Nel file `standalone.html`:
1. Apri con un editor di testo
2. Cerca la sezione `const dieta = {`
3. Modifica i dati
4. Salva e ricarica il browser

### Nel progetto React (`src/App.jsx`):
1. Modifica gli oggetti `dieta` e `datiControlli`
2. Salva
3. Il server live-reload aggiornerà automaticamente

---

## 🎨 Colori Brand

- **Arancione**: #FF6B35 (primario - energia)
- **Cyan**: #00D9FF (secondario - dati)
- **Verde**: #6BCB77 (accento - salute)

---

## 📞 Supporto

Problema? Controlla:
- Browser supportati: Chrome, Safari, Firefox, Edge (ultimi 2 anni)
- Assicurati JavaScript sia abilitato
- Prova con Ctrl+Shift+Delete per pulire cache

---

**Buon utilizzo!** 🎉

