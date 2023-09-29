const reteLimit = require('express-rate-limit'); // лимит запросов //

module.exports.limiter = reteLimit({ // Создать лимит запросов //
  windowMs: 15 * 60 * 1000, // 15 минут //
  max: 100, // Максимальное количество запросов с одного ID //
  message: 'Превышен лимит запросов с вашего IP-адреса. Попробуйте позже.',
});
