
# ШАГ — Backend (Google Apps Script v17.0)

Этот код обеспечивает логику "Meet for Charity": менторы проводят встречи бесплатно, а оплата талантов идет на развитие миссии платформы.

```javascript
/**
 * BACKEND СИСТЕМЫ ШАГ — MISSION CORE
 * Листы: Users, Bookings, Jobs, Messages, Transactions, Services
 */

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var action = e.parameter.action;
  
  if (action === 'sync') {
    var email = e.parameter.email;
    return createResponse({
      result: 'success',
      dynamicMentors: getRowsAsObjects(ss.getSheetByName('Users')),
      services: getRowsAsObjects(ss.getSheetByName('Services')),
      bookings: getRowsAsObjects(ss.getSheetByName('Bookings')),
      jobs: getRowsAsObjects(ss.getSheetByName('Jobs')),
      transactions: email ? getRowsAsObjects(ss.getSheetByName('Transactions')).filter(t => t.userId === email) : []
    });
  }
  
  if (action === 'login') {
    var users = getRowsAsObjects(ss.getSheetByName('Users'));
    var user = users.find(u => 
      String(u.email).toLowerCase() === String(e.parameter.email).toLowerCase() && 
      String(u.password) === String(e.parameter.password)
    );
    return user ? createResponse({ result: 'success', user: user }) : createResponse({ result: 'error', message: 'Ошибка входа' });
  }
}

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var data = JSON.parse(e.postData.contents);
  var action = data.action;

  // --- МАССОВАЯ ОЧИСТКА ---
  if (action === 'clear_all') {
    var sheetName = (data.type === 'services' ? 'Services' : (data.type === 'jobs' ? 'Jobs' : (data.type === 'bookings' ? 'Bookings' : '')));
    if (sheetName) {
      var sheet = ss.getSheetByName(sheetName);
      if (sheet && sheet.getLastRow() > 1) {
        sheet.deleteRows(2, sheet.getLastRow() - 1);
      }
      SpreadsheetApp.flush();
      return createResponse({ result: 'success' });
    }
  }

  // --- УСЛУГИ ---
  if (action === 'save_service') {
    var sheet = getOrCreateSheet(ss, 'Services', ["id", "mentorId", "mentorName", "title", "description", "price", "groupPrice", "maxParticipants", "format", "duration", "category", "slots", "imageUrl", "videoUrl"]);
    appendData(sheet, data);
    SpreadsheetApp.flush();
    return createResponse({ result: 'success' });
  }

  if (action === 'update_service') {
    updateRow(ss.getSheetByName('Services'), 'id', data.id, data.updates);
    SpreadsheetApp.flush();
    return createResponse({ result: 'success' });
  }

  if (action === 'delete_service') {
    deleteRow(ss.getSheetByName('Services'), 'id', data.id);
    SpreadsheetApp.flush();
    return createResponse({ result: 'success' });
  }

  // --- МИССИИ ---
  if (action === 'save_job') {
    var sheet = getOrCreateSheet(ss, 'Jobs', ["id", "mentorId", "mentorName", "title", "description", "reward", "category", "telegram", "deadline", "status", "createdAt"]);
    appendData(sheet, data);
    SpreadsheetApp.flush();
    return createResponse({ result: 'success' });
  }

  if (action === 'update_job') {
    updateRow(ss.getSheetByName('Jobs'), 'id', data.id, data.updates);
    SpreadsheetApp.flush();
    return createResponse({ result: 'success' });
  }

  if (action === 'delete_job') {
    deleteRow(ss.getSheetByName('Jobs'), 'id', data.id);
    SpreadsheetApp.flush();
    return createResponse({ result: 'success' });
  }

  // --- ПРОФИЛЬ ---
  if (action === 'update_profile') {
    updateRow(ss.getSheetByName('Users'), 'email', data.email, data.updates);
    SpreadsheetApp.flush();
    return createResponse({ result: 'success' });
  }

  if (action === 'register') {
    var sheet = getOrCreateSheet(ss, 'Users', ["id", "role", "name", "email", "password", "phone", "city", "direction", "companyName", "turnover", "slots", "paymentUrl", "qualities", "requestToYouth", "videoUrl", "timeLimit", "birthDate", "focusGoal", "expectations", "mutualHelp"]);
    appendData(sheet, data);
    SpreadsheetApp.flush();
    return createResponse({ result: 'success' });
  }

  return createResponse({ result: 'error', message: 'Action not found' });
}

function createResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function getRowsAsObjects(sheet) {
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  var headers = data[0];
  var rows = [];
  for (var i = 1; i < data.length; i++) {
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = data[i][j];
    }
    rows.push(obj);
  }
  return rows;
}

function appendData(sheet, data) {
  var headers = sheet.getDataRange().getValues()[0];
  var row = headers.map(function(h) { return data[h] !== undefined ? data[h] : ""; });
  sheet.appendRow(row);
}

function updateRow(sheet, key, value, updates) {
  if (!sheet) return;
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var colIndex = headers.indexOf(key);
  if (colIndex === -1) return;
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][colIndex]) === String(value)) {
      for (var k in updates) {
        var updateCol = headers.indexOf(k);
        if (updateCol > -1) sheet.getRange(i + 1, updateCol + 1).setValue(updates[k]);
      }
      break;
    }
  }
}

function deleteRow(sheet, key, value) {
  if (!sheet) return;
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var colIndex = headers.indexOf(key);
  if (colIndex === -1) return;
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][colIndex]) === String(value)) {
      sheet.deleteRow(i + 1);
      break;
    }
  }
}

function getOrCreateSheet(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
  }
  return sheet;
}
```
