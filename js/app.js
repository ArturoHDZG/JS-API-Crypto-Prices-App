//* Selectors
const form = document.querySelector('#formulario');
const currencies = document.querySelector('#moneda');
const cryptos = document.querySelector('#criptomonedas');
const result = document.querySelector('#resultado');

//* Variables
const searchObj = {
  moneda: '',
  criptomoneda: ''
};

//* Promise
const getCryptos = cryptocurrencies => Promise.resolve(cryptocurrencies);

//* Event listeners
document.addEventListener('DOMContentLoaded', () => {
  cryptoQuery();
  form.addEventListener('submit', submitForm);
  currencies.addEventListener('change', readValue);
  cryptos.addEventListener('change', readValue);
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

function readValue(e) {
  searchObj[ e.target.name ] = e.target.value;
}

function submitForm(e) {
  e.preventDefault();

  const { moneda, criptomoneda } = searchObj;

  if (moneda === '' || criptomoneda === '') {
    showAlert('Todos los campos son obligatorios');
    return;
  }
}

function showAlert(message) {
  const ALERT_DURATION = 3000;
  const alertExists = document.querySelector('.error');
  const alert = document.createElement('DIV');

  if (!alertExists) {
    alert.textContent = message;
    alert.classList.add('error');
    form.appendChild(alert);

    setTimeout(() => {
      alert.remove();
    }, ALERT_DURATION);
  }

}
