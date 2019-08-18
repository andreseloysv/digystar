const { Client } = require("pg");

function getDBClient() {
  return new Client({
    connectionString:
      process.env.DATABASE_URL ||
      "postgres://ldrgpvtrwembad:b3e8f7fcfd472039155a1748bc1d99d2debf235a5417c78f43fdba4f5cd0c606@ec2-79-125-2-142.eu-west-1.compute.amazonaws.com:5432/d1n97knhjptmb7",
    ssl: process.env.DATABASE_URL ? true : true
  });
}

module.exports = {
  getDBClient
};
