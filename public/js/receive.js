const publicKeyDiv = document.querySelector('#public-key');
const qrCodeDiv = document.querySelector('#qrcode');

// Function to generate QR code
function generateQRCode(data) {
  qrCodeDiv.innerHTML = '';
  const qrCode = new QRCode(qrCodeDiv, {
    text: data,
    width: 256,
    height: 256,
    colorDark : '#000000',
    colorLight : '#ffffff',
    correctLevel : QRCode.CorrectLevel.H
  });
}

// Function to get public key
function getPublicKey() {
  fetch('/command', {
    method: 'POST',
    body: JSON.stringify({ command: 'novo-cli getnewaddress' }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.text())
  .then(data => {
    publicKeyDiv.textContent = data;
    generateQRCode(data);
  })
  .catch(error => console.error('Error getting public key:', error));
}

// Initial update of public key and QR code
getPublicKey();

