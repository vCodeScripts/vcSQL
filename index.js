const mysql = require("mysql2/promise");
var db;
let connectedToDatabase = false;
const config = require("./config.json");
// create the connection to database

const awaitDatabaseConnection = async () => {
  if (connectedToDatabase) return;
  await new Promise((ensure) => {
    (function timeout() {
      if (connectedToDatabase) {
        return ensure();
      }
      setTimeout(timeout);
    });
  });
};

const initConnection = async () => {
  db = mysql.createPool(config);
  if (db) {
    console.log("Connected to the database.");
    connectedToDatabase = true;
  } else {
    console.log("Error whilst connecting to the database.");
    connectedToDatabase = false;
  }
};
initConnection();

const execute = async (sqlQuery, options) => {
  const resource = GetInvokingResource();

  if (!connectedToDatabase) await awaitDatabaseConnection();

  const [results, fields, err] = await db.query(sqlQuery, options);
  if (err) return console.log(err);
  return results;
};

const transaction = async (objects) => {
  let promises = [];
  if (!connectedToDatabase) await awaitDatabaseConnection();
  const isArr = Array.isArray(objects);
  if (!isArr)
    return console.log(
      "The given parameters to the transaction are faulty. Type needed: Array, type recieved: " +
        typeof objects
    );

  try {
    for ([query, options] of objects) {
      const [results, fields, err] = await db.query(query, options);
      // console.log(results);
      if (err) throw new Error("Transaction Error!");
      promises.push(results);
    }
  } catch (err) {
    console.log(err);
  }
  return promises;
};

exports("exec", execute);
exports("transaction", transaction);
