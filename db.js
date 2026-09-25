// بيانات الربط الخاصة بـ JSONBin
const JSONBIN_BIN_ID = '6ab55304ac6210605af17b83'; 
const JSONBIN_API_KEY = '$2a$10$ivwSTRMoM3LWu6xcGn1TuOwDAt1Od36P/ifB92r0AgPfmP6ZeuEyy'; 

async function getCloudDB() {
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
            method: 'GET',
            headers: {
                'X-Master-Key': JSONBIN_API_KEY,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('فشل جلب البيانات من JSONBin');

        const data = await response.json();
        let db = data.record || {};
        if (!db.usersDB) db.usersDB = {};

        let currentUser = localStorage.getItem('currentUser') || 'demo';

        if (!db.usersDB[currentUser]) {
            db.usersDB[currentUser] = {
                balance: 0.00,
                totalDeposit: 0.00,
                vip: 'VIP0',
                completedTasks: [],
                history: []
            };
            await updateCloudDB(db);
        } else {
            if (db.usersDB[currentUser].balance === undefined || isNaN(db.usersDB[currentUser].balance)) {
                db.usersDB[currentUser].balance = 0.00;
            }
            if (db.usersDB[currentUser].totalDeposit === undefined || isNaN(db.usersDB[currentUser].totalDeposit)) {
                db.usersDB[currentUser].totalDeposit = 0.00;
            }
        }

        return db;
    } catch (error) {
        console.error('خطأ في الاتصال:', error);
        let currentUser = localStorage.getItem('currentUser') || 'demo';
        let fallbackDB = { usersDB: {} };
        fallbackDB.usersDB[currentUser] = { balance: 0.00, totalDeposit: 0.00, vip: 'VIP0', completedTasks: [], history: [] };
        return fallbackDB;
    }
}

async function updateCloudDB(newDbData) {
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': JSONBIN_API_KEY
            },
            body: JSON.stringify(newDbData)
        });
        return await response.json();
    } catch (error) {
        console.error('خطأ أثناء الحفظ:', error);
    }
}
