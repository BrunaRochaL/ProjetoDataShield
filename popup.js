document.addEventListener("DOMContentLoaded", () => {
  console.log("aq");
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: checkCurrentPage,
    });
  });
});

function checkCurrentPage() {
  // Obter URL da aba atual
  const url = window.location.href;
  // Enviar URL para o service worker para verificação
  chrome.runtime.sendMessage({ action: "checkURLSafety", url: url });
}
