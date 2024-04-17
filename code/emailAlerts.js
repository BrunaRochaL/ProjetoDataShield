function checkForAlerts(data) {
  const { is_disposable, is_free, is_spam } = data;
  if (is_disposable || is_free || is_spam) {
    console.log("ALERTA: E-mail suspeito detectado!");
  }
}

module.exports = checkForAlerts;
