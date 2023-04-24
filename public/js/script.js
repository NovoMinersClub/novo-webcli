// script.js

const form = document.querySelector('form');
const output = document.querySelector('#output');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const command = formData.get('command');
  fetch('/command', {
    method: 'POST',
    body: JSON.stringify({ command }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then((response) => response.text())
  .then((data) => {
    output.textContent = data;
  })
  .catch((error) => {
    console.error(error);
    output.textContent = 'An error occurred';
  });
});
