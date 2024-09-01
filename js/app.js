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

/**
 * Initializes event listeners for the DOM elements.
 *
 * @returns {void}
 */
 document.addEventListener('DOMContentLoaded', () => {
  cryptoQuery();
  form.addEventListener('submit', submitForm);
  currencies.addEventListener('change', readValue);
  cryptos.addEventListener('change', readValue);
});

//* Functions
/**
 * Fetches the top 10 cryptocurrencies by market cap and populates the dropdown menu.
 * @async
 * @function cryptoQuery
 * @returns {void}
 * @throws Will throw an error if the fetch operation fails or if the response status is not OK.
 * @example
 * cryptoQuery();
 */
async function cryptoQuery() {
  const URL = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

  try {
    const response = await fetch(URL);
    const data = await response.json();
    selectCryptos(data.Data);
  } catch (error) {
    showAlert('Error: ' + error);
  }
}

/**
 * Populates the dropdown menu with cryptocurrency options based on the provided data.
 * @param {Array} cryptocurrencies - An array of objects representing cryptocurrencies.
 * Each object should have a CoinInfo property containing FullName and Name properties.
 * @returns {void}
 * @example
 * const cryptos = [
 * { CoinInfo: { FullName: 'Bitcoin', Name: 'BTC' } },
 * { CoinInfo: { FullName: 'Ethereum', Name: 'ETH' } },
 * ];
 * selectCryptos(cryptos);
 */
function selectCryptos(cryptocurrencies) {
  cryptocurrencies.forEach(crypto => {
    const { FullName, Name } = crypto.CoinInfo;
    const option = document.createElement('option');
    option.textContent = FullName;
    option.value = Name;
    cryptos.appendChild(option);
  });
}

/**
 * Reads the value of the input element and updates the corresponding property in the search object.
 * @param {Event} e - The event object that triggered the function.
 * @property {HTMLInputElement} e.target - The input element that triggered the event.
 * @property {string} e.target.name - The name attribute of the input element.
 * @property {string} e.target.value - The current value of the input element.
 * @returns {void}
 * @example
// Given an event object 'e' with the following properties:
// e.target.name = 'moneda'
// e.target.value = 'USD'
// The function will update the 'moneda' property in the 'searchObj' object to 'USD'.
 * readValue(e);
 */
function readValue(e) {
  searchObj[ e.target.name ] = e.target.value;
}

/**
 * Handles the form submission event by preventing the default action,
 * validating the form inputs, and calling the appropriate functions.
 * @param {Event} e - The event object that triggered the function.
 * @property {HTMLFormElement} e.target - The form element that triggered the event.
 * @property {string} e.target.moneda - The value of the 'moneda' input field.
 * @property {string} e.target.criptomoneda - The value of the 'criptomoneda' input field.
 * @returns {void}
 * @throws Will throw an error if the 'moneda' or 'criptomoneda' fields are empty.
 * @example
// Given an event object 'e' with the following properties:
// e.target.moneda = 'USD'
// e.target.criptomoneda = 'BTC'
// The function will validate the inputs, prevent the default form submission,
// and call the 'queryAPI' function.
 * submitForm(e);
 */
function submitForm(e) {
  e.preventDefault();

  const { moneda, criptomoneda } = searchObj;

  if (moneda === '' || criptomoneda === '') {
    showAlert('Todos los campos son obligatorios');
    return;
  }

  queryAPI();
}

/**
 * Displays an alert message with a fade-out effect.
 * @param {string} message - The message to be displayed in the alert.
 * @returns {void}
 * @example
 * showAlert('Todos los campos son obligatorios');
 */
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

/**
 * Fetches the current price and other relevant data for a specific cryptocurrency in a given currency.
 * Displays a loading spinner while fetching data and then calls the 'displayPrice' function to display the results.
 * If an error occurs during the fetch operation, it calls the 'showAlert' function to display an error message.
 * @async
 * @function queryAPI
 * @returns {void}
 * @throws Will throw an error if the fetch operation fails or if the response status is not OK.
 * @example
 * queryAPI();
 */
async function queryAPI() {
  const { moneda, criptomoneda } = searchObj;
  const URL = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

  displaySpinner();

  try {
    const response = await fetch(URL);
    const data = await response.json();
    displayPrice(data.DISPLAY[ criptomoneda ][ moneda ]);
  } catch (error) {
    showAlert('Error: ' + error);
  }
}

/**
 * Displays the current price and other relevant data for a specific cryptocurrency in a given currency.
 * It clears the HTML content of the result section, creates new paragraph elements to display the price,
 * high price, low price, change percent, and last update, and appends them to the result section.
 * @param {Object} price - An object containing the price data for the cryptocurrency.
 * @property {string} price.PRICE - The current price of the cryptocurrency.
 * @property {string} price.HIGHDAY - The highest price of the cryptocurrency for the day.
 * @property {string} price.LOWDAY - The lowest price of the cryptocurrency for the day.
 * @property {string} price.CHANGEPCT24HOUR - The percentage change of the cryptocurrency price for the day.
 * @property {string} price.LASTUPDATE - The timestamp of the last update for the price data.
 * @returns {void}
 * @example
 * const priceData = {
 * PRICE: '$1000',
 * HIGHDAY: '$1050',
 * LOWDAY: '$950',
 * CHANGEPCT24HOUR: '5%',
 * LASTUPDATE: '2022-01-01 12:00:00',
 * };
 * displayPrice(priceData);
 */
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

/**
 * Clears the HTML content of the result section by removing all child nodes.
 * This function is used to prepare the result section for displaying new data.
 * @returns {void}
 * @example
 * clearHTML();
 // The HTML content of the 'result' element is now empty.
 */
function clearHTML() {
  while (result.firstChild) {
    result.removeChild(result.firstChild);
  }
}

/**
 * Displays a loading spinner in the result section while fetching data.
 * It clears the HTML content of the result section, creates a new div element with the 'spinner' class,
 * and appends it to the result section.
 * @returns {void}
 * @example
 * displaySpinner();
 // The HTML content of the 'result' element is now empty, and a loading spinner is displayed.
 */
function displaySpinner() {
  clearHTML();

  const spinner = document.createElement('DIV');
  spinner.classList.add('spinner');
  spinner.innerHTML = `
    <div class="cube1"></div>
    <div class="cube2"></div>`;

  result.appendChild(spinner);
}
