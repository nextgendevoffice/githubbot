const express = require('express');
const bodyParser = require('body-parser');
const { handleWebhook } = require('./webhookHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware สำหรับแปลง body ที่ได้จาก requests เป็น JSON
app.use(bodyParser.json());

// Route สำหรับ GitHub Webhook
app.post('/webhook', handleWebhook);

// เริ่มเซิร์ฟเวอร์
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
