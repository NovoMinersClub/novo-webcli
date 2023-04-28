const form = document.querySelector('#send-form');
const tokenSendForm = document.querySelector('#token-send-form');
const sendOutput = document.querySelector('#send-output');
const tokenSendOutput = document.querySelector('#token-send-output');

function clearSendForm() {
  form.elements['send-address'].value = '';
  form.elements['send-amount'].value = '';
  form.elements['send-comment'].value = '';
  form.elements['send-comment-to'].value = '';
  form.elements['subtract-fees'].checked = false;
}

function clearTokenSendForm() {
  tokenSendForm.elements['token-type'].value = 'FT';
  tokenSendForm.elements['token-id'].value = '';
  tokenSendForm.elements['token-value'].value = '';
  tokenSendForm.elements['token-address'].value = '';
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const address = form.elements['send-address'].value.trim();
  const amount = parseFloat(form.elements['send-amount'].value.trim());
  const comment = form.elements['send-comment'].value.trim();
  const commentTo = form.elements['send-comment-to'].value.trim();
  const subtractFees = form.elements['subtract-fees'].checked;

  if (!address || isNaN(amount) || amount <= 0) {
    alert('Please provide a valid address and amount.');
    return;
  }

try {
    const command = `novo-cli sendtoaddress ${address} ${amount} "${comment}" "${commentTo}" ${subtractFees ? 'true' : 'false'}`;
    const response = await fetch('/command', {
      method: 'POST',
      body: JSON.stringify({ command }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.text();
    sendOutput.innerHTML = `<span class="copyable" data-txid="${data}">Transaction ID: ${data}</span>`;
    const copyableElement = document.querySelector('#send-output .copyable');
    if (copyableElement) {
      copyableElement.addEventListener('click', () => {
        const txid = data;
        navigator.clipboard.writeText(txid).then(() => {
          alert('Transaction ID copied to clipboard');
        });
      });
    }
  } catch (error) {
    console.error(error);
    sendOutput.textContent = 'An error occurred';
  }
}); 


tokenSendForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const tokenType = tokenSendForm.elements['token-type'].value.trim();
  const tokenId = tokenSendForm.elements['token-id'].value.trim();
  const tokenValue = tokenSendForm.elements['token-value'].value.trim();
  const tokenAddress = tokenSendForm.elements['token-address'].value.trim();

  if (!tokenType || !tokenId || !tokenValue || !tokenAddress) {
    alert('Please provide all required token information.');
    return;
  }

  try {
    const command = `novo-cli transfertoken "${tokenType}" "${tokenId}" "${tokenValue}" "${tokenAddress}"`;
    const response = await fetch('/command', {
      method: 'POST',
      body: JSON.stringify({ command }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.text();
    tokenSendOutput.innerHTML = `<span class="copyable" data-txid="${data}">Transaction ID: ${data}</span>`;
    const copyableElement = document.querySelector('#token-send-output .copyable');
    if (copyableElement) {
      copyableElement.addEventListener('click', () => {
        const txid = data;
        navigator.clipboard.writeText(txid).then(() => {
          alert('Transaction ID copied to clipboard');
        });
      });
    }
  } catch (error) {
    console.error(error);
    tokenSendOutput.textContent = 'An error occurred';
  }
});

clearSendForm();
clearTokenSendForm();

