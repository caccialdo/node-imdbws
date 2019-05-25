const request = require("./utils/request");

/**
 * Returns metadata for videos shown on the landing page of the given tconst.
 * Requires `options.region` to be set to get a non-empty response.
 *
 * @param {String} tconst - IMDb ID, usually starts with "tt" for movies
 * @param {Object} options - Set of optional arguments
 * @param {String} options.region - E.g. "GB"
 */
const heroVideos = (tconst, { region } = {}) =>
  request("/template/imdb-ios-writable/const-hero-videos-v2.jstl/render", {
    query: { constId: `/title/${tconst}/`, region },
  });

/**
 * Returns sales, technical info (camera/film used…) and movies similar
 * or associated to the given tconst.
 *
 * @param {String} tconst - IMDb ID, usually starts with "tt" for movies
 * @param {Object} options - Set of optional arguments
 * @param {String} options.region - E.g. "GB"
 */
const belowTheFold = (tconst, { region } = {}) =>
  request("/template/imdb-ios-writable/title-below-thefold-v2.jstl/render", {
    query: { tconst, region },
  });

/**
 * Returns tons of metadata for the given tconst, except IMDb ratings.
 *
 * @param {String} tconst - IMDb ID, usually starts with "tt" for movies
 * @param {Object} options - Set of optional arguments
 * @param {String} options.region - E.g. "GB"
 * @param {String} options.today - E.g. "2019-05-27"
 */
const auxiliary = (tconst, { region, today, minWidth, osVersion } = {}) =>
  request("/template/imdb-ios-writable/title-auxiliary-v34.jstl/render", {
    query: { tconst, region, today, minwidth: minWidth, osVersion },
  });

/**
 * Returns show times for cinemas for the given lat-long, radius and timezone.
 * Also returns basic metadata for the given tconst **and ratings**!
 *
 * @param {String} tconst - IMDb ID, usually starts with "tt" for movies
 * @param {Object} options - Set of optional arguments
 * @param {String} options.region - E.g. "GB"
 * @param {String} options.today - E.g. "2019-05-27"
 * @param {String} options.latLong - E.g. "43.30,-0.38"
 * @param {String} options.distance - E.g. "4670027204908810240"
 * @param {String} options.timeZone - E.g. "UTC+01:00"
 */
const whereToWatch = (
  tconst,
  { region, today, latLong, distance, timeZone } = {}
) => {
  const tvLoadPath = timeZone
    ? `/title/${tconst}/tv/schedules/timezone/${timeZone}`
    : undefined;
  return request(
    "/template/imdb-ios-writable/title-where-to-watch-v5.jstl/render",
    {
      query: { tconst, region, today, latLong, distance, tvLoadPath },
    }
  );
};

module.exports = {
  heroVideos,
  belowTheFold,
  auxiliary,
  whereToWatch,
};
