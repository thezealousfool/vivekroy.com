// const {neverland, html, useState} = window.neverland;
import {neverland, html, useState} from 'neverland';

const Counter = neverland(() => {
  const [count, setCount] = useState(0);
  return html`
  <button onclick=${() => setCount(count + 1)}>
    Count: ${count}
  </button>`;
});

document.body.appendChild(Counter());
