
# ШАГ — Backend (Google Apps Script v33.2 - PAYMENTS READY)

### Новое в v33.2: Интеграция ЮKassa

Для работы платежей добавьте в скрипт следующие функции и замените блок `doPost`.

```javascript
/**
 * НАСТРОЙКИ ЮKASSA
 */
const SHOP_ID = 'ВАШ_SHOP_ID';
const SECRET_KEY = 'ВАШ_SECRET_KEY';

function getAuthHeader() {
  return "Basic " + Utilities.base64Encode(SHOP_ID + ":" + SECRET_KEY);
}

function createYookassaPayment(amount, description, bookingId) {
  const url = "https://api.yookassa.ru/v3/payments";
  const payload = {
    amount: { value: amount.toFixed(2), currency: "RUB" },
    capture: true,
    confirmation: { type: "redirect", return_url: "ВАШ_URL_САЙТА" },
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
  
  if (data.status === "pending") {
    return { result: "success", confirmation_url: data.confirmation.confirmation_url, payment_id: data.id };
  }
  return { result: "error", message: data.description || "Ошибка ЮKassa" };
}

// В doPost добавьте обработку action: 'create_yookassa_payment'
// И создайте отдельный эндпоинт для Webhook от ЮKassa (или обрабатывайте в doPost)
```

**Листы в таблице:** `Users`, `PendingUsers`, `Services`, `Bookings`, `Jobs`, `Messages`, `Transactions`.
