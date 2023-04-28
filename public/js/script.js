const form = document.querySelector('form');
const output = document.querySelector('#output');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const command = formData.get('command');
  const novoCommand = "novo-cli " + command;

  try {
    const result = await runCommand(novoCommand);
    output.textContent = result;
  } catch (error) {
    console.error(error);
    output.textContent = 'An error occurred';
  }
});

async function runCommand(command) {
  const response = await fetch('/command', {
    method: 'POST',
    body: JSON.stringify({ command }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.text();
}

document.addEventListener('DOMContentLoaded', async () => {
  const helpOutput = await runCommand('novo-cli help');
  document.getElementById('output').textContent = helpOutput;
});

