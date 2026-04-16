/**
 * Google Apps Script for Byman Cykler EAN Scanner
 *
 * Sheet structure per tab (Hjelme, Sko, Tøj, Tilbehør, Energi, Tools):
 *   A: Produktnavn
 *   B: Mærke (brand)
 *   C: Farve
 *   D: Størrelse
 *   E: Pris (DKK)
 *   F: Antal på lager    <-- updated by scanner
 *   G: Leverandør varenr.
 *   H: Stregkode / EAN   <-- matched by scanner
 *   I: Beskrivelse
 *
 * HOW TO SET UP:
 * 1. Open your Google Sheet
 * 2. Click Extensions > Apps Script
 * 3. Delete any code already there
 * 4. Paste this entire file
 * 5. Click Deploy > New deployment
 * 6. Choose type: "Web app"
 * 7. Set "Execute as": Me
 * 8. Set "Who has access": Anyone
 * 9. Click Deploy
 * 10. Copy the URL — paste it into the scanner app settings
 *
 * UPDATING: When you paste new code, click Deploy > Manage deployments >
 * edit (pencil icon) > set Version to "New version" > Deploy
 */

var EAN_COLUMN = 8;   // Column H: Stregkode / EAN
var QTY_COLUMN = 6;   // Column F: Antal på lager

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var data = JSON.parse(e.postData.contents);
  var items = data.items;
  var category = data.category; // Selected tab name (e.g. "Hjelme")
  var results = [];

  for (var i = 0; i < items.length; i++) {
    var ean = String(items[i].ean);
    var qty = items[i].quantity;
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
          // Found — update "Antal på lager"
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
      // New product — add to the selected category tab
      var targetSheet = ss.getSheetByName(category);
      if (targetSheet) {
        // Add new row: empty fields except EAN and quantity
        // [Produktnavn, Mærke, Farve, Størrelse, Pris, Antal, Leverandør nr., EAN, Beskrivelse]
        targetSheet.appendRow(['', '', '', '', '', qty, '', ean, '']);
        results.push({
          ean: ean,
          status: 'new',
          tab: category
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

// Test function — run this in Apps Script to verify it works
function testDoPost() {
  var testEvent = {
    postData: {
      contents: JSON.stringify({
        items: [
          { ean: '5711234567890', quantity: 5 },
          { ean: '9999999999999', quantity: 2 }
        ],
        category: 'Hjelme'
      })
    }
  };

  var result = doPost(testEvent);
  Logger.log(result.getContent());
}
