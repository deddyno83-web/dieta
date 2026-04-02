# 🍽️ Dieta & Controlli App

App moderna e colorata per consultare la dieta settimanale e tracciare i progressi antropometrici.

## 🎯 Caratteristiche

- **📋 Sezione Dieta**: Menu settimanale interattivo con calorie per ogni pasto
- **📊 Sezione Controlli**: Confronto dati antropometrici e grafici di andamento
- **👤 Sezione Profilo**: Informazioni personali e parametri di allenamento
- **🎨 Design Energico**: Stile moderno tipo Fitbit con colori vibranti
- **📱 Responsive**: Perfetto su mobile, tablet e desktop
- **⚡ Bottom Navigation iOS Style**: Navigazione intuitiva

## 🚀 Come usare

### Online (GitHub Pages)
Accedi direttamente dal link della demo live.

### In locale

1. **Clona il repository**
```bash
git clone https://github.com/tuonome/dieta-app.git
cd dieta-app
```

2. **Installa le dipendenze**
```bash
npm install
```

3. **Avvia il server di sviluppo**
```bash
npm run dev
```

4. **Apri nel browser**
```
http://localhost:5173
```

## 📦 Build per produzione

```bash
npm run build
```

I file compilati saranno in `dist/`

## 🎨 Colori Brand

- **Primario (Arancione)**: #FF6B35 - Energia e azione
- **Secondario (Cyan)**: #00D9FF - Dati e progressi
- **Accento (Verde)**: #6BCB77 - Salute e benessere

## 📱 Struttura Progetto

```
dieta-app/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx           # Componente principale
│   └── App.css           # Stili
├── package.json
└── README.md
```

## 🔄 Come aggiornare i dati

1. Apri `src/App.jsx`
2. Modifica gli oggetti `dieta` e `datiControlli` con i nuovi dati
3. Salva e rilancia l'app

## 🛠️ Tecnologie

- React 18
- Vite
- CSS moderno (grid, flexbox)
- JavaScript ES6+

## 📄 Licenza

MIT

## 👨‍💻 Autore

Creata con ❤️ per Edoardo Botta

---

**Tips di utilizzo**:
- Clicca sui giorni della settimana per cambiare il menu dieta
- Naviga tra le sezioni con la bottom navigation
- Usa le frecce per navigare i giorni della settimana
- Hover sui card per vedere effetti interattivi

