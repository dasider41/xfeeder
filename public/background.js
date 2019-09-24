chrome.runtime.onInstalled.addListener(() => {
  let db = dbConn();
  // initate default tables
  initateTables(db);

  console.log("onInstalled...");
  getFeeds(db);
  chrome.alarms.create("refresh", { periodInMinutes: 1 });
});

chrome.alarms.onAlarm.addListener(alarm => {
  console.log(alarm.name); // refresh
  let db = dbConn();
  getFeeds(db);
});

const getFeeds = db => {
  console.log("Http request");
  const url =
    "https://www.nzkoreapost.com/bbs/rss.php?bo_table=market_buynsell";
  fetch(url)
    .then(r => r.text())
    .then(result => {
      const domParser = new DOMParser();
      const xmlParsed = domParser.parseFromString(result, "text/xml");
      xmlParsed.querySelectorAll("item").forEach(item => {
        console.log(item);
        let objFeed = parsingItem(item);
        duplicateArticle(db, "articles", [objFeed.link]).then(res => {
          console.log(res);
          if (res <= 0) {
            console.log("update new record");
            const query = buildQuery("articles", objFeed);
            db.transaction(tx => {
              tx.executeSql(query, Object.values(objFeed));
            });
          }
        });
      });
    });
};

const parsingItem = item => {
  let title = item.querySelector("title").textContent;
  let link = item.querySelector("link").textContent;
  let date = item.getElementsByTagNameNS(
    "http://purl.org/dc/elements/1.1/",
    "date"
  )[0].textContent;
  return { title: title, link: link, date: date };
};

// TODO :: refactory by package
/**************** websql.js ******************** */

const dbConn = () => {
  let db;
  if (!window.openDatabase) {
    console.log("WebSQL is not supported by your browser!");
    return null;
  }

  // Create the database the parameters are 1. the database name 2.version number 3. a description 4. the size of the database (in bytes) 1024 x 1024 = 1MB
  db = openDatabase("feed_db", "0.1", "x Feed web sql", 1024 * 1024);

  return db;
};

const buildQuery = (table, object) => {
  const keys = Object.keys(object);
  const values = "?,".repeat(keys.length).slice(0, -1);
  return `INSERT INTO ${table} (${keys}) VALUES (${values})`;
};

const initateTables = db => {
  console.log("init table");
  db.transaction(tx => {
    const queries = [
      "CREATE TABLE IF NOT EXISTS articles (id INTEGER PRIMARY KEY ASC, title TEXT, link TEXT, date TEXT)"
      //   "CREATE TABLE IF NOT EXISTS subscription (id INTEGER PRIMARY KEY ASC, title TEXT, body TEXT)"
    ];
    queries.map(query => {
      tx.executeSql(query);
    });
  });
};

const duplicateArticle = (db, table, condition) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx =>
      tx.executeSql(
        `SELECT count(*) as count FROM ${table} Where link = ?`,
        condition,
        (transaction, result) => {
          console.log(result);
          resolve(result.rows[0].count);
        }
      )
    );
  });
};
