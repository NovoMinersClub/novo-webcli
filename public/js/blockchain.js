const output = document.querySelector('#blockchain-info');

function refreshBlockchainInfo() {
  fetch('/command', {
    method: 'POST',
    body: JSON.stringify({ command: 'novo-cli getblockchaininfo' }),
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
setInterval(refreshBlockchainInfo, 1000);

