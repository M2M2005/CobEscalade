const API_KEY = "AIzaSyCTdn9QwIBop7xelDyXuaOmtT1Qwi2hppY";

async function buttonFeuille(SHEET_ID) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}?key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!data.sheets || data.sheets.length === 0) {
            document.getElementById("results").innerText = "Aucune feuille trouvée.";
            return;
        }

        const resultsContainer = document.getElementById("results");

        // Feuille spécifique "RG"
        const filteredSheetsRG = data.sheets
            .map(sheet => sheet.properties.title)
            .filter(name => name === "RG");

        if (filteredSheetsRG.length > 0) {
            createSheetButton(filteredSheetsRG[0], resultsContainer, "H2:K202");
        }

        // Feuilles commençant par "U" avec plus de 2 caractères
        const filteredSheetsU = data.sheets
            .map(sheet => sheet.properties.title)
            .filter(name => name.startsWith("U") && name.length > 2);

        filteredSheetsU.forEach(sheetName => {
            createSheetButton(sheetName, resultsContainer, "LQ7:LT32");
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        const resultsContainer = document.getElementById("results");
        if (!resultsContainer) {
            console.error("L'élément avec l'ID 'results' est introuvable.");
        }
    }
}

function createSheetButton(sheetName, container, range) {
    const sheetContainer = document.createElement("div");
    sheetContainer.className = "sheet-container";

    const button = document.createElement("button");
    if (sheetName === "RG") {
        button.innerHTML = `► Résultat général`;
    } else {
        button.innerHTML = `► ${sheetName}`;
    }
    button.className = "sheet-button";
    button.onclick = () => sheetDataResultat(sheetName, button, sheetContainer, range, SHEET_ID);

    const resultDiv = document.createElement("div");
    resultDiv.className = "sheet-results";
    resultDiv.style.display = "none"; // Masqué par défaut

    sheetContainer.appendChild(button);
    sheetContainer.appendChild(resultDiv);
    container.appendChild(sheetContainer);
}

async function sheetDataResultat(sheetName, button, container, range, SHEET_ID) {
    const resultDiv = container.querySelector(".sheet-results");

    if (resultDiv.style.display === "none") {
        if (sheetName === "RG") {
            button.innerHTML = `▼ Résultat général`;
        } else {
            button.innerHTML = `▼ ${sheetName}`;
        }
        resultDiv.style.display = "block";

        try {
            let urlStatut;
            if (sheetName === "RG") {
                urlStatut = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}!O2?key=${API_KEY}`;
            } else {
                urlStatut = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}!D2?key=${API_KEY}`;
            }

            const responseStatut = await fetch(urlStatut);
            const dataStatut = await responseStatut.json();

            if (!dataStatut.values || !dataStatut.values[0]) {
                resultDiv.innerText = "Erreur : Impossible de récupérer le statut.";
                return;
            }

            if (dataStatut.values[0][0] === "FALSE") {
                resultDiv.innerText = "Les résultats ne sont pas encore disponibles.";
            } else {
                const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}!${range}?key=${API_KEY}`;
                const response = await fetch(url);
                const data = await response.json();

                if (!data.values || data.values.length === 0) {
                    resultDiv.innerText = "Aucune donnée trouvée.";
                    return;
                }

                const table = document.createElement("table");
                table.className = "results-table";

                data.values.forEach(row => {
                    if (row.length !== 1) {
                        const tr = document.createElement("tr");
                        row.forEach(cell => {
                            const td = document.createElement("td");
                            td.textContent = cell || "";
                            tr.appendChild(td);
                        });
                        table.appendChild(tr);
                    }
                });

                resultDiv.innerHTML = "";
                resultDiv.appendChild(table);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des données :", error);
            resultDiv.innerText = "Erreur lors de la récupération des données.";
        }

    } else {
        if (sheetName === "RG") {
            button.innerHTML = `► Résultat général`;
        } else {
            button.innerHTML = `► ${sheetName}`;
        }
        resultDiv.style.display = "none";
    }
}

window.addEventListener("DOMContentLoaded", () => {
    // Uniquement appeler buttonFeuille si SHEET_ID est défini (pages anciennes)
    // Pour result.html, c'est appelé après loadCompetition()
    if (typeof SHEET_ID !== 'undefined' && SHEET_ID !== '') {
        buttonFeuille(SHEET_ID);
    }
});


// Function to load image and convert to base64
async function loadImageAsBase64(imagePath) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL('image/png');
            resolve(dataURL);
        };
        img.onerror = reject;
        img.src = imagePath;
    });
}

async function generatePDF(SHEET_ID, YEAR, NAME) {
    try {
        const body = await tableauTopo(SHEET_ID);

//         const point = await tableauPoint(SHEET_ID);

        const imgDate = await loadImageAsBase64('img/Mur_3D_2026.png');

        const information = [
            [
                {text: "NOM :", style: "tableInfo"},
                {text: "PRÉNOM :", style: "tableInfo"},
                {text: "CATÉGORIE :", style: "tableInfo"},
                {text: "GOÛTER :", style: "tableInfo"},
            ],
        ];

        const docDefinition = {
            content: [
                {text: "Challenge " + YEAR + " - " + NAME, style: "header"},
                {
                    table: {
                        headerRows: 2,
                        widths: ["*", "*", "*", "*", 20, 20, 20, 20, 20, 20, 20, "*"],
                        body: body,
                    },
                },

//                 {text: " ", style: "saut"},
//                 {
//                     table: {
//                         headerRows: 1,
//                         widths: [60, "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
//                         body: point,
//                     },
//                 },
//
                {text: " ", style: "saut"},
                {
                    table: {
                        headerRows: 0,
                        widths: ["*", "*", "*", "*"],
                        heights: [40],
                        body: information,
                    },
                },

                {
                    image: imgDate,
                    width: 405,
                    alignment: "center",
                },
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 10],
                    alignment: "center",
                },
                tableHeader: {
                    fontSize: 7,
                    bold: true,
                    alignment: "center",
                    fillColor: "#f2f2f2",
                },
                tableBody: {
                    fontSize: 5,
                    alignment: "center",
                    margin: [0, 0, 0, 0],
                },
                tableInfo: {
                    fontSize: 10,
                    bold: true,
                },
                saut: {
                    fontSize: 5,
                }
            },
        };

        pdfMake.createPdf(docDefinition).download("topo_escalade.pdf");
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
    }
}

async function tableauTopo(SHEET_ID) {
    const sheetName = "Voies";
    const range = "C2:FF10";
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}!${range}?key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data || !data.values || data.values.length < 9) {
        console.error("Les données récupérées sont invalides :", data);
        return;
    }

    const numeros = data.values[0] || [];
    const couleurs = data.values[1] || [];
    const degaines = data.values[6] || [];
    const points = data.values[7] || [];
    const cotations = data.values[8] || [];

    const body = [];
    const maxDegaines = 7;

    // En-tête
    const headerRow1 = [
      {text: "COULOIR", rowSpan: 2, style: "tableHeader", margin: [0, 7, 0, 0]},
      {text: "COULEUR", rowSpan: 2, style: "tableHeader", margin: [0, 7, 0, 0]},
      {text: "COTATION", rowSpan: 2, style: "tableHeader", margin: [0, 7, 0, 0]},
      {text: "POINTS", rowSpan: 2, style: "tableHeader", margin: [0, 7, 0, 0]},
      {text: "POINTS", colSpan: maxDegaines, style: "tableHeader"}
    ];

    for (let i = 1; i <= maxDegaines - 1; i++) {
      headerRow1.push({});
    }

    headerRow1.push({text: "JUGE", rowSpan: 2, style: "tableHeader", margin: [0, 7, 0, 0]});


    const headerRow2 = [
      "",
      "",
      "",
      "",
    ];

    for (let i = 1; i <= maxDegaines - 1; i++) {
        headerRow2.push({text: i.toString(), style: "tableHeader"});
    }

    headerRow2.push({text: "TOP", style: "tableHeader"});
    headerRow2.push("");

    body.push(headerRow1);
    body.push(headerRow2);

    // Parcourir par couloirs (4 colonnes = 1 couloir)
    const nbCouloirs = Math.floor(numeros.length / 4);

    for (let couloir = 0; couloir < nbCouloirs; couloir++) {
        const startCol = couloir * 4;
        const numeroCouloir = numeros[startCol] || (couloir + 1).toString();

        // Collecter d'abord les voies valides de ce couloir
        const voiesCouloir = [];

        for (let voie = 0; voie < 4; voie++) {
            const col = startCol + voie;
            const couleur = couleurs[col] || "";
            const pt = points[col] || "";
            const cotation = cotations[col] || "";

            // Ignorer les voies "X" ou vides
            if (couleur !== "X" && cotation !== "X" && couleur !== "") {
                voiesCouloir.push({
                    couleur: couleur,
                    points: pt,
                    cotation: cotation
                });
            }
        }

        // Ajouter les voies avec rowSpan
        voiesCouloir.forEach((voie, index) => {
            const row = [];

            // Première voie: numéro avec rowSpan
            if (index === 0) {
                row.push({
                    text: numeroCouloir,
                    alignment: "center",
                    style: "tableBody",
                    rowSpan: voiesCouloir.length
                });
            } else {
                // Voies suivantes: cellule vide (couverte par rowSpan)
                row.push("");
            }

            // Couleur, cotation, points
            row.push(
                {text: voie.couleur, alignment: "center", style: "tableBody"},
                {text: voie.cotation, alignment: "center", style: "tableBody"},
                {text: voie.points, alignment: "center", style: "tableBody"}
            );

            // 7 cases vides pour dégaines
            for (let j = 0; j < 7; j++) {
                row.push({text: "", alignment: "center", style: "tableBody"});
            }

            // Case vide finale
            row.push({text: "", alignment: "center", style: "tableBody"});

            body.push(row);
        });
    }

    console.log("Total lignes:", body.length);
    return body;
}
// async function tableauPoint(SHEET_ID) {
//     const sheetName = "Points";
//     const range = "C7:O14";
//     const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}!${range}?key=${API_KEY}`;
//     const response = await fetch(url);
//     const data = await response.json();
//
//     if (!data || !data.values) {
//         console.error("Les données récupérées sont invalides :", data);
//         return;
//     }
//
//     const body = [
//         [
//             {text: "POINTS", colSpan: 13, style: "tableHeader"},
//             {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {},
//         ],
//     ];
//
//     const rows = data.values.slice(0);
//     let previousRow = null;
//
//     rows.forEach((row) => {
//         const formattedRow = [];
//         row.forEach((cell) => {
//             formattedRow.push({text: cell || "", alignment: "center", style: "tableBody"});
//         });
//         body.push(formattedRow);
//         previousRow = row;
//     });
//     return body;
// }
async function tableauPoint(SHEET_ID) {    console.log("=== tableauPoint COMMENTÉ ===");    return [[]];}
// Burger menu - Attendre que le header soit chargé
window.addEventListener('DOMContentLoaded', () => {
    // Attendre un peu que les composants se chargent
    setTimeout(() => {
        const burgerMenu = document.getElementById('burger-menu');
        const burgerNav = document.getElementById('burger-nav');

        if (burgerMenu && burgerNav) {
            burgerMenu.addEventListener('click', () => {
                burgerNav.classList.toggle('active');
                burgerMenu.classList.toggle('open');
            });
        }
    }, 100);
});
