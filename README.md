
# ШАГ — Backend (Google Apps Script v33.0 - MODERATION ENGINE)

Замените ваш текущий код в Apps Script на этот. Он поддерживает раздельные листы для модерации и участников, а также перенос строк.

**Важно:** Убедитесь, что у вас созданы листы с именами: `Users`, `PendingUsers`, `Services`, `Bookings`, `Jobs`, `Messages`, `Transactions`.

```javascript
/**
 * MISSION CORE ENGINE v33.0 - PRODUCTION READY
 */

const HEADERS = ["id", "role", "name", "email", "password", "phone", "city", "direction", "companyName", "turnover", "slots", "paymentUrl", "qualities", "requestToYouth", "videoUrl", "timeLimit", "birthDate", "focusGoal", "expectations", "mutualHelp", "balance", "status", "lastWeeklyUpdate", "businessClubs", "lifestyle"];

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var action = e.parameter.action;
  
  if (action === 'sync') {
    var email = e.parameter.email;
    var adminMode = e.parameter.admin_access === 'true';
    
    // Получаем данные из обоих листов пользователей
    var activeUsers = getRowsAsObjects(ss.getSheetByName('Users'));
    var pendingUsers = getRowsAsObjects(ss.getSheetByName('PendingUsers'));
    
    // Для админа отдаем всё, для обычного пользователя только активных
    var allUsers = adminMode ? activeUsers.concat(pendingUsers) : activeUsers;

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
    var users = getRowsAsObjects(ss.getSheetByName('Users')).concat(getRowsAsObjects(ss.getSheetByName('PendingUsers')));
    var user = users.find(u => 
      String(u.email).toLowerCase().trim() === String(e.parameter.email).toLowerCase().trim() && 
      String(u.password).trim() === String(e.parameter.password).trim()
    );
    return user ? createResponse({ result: 'success', user: user }) : createResponse({ result: 'error', message: 'Неверные данные или пользователь еще не одобрен' });
  }

  if (action === 'get_messages') {
    return createResponse({ result: 'success', messages: getRowsAsObjects(ss.getSheetByName('Messages')).filter(m => String(m.bookingId) === String(e.parameter.bookingId)) });
  }
}

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var data = JSON.parse(e.postData.contents);
  var action = data.action;

  // --- РЕГИСТРАЦИЯ С ПРОВЕРКОЙ EMAIL ПО ВСЕМ ЛИСТАМ ---
  if (action === 'register') {
    var allUsers = getRowsAsObjects(ss.getSheetByName('Users')).concat(getRowsAsObjects(ss.getSheetByName('PendingUsers')));
    var exists = allUsers.some(u => String(u.email).toLowerCase().trim() === String(data.email).toLowerCase().trim());
    
    if (exists) {
      return createResponse({ result: 'error', message: 'Этот email уже занят' });
    }

    // Предприниматели в модерацию, таланты сразу в активные
    var targetSheetName = data.role === 'entrepreneur' ? 'PendingUsers' : 'Users';
    var sheet = getOrCreateSheet(ss, targetSheetName, HEADERS);
    appendData(sheet, data);
    return createResponse({ result: 'success' });
  }

  // --- ОДОБРЕНИЕ (ПЕРЕНОС ИЗ МОДЕРАЦИИ В УЧАСТНИКИ) ---
  if (action === 'approve_user') {
    var pendingSheet = ss.getSheetByName('PendingUsers');
    var usersSheet = getOrCreateSheet(ss, 'Users', HEADERS);
    var userData = findAndRemoveRow(pendingSheet, 'email', data.email);
    
    if (userData) {
      userData.status = 'active'; // Обновляем статус
      appendData(usersSheet, userData);
      return createResponse({ result: 'success', message: 'Пользователь одобрен и перенесен' });
    }
    return createResponse({ result: 'error', message: 'Пользователь не найден в листе модерации' });
  }

  if (action === 'reject_user') {
    updateRow(ss.getSheetByName('PendingUsers'), 'email', data.email, { status: 'rejected' });
    return createResponse({ result: 'success', message: 'Заявка отклонена' });
  }

  // --- ОБЩИЕ ДЕЙСТВИЯ ---
  if (action === 'update_profile') {
    var s1 = ss.getSheetByName('Users');
    var s2 = ss.getSheetByName('PendingUsers');
    updateRow(s1, 'email', data.email, data.updates);
    updateRow(s2, 'email', data.email, data.updates);
    return createResponse({ result: 'success' });
  }

  if (action === 'save_service') { appendData(getOrCreateSheet(ss, 'Services', ["id", "mentorId", "mentorName", "title", "description", "price", "groupPrice", "maxParticipants", "format", "duration", "category", "slots", "imageUrl", "videoUrl"]), data); return createResponse({ result: 'success' }); }
  if (action === 'save_job') { appendData(getOrCreateSheet(ss, 'Jobs', ["id", "mentorId", "mentorName", "title", "description", "reward", "category", "telegram", "deadline", "status", "createdAt"]), data); return createResponse({ result: 'success' }); }
  if (action === 'save_booking') { appendData(getOrCreateSheet(ss, 'Bookings', ["id", "mentorId", "mentorName", "userEmail", "userName", "format", "date", "time", "status", "goal", "exchange", "price", "serviceId", "serviceTitle"]), data); return createResponse({ result: 'success' }); }
  if (action === 'update_booking') { updateRow(ss.getSheetByName('Bookings'), 'id', data.id, data.updates); return createResponse({ result: 'success' }); }
  if (action === 'delete_user') { deleteRow(ss.getSheetByName('Users'), 'email', data.email); deleteRow(ss.getSheetByName('PendingUsers'), 'email', data.email); return createResponse({ result: 'success' }); }

  return createResponse({ result: 'error', message: 'Action not found: ' + action });
}

// УТИЛИТАРНЫЕ ФУНКЦИИ

function createResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function getRowsAsObjects(sheet) {
  if (!sheet) return [];
  var range = sheet.getDataRange();
  var data = range.getValues();
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
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][colIdx]).toLowerCase().trim() === String(value).toLowerCase().trim()) {
      for (var k in updates) {
        var uIdx = headers.indexOf(k);
        if (uIdx > -1) sheet.getRange(i + 1, uIdx + 1).setValue(updates[k]);
      }
      break;
    }
  }
}

function findAndRemoveRow(sheet, key, value) {
  if (!sheet) return null;
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var colIdx = headers.indexOf(key);
  if (colIdx === -1) return null;
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][colIdx]).toLowerCase().trim() === String(value).toLowerCase().trim()) {
      var obj = {};
      for (var j = 0; j < headers.length; j++) obj[headers[j]] = data[i][j];
      sheet.deleteRow(i + 1);
      return obj;
    }
  }
  return null;
}

function deleteRow(sheet, key, value) {
  if (!sheet) return;
  var data = sheet.getDataRange().getValues();
  var colIdx = data[0].indexOf(key);
  if (colIdx === -1) return;
  for (var i = data.length - 1; i >= 1; i--) {
    if (String(data[i][colIdx]).toLowerCase().trim() === String(value).toLowerCase().trim()) {
      sheet.deleteRow(i + 1);
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
