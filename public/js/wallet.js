document.addEventListener('DOMContentLoaded', () => {
  const walletOutput = document.querySelector('#wallet-info');
  const privateKeyForm = document.querySelector('#import-private-key-form');
  const transactionList = document.querySelector('#transaction-history');
  const output = document.querySelector('#import-private-key-output');
  const backupButton = document.querySelector('#backup-wallet-button');
  const backupOutput = document.querySelector('#backup-wallet-output');

// Function to format date string
function formatDate(timestamp) {
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);
  const seconds = ('0' + date.getSeconds()).slice(-2);
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Function to get transaction history
function getTransactionHistory() {
  fetch('/command', {
    method: 'POST',
    body: JSON.stringify({ command: 'novo-cli listtransactions' }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    const transactions = data.reverse(); // Reverse order to display newest first
    transactionList.innerHTML = ''; // Clear existing transactions
    transactions.forEach(transaction => {
      const type = transaction.category === 'send' ? 'Sent' : 'Received';
      const amount = Math.abs(transaction.amount).toFixed(8);
      const date = formatDate(transaction.time);
      const confirmations = transaction.confirmations === 0 ? 'Pending' : transaction.confirmations;
      const transactionId = transaction.txid.slice(0, 10) + '...';
      let fee = transaction.fee;
      if (fee !== undefined) {
        fee = fee.toFixed(8);
      } else {
        fee = '-';
      }
      const row = `
        <tr>
          <td>${date}</td>
          <td>${type}</td>
          <td>${amount}</td>
          <td>${fee}</td>
          <td>${transaction.address}</td>
          <td>${confirmations}</td>
          <td>${transactionId}</td>
        </tr>
      `;
      transactionList.insertAdjacentHTML('beforeend', row);
    });
  })
  .catch(error => console.error(error));
}


// Function to update wallet info
function updateWalletInfo() {
  fetch('/command', {
    method: 'POST',
    body: JSON.stringify({ command: 'novo-cli getwalletinfo' }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    document.querySelector('#balance').textContent = data.balance.toFixed(8);
    document.querySelector('#unconfirmed-balance').textContent = data.unconfirmed_balance.toFixed(8);
    document.querySelector('#immature-balance').textContent = data.immature_balance.toFixed(8);
    document.querySelector('#contract-balance').textContent = data.contract_balance.toFixed(8);
    document.querySelector('#unconfirmed-contract-balance').textContent = data.unconfirmed_contract_balance.toFixed(8);
    document.querySelector('#num-transactions').textContent = data.txcount;
  })
  .catch(error => console.error(error));
}

// Event listener for importing private key
privateKeyForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(privateKeyForm);
  const privateKey = formData.get('private_key');
  const novoImportKey = "novo-cli importprivkey ";
  const novoImportMyKey = novoImportKey + privateKey;
  fetch('/command', {
    method: 'POST',
    body: JSON.stringify({ command: novoImportMyKey }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.text())
  .then(data => {
    output.textContent = data;
    if (data === 'null') {
      output.textContent = 'An error occurred while importing the private key.';
    } else {
      output.textContent = 'Private key successfully imported.';
    }
  })
  .catch(error => {
    console.error(error);
    output.textContent = 'An error occurred';
  });
});
  
// Event listener for the "Backup Wallet" button
backupButton.addEventListener('click', () => {
  fetch('/backup-wallet')
    .then(response => {
      if (!response.ok) {
        throw new Error('Error generating wallet dump.');
      }
      return response.blob();
    })
    .then(blob => {
      const url = URL.createObjectURL(blob);
      const downloadBackupLink = document.querySelector('#download-backup-link');
      downloadBackupLink.href = url;
      downloadBackupLink.download = 'wallet-dump.txt';
      downloadBackupLink.click();
      document.querySelector('#backup-wallet-output').textContent = 'Wallet dump successful.';
    })
    .catch(error => {
      console.error(error);
      document.querySelector('#backup-wallet-output').textContent = 'An error occurred while dumping the wallet.';
    });
});


  // Initial update of wallet info and transaction history
  updateWalletInfo();
  getTransactionHistory();

  // Set interval to update wallet info and transaction history every 5 seconds
  setInterval(() => {
    updateWalletInfo();
    getTransactionHistory();
  }, 5000);
});
