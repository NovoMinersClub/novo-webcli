const output = document.querySelector('#network-info');

function refreshNetworkInfo() {
  fetch('/command', {
    method: 'POST',
    body: JSON.stringify({ command: 'novo-cli getnetworkinfo' }),
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
}

// Refresh blockchain info every second
setInterval(refreshNetworkInfo, 1000);

