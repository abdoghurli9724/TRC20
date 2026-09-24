// db.js - الربط بقاعدة البيانات السحابية JSONbin.io

const JSONBIN_CONFIG = {
    apiKey: '$2a$10$ivwSTRMoM3LWu6xcGn1TuOwDAt1Od36P/ifB92r0AgPfmP6ZeuEyy', // ضع Master Key الخاص بك هنا
    binId: '6aaf174eac6210605ae110f6',             // ضع Bin ID الخاص بك هنا
    url: 'https://api.jsonbin.io/v3/b'
};

// جلب قاعدة البيانات من السحابة
async function getCloudDB() {
    try {
        const response = await fetch(`${JSONBIN_CONFIG.url}/${JSONBIN_CONFIG.binId}/latest`, {
            method: 'GET',
            headers: {
                'X-Master-Key': JSONBIN_CONFIG.apiKey,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        return data.record || { usersDB: {}, depositRequests: [] };
    } catch (error) {
        console.error('خطأ في جلب البيانات من السحابة:', error);
        return { usersDB: {}, depositRequests: [] };
    }
}

// تحديث وحفظ البيانات في السحابة
async function updateCloudDB(newData) {
    try {
        const response = await fetch(`${JSONBIN_CONFIG.url}/${JSONBIN_CONFIG.binId}`, {
            method: 'PUT',
            headers: {
                'X-Master-Key': JSONBIN_CONFIG.apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newData)
        });
        return await response.json();
    } catch (error) {
        console.error('خطأ في حفظ البيانات في السحابة:', error);
    }
}
