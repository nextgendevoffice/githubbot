const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./githubPushNotifications.db');

db.serialize(() => {
  // สร้างตาราง push_logs หากยังไม่มี
  db.run(`CREATE TABLE IF NOT EXISTS push_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pusher_name TEXT NOT NULL,
    commit_message TEXT,
    commit_url TEXT,
    push_date TEXT NOT NULL
  )`);
});

function logPush(pusherName, commitMessage, commitUrl) {
  const stmt = db.prepare(`INSERT INTO push_logs (pusher_name, commit_message, commit_url, push_date) VALUES (?, ?, ?, ?)`);
  stmt.run(pusherName, commitMessage, commitUrl, new Date().toISOString(), function(err) {
    if (err) {
      console.error(err);
    }
    console.log(`Logged push from ${pusherName}`);
  });
  stmt.finalize();
}

function getTodaysPushCount(callback) {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  db.all(`SELECT pusher_name, COUNT(*) as count FROM push_logs WHERE push_date BETWEEN ? AND ? GROUP BY pusher_name`, [todayStart.toISOString(), todayEnd.toISOString()], (err, rows) => {
    if (err) {
      console.error(err);
      callback(err);
      return;
    }
    callback(null, rows);
  });
}

function getTodaysUserPushCount(pusherName, callback) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
  
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
  
    db.get(`SELECT COUNT(*) AS count FROM push_logs WHERE pusher_name = ? AND push_date BETWEEN ? AND ?`, [pusherName, todayStart.toISOString(), todayEnd.toISOString()], (err, row) => {
      if (err) {
        console.error(err);
        callback(err);
        return;
      }
      callback(null, row ? row.count : 0);
    });
  }
  

  module.exports = { logPush, getTodaysPushCount, getTodaysUserPushCount };

