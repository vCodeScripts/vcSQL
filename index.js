const mysql = require("mysql2/promise");
var db;
let connectedToDatabase = false;
const config = require("./config.json");
// create the connection to database

const isObject = (options) => {
  if (Object.prototype.toString.call(options) === "[object Object]") {
    return true;
  }
  return false;
};

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

const executeSQL = async (sqlQuery, options) => {
  const resource = GetInvokingResource();
  let optionsArr;
  const check = isObject(options);
  check ? (optionsArr = []) : (optionsArr = options);
  if (check) {
    for (const [val, index] of Object.entries(options)) {
      optionsArr.push(val);
    }
  }

  if (!connectedToDatabase) await awaitDatabaseConnection();

  const [results, fields, err] = await db.query(sqlQuery, optionsArr);
  if (err) return console.error(err);
  return results;
};

const transaction = async (objects) => {
  let promises = [];
  if (!connectedToDatabase) await awaitDatabaseConnection();
  const isArr = Array.isArray(objects);
  if (!isArr)
    return console.error(
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
    console.error(err);
  }
  return promises;
};

exports("exec", executeSQL);
exports("transaction", transaction);

// const deneme = async () => {
//   const obj = [
//     ["SELECT * FROM players", []],
//     ["DELETE FROM gls_whitelist WHERE hex = ?", ["PYL76366"]],
//   ];
//   const res = await transaction(obj);
//   console.log(res);
// };

// deneme();
