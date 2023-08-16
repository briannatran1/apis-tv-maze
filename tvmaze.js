"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const TVMAZE_URL = 'https://api.tvmaze.com'

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // Remove placeholder & make request to TVMaze search shows API.
  const params = new URLSearchParams({q: term});
  const response = await fetch(`${TVMAZE_URL}/search/shows?${params}`);
  const showData = await response.json();
  console.log('showData = ', showData);
  const showDataArray = [];
  for(let i = 0; i < showData.length; i++){
    const {id, name, summary, image} = showData[i].show;
    const extractedShowData = {id, name, summary, image};
    showDataArray.push(extractedShowData);
    const {medium} = showData[i].show.image;
    console.log({medium});
  }
  console.log(showDataArray);
  return showDataArray;
}


/** Given list of shows, create markup for each and append to DOM.
 *
 * A show is {id, name, summary, image}
 * */

function displayShows(shows) {
  $showsList.empty();
  console.log(`shows in displayShows`, shows);

  for (const show of shows) {
    const $show = $(`
        <div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${show.image}"
              alt="Bletchly Circle San Francisco"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);
      // const showParsed = $show.json();
      // console.log(`showParsed in displayShows`, showParsed);
    $showsList.append($show);
  }

}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchShowsAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);
  console.log(`shows in seatchShowsAndDisplay`, shows);

  $episodesArea.hide();
  displayShows(shows);
}

$searchForm.on("submit", async function handleSearchForm (evt) {
  evt.preventDefault();
  await searchShowsAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

// async function getEpisodesOfShow(id) { }

/** Write a clear docstring for this function... */

// function displayEpisodes(episodes) { }

// add other functions that will be useful / match our structure & design
