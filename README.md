
# ШАГ — Backend (Google Apps Script v30.0 - ULTRA STABLE)

Этот скрипт — ядро платформы. Он управляет всеми базами данных. 
Инструкция:
1. Создайте Google Таблицу.
2. В меню выберите: Extensions -> Apps Script.
3. Вставьте код ниже.
4. Нажмите "Deploy" -> "New Deployment" -> "Web App".
5. Установите доступ: "Who has access: Anyone".
6. Скопируйте полученный URL в `services/databaseService.ts`.

```javascript
/**
 * MISSION CORE ENGINE v30.0
 * Поддержка: Менторы, Таланты, Админы
 */

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var action = e.parameter.action;
  
  // Синхронизация данных
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
  
  // Авторизация
  if (action === 'login') {
    var users = getRowsAsObjects(ss.getSheetByName('Users'));
    var user = users.find(u => 
      String(u.email).toLowerCase().trim() === String(e.parameter.email).toLowerCase().trim() && 
      String(u.password).trim() === String(e.parameter.password).trim()
    );
    return user ? createResponse({ result: 'success', user: user }) : createResponse({ result: 'error', message: 'Неверные данные' });
  }

  // Сообщения чата
  if (action === 'get_messages') {
    var messages = getRowsAsObjects(ss.getSheetByName('Messages'));
    var filtered = messages.filter(m => String(m.bookingId) === String(e.parameter.bookingId));
    return createResponse({ result: 'success', messages: filtered });
  }
}

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var data = JSON.parse(e.postData.contents);
  var action = data.action;

  // --- УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯМИ ---
  if (action === 'register') {
    var sheet = getOrCreateSheet(ss, 'Users', ["id", "role", "name", "email", "password", "phone", "city", "direction", "companyName", "turnover", "slots", "paymentUrl", "qualities", "requestToYouth", "videoUrl", "timeLimit", "birthDate", "focusGoal", "expectations", "mutualHelp", "balance", "lastWeeklyUpdate"]);
    appendData(sheet, data);
    return createResponse({ result: 'success' });
  }

  if (action === 'update_profile') {
    updateRow(ss.getSheetByName('Users'), 'email', data.email, data.updates);
    return createResponse({ result: 'success' });
  }

  if (action === 'delete_user') {
    deleteRow(ss.getSheetByName('Users'), 'email', data.email);
    return createResponse({ result: 'success' });
  }

  // --- ШАГи (УСЛУГИ) ---
  if (action === 'save_service') {
    var sheet = getOrCreateSheet(ss, 'Services', ["id", "mentorId", "mentorName", "title", "description", "price", "groupPrice", "maxParticipants", "format", "duration", "category", "slots", "imageUrl", "videoUrl"]);
    appendData(sheet, data);
    return createResponse({ result: 'success' });
  }

  if (action === 'update_service') {
    updateRow(ss.getSheetByName('Services'), 'id', data.id, data.updates);
    return createResponse({ result: 'success' });
  }

  if (action === 'delete_service') {
    deleteRow(ss.getSheetByName('Services'), 'id', data.id);
    return createResponse({ result: 'success' });
  }

  // --- МИССИИ (ВАКАНСИИ) ---
  if (action === 'save_job') {
    var sheet = getOrCreateSheet(ss, 'Jobs', ["id", "mentorId", "mentorName", "title", "description", "reward", "category", "telegram", "deadline", "status", "createdAt"]);
    appendData(sheet, data);
    return createResponse({ result: 'success' });
  }

  if (action === 'update_job') {
    updateRow(ss.getSheetByName('Jobs'), 'id', data.id, data.updates);
    return createResponse({ result: 'success' });
  }

  if (action === 'delete_job') {
    deleteRow(ss.getSheetByName('Jobs'), 'id', data.id);
    return createResponse({ result: 'success' });
  }

  // --- ВСТРЕЧИ (БРОНИРОВАНИЯ) ---
  if (action === 'save_booking') {
    var sheet = getOrCreateSheet(ss, 'Bookings', ["id", "mentorId", "mentorName", "userEmail", "userName", "format", "date", "time", "status", "goal", "exchange", "price", "serviceId", "serviceTitle"]);
    appendData(sheet, data);
    // Логируем как транзакцию
    var txSheet = getOrCreateSheet(ss, 'Transactions', ["id", "userId", "amount", "type", "description", "status", "date"]);
    appendData(txSheet, {
      id: "TX-" + data.id,
      userId: data.mentorId,
      amount: data.price,
      type: 'credit',
      description: "ШАГ: " + data.serviceTitle,
      status: 'completed',
      date: new Date().toISOString()
    });
    return createResponse({ result: 'success' });
  }

  if (action === 'update_booking') {
    updateRow(ss.getSheetByName('Bookings'), 'id', data.id, data.updates);
    return createResponse({ result: 'success' });
  }

  if (action === 'delete_booking') {
    deleteRow(ss.getSheetByName('Bookings'), 'id', data.id);
    return createResponse({ result: 'success' });
  }

  // --- ЧАТ ---
  if (action === 'send_message') {
    var sheet = getOrCreateSheet(ss, 'Messages', ["id", "bookingId", "senderEmail", "senderName", "text", "timestamp"]);
    appendData(sheet, data);
    return createResponse({ result: 'success' });
  }

  // --- АДМИН ПАНЕЛЬ (ОЧИСТКА) ---
  if (action === 'clear_all') {
    var sheetNames = { services: 'Services', jobs: 'Jobs', bookings: 'Bookings' };
    var targetSheet = ss.getSheetByName(sheetNames[data.type]);
    if (targetSheet && targetSheet.getLastRow() > 1) {
      targetSheet.deleteRows(2, targetSheet.getLastRow() - 1);
    }
    return createResponse({ result: 'success' });
  }

  return createResponse({ result: 'error', message: 'Action not found' });
}

// УТИЛИТЫ

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
      var val = data[i][j];
      obj[headers[j]] = (val instanceof Date) ? val.toISOString() : val;
    }
    rows.push(obj);
  }
  return rows;
}

function appendData(sheet, data) {
  var headers = sheet.getDataRange().getValues()[0];
  var row = headers.map(h => (data[h] !== undefined) ? data[h] : "");
  sheet.appendRow(row);
  SpreadsheetApp.flush();
}

function updateRow(sheet, key, value, updates) {
  if (!sheet) return;
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var colIdx = headers.indexOf(key);
  if (colIdx === -1) return;
  var searchVal = String(value).toLowerCase().trim();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][colIdx]).toLowerCase().trim() === searchVal) {
      for (var k in updates) {
        var uIdx = headers.indexOf(k);
        if (uIdx > -1) sheet.getRange(i + 1, uIdx + 1).setValue(updates[k]);
      }
      break;
    }
  }
  SpreadsheetApp.flush();
}

function deleteRow(sheet, key, value) {
  if (!sheet) return;
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var colIdx = headers.indexOf(key);
  if (colIdx === -1) return;
  var searchVal = String(value).toLowerCase().trim();
  for (var i = data.length - 1; i >= 1; i--) {
    if (String(data[i][colIdx]).toLowerCase().trim() === searchVal) {
      sheet.deleteRow(i + 1);
    }
  }
  SpreadsheetApp.flush();
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
