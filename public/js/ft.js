const ftList = document.querySelector('#ft-list');
const refreshFTListButton = document.querySelector('#refresh-ft-list');

// Retrieve the list of contract unspent
const getContractUnspent = async () => {
  try {
    const response = await fetch('/command', {
      method: 'POST',
      body: JSON.stringify({ command: 'novo-cli listcontractunspent' }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    ftList.textContent = 'An error occurred';
    return null;
  }
}

// Parse the FT contract output and return the relevant data
const parseFTContract = (contract) => {
  let metadata = {};

  const fixJSONString = (str) => {
    return str
      .replace(/(\w+)\s*:/g, (_, key) => `"${key}":`) // Wrap keys in double quotes
      .replace(/'/g, '"'); // Replace single quotes with double quotes
  };

  try {
    if (!contract.contractMetadata.trim().startsWith('{')) {
      contract.contractMetadata = `{${contract.contractMetadata.trim()}}`;
    }

    try {
      metadata = JSON.parse(contract.contractMetadata);
    } catch (innerError) {
      // Attempt to fix the JSON string and parse it again
      metadata = JSON.parse(fixJSONString(contract.contractMetadata));
    }
  } catch (error) {
    console.error('Error parsing contract metadata:', error);
  }

  return {
    txid: contract.txid,
    amount: contract.amount,
    contractID: contract.contractID,
    contractValue: contract.contractValue,
    contractMaxSupply: contract.contractMaxSupply,
    name: metadata.name || '',
    symbol: metadata.symbol || '',
    decimal: metadata.decimal || 0
  };
};


// Display the list of FT contracts in the page
const displayFTContracts = (contracts) => {
  let output = '<h2>Tokens</h2>';
  output += '<table>';
  output += '<tr><th>Token Name</th><th>Symbol</th><th>Decimal</th><th>Amount</th><th>Contract ID</th><th>Contract Value</th><th>Contract Max Supply</th></tr>';

  contracts.forEach((contract) => {
    if (contract.contractType === 'FT') {
      const ftContract = parseFTContract(contract);
      output += `<tr><td>${ftContract.name}</td><td>${ftContract.symbol}</td><td>${ftContract.decimal}</td><td>${ftContract.amount}</td><td>${ftContract.contractID}</td><td>${ftContract.contractValue}</td><td>${ftContract.contractMaxSupply}</td></tr>`;
    }
  });

  output += '</table>';
  ftList.innerHTML = output;
}

// Update the list of FT contracts when the refresh button is clicked
refreshFTListButton.addEventListener('click', async () => {
  const contractUnspent = await getContractUnspent();
  if (contractUnspent) {
    displayFTContracts(contractUnspent);
  }
});

// Load the list of FT contracts when the page is loaded
(async () => {
  const contractUnspent = await getContractUnspent();
  if (contractUnspent) {
    displayFTContracts(contractUnspent);
  }
})();

