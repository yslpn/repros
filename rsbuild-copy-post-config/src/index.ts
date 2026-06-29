const targets = [
  {
    label: 'server.publicDir',
    url: '/public-config.json',
  },
  {
    label: 'output.copy',
    url: '/copy-config.json',
  },
];

const root = document.querySelector('#root')!;

root.innerHTML = `
  <main>
    <h1>Rsbuild dev static POST repro</h1>
    <p>Open DevTools Network. This page sends POST requests to two JSON files.</p>
    <ul>
      ${targets
        .map(
          (target, index) =>
            `<li><code>POST ${target.url}</code> from ${target.label}: <strong id="status-${index}">pending</strong></li>`,
        )
        .join('')}
    </ul>
  </main>
`;

for (const [index, target] of targets.entries()) {
  const status = document.querySelector(`#status-${index}`)!;

  fetch(target.url, { method: 'POST' })
    .then(async (response) => {
      const body = await response.text();
      status.textContent = `${response.status} ${response.ok ? 'OK' : 'ERROR'} ${body.trim()}`;
    })
    .catch((error: unknown) => {
      status.textContent = `request failed: ${String(error)}`;
    });
}
