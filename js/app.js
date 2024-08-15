//* Selectors
const form = document.querySelector('#formulario');
const currencies = document.querySelector('#moneda');
const cryptos = document.querySelector('#criptomonedas');
const result = document.querySelector('#resultado');

//* Promise
const getCryptos = cryptocurrencies => Promise.resolve(cryptocurrencies);

//* Event listeners
document.addEventListener('DOMContentLoaded', () => {
  cryptoQuery();
});

//* Functions
function cryptoQuery() {
  const URL = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

  fetch(URL)
    .then(response => response.json())
    .then(data => getCryptos(data.Data))
    .then(cryptocurrencies => selectCryptos(cryptocurrencies));
}

function selectCryptos(cryptocurrencies) {
  cryptocurrencies.forEach(crypto => {
    const { FullName, Name } = crypto.CoinInfo;
    const option = document.createElement('option');
    option.textContent = FullName;
    option.value = Name;
    cryptos.appendChild(option);
  });
}
