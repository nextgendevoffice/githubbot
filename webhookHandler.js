const { logPush, getTodaysUserPushCount } = require('./db');
const { notifyPush } = require('./telegramNotifier');

function handleWebhook(req, res) {
    const { commits, pusher } = req.body;
    if (!commits || !Array.isArray(commits)) {
        console.error('Commits is undefined or not an array');
        return res.status(400).send('Bad request');
    }

    commits.forEach(commit => {
        logPush(pusher.name, commit.message, commit.url);
        // หลังจาก logPush, ดึงจำนวนการ push ของวันนี้
        getTodaysUserPushCount(pusher.name, (err, count) => {
            if (err) {
                console.error('Error fetching today\'s push count:', err);
                return;
            }
            // ที่นี่ count คือจำนวนการ push ของผู้ใช้ในวันนี้
            notifyPush(pusher.name, commit.message, commit.url, count);
        });
    });

    res.status(200).send('Webhook received and processed');
}
module.exports = { handleWebhook };