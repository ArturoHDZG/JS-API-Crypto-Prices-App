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

  queryAPI();
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

function queryAPI() {
  const { moneda, criptomoneda } = searchObj;
  const URL = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

  displaySpinner();

  fetch(URL)
    .then(response => response.json())
    .then(data => displayPrice(data.DISPLAY[ criptomoneda ][ moneda ]));
}

function displayPrice(price) {
  clearHTML();

  const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = price;
  const currentPrice = document.createElement('P');
  const highPrice = document.createElement('P');
  const lowPrice = document.createElement('P');
  const changePercent = document.createElement('P');
  const timeUpdated = document.createElement('P');

  currentPrice.classList.add('precio');
  currentPrice.innerHTML = `Precio de hoy: <span>${PRICE}</span>`;

  highPrice.innerHTML = `Precio máximo del día: <span>${HIGHDAY}</span>`;
  lowPrice.innerHTML = `Precio mínimo del día: <span>${LOWDAY}</span>`;
  changePercent.innerHTML = `Variación del día (%): <span>${CHANGEPCT24HOUR}%</span>`;
  timeUpdated.innerHTML = `Última actualización: <span>${LASTUPDATE}</span>`;

  result.appendChild(currentPrice);
  result.appendChild(highPrice);
  result.appendChild(lowPrice);
  result.appendChild(changePercent);
  result.appendChild(timeUpdated);
}

function clearHTML() {
  while (result.firstChild) {
    result.removeChild(result.firstChild);
  }
}

function displaySpinner() {
  clearHTML();

  const spinner = document.createElement('DIV');
  spinner.classList.add('spinner');
  spinner.innerHTML = `
    <div class="cube1"></div>
    <div class="cube2"></div>`;

  result.appendChild(spinner);
}
