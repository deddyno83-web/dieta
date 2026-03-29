document.addEventListener('DOMContentLoaded', () => {
    // Inizializza icone Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    const fileInput = document.getElementById('pdf-upload');
    const fileNameDisplay = document.getElementById('file-name');
    const dashboard = document.getElementById('dashboard');
    const welcomeScreen = document.getElementById('welcome-screen');
    const daysTabsContainer = document.getElementById('days-tabs');
    const mealsContainer = document.getElementById('meals-container');
    const activeDayTitle = document.getElementById('active-day-title');
    const consumedKcalEl = document.getElementById('consumed-kcal');
    const totalDayKcalEl = document.getElementById('total-day-kcal');
    const dailyProgressFill = document.getElementById('daily-progress-fill');
    
    const tabTemplate = document.getElementById('tab-template');
    const mealTemplate = document.getElementById('meal-template');

    let dietData = JSON.parse(localStorage.getItem('savedDietDataPro')) || [];
    let currentDayId = 'giorno-1';
    
    // Struttura salvataggio: { "giorno-1-COLAZIONE": true, "giorno-2-PRANZO": false, ... }
    const savedProgress = JSON.parse(localStorage.getItem('dietProgressPro')) || {};

    if (dietData.length > 0) {
        welcomeScreen.classList.add('hidden');
        dashboard.classList.remove('hidden');
        initTabs();
        renderDayContent(currentDayId);
    }

    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        fileNameDisplay.textContent = file.name;
        fileNameDisplay.classList.remove('hidden');

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfText = await extractTextFromPDF(arrayBuffer);
            
            dietData = parseDietText(pdfText);

            if (dietData.length > 0) {
                localStorage.setItem('savedDietDataPro', JSON.stringify(dietData));
                welcomeScreen.classList.add('hidden');
                dashboard.classList.remove('hidden');
                initTabs();
                renderDayContent(currentDayId);
            } else {
                alert("Non sono riuscito a trovare la struttura della dieta nel file.");
            }
            
        } catch (error) {
            console.error("Errore durante la lettura del PDF:", error);
            alert("Errore durante la lettura del file. Riprova.");
        }
    });

    async function extractTextFromPDF(arrayBuffer) {
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        let fullText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const strings = content.items.map(item => item.str);
            fullText += strings.join(" ") + "\n";
        }
        return fullText;
    }

    function parseDietText(text) {
        const parsedDays = [];
        
        let globalKcal = "2650"; // Fallback medio
        const kcalMatch = text.match(/CALORIE\s+([\d-]+)\s*KCAL/i);
        if (kcalMatch) {
            // Se trova range es. 2600-2700, prendiamo il primo per fare calcoli
            let kStr = kcalMatch[1].split('-')[0];
            globalKcal = kStr.trim();
        }
        
        const dayNames = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
        const numKcal = parseInt(globalKcal) || 2650;
        
        for (let i = 1; i <= 7; i++) {
            const dayRegex = new RegExp("GIORNO\\s*" + i, "i");
            const match = dayRegex.exec(text);
            if (!match) continue;
            
            let nextIndex = text.length;
            if (i < 7) {
                const nextMatch = new RegExp("GIORNO\\s*" + (i + 1), "i").exec(text);
                if (nextMatch) nextIndex = nextMatch.index;
            } else {
                const stopMatch = text.match(/INTEGRAZIONE|IDRATAZIONE/i);
                if (stopMatch && stopMatch.index > match.index) {
                    nextIndex = stopMatch.index;
                }
            }
            
            let dayBlock = text.substring(match.index + match[0].length, nextIndex).trim();
            
            const mealNames = ['COLAZIONE', 'SPUNTINO', 'PRANZO', 'MERENDA', 'CENA', 'POST-CENA', 'CONDIMENTO'];
            let mealParts = [];
            mealNames.forEach(meal => {
                const idx = dayBlock.indexOf(meal);
                if (idx !== -1) mealParts.push({ name: meal, index: idx });
            });
            
            mealParts.sort((a,b) => a.index - b.index);
            let parsedMeals = [];
            
            if (mealParts.length > 0) {
                mealParts.forEach((part, partIdx) => {
                    const nextPart = mealParts[partIdx + 1];
                    const endIdx = nextPart ? nextPart.index : dayBlock.length;
                    let content = dayBlock.substring(part.index + part.name.length, endIdx).trim();
                    content = content.replace(/[\u2022\u25E6\u25CF\-\uF0B7]/g, '<br>• '); 
                    if(content.startsWith('<br>')) content = content.substring(4);
                    
                    // Stima Kcal
                    let mealKcal = 0;
                    if(part.name === 'COLAZIONE') mealKcal = Math.round(numKcal * 0.20);
                    else if(part.name === 'SPUNTINO' || part.name === 'MERENDA') mealKcal = Math.round(numKcal * 0.10);
                    else if(part.name === 'PRANZO' || part.name === 'CENA') mealKcal = Math.round(numKcal * 0.25);
                    else if(part.name === 'POST-CENA') mealKcal = Math.round(numKcal * 0.05);
                    else if(part.name === 'CONDIMENTO') mealKcal = Math.round(numKcal * 0.05);
                    else mealKcal = Math.round(numKcal * 0.10);

                    parsedMeals.push({
                        id: part.name,
                        name: part.name,
                        content: content,
                        estimatedKcal: mealKcal
                    });
                });
            } else {
                parsedMeals.push({
                    id: 'GENERALE',
                    name: 'Distribuzione',
                    content: dayBlock.replace(/\n/g, '<br>'),
                    estimatedKcal: numKcal
                });
            }

            parsedDays.push({
                id: 'giorno-' + i,
                name: dayNames[i-1],
                totalKcal: numKcal,
                meals: parsedMeals
            });
        }
        return parsedDays;
    }

    function initTabs() {
        daysTabsContainer.innerHTML = '';
        dietData.forEach((dayInfo, idx) => {
            const clone = tabTemplate.content.cloneNode(true);
            const btn = clone.querySelector('.day-tab');
            btn.querySelector('.tab-name').textContent = dayInfo.name;
            
            if(idx === 0) currentDayId = dayInfo.id;
            
            if(dayInfo.id === currentDayId) btn.classList.add('active');
            
            btn.addEventListener('click', () => {
                document.querySelectorAll('.day-tab').forEach(t => t.classList.remove('active'));
                btn.classList.add('active');
                currentDayId = dayInfo.id;
                renderDayContent(currentDayId);
            });
            
            daysTabsContainer.appendChild(clone);
        });
    }

    function renderDayContent(dayId) {
        const dayInfo = dietData.find(d => d.id === dayId);
        if(!dayInfo) return;

        activeDayTitle.textContent = dayInfo.name;
        totalDayKcalEl.textContent = dayInfo.totalKcal;
        mealsContainer.innerHTML = '';

        dayInfo.meals.forEach((meal, idx) => {
            const clone = mealTemplate.content.cloneNode(true);
            const card = clone.querySelector('.meal-card');
            
            clone.querySelector('.meal-name').textContent = meal.name;
            clone.querySelector('.meal-kcal-val').textContent = meal.estimatedKcal;
            clone.querySelector('.meal-content').innerHTML = meal.content.replace(/\n/g, '<br>');

            const checkbox = clone.querySelector('.meal-checkbox');
            const progressKey = `${dayId}-${meal.id}`;
            
            if (savedProgress[progressKey]) {
                checkbox.checked = true;
                requestAnimationFrame(() => card.classList.add('checked'));
            }

            checkbox.addEventListener('change', (e) => {
                savedProgress[progressKey] = e.target.checked;
                localStorage.setItem('dietProgressPro', JSON.stringify(savedProgress));
                
                if(e.target.checked) card.classList.add('checked');
                else card.classList.remove('checked');

                updateDayProgress(dayInfo);
            });

            mealsContainer.appendChild(clone);
            
            // Waterfall animation per le card
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50 * idx);
        });

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        updateDayProgress(dayInfo);
    }

    function updateDayProgress(dayInfo) {
        let consumed = 0;
        dayInfo.meals.forEach(meal => {
            const progressKey = `${dayInfo.id}-${meal.id}`;
            if (savedProgress[progressKey]) {
                consumed += meal.estimatedKcal;
            }
        });

        consumedKcalEl.textContent = consumed;
        let percent = (consumed / dayInfo.totalKcal) * 100;
        if(percent > 100) percent = 100;
        
        dailyProgressFill.style.width = `${percent}%`;
    }
});
