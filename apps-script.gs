/**
 * Google Apps Script for Byman Cykler EAN Scanner
 *
 * Receives scanned items from the phone app and writes to the sheet.
 * Product info (name, brand, description) is looked up by the app
 * and sent here — no external API calls needed.
 *
 * Sheet structure per tab (Hjelme, Sko, Tøj, Tilbehør, Energi, Tools):
 *   A: Produktnavn        B: Mærke (brand)     C: Farve
 *   D: Størrelse          E: Pris (DKK)        F: Antal på lager
 *   G: Leverandør varenr. H: Stregkode / EAN   I: Beskrivelse
 *
 * UPDATING: Deploy > Manage deployments > pencil icon >
 * Version: "New version" > Deploy
 */

var EAN_COLUMN = 8;   // Column H
var QTY_COLUMN = 6;   // Column F

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var data = JSON.parse(e.postData.contents);
  var items = data.items;
  var category = data.category;
  var results = [];

  for (var i = 0; i < items.length; i++) {
    var ean = String(items[i].ean);
    var qty = items[i].quantity;
    var info = items[i].info || null;
    var found = false;

    // Search every tab for this EAN and update quantity if found
    var sheets = ss.getSheets();
    for (var s = 0; s < sheets.length; s++) {
      var sheet = sheets[s];
      var lastRow = sheet.getLastRow();
      if (lastRow <= 1) continue;

      var eanValues = sheet.getRange(2, EAN_COLUMN, lastRow - 1, 1).getValues();

      for (var r = 0; r < eanValues.length; r++) {
        if (String(eanValues[r][0]) === ean) {
          sheet.getRange(r + 2, QTY_COLUMN).setValue(qty);
          results.push({ ean: ean, status: 'updated', tab: sheet.getName() });
          found = true;
          break;
        }
      }
      if (found) break;
    }

    // New product — add to selected category tab
    if (!found) {
      var targetSheet = ss.getSheetByName(category);
      if (targetSheet) {
        targetSheet.appendRow([
          info ? info.name        : '',   // A: Produktnavn
          info ? info.brand       : '',   // B: Mærke (brand)
          '',                             // C: Farve
          '',                             // D: Størrelse
          '',                             // E: Pris (DKK)
          qty,                            // F: Antal på lager
          '',                             // G: Leverandør varenr.
          ean,                            // H: Stregkode / EAN
          info ? info.description : '',   // I: Beskrivelse
        ]);
        results.push({ ean: ean, status: 'new', tab: category });
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
