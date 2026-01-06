
# ШАГ — Full Backend (Google Apps Script)

Этот скрипт объединяет управление базой данных в Google Таблицах и интеграцию с ЮKassa.

### Код для вставки в Apps Script (Code.gs)

```javascript
/**
 * НАСТРОЙКИ ЮKASSA (Берутся из свойств скрипта)
 */
const props = PropertiesService.getScriptProperties();
const SHOP_ID = props.getProperty('SHOP_ID');
const SECRET_KEY = props.getProperty('SECRET_KEY');
const RETURN_URL = props.getProperty('RETURN_URL');

function getAuthHeader() {
  return "Basic " + Utilities.base64Encode(SHOP_ID + ":" + SECRET_KEY);
}

/**
 * ГЛАВНЫЙ ОБРАБОТЧИК GET ЗАПРОСОВ (Синхронизация и вход)
 */
function doGet(e) {
  const action = e.parameter.action;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  try {
    if (action === 'sync') {
      const mentors = getSheetData(ss, "Users");
      const services = getSheetData(ss, "Services");
      const bookings = getSheetData(ss, "Bookings");
      const jobs = getSheetData(ss, "Jobs");
      const transactions = getSheetData(ss, "Transactions");
      
      const email = e.parameter.email;
      let userBookings = bookings;
      if (email && e.parameter.admin_access !== 'true') {
        userBookings = bookings.filter(b => 
          b.userEmail === email || b.mentorId === email
        );
      }

      return jsonResponse({
        result: "success",
        dynamicMentors: mentors,
        services: services,
        bookings: userBookings,
        jobs: jobs,
        transactions: transactions
      });
    }

    if (action === 'login') {
      const email = e.parameter.email;
      const password = e.parameter.password;
      const users = getSheetData(ss, "Users");
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        return jsonResponse({ result: "success", user: user });
      } else {
        // Проверяем в листе ожидания (Pending)
        const pending = getSheetData(ss, "PendingUsers");
        const pUser = pending.find(u => u.email === email && u.password === password);
        if (pUser) return jsonResponse({ result: "success", user: { ...pUser, status: 'pending' } });
        
        return jsonResponse({ result: "error", message: "Неверный логин или пароль" });
      }
    }
    
    return jsonResponse({ result: "error", message: "Unknown action" });
  } catch (err) {
    return jsonResponse({ result: "error", message: err.toString() });
  }
}

/**
 * ГЛАВНЫЙ ОБРАБОТЧИК POST ЗАПРОСОВ (Регистрация, Сохранение, Платежи)
 */
function doPost(e) {
  let contents;
  try {
    contents = JSON.parse(e.postData.contents);
  } catch(err) {
    // Если это webhook от ЮKassa (там другой формат)
    return handleYookassaWebhook(e);
  }

  const action = contents.action;
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  try {
    // 1. Создание платежа в ЮKassa
    if (action === 'create_yookassa_payment') {
      return jsonResponse(createYookassaPayment(contents.amount, contents.description, contents.bookingId));
    }

    // 2. Регистрация
    if (action === 'register') {
      const sheetName = contents.role === 'entrepreneur' ? "PendingUsers" : "Users";
      const sheet = ss.getSheetByName(sheetName);
      
      // Проверка на дубликат
      const existing = getSheetData(ss, sheetName).find(u => u.email === contents.email);
      if (existing) return jsonResponse({ result: "error", message: "Email уже зарегистрирован" });
      
      const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      const row = headers.map(h => contents[h] || "");
      sheet.appendRow(row);
      return jsonResponse({ result: "success" });
    }

    // 3. Сохранение бронирования
    if (action === 'save_booking') {
      const sheet = ss.getSheetByName("Bookings");
      const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      const row = headers.map(h => contents[h] || "");
      sheet.appendRow(row);
      return jsonResponse({ result: "success" });
    }

    // 4. Универсальное обновление
    if (action === 'update_profile' || action === 'update_service' || action === 'update_booking') {
      const sheetMap = { 'update_profile': 'Users', 'update_service': 'Services', 'update_booking': 'Bookings' };
      const sheet = ss.getSheetByName(sheetMap[action]);
      const data = sheet.getDataRange().getValues();
      const headers = data[0];
      const idKey = action === 'update_profile' ? 'email' : 'id';
      const targetId = contents[idKey];
      
      for (let i = 1; i < data.length; i++) {
        if (data[i][headers.indexOf(idKey)] == targetId) {
          const updates = contents.updates || contents;
          headers.forEach((h, colIdx) => {
            if (updates[h] !== undefined) {
              sheet.getRange(i + 1, colIdx + 1).setValue(updates[h]);
            }
          });
          return jsonResponse({ result: "success" });
        }
      }
    }

    return jsonResponse({ result: "error", message: "Action not implemented" });
  } catch (err) {
    return jsonResponse({ result: "error", message: err.toString() });
  }
}

/**
 * ФУНКЦИИ ЮKASSA
 */
function createYookassaPayment(amount, description, bookingId) {
  const url = "https://api.yookassa.ru/v3/payments";
  const payload = {
    amount: { value: Number(amount).toFixed(2), currency: "RUB" },
    capture: true,
    confirmation: { type: "redirect", return_url: RETURN_URL },
    description: description,
    metadata: { bookingId: bookingId }
  };

  const options = {
    method: "post",
    headers: {
      "Authorization": getAuthHeader(),
      "Idempotence-Key": Utilities.getUuid(),
      "Content-Type": "application/json"
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  const data = JSON.parse(response.getContentText());
  
  if (data.id && data.confirmation) {
    return { 
      result: "success", 
      confirmation_url: data.confirmation.confirmation_url, 
      payment_id: data.id 
    };
  }
  return { result: "error", message: data.description || "Ошибка ЮKassa" };
}

function handleYookassaWebhook(e) {
  const postData = JSON.parse(e.postData.contents);
  if (postData.event === "payment.succeeded") {
    const bookingId = postData.object.metadata.bookingId;
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("Bookings");
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == bookingId) {
        sheet.getRange(i + 1, 10).setValue("confirmed"); // Предполагаем 10 столбец - статус
        break;
      }
    }
  }
  return jsonResponse({ result: "ok" });
}

/**
 * ХЕЛПЕРЫ
 */
function getSheetData(ss, name) {
  const sheet = ss.getSheetByName(name);
  if (!sheet) return [];
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  return values.slice(1).map(row => {
    let obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
```
