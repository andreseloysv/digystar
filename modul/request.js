const databaseConnection = require('../globals/db.js');

async function queryGetRequestInfo(client) {
  const query = `SELECT count(id), country FROM "user".request group by country;`;
  const result = await client.query(query);
  console.log('query request', query);
  return result.rows;
}

async function queryGetRegisteredUsers(client) {
  const query = `SELECT count(id) FROM "user".user;`;
  const result = await client.query(query);
  console.log('query number of registered users', query);
  return result.rows;
}

async function getRequestInfo() {
  const client = databaseConnection.getDBClient();
  client.connect();
  const requestInfo = await queryGetRequestInfo(client);
  client.end();
  return JSON.stringify(requestInfo);
}

async function getRegisteredUsers() {
  const client = databaseConnection.getDBClient();
  client.connect();
  const requestInfo = await queryGetRegisteredUsers(client);
  client.end();
  return JSON.stringify(requestInfo);
}

async function querySaveUserEmail(client, email) {
  const query = `INSERT into "user".user 
    ("email") VALUES ($1);`;
  const values = [email];
  console.log('query insert user email', query,values);
  return await client.query(query, values);
}

async function saveUserEmail(email = '') {
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
    "acceptlanguage") VALUES ($1,$2,
      $3,$4,$5,$6,$7,
      $8,$9,$10,$11,$12);`;
  const values = [
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
  ];
  console.log('query insert request', query, values);
  return await client.query(query, values);
}

async function saveRequestInfo(
  ip = '',
  country = '',
  host = '',
  userAgen = '',
  browserName = '',
  browserVersion = '',
  osName = '',
  osVersion = '',
  deviceVendor = '',
  deviceModel = '',
  deviceType = '',
  acceptLanguage = ''
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
  getRegisteredUsers,
  getRequestInfo,
  saveUserEmail,
  saveRequestInfo
};
