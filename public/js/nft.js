const nftList = document.querySelector('#nft-list');
const refreshNFTListButton = document.querySelector('#refresh-nft-list');

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
    nftList.textContent = 'An error occurred';
    return null;
  }
};

// Parse the NFT contract output and return the relevant data
const parseNFTContract = (contract) => {
  let metadata = {};

  try {
    metadata = JSON.parse(contract.contractMetadata);
  } catch (error) {
    console.error('Error parsing contract metadata:', error);
  }

  return {
    contractID: contract.contractID,
    contractValue: contract.contractValue,
    contractMaxSupply: contract.contractMaxSupply,
    name: metadata.name || '',
    description: metadata.description || '',
    image: metadata.image || '',
    address: contract.address,
    account: contract.account,
    confirmations: contract.confirmations
  };
};

// Display the list of NFT contracts in the page
const displayNFTContracts = (contracts) => {
  let output = '<h2>NFTs</h2>';
  output += '<table>';
  output += '<tr><th>Name</th><th>Description</th><th>Image</th><th>Contract ID</th><th>Token Value</th><th>Max Supply</th><th>Address</th><th>Account</th><th>Confirmations</th></tr>';

  contracts.forEach((contract) => {
    if (contract.contractType === 'NFT') {
      const nftContract = parseNFTContract(contract);
      output += `
        <tr>
          <td>${nftContract.name}</td>
          <td>${nftContract.description}</td>
          <td><img src="data:image/jpeg;base64,${nftContract.image}" alt="${nftContract.name}" style="max-width: 100px; max-height: 100px;" /></td>
          <td>${nftContract.contractID}</td>
          <td>${nftContract.contractValue}</td>
          <td>${nftContract.contractMaxSupply}</td>
          <td>${nftContract.address}</td>
          <td>${nftContract.account}</td>
          <td>${nftContract.confirmations}</td>
        </tr>
      `;
    }
  });

  output += '</table>';
  nftList.innerHTML = output;
};

// Update the list of NFT contracts when the refresh button is clicked
refreshNFTListButton.addEventListener('click', async () => {
  const contractUnspent = await getContractUnspent();
  if (contractUnspent) {
    displayNFTContracts(contractUnspent);
  }
});

// Load the list of NFT contracts when the page is loaded
(async () => {
  const contractUnspent = await getContractUnspent();
  if (contractUnspent) {
    displayNFTContracts(contractUnspent);
  }
})();

