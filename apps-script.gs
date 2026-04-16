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
 * HOW TO SET UP:
 * 1. Open your Google Sheet
 * 2. Click Extensions > Apps Script
 * 3. Delete any code already there
 * 4. Paste this entire file
 * 5. Click Deploy > New deployment (or update existing)
 * 6. Choose type: "Web app"
 * 7. Set "Execute as": Me
 * 8. Set "Who has access": Anyone
 * 9. Click Deploy
 * 10. Copy the URL — paste it into the scanner app settings
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
      // New product — look up info and add to selected tab
      var info = lookupEan(ean);
      var targetSheet = ss.getSheetByName(category);

      if (targetSheet) {
        targetSheet.appendRow([
          info.name,         // A: Produktnavn
          info.brand,        // B: Mærke (brand)
          '',                // C: Farve
          '',                // D: Størrelse
          '',                // E: Pris (DKK)
          qty,               // F: Antal på lager
          '',                // G: Leverandør varenr.
          ean,               // H: Stregkode / EAN
          info.description   // I: Beskrivelse
        ]);

        results.push({
          ean: ean,
          status: 'new',
          tab: category,
          product: info.name
        });
      }
    }
  }

  return ContentService.createTextOutput(
    JSON.stringify({ status: 'ok', results: results })
  ).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Look up product info from EAN code using UPCitemdb (free, 100 lookups/day)
 */
function lookupEan(ean) {
  var info = { name: '', brand: '', description: '' };

  try {
    var response = UrlFetchApp.fetch(
      'https://api.upcitemdb.com/prod/trial/lookup?upc=' + ean,
      { muteHttpExceptions: true }
    );

    if (response.getResponseCode() === 200) {
      var data = JSON.parse(response.getContentText());

      if (data.code === 'OK' && data.items && data.items.length > 0) {
        var item = data.items[0];
        info.name = item.title || '';
        info.brand = item.brand || '';
        info.description = item.description || '';
      }
    }
  } catch (e) {
    // Lookup failed — fields will be blank, user fills in manually
  }

  return info;
}

function doGet(e) {
  return ContentService.createTextOutput('Byman Cykler scanner script is running.');
}

// Test: run this in Apps Script editor to verify
function testDoPost() {
  var testEvent = {
    postData: {
      contents: JSON.stringify({
        items: [
          { ean: '4026495099189', quantity: 2 }
        ],
        category: 'Tilbehør'
      })
    }
  };

  var result = doPost(testEvent);
  Logger.log(result.getContent());
}
