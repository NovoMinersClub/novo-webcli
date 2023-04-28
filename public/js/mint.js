document.addEventListener('DOMContentLoaded', async () => {
  await displayMintingRights();

  const createTokenForm = document.getElementById('create-token-form');
  const mintTokenForm = document.getElementById('mint-token-form');

  createTokenForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const tokenType = createTokenForm.elements['token-type'].value.trim();
    const maxSupply = createTokenForm.elements['max-supply'].value;
    const metadata = createTokenForm.elements['metadata'].value.trim();
    const address = createTokenForm.elements['address'].value.trim();

    const resultElement = document.getElementById('create-token-result');

    try {
      const result = await runCommand(`novo-cli createtoken "${tokenType}" "${maxSupply}" "${metadata}" "${address}"`);
      resultElement.textContent = `Token ID: ${result.trim()}`;
    } catch (error) {
      resultElement.textContent = `Error: ${error.message}`;
    }
  });

  mintTokenForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const mintType = mintTokenForm.elements['mint-type'].value.trim();
    const tokenId = mintTokenForm.elements['token-id'].value.trim();
    const tokenData = mintTokenForm.elements['token-data'].value.trim();
    const mintAddress = mintTokenForm.elements['mint-address'].value.trim();

    const resultElement = document.getElementById('mint-token-result');

    try {
      const result = await runCommand(`novo-cli minttoken "${mintType}" "${tokenId}" "${tokenData}" "${mintAddress}"`);
      resultElement.textContent = `Transaction ID: ${result.trim()}`;
    } catch (error) {
      resultElement.textContent = `Error: ${error.message}`;
    }
  });
});

async function displayMintingRights() {
  const mintingRightsElement = document.getElementById('minting-rights');
  const unspentContracts = await runCommand('novo-cli listcontractunspent');
  const mintingRights = JSON.parse(unspentContracts).filter(contract => contract.contractType === 'FT_MINT' || contract.contractType === 'NFT_MINT');

  mintingRights.forEach((right) => {
    const rightElement = document.createElement('div');
    rightElement.className = 'minting-right';
    rightElement.innerHTML = `
      <h3>${right.contractType} (${right.contractID})</h3>
      <p>Address: ${right.address}</p>
      <p>Metadata: ${right.contractMetadata}</p>
      <p>Current Value: ${right.contractValue}</p>
      <p>Max Supply: ${right.contractMaxSupply}</p>
    `;
    mintingRightsElement.appendChild(rightElement);
  });
}

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

