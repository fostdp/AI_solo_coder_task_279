const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'records.json');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

function readRecords() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            return JSON.parse(data);
        }
        return [];
    } catch (err) {
        console.error('读取记录失败:', err);
        return [];
    }
}

function writeRecords(records) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(records, null, 2), 'utf8');
        return true;
    } catch (err) {
        console.error('保存记录失败:', err);
        return false;
    }
}

app.get('/api/records', (req, res) => {
    const records = readRecords();
    res.json(records);
});

app.post('/api/records', (req, res) => {
    const record = req.body;
    const records = readRecords();
    
    records.unshift(record);
    
    if (records.length > 20) {
        records.splice(20);
    }
    
    if (writeRecords(records)) {
        res.json({ success: true, record });
    } else {
        res.status(500).json({ success: false, error: '保存失败' });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log('垃圾分类AR游戏服务器已启动');
    console.log('访问地址: http://localhost:' + PORT);
    console.log('API地址: http://localhost:' + PORT + '/api/records');
});
