/**
 * Google Apps Script for Byman Cykler EAN Scanner
 *
 * UPDATING: Deploy > Manage deployments > pencil icon >
 * Version: "New version" > Deploy
 */

// ========== CONFIGURATION ==========
// Paste your Barcodelookup.com API key here:
var BARCODELOOKUP_API_KEY = '';  // e.g. 'abc123xyz'
// ====================================

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
          results.push({ ean: ean, status: 'updated', tab: sheet.getName() });
          found = true;
          break;
        }
      }
      if (found) break;
    }

    if (!found) {
      var targetSheet = ss.getSheetByName(category);
      if (targetSheet) {
        // Step 1: Write EAN + quantity FIRST (so data always appears)
        targetSheet.appendRow(['', '', '', '', '', qty, '', ean, '']);
        var newRow = targetSheet.getLastRow();

        // Step 2: Try to look up product info and update the row
        try {
          var info = lookupEan(ean);
          if (info.name) targetSheet.getRange(newRow, 1).setValue(info.name);
          if (info.brand) targetSheet.getRange(newRow, 2).setValue(info.brand);
          if (info.description) targetSheet.getRange(newRow, 9).setValue(info.description);
          results.push({ ean: ean, status: 'new', tab: category, product: info.name, source: info.source });
        } catch (err) {
          results.push({ ean: ean, status: 'new', tab: category, product: '', source: 'error: ' + err.message });
        }
      }
    }
  }

  return ContentService.createTextOutput(
    JSON.stringify({ status: 'ok', results: results })
  ).setMimeType(ContentService.MimeType.JSON);
}

function lookupEan(ean) {
  // Try Barcodelookup.com first (paid, best coverage)
  if (BARCODELOOKUP_API_KEY) {
    Logger.log('Trying Barcodelookup for ' + ean + ' with key: ' + BARCODELOOKUP_API_KEY.substring(0, 5) + '...');
    var info = tryBarcodeLookup(ean);
    if (info) return info;
  } else {
    Logger.log('No Barcodelookup API key configured');
  }

  // Fallback: UPCitemdb (free)
  Logger.log('Trying UPCitemdb for ' + ean);
  var info = tryUpcItemDb(ean);
  if (info) return info;

  return { name: '', brand: '', description: '', source: 'none' };
}

function tryBarcodeLookup(ean) {
  try {
    var url = 'https://api.barcodelookup.com/v3/products?barcode=' + ean
            + '&formatted=y&key=' + BARCODELOOKUP_API_KEY;
    var response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    var code = response.getResponseCode();
    var text = response.getContentText();
    Logger.log('Barcodelookup response code: ' + code);
    Logger.log('Barcodelookup response: ' + text.substring(0, 300));

    if (code !== 200) return null;

    var data = JSON.parse(text);
    if (data.products && data.products.length > 0) {
      var p = data.products[0];
      return {
        name: p.title || p.product_name || '',
        brand: p.brand || p.manufacturer || '',
        description: p.description || '',
        source: 'barcodelookup'
      };
    }
  } catch (e) {
    Logger.log('Barcodelookup error: ' + e.message);
  }
  return null;
}

function tryUpcItemDb(ean) {
  try {
    var response = UrlFetchApp.fetch(
      'https://api.upcitemdb.com/prod/trial/lookup?upc=' + ean,
      { muteHttpExceptions: true }
    );
    var code = response.getResponseCode();
    Logger.log('UPCitemdb response code: ' + code);

    if (code !== 200) return null;

    var data = JSON.parse(response.getContentText());
    if (data.code === 'OK' && data.items && data.items.length > 0) {
      var item = data.items[0];
      var title = (item.title || '').replace(new RegExp('\\s*' + ean + '\\s*$'), '');
      return { name: title, brand: item.brand || '', description: item.description || '', source: 'upcitemdb' };
    }
  } catch (e) {
    Logger.log('UPCitemdb error: ' + e.message);
  }
  return null;
}

function doGet(e) {
  return ContentService.createTextOutput('Byman Cykler scanner script is running.');
}

// Test: select this function and click Run, then check Execution log
function testLookup() {
  Logger.log('API key configured: ' + (BARCODELOOKUP_API_KEY ? 'YES (' + BARCODELOOKUP_API_KEY.substring(0, 5) + '...)' : 'NO'));
  var result = lookupEan('768686474972');
  Logger.log('Giro result: ' + JSON.stringify(result));
}
