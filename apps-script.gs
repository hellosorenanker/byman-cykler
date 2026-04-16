/**
 * Google Apps Script for Byman Cykler EAN Scanner
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
 */

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  var now = new Date();

  // Ensure headers exist
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['EAN', 'Quantity', 'Last Updated']);
    sheet.getRange(1, 1, 1, 3).setFontWeight('bold');
  }

  var items = data.items;

  for (var i = 0; i < items.length; i++) {
    var ean = items[i].ean;
    var qty = items[i].quantity;

    // Check if EAN already exists in the sheet
    var existingRow = findEanRow(sheet, ean);

    if (existingRow > 0) {
      // Update existing row
      sheet.getRange(existingRow, 2).setValue(qty);
      sheet.getRange(existingRow, 3).setValue(now);
    } else {
      // Add new row
      sheet.appendRow([ean, qty, now]);
    }
  }

  return ContentService.createTextOutput(
    JSON.stringify({ status: 'ok', count: items.length })
  ).setMimeType(ContentService.MimeType.JSON);
}

function findEanRow(sheet, ean) {
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return -1; // Only header or empty

  var eanColumn = sheet.getRange(2, 1, lastRow - 1, 1).getValues();

  for (var i = 0; i < eanColumn.length; i++) {
    if (String(eanColumn[i][0]) === String(ean)) {
      return i + 2; // +2 because array is 0-indexed and we skip header
    }
  }

  return -1; // Not found
}

// Test function — run this to verify the script works
function testDoPost() {
  var testEvent = {
    postData: {
      contents: JSON.stringify({
        items: [
          { ean: '5901234123457', quantity: 3 },
          { ean: '4006381333931', quantity: 1 }
        ]
      })
    }
  };

  var result = doPost(testEvent);
  Logger.log(result.getContent());
}
