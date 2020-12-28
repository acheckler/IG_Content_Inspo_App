'use strict'
const unsplashID = "RB0c5XN-C4SiX0b5hQwEgq_-FSZ1zi00xCtLXON7UY0"
const unsplashURL = "https://api.unsplash.com/search/photos"
const qgURL = "https://quote-garden.herokuapp.com/api/v3/quotes"

function watchStartBtn() {
  $('#start-button').on("click", () => {
    $('#js-form').removeClass('hidden');
    $('.search-instructions').removeClass('hidden');
    $('.hide-landing-page').addClass('hidden');
  })
}


function watchForm() {
  $('#js-form').submit(event => {
    event.preventDefault();
    var picSearchTerm = $('#photo-search-term').val();
    var quoteSearchType = $('#quote-search-type').val();
    var quoteSearchTerm = $('#quote-search-term').val();
    var picColor = $('#photo-search-color').val();
    getPictures(picSearchTerm, picColor);
    getQuotes(quoteSearchTerm, quoteSearchType);
    $('.photos').empty();
    $('.quotes').empty();

  });
}

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}
function getPictures(picSearchTerm, picColor) {
  const params = {
    client_id: unsplashID,
    query: picSearchTerm,
    per_page: 50,
    color: picColor
  }
  const queryString = formatQueryParams(params);
  const url = unsplashURL + '?' + queryString;
  const getRandom = max => {
    return Math.ceil(Math.random() * max)
  }
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      let total = responseJson.results.length
      let random = getRandom(total)
      displayPictures(responseJson.results[random]);
    })
    .catch(err => {
      $('#error-message').text(`Could not find a photo with given keyword(s). Please try using another search term.`);
    });
}
function getQuotes(quoteSearchTerm, quoteSearchType) {
  const params = {
    page: 1,
    limit: 3
  }
  if (quoteSearchType === "quotes") {
    params.query = quoteSearchTerm
  }
  else {
    params.genre = quoteSearchTerm
  }
  const queryString = formatQueryParams(params);
  const url = qgURL + '?' + queryString;
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      displayQuotes(responseJson);
    })
    .catch(err => {

      $('#error-message').text(`Could not find a quote with given keyword(s). Please try using another search term.`);
    });
}
function displayQuotes(responseJson) {
  if (responseJson.data.length === 0) {
    $('#error-message').text(`Could not find a quote with given keyword(s). Please try using another search term.`);
  }
  for (let i = 0; i < responseJson.data.length; i++) {
    $('.quotes').append(
      `<li> <p> '${responseJson.data[i].quoteText}' </p>
      <p> '${responseJson.data[i].quoteAuthor}' </p>
      </li>
      `
    )
  }
}
function displayPictures(responseJson) {
  $('.photos').append(
    `<div class="results-image"
    <li> <img src ='${responseJson.urls.regular}' id="fetch-image" alt = "Image returned from API">
      <a href = ${responseJson.urls.regular}> Unsplash Link </a>
      </li>
      </div>
      `
  )
}
function render() {
  $(watchForm);
  $(watchStartBtn);
}
$(render);