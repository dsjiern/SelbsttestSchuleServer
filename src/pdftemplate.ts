export const template = `
<html>
    <head>
        <style>
            html, body {
                margin: 0px;
                padding: 0px;
                font-family: Arial, sans-serif;
                font-size: 80%;
            }
            
            body {
                padding: 20mm 15mm;
            }
            
            header {
                position: absolute;
                top: 0px;
                left: 0px;
                height: 15mm;
                width: 100%;
                text-align: center;
                background-color: rgb(255, 171, 0);
                color: rgb(255, 255, 255);
                font-size: 8mm;
                line-height: 15mm;
            }

            footer {
                position: absolute;
                bottom: 0px;
                left: 0px;
                height: 15mm;
                width: 100%;
                text-align: center;
                background-color: rgb(255, 171, 0);
                color: rgb(255, 255, 255);
                font-size: 8mm;
                line-height: 15mm;
            }
            
            img {
                width: 4cm;
                height: 4cm;
                display: block;
                margin: auto;
            }
            
            h4 + p {
                font-size: 85%;
                font-style: italic;
                text-align: center;
            }
            
            p.footer {
                font-size: 85%;
                margin-top: 1em;
                font-style: italic;
            }
        </style>
    </head>
    <body>
        <header>Nachweis über Selbsttest in Schulen</header>
        <h1>Bescheinigung eines negativen Schnelltests</h1>
        <p>Im Rahmen der Teststrategie führen Schüler in Baden-Württemberg zwei mal pro Woche unter Aufsicht einer unterwiesenen Lehrkraft einen Selbsttest durch.</p>
        <p>Hiermit wird für</p>
        <h2>{{name}} {{geburt}}</h2>
        <p>ein <u>negatives Testergebnis</u> bescheinigt.</p>
        <h3><u>Durchführende Stelle:</u> {{schule}}</h3>
        <h3><u>Telefon:</u> {{telefon}}</h3>
        <h3><u>Testzeitpunkt:</u> {{zeitpunkt}}</h3>
        <h3>{{hersteller}}</h3>
        <h4>Digitaler Nachweis:</h4>
        <p><img src="{{qr}}" />{{url}}</p>
        <p><b>Bitte beachten!</b> Ein negatives Testergebnis stellt nur eine Momentaufnahme dar und entbindet nicht von Hygiene- und Schutzmaßnahmen. Ein Schnelltest reduziert jedoch das Risiko, andere unwissentlich anzustecken.</p>
        <p><u>Ein negatives Ergebnis im Antigen-Schnelltest schließt eine Infektion nicht aus!</u></p>
        <p class="footer">
          Diese Bescheinigung wurde elektronisch erstellt und ist ohne Unterschrift gültig. Zur Verifikation kann innerhalb von 60 Stunden der angegebene QR-Code gescannt werden.
          Die Verantwortung für die ausgeführten Tests und die ausgestellten Bescheinigungen liegt bei oben angegebener Schule.
        </p>
        <footer>www.selbsttest-schule.de</footer>
    </body>
</html>
`;
