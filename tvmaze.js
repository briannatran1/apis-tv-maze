"use strict";

const $showsList = $("#showsList");
const $episodesList = $("#episodesList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const TVMAZE_URL = 'https://api.tvmaze.com'
const MISSING_IMAGE_URL = 'https://tinyurl.com/tv-missing'

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
  const collectedShows = [];

  for(let tvShow of showData){
    let {id, name, summary, image} = tvShow.show;
    const extractedShowData = {id, name, summary, image};

    if(image){
      extractedShowData.image = image.medium;
    }
    else{
      extractedShowData.image = MISSING_IMAGE_URL;
    }

    collectedShows.push(extractedShowData);
  }

  return collectedShows;
}

/** Given list of shows, create markup for each and append to DOM.
 *
 * A show is {id, name, summary, image}
 * */

function displayShows(shows) {
  $showsList.empty();

  for (const show of shows) {
    const $show = $(`
        <div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${show.image}"
              alt="${show.name}"
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

  $episodesArea.hide();
  displayShows(shows);
}

$searchForm.on("submit", async function handleSearchForm (evt) {
  evt.preventDefault();
  /*await*/ searchShowsAndDisplay(); //do not need await since we don't have to wait for results
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

// perform ajax request to get episode data
// parse data
// iterate through data using map and for each ep, return the id, name, season, and number

async function getEpisodesOfShow(showId) {
    const episodeResponse = await fetch(`${TVMAZE_URL}/shows/${showId}/episodes`);
    const episodeData = await episodeResponse.json();

    console.log('episodeData = ', episodeData);

    return episodeData.map(ep => ({
      id: ep.id,
      name: ep.name,
      season: ep.season,
      number: ep.number
    }));
 }

/** Given a list of episodes, create list item for each and append to the DOM.
 *
 * An episode is {id, name, season, number}
*/

// empty episodesList area
// iterate through episodes using for...of loop
// create a new li for each episode that contains the ep name, season, and number
// append episode to the episodesList
// show episodesArea that is currently hidden

function displayEpisodes(episodes) {
  $episodesList.empty();

  for(const episode of episodes){
    const $episode = $(
      `<li>
        ${episode.name}
        (season ${episode.season}, episode ${episode.number})
        </li>`
    );

    $episodesList.append($episode);
  }

  $episodesArea.show();
}

// add other functions that will be useful / match our structure & design

/** Handle click on episodes button: get episodes for show and display */

async function getEpisodesAndDisplay(showId){
  const episodes = await getEpisodesOfShow(showId);
  displayEpisodes(episodes);
}

// - we're using "event delegation", since the buttons *won't exist* on page
//   load, only after they've search for shows
// - our "discriminant" for this event handler is the class Show-getEpisodes;

$showsList.on('click', '.Show-getEpisodes', async function handleEpisodeClick(evt){
  // search "closest" ancestor with the class of .Show (which is put onto the enclosing div, which
  // has the .data-show-id attribute).
  // .data() returns a str so turn id into a num
  // call getEpisodesAndDisplay function on showId to get list of episodes

  const showId = Number($(evt.target).closest('.Show').data('show-id'));
  await getEpisodesAndDisplay(showId);
});

