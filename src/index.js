import {html, render} from 'lit-html';

// This is a lit-html template function. It returns a lit-html template.
const helloTemplate = (name) => html`<h1>Hello ${name}!</h1>`;

// This renders <div>Hello Steve!</div> to the document body
render(helloTemplate('Vivek'), document.body);
