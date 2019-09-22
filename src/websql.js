const dbConn = () => {
  let db;
  if (!window.openDatabase) {
    console.log("WebSQL is not supported by your browser!");
    return null;
  }

  // Create the database the parameters are 1. the database name 2.version number 3. a description 4. the size of the database (in bytes) 1024 x 1024 = 1MB
  db = openDatabase("feed_db", "0.1", "x Feed web sql", 1024 * 1024);
  // initate default tables
  initateTables(db);
  return db;
};

const initateTables = db => {
  db.transaction(tx => {
    const queries = [
      "CREATE TABLE IF NOT EXISTS articles (id INTEGER PRIMARY KEY ASC, title TEXT, body TEXT)",
      "CREATE TABLE IF NOT EXISTS subscription (id INTEGER PRIMARY KEY ASC, title TEXT, body TEXT)"
    ];
    queries.map(query => {
      tx.executeSql(query);
    });
  });
};

const insertMap = (db, table, array) => {
  const query = buildQuery(table, array[0]);
  array.map(item => {
    db.transaction(tx => {
      tx.executeSql(query, Object.values(item));
    });
  });
};

const showTable = (db, table) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx =>
      tx.executeSql(`SELECT * FROM ${table}`, [], (transaction, result) => {
        let response = [];
        for (var i = 0; i < result.rows.length; i++) {
          response.push(result.rows.item(i));
        }
        resolve(response);
      })
    );
  });
};

const buildQuery = (table, object) => {
  const keys = Object.keys(object);
  const values = "?,".repeat(keys.length).slice(0, -1);
  return `INSERT INTO ${table} (${keys}) VALUES (${values})`;
};

export { dbConn, insertMap, showTable };
