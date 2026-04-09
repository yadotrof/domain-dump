# Privacy Policy — Domain Dump

_Last updated: 2026-04-09_

## English

**Domain Dump does not collect, store, transmit, or share any personal data.**

The extension observes the network requests of the browser tab you are actively viewing in order to build a list of the domains that tab contacts. This is its single purpose.

- **What is processed:** URLs of requests initiated by the current tab (only their hostnames are kept).
- **Where it is stored:** in memory of the extension's service worker, scoped to the tab. Data is discarded when the tab is closed or when you navigate to a new page.
- **What leaves your browser:** nothing. No analytics, no telemetry, no remote servers, no third-party SDKs. The extension makes no network requests of its own.
- **Who can see the data:** only you, inside the extension popup.
- **Permissions used:**
  - `webRequest` — to observe requests made by the current tab.
  - `webNavigation` — to reset the list when the tab navigates to a new page.
  - `host_permissions: <all_urls>` — so requests on any website the user visits can be observed.

The extension is open source. You can audit the full code at [github.com/yadotrof/domain-dump](https://github.com/yadotrof/domain-dump).

**Contact:** open an issue at [github.com/yadotrof/domain-dump/issues](https://github.com/yadotrof/domain-dump/issues).

---

## Русский

**Domain Dump не собирает, не хранит, не передаёт и не публикует никаких персональных данных.**

Расширение наблюдает за сетевыми запросами активной вкладки браузера, чтобы составить список доменов, к которым эта вкладка обращается. Это его единственная задача.

- **Что обрабатывается:** URL-адреса запросов, инициированных текущей вкладкой (сохраняются только их hostnames).
- **Где хранится:** в памяти service worker расширения, изолированно по вкладкам. Данные удаляются при закрытии вкладки или при переходе на новый URL.
- **Что покидает браузер:** ничего. Нет аналитики, телеметрии, удалённых серверов или сторонних SDK. Само расширение не делает никаких сетевых запросов.
- **Кто видит данные:** только вы, в попапе расширения.
- **Используемые разрешения:**
  - `webRequest` — наблюдение за запросами текущей вкладки.
  - `webNavigation` — сброс списка при навигации вкладки.
  - `host_permissions: <all_urls>` — чтобы можно было видеть запросы на любом сайте, который посещает пользователь.

Расширение имеет открытый исходный код. Полный код доступен на [github.com/yadotrof/domain-dump](https://github.com/yadotrof/domain-dump).

**Связь:** открой issue на [github.com/yadotrof/domain-dump/issues](https://github.com/yadotrof/domain-dump/issues).
