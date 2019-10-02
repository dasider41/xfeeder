chrome.runtime.onInstalled.addListener(() => {
  const DURATION = 1; // 1 min
  const db = dbConn();

  // initate default tables
  initateTables(db);
  console.log("onInstalled...");

  getFeeds(db);

  // create an schedule
  chrome.alarms.create("refresh", { periodInMinutes: DURATION });
});

chrome.alarms.onAlarm.addListener(alarm => {
  console.log(alarm.name); // refresh
  const db = dbConn();
  getFeeds(db);
});

const getFeeds = async db => {
  console.log("Http request");
  const url =
    "https://www.nzkoreapost.com/bbs/rss.php?bo_table=market_buynsell";
  const response = await fetch(url);
  const result = await response.text();
  const domParser = new DOMParser();
  const xmlParsed = domParser.parseFromString(result, "text/xml");
  const feeds = [];
  xmlParsed.querySelectorAll("item").forEach((item, idx) => {
    feeds[idx] = parsingItem(item);
  });
  await Promise.all(
    feeds.map(async feed => {
      const cntDuplicate = await countDuplicateArticle(db, "articles", [
        feed.link
      ]);
      console.log(cntDuplicate);
      if (cntDuplicate <= 0) {
        newArticle(db, feed);
      }
    })
  );
  console.log("update done");
  updateBadge(db);
};

const newArticle = (db, object) => {
  console.log("update new record");
  const query = buildQuery("articles", object);
  db.transaction(tx => {
    tx.executeSql(query, Object.values(object));
  });
};

const updateBadge = db => {
  console.log("updateBadge");
  db.transaction(tx =>
    tx.executeSql(
      `SELECT count(*) as total FROM articles`,
      [],
      (transaction, result) => {
        console.log(result);
        const badgeCount = result.rows[0].total;
        let badgeText = "";
        if (badgeCount > 0) {
          badgeText = badgeCount.toString();
        }
        if (badgeCount > 99) {
          badgeText = "99+";
        }
        chrome.browserAction.setBadgeText({ text: badgeText });
      }
    )
  );
};

const parsingItem = item => {
  const formatDate = str => {
    const strDate = new Date(str);
    return strDate
      .toISOString()
      .substr(0, 10)
      .concat(" ")
      .concat(strDate.toTimeString().substr(0, 8));
  };
  let title = item.querySelector("title").textContent;
  let link = item.querySelector("link").textContent;
  let date = item.getElementsByTagNameNS(
    "http://purl.org/dc/elements/1.1/",
    "date"
  )[0].textContent;

  return { title: title, link: link, date: formatDate(date) };
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
      "CREATE TABLE IF NOT EXISTS articles (id INTEGER PRIMARY KEY ASC, title TEXT, link TEXT, date DATETIME)"
      //   "CREATE TABLE IF NOT EXISTS subscription (id INTEGER PRIMARY KEY ASC, title TEXT, body TEXT)"
    ];
    queries.map(query => {
      tx.executeSql(query);
    });
  });
};

const countDuplicateArticle = (db, table, condition) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx =>
      tx.executeSql(
        `SELECT count(*) as count FROM ${table} Where link = ?`,
        condition,
        (transaction, result) => {
          // console.log(result);
          resolve(result.rows[0].count);
        }
      )
    );
  });
};
