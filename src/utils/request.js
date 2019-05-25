const superagent = require("superagent");
const signRequest = require("superagent-aws-signed-request");
const oncePerSession = require("./oncePerSession");

const API_HOST = "api.imdbws.com";
const APP_KEY = "f46e384b-dde3-4b48-9579-77fc1bee5926";
const USER_AGENT = "IMDb/9.10 (iPhone11,2; iOS 12.2)";
const CONTENT_TYPE = "application/vnd.imdb.api+json";

const baseHeaders = {
  Accept: CONTENT_TYPE,
  "User-Agent": USER_AGENT
};

const getAwsCredentials = oncePerSession(async () => {
  const res = await superagent
    .post(`https://${API_HOST}/authentication/credentials/temporary/ios85`)
    .set(baseHeaders)
    .send({ appKey: APP_KEY });

  const { accessKeyId, secretAccessKey, sessionToken } = res.body.resource;

  return {
    key: accessKeyId,
    secret: secretAccessKey,
    sessionToken
  };
});

const request = async (path, { method = "GET", query, dataObj }) => {
  const awsCredentials = await getAwsCredentials();

  const url = `https://${API_HOST}${path}`;
  const requestPromise = superagent[method.toLowerCase()](url);

  if (query) {
    requestPromise.query(query);
  }

  if (dataObj) {
    requestPromise.set("Content-Type", "application/json").send(dataObj);
  }

  return requestPromise.set(baseHeaders).use(
    signRequest("imdbapi", {
      ...awsCredentials,
      region: "us-east-1"
    })
  );
};

module.exports = request;
