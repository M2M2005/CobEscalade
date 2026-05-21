// Single Page Application Navigation
(function() {
    // État global de l'application
    let currentView = 'home';
    let currentSheetId = null;
    let currentVersion = null;
    let loadedScripts = {}; // Track loaded scripts

    // Fonction pour charger dynamiquement le script de version
    function loadVersionScript(version) {
        return new Promise((resolve, reject) => {
            // Si déjà chargé, résoudre immédiatement
            if (loadedScripts[version]) {
                resolve();
                return;
            }

            // Créer et charger le script
            const script = document.createElement('script');
            script.src = `js/script_${version}.js`;
            script.onload = () => {
                loadedScripts[version] = true;
                resolve();
            };
            script.onerror = () => reject(new Error(`Failed to load script_${version}.js`));
            document.head.appendChild(script);
        });
    }

    // Fonction pour afficher les résultats d'une compétition
    window.showResults = async function(sheetId, year, title, date, time = null, version = 'v2') {
        try {
            // Charger le script de version si nécessaire
            await loadVersionScript(version);

            // Sauvegarder les données
            currentSheetId = sheetId;
            currentVersion = version;
            window.SHEET_ID = sheetId;
            window.YEAR = year;

            // Cacher la vue home
            const homeView = document.getElementById('home-view');
            const resultView = document.getElementById('result-view');

            homeView.style.display = 'none';
            resultView.style.display = 'block';

            // Mettre à jour le contenu
            document.getElementById('result-title').textContent = title;
            document.getElementById('result-date').textContent = date;

            const timeElement = document.getElementById('result-time');
            if (time) {
                timeElement.textContent = time;
                timeElement.style.display = 'block';
            } else {
                timeElement.style.display = 'none';
            }

            // Mettre à jour le bouton PDF
            const pdfButton = document.getElementById('pdf-button');
            pdfButton.onclick = function() {
                generatePDF(sheetId, year, 'Un Max de Grimpe !');
            };

            // Vider les résultats précédents
            const resultsContainer = document.getElementById('results');
            resultsContainer.innerHTML = '';

            // Charger les nouveaux résultats
            if (typeof buttonFeuille === 'function') {
                buttonFeuille(sheetId);
            }

            // Scroller en haut
            window.scrollTo(0, 0);

            currentView = 'result';
        } catch (error) {
            console.error('Error loading results:', error);
            alert('Erreur lors du chargement des résultats');
        }
    };

    // Fonction pour retourner à l'accueil
    window.showHome = function() {
        const homeView = document.getElementById('home-view');
        const resultView = document.getElementById('result-view');

        homeView.style.display = 'block';
        resultView.style.display = 'none';

        // Vider les résultats
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = '';

        // Scroller en haut
        window.scrollTo(0, 0);

        currentView = 'home';
        currentSheetId = null;
        window.SHEET_ID = null;
    };

    // Gérer le bouton retour du navigateur
    window.addEventListener('popstate', function(event) {
        if (currentView === 'result') {
            showHome();
        }
    });

    // Ajouter une entrée dans l'historique quand on affiche les résultats
    const originalShowResults = window.showResults;
    window.showResults = function(...args) {
        originalShowResults(...args);
        history.pushState({ view: 'result' }, '', '');
    };
})();
