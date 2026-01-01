
# ШАГ — Backend (Google Apps Script v15.0)

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
    var userSheet = ss.getSheetByName('Users');
    var allUsers = getRowsAsObjects(userSheet);
    
    return createResponse({
      result: 'success',
      dynamicMentors: allUsers,
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
    if (user) {
      return createResponse({ result: 'success', user: user });
    } else {
      return createResponse({ result: 'error', message: 'Неверный логин или пароль' });
    }
  }
}

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var data = JSON.parse(e.postData.contents);
  var action = data.action;

  // --- МАССОВАЯ ОЧИСТКА ---
  if (action === 'clear_all') {
    var sheetName = "";
    if (data.type === 'services') sheetName = 'Services';
    if (data.type === 'jobs') sheetName = 'Jobs';
    if (data.type === 'bookings') sheetName = 'Bookings';
    
    if (sheetName) {
      var sheet = ss.getSheetByName(sheetName);
      if (sheet && sheet.getLastRow() > 1) {
        sheet.deleteRows(2, sheet.getLastRow() - 1);
      }
      return createResponse({ result: 'success' });
    }
  }

  // --- УСЛУГИ (ШАГИ) ---
  if (action === 'save_service') {
    var sheet = getOrCreateSheet(ss, 'Services', ["id", "mentorId", "mentorName", "title", "description", "price", "groupPrice", "maxParticipants", "format", "duration", "category", "slots", "imageUrl", "videoUrl"]);
    appendData(sheet, data);
    return createResponse({ result: 'success' });
  }

  if (action === 'update_service') {
    var sheet = ss.getSheetByName('Services');
    updateRow(sheet, 'id', data.id, data.updates);
    return createResponse({ result: 'success' });
  }

  if (action === 'delete_service') {
    var sheet = ss.getSheetByName('Services');
    deleteRow(sheet, 'id', data.id);
    return createResponse({ result: 'success' });
  }

  // --- ПОДРАБОТКИ (МИССИИ) ---
  if (action === 'save_job') {
    var sheet = getOrCreateSheet(ss, 'Jobs', ["id", "mentorId", "mentorName", "title", "description", "reward", "category", "telegram", "deadline", "status", "createdAt"]);
    appendData(sheet, data);
    return createResponse({ result: 'success' });
  }

  if (action === 'update_job') {
    var sheet = ss.getSheetByName('Jobs');
    updateRow(sheet, 'id', data.id, data.updates);
    return createResponse({ result: 'success' });
  }

  if (action === 'delete_job') {
    var sheet = ss.getSheetByName('Jobs');
    deleteRow(sheet, 'id', data.id);
    return createResponse({ result: 'success' });
  }

  // --- БРОНИРОВАНИЯ ---
  if (action === 'booking') {
    var bookingSheet = getOrCreateSheet(ss, 'Bookings', ["id", "mentorId", "mentorEmail", "userEmail", "userName", "format", "date", "time", "status", "goal", "price", "serviceId", "serviceTitle"]);
    appendData(bookingSheet, data);
    
    var transSheet = getOrCreateSheet(ss, 'Transactions', ["id", "userId", "amount", "type", "description", "status", "date"]);
    appendData(transSheet, {
      id: "GIFT-" + data.id,
      userId: data.userEmail,
      amount: data.price,
      type: "debit",
      description: "Вклад за ШАГ: " + data.serviceTitle,
      status: "completed",
      date: new Date().toISOString()
    });
    return createResponse({ result: 'success' });
  }

  if (action === 'update_booking') {
    var sheet = ss.getSheetByName('Bookings');
    updateRow(sheet, 'id', data.id, data.updates);
    return createResponse({ result: 'success' });
  }

  // --- ПРОФИЛЬ ---
  if (action === 'update_profile') {
    var sheet = ss.getSheetByName('Users');
    updateRow(sheet, 'email', data.email, data.updates);
    return createResponse({ result: 'success' });
  }

  if (action === 'register') {
    var sheet = getOrCreateSheet(ss, 'Users', ["id", "role", "name", "email", "password", "phone", "city", "direction", "companyName", "turnover", "slots", "paymentUrl", "qualities", "requestToYouth", "videoUrl", "timeLimit", "birthDate", "focusGoal", "expectations", "mutualHelp"]);
    var users = getRowsAsObjects(sheet);
    if (users.some(u => String(u.email).toLowerCase() === String(data.email).toLowerCase())) {
      return createResponse({ result: 'error', message: 'Email уже занят' });
    }
    appendData(sheet, data);
    return createResponse({ result: 'success' });
  }

  return createResponse({ result: 'error', message: 'Action not found: ' + action });
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
  var row = headers.map(h => data[h] !== undefined ? data[h] : "");
  sheet.appendRow(row);
}

function updateRow(sheet, key, value, updates) {
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var colIndex = headers.indexOf(key);
  if (colIndex === -1) return;
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][colIndex]).toLowerCase() === String(value).toLowerCase()) {
      for (var k in updates) {
        var updateCol = headers.indexOf(k);
        if (updateCol > -1) sheet.getRange(i + 1, updateCol + 1).setValue(updates[k]);
      }
      break;
    }
  }
}

function deleteRow(sheet, key, value) {
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var colIndex = headers.indexOf(key);
  if (colIndex === -1) return;
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][colIndex]).toLowerCase() === String(value).toLowerCase()) {
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
