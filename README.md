
# ШАГ — Backend (Google Apps Script v13.0)

Этот код обеспечивает логику "Meet for Charity": менторы проводят встречи бесплатно, а оплата талантов идет на развитие миссии платформы.

```javascript
/**
 * BACKEND СИСТЕМЫ ШАГ — MISSION CORE
 * Листы: Users, Bookings, Jobs, Messages, Transactions
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
      // Транзакции теперь просто история вкладов
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

  // ЛОГИКА ОПЛАТЫ ШАГА
  if (action === 'booking') {
    var bookingSheet = getOrCreateSheet(ss, 'Bookings', ["id", "mentorId", "mentorEmail", "userEmail", "userName", "format", "date", "time", "status", "goal", "price", "serviceId", "serviceTitle"]);
    appendData(bookingSheet, data);
    
    var transSheet = getOrCreateSheet(ss, 'Transactions', ["id", "userId", "amount", "type", "description", "status", "date"]);
    
    // 1. Фиксируем вклад Таланта
    appendData(transSheet, {
      id: "GIFT-" + data.id,
      userId: data.userEmail,
      amount: data.price,
      type: "debit",
      description: "Вклад за ШАГ: " + data.serviceTitle,
      status: "completed",
      date: new Date().toISOString()
    });

    // 2. Фиксируем вклад Ментора в историю (БЕЗ начисления денег)
    appendData(transSheet, {
      id: "IMPACT-" + data.id,
      userId: data.mentorEmail,
      amount: data.price,
      type: "credit",
      description: "Проведен ШАГ для " + data.userName,
      status: "completed",
      date: new Date().toISOString()
    });
    
    return createResponse({ result: 'success' });
  }

  // Обновление профиля
  if (action === 'update_profile') {
    var sheet = ss.getSheetByName('Users');
    updateRow(sheet, 'email', data.email, data.updates);
    return createResponse({ result: 'success' });
  }

  // Регистрация
  if (action === 'register') {
    var sheet = getOrCreateSheet(ss, 'Users', ["id", "role", "name", "email", "password", "phone", "city", "direction", "companyName", "turnover", "slots", "paymentUrl", "qualities", "requestToYouth", "videoUrl", "timeLimit", "birthDate", "focusGoal", "expectations", "mutualHelp"]);
    var users = getRowsAsObjects(sheet);
    if (users.some(u => String(u.email).toLowerCase() === String(data.email).toLowerCase())) {
      return createResponse({ result: 'error', message: 'Email уже занят' });
    }
    appendData(sheet, data);
    return createResponse({ result: 'success' });
  }

  return createResponse({ result: 'error', message: 'Action not found' });
}

// Хелперы остаются прежними...
function createResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function getRowsAsObjects(sheet) {
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
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
  var row = headers.map(h => data[h] || "");
  sheet.appendRow(row);
}

function updateRow(sheet, key, value, updates) {
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var colIndex = headers.indexOf(key);
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

function getOrCreateSheet(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
  }
  return sheet;
}
```
