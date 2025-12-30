
# ШАГ — Инструкция по настройке Backend (Google Sheets)

## ВАЖНО: Как обновлять скрипт
После любого изменения кода в Apps Script:
1. Нажмите кнопку **Развернуть** (Deploy) -> **Управление развертываниями**.
2. Нажмите на иконку **Карандаша** (Edit).
3. В выпадающем списке выберите **Новая версия** (New version).
4. Нажмите **Развернуть**. 
*Без этого действия изменения не вступят в силу!*

---

## Код для Google Apps Script (полная замена)

```javascript
/** 
 * ШАГ - Серверная логика
 * Версия 2.0 (Усиленная)
 */

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
        user = users.find(u => u.email === email);
      }
      
      var userBookings = email ? allBookings.filter(r => r.userEmail === email || String(r.mentorId) === String(email)) : [];
      
      return createResponse({ 
        result: 'success', 
        user: user || null,
        bookings: userBookings, 
        dynamicMentors: dynamicMentors,
        services: allServices
      });
    }

    if (action === 'login') {
      var email = e.parameter.email;
      var password = e.parameter.password;
      var users = getRowsAsObjects(ss.getSheetByName('Users'));
      var user = users.find(u => u.email === email && String(u.password) === String(password));
      
      if (user) {
        return createResponse({ result: 'success', user: user });
      } else {
        return createResponse({ result: 'error', message: 'Неверный email или пароль' });
      }
    }
  } catch (err) {
    return createResponse({ result: 'error', message: err.toString() });
  }
}

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;

    if (action === 'register') {
      var sheet = getOrCreateSheet(ss, 'Users', ["id", "role", "name", "email", "password", "city", "companyName", "turnover", "direction", "qualities", "requestToYouth", "videoUrl", "timeLimit", "slots", "birthDate", "phone", "focusGoal", "expectations", "mutualHelp", "paymentUrl", "createdAt"]);
      appendData(sheet, data);
      
      if (data.role === 'entrepreneur') {
        var mentorSheet = getOrCreateSheet(ss, 'Mentors', ["id", "name", "industry", "city", "description", "videoUrl", "avatarUrl", "singlePrice", "groupPrice", "ownerEmail", "slots", "createdAt"]);
        var mentorEntry = {
          id: data.id,
          name: data.name,
          industry: data.direction || "Предприниматель",
          city: data.city,
          description: data.qualities,
          videoUrl: data.videoUrl || "",
          avatarUrl: data.paymentUrl || "https://picsum.photos/seed/" + data.id + "/400/400",
          singlePrice: 1500,
          groupPrice: 800,
          ownerEmail: data.email,
          slots: data.slots,
          createdAt: new Date().toISOString()
        };
        appendData(mentorSheet, mentorEntry);
      }
      return createResponse({ result: 'success' });
    }

    if (action === 'save_avatar') {
      updateUserField(ss.getSheetByName('Users'), data.email, 'paymentUrl', data.avatarUrl);
      updateUserField(ss.getSheetByName('Mentors'), data.email, 'avatarUrl', data.avatarUrl, 'ownerEmail');
      return createResponse({ result: 'success' });
    }

    if (action === 'save_service') {
      var sheet = getOrCreateSheet(ss, 'Services', ["id", "mentorId", "mentorName", "title", "description", "price", "format", "duration", "category"]);
      appendData(sheet, data);
      return createResponse({ result: 'success' });
    }
    
    if (action === 'booking') {
      var sheet = getOrCreateSheet(ss, 'Bookings', ["id", "mentorId", "userEmail", "userName", "format", "date", "time", "status", "goal", "price"]);
      appendData(sheet, data);
      return createResponse({ result: 'success' });
    }

    if (action === 'save_mentor') {
      updateUserField(ss.getSheetByName('Mentors'), data.ownerEmail, 'slots', data.slots, 'ownerEmail');
      return createResponse({ result: 'success' });
    }

    return createResponse({ result: 'error', message: 'Unknown action: ' + action });
  } catch (err) {
    return createResponse({ result: 'error', message: err.toString() });
  }
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

function updateUserField(sheet, email, field, value, emailField) {
  if (!sheet) return;
  emailField = emailField || 'email';
  var data = getRowsAsObjects(sheet);
  var index = data.findIndex(d => String(d[emailField]).toLowerCase() === String(email).toLowerCase());
  if (index > -1) {
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var col = headers.indexOf(field) + 1;
    if (col > 0) {
      sheet.getRange(index + 2, col).setValue(value);
    }
  }
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
