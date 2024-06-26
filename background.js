chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.url &&
    tab.status === "complete" &&
    !changeInfo.url.startsWith("chrome://")
  ) {
    checkURLSafety(changeInfo.url, tabId);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "ping") {
    console.log("Ping received");
    sendResponse({ status: "Service Worker active" });
    return true;
  }

  if (message.action === "checkURLSafety") {
    checkURLSafety(message.url);
  }
});

async function checkURLSafety(url, tabId) {
  console.log("a1q");
  const apiKey = "AIzaSyDqHnBMZuz3pMvBDMfnnmOF4nvDIzKQEhQ";
  const response = await fetch(
    `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`,
    {
      method: "POST",
      body: JSON.stringify({
        client: {
          clientId: "DataShield",
          clientVersion: "1.0",
        },
        threatInfo: {
          threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
          platformTypes: ["WINDOWS"],
          threatEntryTypes: ["URL"],
          threatEntries: [{ url: url }],
        },
      }),
      headers: { "Content-Type": "application/json" },
    }
  );

  const data = await response.json();
  console.log("aqqq", data.matches, url);
  if (data.matches) {
    console.log("Unsafe URL detected:", data.matches);
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      function: showAlert,
      args: [data.matches],
    });
  }
}

function showAlert(matches) {
  const message = `Alerta de Segurança: Este site pode ser perigoso!\nMotivos: ${matches
    .map((m) => m.threatType)
    .join(", ")}`;
  alert(message);
}
