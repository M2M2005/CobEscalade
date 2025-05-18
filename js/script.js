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
            createSheetButton(filteredSheetsRG[0], resultsContainer, "F2:H202");
        }

        // Feuilles commençant par "U" avec plus de 2 caractères
        const filteredSheetsU = data.sheets
            .map(sheet => sheet.properties.title)
            .filter(name => name.startsWith("U") && name.length > 2);

        filteredSheetsU.forEach(sheetName => {
            createSheetButton(sheetName, resultsContainer, "EG7:EI32");
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
                urlStatut = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}!L2?key=${API_KEY}`;
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
    buttonFeuille(SHEET_ID);
});

async function generatePDF(SHEET_ID) {
    try {
        const body = await tableauTopo(SHEET_ID);

        const point = await tableauPoint(SHEET_ID);

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
                {text: "Challenge 2025", style: "header"},
                {
                    table: {
                        headerRows: 2,
                        widths: ["*", "*", "*", 20, 20, 20, 20, 20, 20, "*"],
                        body: body,
                    },
                },

                {text: " ", style: "saut"},
                {
                    table: {
                        headerRows: 1,
                        widths: [60, "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
                        body: point,
                    },
                },

                {text: " ", style: "saut"},
                {
                    table: {
                        headerRows: 0,
                        widths: ["*", "*", "*", "*"],
                        heights: [40],
                        body: information,
                    },
                },

                {text: " ", pageBreak: "before"},
                {
                    image: "https://cyprienbons.com/img/Logo_COBE.png",
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
                    fontSize: 6,
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
    const sheetName = "Topo";
    const range = "A1:K65";
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}!${range}?key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data || !data.values) {
        console.error("Les données récupérées sont invalides :", data);
        return;
    }

    const body = [
        [
            {text: "COULOIR", rowSpan: 2, style: "tableHeader", margin: [0, 7, 0, 0]},
            {text: "COULEUR", rowSpan: 2, style: "tableHeader", margin: [0, 7, 0, 0]},
            {text: "COTATION", rowSpan: 2, style: "tableHeader", margin: [0, 7, 0, 0]},
            {text: "POINTS", colSpan: 6, style: "tableHeader"},
            {},
            {},
            {},
            {},
            {},
            {text: "JUGE", rowSpan: 2, style: "tableHeader", margin: [0, 7, 0, 0]},
        ],
        [
            "",
            "",
            "",
            {text: "1", style: "tableHeader"},
            {text: "2", style: "tableHeader"},
            {text: "3", style: "tableHeader"},
            {text: "4", style: "tableHeader"},
            {text: "5", style: "tableHeader"},
            {text: "TOP", style: "tableHeader"},
            "",
        ],
    ];

    const rows = data.values.slice(0);
    let previousRow = null;
    let rowspanCount = 0;

    rows.forEach((row) => {
        if (row[2] !== "X") {
            const formattedRow = [
                "",
                {text: row[1] || "", alignment: "center", style: "tableBody"},
                {text: row[2] || "", alignment: "center", style: "tableBody"},
                "",
                "",
                "",
                "",
                "",
                "",
                "",
            ];

            if (!previousRow || row[0] !== "") {
                formattedRow[0] = {
                    text: row[0],
                    alignment: "center",
                    rowSpan: 1,
                    margin: [0, 0, 0, 0],
                    style: "tableBody"
                };
                rowspanCount = 1;
            } else {
                rowspanCount++;
                body[body.length - rowspanCount + 1][0].rowSpan = rowspanCount;
                body[body.length - rowspanCount + 1][0].margin = [0, (rowspanCount - 1) * 5, 0, 0];
            }

            body.push(formattedRow);
            previousRow = row;
        }
    });

    return body;
}

async function tableauPoint(SHEET_ID) {
    const sheetName = "Point";
    const range = "C7:R14";
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}!${range}?key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data || !data.values) {
        console.error("Les données récupérées sont invalides :", data);
        return;
    }

    const body = [
        [
            {text: "POINTS", colSpan: 16, style: "tableHeader"},
            {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {},
        ],
    ];

    const rows = data.values.slice(0);
    let previousRow = null;

    rows.forEach((row) => {
        const formattedRow = [];
        row.forEach((cell) => {
            formattedRow.push({text: cell || "", alignment: "center", style: "tableBody"});
        });
        body.push(formattedRow);
        previousRow = row;
    });
    return body;
}

// Burger menu
const burgerMenu = document.getElementById('burger-menu');
const burgerNav = document.getElementById('burger-nav');
burgerMenu.addEventListener('click', () => {
    burgerNav.classList.toggle('active');
    burgerMenu.classList.toggle('open');
});
