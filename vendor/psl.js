// Minimal Public Suffix List matcher.
// Depends on PSL_DATA (see psl-data.js).
//
// Algorithm (per https://publicsuffix.org/list/):
//   1. Split the hostname into labels.
//   2. Find the longest matching rule, where:
//        - a normal rule "a.b.c" matches if the hostname's trailing labels equal it;
//        - a wildcard rule "*.b.c" matches if the hostname has any label followed by "b.c";
//        - an exception "!a.b.c" cancels a wildcard match and the public suffix is the
//          rule minus its first label.
//   3. The public suffix = the matched rule (or, for exceptions, the rule without its
//      first label). The registrable domain ("eTLD+1") = the public suffix preceded by
//      one more label from the hostname.

(function () {
  const DATA = self.PSL_DATA;
  if (!DATA) return;

  const ruleSet = new Set(DATA.rules);
  const wildcardSet = new Set(DATA.wildcards);
  const exceptionSet = new Set(DATA.exceptions);

  function publicSuffix(host) {
    const labels = host.split('.');
    // Try progressively shorter suffixes: labels[i..], labels[i+1..], ...
    for (let i = 0; i < labels.length; i++) {
      const suffix = labels.slice(i).join('.');
      // Exception wins over wildcard.
      if (exceptionSet.has(suffix)) {
        // Public suffix = suffix without its first label.
        return labels.slice(i + 1).join('.');
      }
      if (ruleSet.has(suffix)) {
        return suffix;
      }
      // Wildcard: "*.foo" matches "x.foo" — i.e. if labels[i+1..] is in wildcardSet.
      if (i + 1 < labels.length) {
        const wildcardTail = labels.slice(i + 1).join('.');
        if (wildcardSet.has(wildcardTail)) {
          return suffix; // the full match including the wildcard-covered label
        }
      }
    }
    // Default rule: if no rule matches, the entire TLD is the public suffix.
    return labels[labels.length - 1] || '';
  }

  function getDomain(host) {
    if (!host) return '';
    host = String(host).toLowerCase();
    // Strip trailing dot, if any.
    if (host.endsWith('.')) host = host.slice(0, -1);
    // Skip IPs and single-label hosts ("localhost").
    if (!host.includes('.')) return host;
    if (/^[\d.]+$/.test(host)) return host; // IPv4
    if (host.includes(':')) return host; // IPv6 or host:port — shouldn't happen here
    const suffix = publicSuffix(host);
    if (!suffix || suffix === host) return host;
    const suffixLabels = suffix.split('.').length;
    const hostLabels = host.split('.');
    if (hostLabels.length <= suffixLabels) return host;
    return hostLabels.slice(hostLabels.length - suffixLabels - 1).join('.');
  }

  self.PSL = { getDomain, publicSuffix };
})();
