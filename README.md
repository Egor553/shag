
# ШАГ — Инструкция по настройке Backend (Google Sheets)

## Код для Google Apps Script (Версия 4.0 - Advanced Services)

```javascript
function doGet(e) {
  var action = e.parameter.action;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  try {
    if (action === 'sync') {
      var email = e.parameter.email;
      var dynamicMentors = getRowsAsObjects(ss.getSheetByName('Mentors'));
      var allServices = getRowsAsObjects(ss.getSheetByName('Services'));
      var allBookings = getRowsAsObjects(ss.getSheetByName('Bookings'));
      var user = null;
      if (email) {
        var users = getRowsAsObjects(ss.getSheetByName('Users'));
        user = users.find(u => String(u.email).toLowerCase() === String(email).toLowerCase());
      }
      return createResponse({ result: 'success', user: user || null, dynamicMentors: dynamicMentors, services: allServices, bookings: allBookings });
    }
    if (action === 'login') {
      var email = e.parameter.email;
      var password = e.parameter.password;
      var users = getRowsAsObjects(ss.getSheetByName('Users'));
      var user = users.find(u => String(u.email).toLowerCase() === String(email).toLowerCase() && String(u.password) === String(password));
      return user ? createResponse({ result: 'success', user: user }) : createResponse({ result: 'error', message: 'Неверный пароль' });
    }
  } catch (err) { return createResponse({ result: 'error', message: err.toString() }); }
}

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;

    if (action === 'save_service') {
      var sheet = getOrCreateSheet(ss, 'Services', ["id", "mentorId", "mentorName", "title", "description", "price", "groupPrice", "format", "duration", "category", "imageUrl", "videoUrl", "slots"]);
      appendData(sheet, data);
      return createResponse({ result: 'success' });
    }

    if (action === 'update_service') {
      var sheet = ss.getSheetByName('Services');
      if (sheet) {
        var rows = sheet.getDataRange().getValues();
        var headers = rows[0];
        for (var i = 1; i < rows.length; i++) {
          if (String(rows[i][0]) === String(data.id)) {
            for (var key in data.updates) {
              var col = headers.indexOf(key) + 1;
              if (col > 0) sheet.getRange(i + 1, col).setValue(data.updates[key]);
            }
            break;
          }
        }
      }
      return createResponse({ result: 'success' });
    }

    if (action === 'delete_service') {
      var sheet = ss.getSheetByName('Services');
      if (sheet) {
        var rows = sheet.getDataRange().getValues();
        for (var i = rows.length - 1; i >= 1; i--) {
          if (String(rows[i][0]) === String(data.id)) {
            sheet.deleteRow(i + 1);
            break;
          }
        }
      }
      return createResponse({ result: 'success' });
    }
    
    // ... (остальные действия register, update_profile, booking остаются без изменений)
    return createResponse({ result: 'error', message: 'Unknown action' });
  } catch (err) { return createResponse({ result: 'error', message: err.toString() }); }
}

function getOrCreateSheet(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) { sheet = ss.insertSheet(name); sheet.appendRow(headers); }
  return sheet;
}

function appendData(sheet, data) {
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var newRow = headers.map(h => data[h] !== undefined ? data[h] : "");
  sheet.appendRow(newRow);
}

function getRowsAsObjects(sheet) {
  if (!sheet || sheet.getLastRow() < 2) return [];
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  return data.slice(1).map(row => {
    var obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
}

function createResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
```
