import './css/styles.css';
import { fetchCountries } from './fetchCountries';
const debounce = require('lodash.debounce');
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
    inputEl: document.querySelector('#search-box'),
    countriesListEl: document.querySelector('.country-list'),
    countryInfoEl: document.querySelector('.country-info'),
};

addStylesForList();

refs.inputEl.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY))

function onSearch(e) {
    const countryName = e.target.value.trim();
    if (countryName === '') return;
    fetchCountries(countryName)
        .then(response => response.json())
        .then(data => {
            if (data.status === 404) {
                clearInnerHTML()
                throw new Error(Notify.failure("Oops, there is no country with that name"));
            };
            const items = data;
            clearInnerHTML()
            if (data.length > 10) {
                return Notify.info("Too many matches found. Please enter a more specific name.")
            };
            if (data.length === 1) {
                createListOneItems(items);
            } else {
                createListItems(items);
            };
        })
        .catch(error => error);
}

function createListItems(items) {
    const markup = items
        .map((item) => `<li><img src="${item.flags.svg}" alt="${item.name.official}" height="20" /><h2 style="display: inline-block; margin-left: 10px">${item.name.official}</h2></li>`)
        .join('');
    refs.countriesListEl.innerHTML = markup;
}

function createListOneItems(items) {
    const markup = items
        .map((item) => `<img src="${item.flags.svg}" alt="${item.name.official}" height="20" /><h2 style="display: inline-block; margin-left: 10px">${item.name.official}</h2><p><b>Capital: </b>${item.capital}</p><p><b>Population: </b>${item.population}</p><p><b>Languages: </b>${Object.values(item.languages)}</p>`)
        .join('');
    refs.countryInfoEl.innerHTML = markup;
}

function clearInnerHTML() {
    refs.countriesListEl.innerHTML = "";
    refs.countryInfoEl.innerHTML = "";
}

function addStylesForList() {
    refs.countriesListEl.style.listStyle = 'none';
    refs.countriesListEl.style.margin = 0;
}