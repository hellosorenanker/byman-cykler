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

// ========== CONFIGURATION ==========
// Paste your Barcodelookup.com API key here:
var BARCODELOOKUP_API_KEY = '';  // e.g. 'abc123xyz'
// ====================================

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
          product: info.name,
          lookupSource: info.source
        });
      }
    }
  }

  return ContentService.createTextOutput(
    JSON.stringify({ status: 'ok', results: results })
  ).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Look up product info by EAN code.
 * Tries Barcodelookup.com first (paid, best coverage),
 * then UPCitemdb as free fallback.
 */
function lookupEan(ean) {
  var info;

  // Try Barcodelookup.com (paid — best coverage for bike products)
  if (BARCODELOOKUP_API_KEY) {
    info = tryBarcodeLookup(ean);
    if (info) return info;
  }

  // Fallback: UPCitemdb (free, 100/day)
  info = tryUpcItemDb(ean);
  if (info) return info;

  return { name: '', brand: '', description: '', source: 'none' };
}

function tryBarcodeLookup(ean) {
  try {
    var url = 'https://api.barcodelookup.com/v3/products?barcode=' + ean
            + '&formatted=y&key=' + BARCODELOOKUP_API_KEY;

    var response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    var code = response.getResponseCode();

    if (code !== 200) return null;

    var data = JSON.parse(response.getContentText());

    if (data.products && data.products.length > 0) {
      var p = data.products[0];
      return {
        name: p.title || p.product_name || '',
        brand: p.brand || p.manufacturer || '',
        description: p.description || '',
        source: 'barcodelookup'
      };
    }
  } catch (e) {}

  return null;
}

function tryUpcItemDb(ean) {
  try {
    var response = UrlFetchApp.fetch(
      'https://api.upcitemdb.com/prod/trial/lookup?upc=' + ean,
      { muteHttpExceptions: true }
    );

    if (response.getResponseCode() !== 200) return null;

    var data = JSON.parse(response.getContentText());

    if (data.code === 'OK' && data.items && data.items.length > 0) {
      var item = data.items[0];
      var title = (item.title || '').replace(new RegExp('\\s*' + ean + '\\s*$'), '');
      return {
        name: title,
        brand: item.brand || '',
        description: item.description || '',
        source: 'upcitemdb'
      };
    }
  } catch (e) {}

  return null;
}

function doGet(e) {
  return ContentService.createTextOutput('Byman Cykler scanner script is running.');
}

// Test: run this in Apps Script editor, check Logs (View > Execution log)
function testLookup() {
  var result = lookupEan('768686474972'); // Giro Eclipse
  Logger.log('Giro: ' + JSON.stringify(result));

  var result2 = lookupEan('4026495099189'); // Schwalbe tube
  Logger.log('Schwalbe: ' + JSON.stringify(result2));
}
