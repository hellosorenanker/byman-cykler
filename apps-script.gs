/**
 * Google Apps Script for Byman Cykler EAN Scanner
 *
 * Sheet structure per tab (Hjelme, Sko, Tøj, Tilbehør, Energi, Tools):
 *   A: Produktnavn        <-- auto-filled from EAN lookup
 *   B: Mærke (brand)      <-- auto-filled from EAN lookup
 *   C: Farve
 *   D: Størrelse
 *   E: Pris (DKK)
 *   F: Antal på lager     <-- set by scanner
 *   G: Leverandør varenr.
 *   H: Stregkode / EAN    <-- matched/set by scanner
 *   I: Beskrivelse        <-- auto-filled from EAN lookup
 *
 * UPDATING: Deploy > Manage deployments > pencil icon >
 * Version: "New version" > Deploy
 */

var EAN_COLUMN = 8;   // Column H: Stregkode / EAN
var QTY_COLUMN = 6;   // Column F: Antal på lager

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var data = JSON.parse(e.postData.contents);
  var items = data.items;
  var category = data.category;
  var results = [];

  for (var i = 0; i < items.length; i++) {
    var ean = String(items[i].ean);
    var qty = items[i].quantity;
    var info = items[i].info; // Product info from client-side lookup
    var found = false;

    // Search every tab for this EAN
    var sheets = ss.getSheets();
    for (var s = 0; s < sheets.length; s++) {
      var sheet = sheets[s];
      var lastRow = sheet.getLastRow();
      if (lastRow <= 1) continue;

      var eanValues = sheet.getRange(2, EAN_COLUMN, lastRow - 1, 1).getValues();

      for (var r = 0; r < eanValues.length; r++) {
        if (String(eanValues[r][0]) === ean) {
          sheet.getRange(r + 2, QTY_COLUMN).setValue(qty);
          results.push({
            ean: ean,
            status: 'updated',
            tab: sheet.getName(),
            product: sheet.getRange(r + 2, 1).getValue()
          });
          found = true;
          break;
        }
      }
      if (found) break;
    }

    if (!found) {
      // New product — add to selected category tab
      var targetSheet = ss.getSheetByName(category);
      if (targetSheet) {
        var productName = (info && info.name) ? info.name : '';
        var brand = (info && info.brand) ? info.brand : '';
        var description = (info && info.description) ? info.description : '';

        targetSheet.appendRow([
          productName,   // A: Produktnavn
          brand,         // B: Mærke (brand)
          '',            // C: Farve
          '',            // D: Størrelse
          '',            // E: Pris (DKK)
          qty,           // F: Antal på lager
          '',            // G: Leverandør varenr.
          ean,           // H: Stregkode / EAN
          description    // I: Beskrivelse
        ]);

        results.push({
          ean: ean,
          status: 'new',
          tab: category,
          product: productName
        });
      }
    }
  }

  return ContentService.createTextOutput(
    JSON.stringify({ status: 'ok', results: results })
  ).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService.createTextOutput('Byman Cykler scanner script is running.');
}
