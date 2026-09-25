// بيانات الربط الخاصة بـ JSONBin
const JSONBIN_BIN_ID = '6ab55304ac6210605af17b83'; 
const JSONBIN_API_KEY = '$2a$10$ivwSTRMoM3LWu6xcGn1TuOwDAt1Od36P/ifB92r0AgPfmP6ZeuEyy'; 

// دالة جلب البيانات من السحابة مع معالجة الحسابات الجديدة تلقائياً
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
        let db = data.record;

        // التأكد من وجود هيكل البيانات الأساسي
        if (!db) db = {};
        if (!db.usersDB) db.usersDB = {};

        // الحصول على اسم المستخدم الحالي
        let currentUser = localStorage.getItem('currentUser') || 'demo';

        // إذا كان الحساب جديداً وغير موجود في السحابة، يتم تهيئته فوراً بقيم افتراضية صريحة
        if (!db.usersDB[currentUser]) {
            db.usersDB[currentUser] = {
                balance: 0.00,
                vip: 'VIP0',
                completedTasks: [],
                history: [],
                createdAt: new Date().toISOString()
            };
            // حفظ الحساب الجديد فوراً في السحابة
            await updateCloudDB(db);
        } else {
            // ضمان أن الرصيد رقم صحيح وليس undefined أو null
            if (db.usersDB[currentUser].balance === undefined || db.usersDB[currentUser].balance === null || isNaN(db.usersDB[currentUser].balance)) {
                db.usersDB[currentUser].balance = 0.00;
            }
        }

        return db;

    } catch (error) {
        console.error('خطأ في الاتصال بالسحابة:', error);
        // ارجاع كائن افتراضي في حالة انقطاع الإنترنت لعدم تعطل الموقع
        let currentUser = localStorage.getItem('currentUser') || 'demo';
        let fallbackDB = { usersDB: {} };
        fallbackDB.usersDB[currentUser] = { balance: 0.00, vip: 'VIP0', completedTasks: [], history: [] };
        return fallbackDB;
    }
}

// دالة تحديث الحفظ في JSONBin
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

        if (!response.ok) throw new Error('فشل حفظ البيانات في JSONBin');

        return await response.json();
    } catch (error) {
        console.error('خطأ أثناء حفظ البيانات:', error);
    }
}
