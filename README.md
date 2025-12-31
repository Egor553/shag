
# ШАГ — Инструкция по настройке Backend (Google Sheets)

## Код для Google Apps Script (Версия 5.0 - Полная поддержка Миссий)

Скопируйте этот код в редактор скриптов вашей Google Таблицы (Расширения -> Apps Script).

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
      var allJobs = getRowsAsObjects(ss.getSheetByName('Jobs'));
      
      var user = null;
      if (email) {
        var users = getRowsAsObjects(ss.getSheetByName('Users'));
        user = users.find(u => String(u.email).toLowerCase() === String(email).toLowerCase());
      }
      return createResponse({ 
        result: 'success', 
        user: user || null, 
        dynamicMentors: dynamicMentors, 
        services: allServices, 
        bookings: allBookings,
        jobs: allJobs
      });
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

    // Регистрация
    if (action === 'register') {
      var sheet = getOrCreateSheet(ss, 'Users', ["id", "email", "password", "name", "role", "city", "companyName", "turnover", "direction", "qualities", "requestToYouth", "videoUrl", "birthDate", "phone", "focusGoal", "expectations", "mutualHelp", "timeLimit", "slots", "paymentUrl", "createdAt"]);
      appendData(sheet, data);
      
      // Если это ментор, добавляем его также в таблицу Mentors для каталога
      if (data.role === 'entrepreneur') {
        var mentorSheet = getOrCreateSheet(ss, 'Mentors', ["id", "name", "industry", "city", "description", "videoUrl", "avatarUrl", "singlePrice", "groupPrice", "ownerEmail", "slots", "createdAt"]);
        appendData(mentorSheet, {
          id: data.id,
          name: data.name,
          industry: data.direction,
          city: data.city,
          description: data.qualities,
          videoUrl: data.videoUrl,
          avatarUrl: data.paymentUrl || 'https://picsum.photos/seed/default/400/400',
          singlePrice: data.singlePrice || 1500,
          groupPrice: data.groupPrice || 800,
          ownerEmail: data.email,
          slots: data.slots,
          createdAt: data.createdAt
        });
      }
      return createResponse({ result: 'success' });
    }

    // Профиль
    if (action === 'update_profile') {
      updateRow(ss.getSheetByName('Users'), 'email', data.email, data.updates);
      if (ss.getSheetByName('Mentors')) {
        updateRow(ss.getSheetByName('Mentors'), 'ownerEmail', data.email, data.updates);
      }
      return createResponse({ result: 'success' });
    }

    // Услуги
    if (action === 'save_service') {
      var sheet = getOrCreateSheet(ss, 'Services', ["id", "mentorId", "mentorName", "title", "description", "price", "groupPrice", "format", "duration", "category", "imageUrl", "videoUrl", "slots"]);
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

    // МИССИИ (ПОДРАБОТКА)
    if (action === 'save_job') {
      var sheet = getOrCreateSheet(ss, 'Jobs', ["id", "mentorId", "mentorName", "title", "description", "reward", "category", "deadline", "status", "createdAt"]);
      appendData(sheet, data);
      return createResponse({ result: 'success' });
    }

    if (action === 'delete_job') {
      deleteRow(ss.getSheetByName('Jobs'), 'id', data.id);
      return createResponse({ result: 'success' });
    }

    // Бронирование
    if (action === 'booking') {
      var sheet = getOrCreateSheet(ss, 'Bookings', ["id", "mentorId", "userEmail", "userName", "format", "date", "time", "status", "goal", "exchange", "price", "serviceId", "serviceTitle"]);
      appendData(sheet, data);
      return createResponse({ result: 'success' });
    }

    return createResponse({ result: 'error', message: 'Unknown action: ' + action });
  } catch (err) { return createResponse({ result: 'error', message: err.toString() }); }
}

// Вспомогательные функции
function getOrCreateSheet(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) { 
    sheet = ss.insertSheet(name); 
    sheet.appendRow(headers); 
  }
  return sheet;
}

function appendData(sheet, data) {
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var newRow = headers.map(h => data[h] !== undefined ? data[h] : "");
  sheet.appendRow(newRow);
}

function updateRow(sheet, keyName, keyValue, updates) {
  if (!sheet) return;
  var rows = sheet.getDataRange().getValues();
  var headers = rows[0];
  var keyIndex = headers.indexOf(keyName);
  if (keyIndex === -1) return;

  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][keyIndex]).toLowerCase() === String(keyValue).toLowerCase()) {
      for (var key in updates) {
        var col = headers.indexOf(key) + 1;
        if (col > 0) sheet.getRange(i + 1, col).setValue(updates[key]);
      }
    }
  }
}

function deleteRow(sheet, keyName, keyValue) {
  if (!sheet) return;
  var rows = sheet.getDataRange().getValues();
  var headers = rows[0];
  var keyIndex = headers.indexOf(keyName);
  if (keyIndex === -1) return;

  for (var i = rows.length - 1; i >= 1; i--) {
    if (String(rows[i][keyIndex]) === String(keyValue)) {
      sheet.deleteRow(i + 1);
    }
  }
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
