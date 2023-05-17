import "./css/styles.css";
import debounce from "lodash.debounce";
import Notiflix from "notiflix";
import API from "./fetchCountries";


const refs = {
  input: document.querySelector("#search-box"),
  countryList: document.querySelector(".country-list"),
  countryInfo: document.querySelector(".country-info"),
};
const DEBOUNCE_DELAY = 500;

refs.input.addEventListener("input", debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  const userQuery = e.target.value.trim();

  if(!userQuery) {
    render();
    return;
  }

  API.fetchCountries(userQuery).then(country => {
    if(country[0].length < 1) {
      throw new Error();
    }

    if(country.length > 10) {
      return Notiflix.Notify.info(
        "Too many matches found. Please enter a more specific name.");
    }

    if(country.length === 1) {
      render();
      createInfo(country);
    } else {
      render();
      createList(country);
    }
  }).catch(error => {
    render();
    console.log(error);
    Notiflix.Notify.failure("Oops, there is no country with that name.");
  });
}

function createList(country) {
  const markup = country.map(({name: {official}, flags: {alt, svg}}) => {
    return `
            <li style="
                        list-style: none;
                        display: flex;
                        gap: 10px;
                        align-items: center ">
                <img width="100" height="50" src="${svg}" alt="${alt}">
                <p style="font-size: 24px; font-weight: 700">${official}</p>
            </li>`;
  });

  refs.countryList.insertAdjacentHTML("beforeend", markup.join(""));
}

function createInfo(country) {
  const markup = country.map(({
                                name: {official},
                                population,
                                capital,
                                flags: {alt, svg},
                                languages,
                              }) => {
    const lang = Object.values(languages).join(", ");

    return `
             <div>
                 <img width="200" height="200" src="${svg}" alt="${alt}"/>
                 <h2>Country: ${official}</h2>
                 <p>Population: ${population}</p>
                 <p>Capital: ${capital}</p>
                 <p>Languages: ${lang}</p>
             </div>`;
  });

  refs.countryInfo.insertAdjacentHTML("beforeend", markup);

}

function render() {
  refs.countryInfo.innerHTML = "";
  refs.countryList.innerHTML = "";
}