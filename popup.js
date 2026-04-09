(function () {
  const listEl = document.getElementById('list');
  const countEl = document.getElementById('count');
  const searchEl = document.getElementById('search');
  const copyBtn = document.getElementById('copy');
  const exportBtn = document.getElementById('export');
  const clearBtn = document.getElementById('clear');
  const modeRadios = document.querySelectorAll('input[name="mode"]');

  let currentTabId = null;
  let currentTabHost = null;
  let rawHosts = [];
  let rendered = [];

  function getMode() {
    return document.querySelector('input[name="mode"]:checked').value;
  }

  function rootOf(host) {
    try {
      return tldts.getDomain(host) || host;
    } catch {
      return host;
    }
  }

  function compute() {
    const mode = getMode();
    let values;
    if (mode === 'root') {
      values = new Set(rawHosts.map(rootOf));
    } else {
      values = new Set(rawHosts);
    }
    const selfKey = currentTabHost
      ? (mode === 'root' ? rootOf(currentTabHost) : currentTabHost)
      : null;
    const arr = [...values].sort((a, b) => a.localeCompare(b));
    // Put the site's own domain first if present.
    if (selfKey && arr.includes(selfKey)) {
      const i = arr.indexOf(selfKey);
      arr.splice(i, 1);
      arr.unshift(selfKey);
    }
    rendered = arr;
    render();
  }

  function render() {
    const filter = searchEl.value.trim().toLowerCase();
    const items = filter
      ? rendered.filter((d) => d.toLowerCase().includes(filter))
      : rendered;
    listEl.innerHTML = '';
    countEl.textContent = String(items.length);
    if (items.length === 0) {
      const li = document.createElement('li');
      li.className = 'empty';
      li.textContent = rawHosts.length === 0
        ? 'No requests captured yet. Reload the page.'
        : 'No matches.';
      listEl.appendChild(li);
      return;
    }
    const selfKey = currentTabHost
      ? (getMode() === 'root' ? rootOf(currentTabHost) : currentTabHost)
      : null;
    for (const d of items) {
      const li = document.createElement('li');
      li.textContent = d;
      if (d === selfKey) li.className = 'self';
      listEl.appendChild(li);
    }
  }

  async function load() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) return;
    currentTabId = tab.id;
    try {
      currentTabHost = tab.url ? new URL(tab.url).hostname : null;
    } catch {
      currentTabHost = null;
    }
    chrome.runtime.sendMessage({ type: 'get', tabId: currentTabId }, (res) => {
      rawHosts = (res && res.hosts) || [];
      compute();
    });
  }

  modeRadios.forEach((r) => r.addEventListener('change', compute));
  searchEl.addEventListener('input', render);

  copyBtn.addEventListener('click', async () => {
    const text = rendered.join('\n');
    try {
      await navigator.clipboard.writeText(text);
      copyBtn.textContent = 'Copied!';
      setTimeout(() => (copyBtn.textContent = 'Copy'), 1000);
    } catch {
      copyBtn.textContent = 'Failed';
      setTimeout(() => (copyBtn.textContent = 'Copy'), 1000);
    }
  });

  exportBtn.addEventListener('click', () => {
    const text = rendered.join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const name = currentTabHost ? currentTabHost.replace(/[^\w.-]/g, '_') : 'domains';
    a.href = url;
    a.download = `domains-${name}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  clearBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'clear', tabId: currentTabId }, () => {
      rawHosts = [];
      compute();
    });
  });

  load();
})();
