const databaseConnection = require("../globals/db.js");

async function queryGetRequestInfo(client, email, password) {
  const query = `SELECT count(id), country FROM "user".request group by country;`;
  const result = await client.query(query);
  console.log("query request", query);
  return result.rows;
}

async function getRequestInfo() {
  const client = databaseConnection.getDBClient();
  client.connect();
  const requestInfo = await queryGetRequestInfo(client);
  client.end();
  return JSON.stringify(requestInfo);
}

async function querySaveUserEmail(client, email) {
  const query = `INSERT into "user".user 
    ("email") VALUES ('${email}');`;
  console.log("query insert user email", query);
  return await client.query(query);
}

async function saveUserEmail(email = "") {
  let client = databaseConnection.getDBClient();
  client.connect();
  await querySaveUserEmail(client, email);
  client.end();
}

async function querySaveRequestInfo(
  client,
  ip,
  country,
  host,
  userAgen,
  browserName,
  browserVersion,
  osName,
  osVersion,
  deviceVendor,
  deviceModel,
  deviceType,
  acceptLanguage
) {
  const query = `INSERT into "user".request 
    ("ip", "country", "host", "useragen",
    "browsername", "browserversion",
    "osname","osversion","devicevendor",
    "devicemodel","devicetype",
    "acceptlanguage") VALUES ('${ip}','${country}',
    '${host}','${userAgen}','${browserName}','${browserVersion}','${osName}',
    '${osVersion}','${deviceVendor}','${deviceModel}','${deviceType}','${acceptLanguage}');`;
  console.log("query insert request", query);
  return await client.query(query);
}

async function saveRequestInfo(
  ip = "",
  country = "",
  host = "",
  userAgen = "",
  browserName = "",
  browserVersion = "",
  osName = "",
  osVersion = "",
  deviceVendor = "",
  deviceModel = "",
  deviceType = "",
  acceptLanguage = ""
) {
  let client = databaseConnection.getDBClient();
  client.connect();
  await querySaveRequestInfo(
    client,
    ip,
    country,
    host,
    userAgen,
    browserName,
    browserVersion,
    osName,
    osVersion,
    deviceVendor,
    deviceModel,
    deviceType,
    acceptLanguage
  );
  client.end();
}
module.exports = {
  getRequestInfo,
  saveUserEmail,
  saveRequestInfo
};