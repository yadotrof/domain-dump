importScripts('vendor/psl-data.js', 'vendor/psl.js');

// tabId -> Set<hostname>
const perTab = new Map();

function addHost(tabId, url) {
  if (tabId == null || tabId < 0) return;
  if (!/^(https?|wss?):/i.test(url)) return;
  let host;
  try { host = new URL(url).hostname; } catch { return; }
  if (!host) return;
  let set = perTab.get(tabId);
  if (!set) {
    set = new Set();
    perTab.set(tabId, set);
  }
  set.add(host);
}

chrome.webRequest.onBeforeRequest.addListener(
  (details) => addHost(details.tabId, details.url),
  { urls: ['<all_urls>'] }
);

// Reset per-tab list when the top frame navigates to a new page.
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.frameId === 0) {
    perTab.delete(details.tabId);
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  perTab.delete(tabId);
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (!msg || typeof msg !== 'object') return;
  if (msg.type === 'get') {
    const set = perTab.get(msg.tabId);
    sendResponse({ hosts: set ? [...set] : [] });
    return; // sync response
  }
  if (msg.type === 'clear') {
    perTab.delete(msg.tabId);
    sendResponse({ ok: true });
    return;
  }
});
