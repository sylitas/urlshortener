const today = new Date();
exports.generateExpiredDate = (days) => new Date(new Date().setDate(today.getDate() + days));