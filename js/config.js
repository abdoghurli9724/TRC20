// ==================== إعدادات JSONBin ====================
const JSONBIN_BIN_ID = "ضع_هنا_BIN_ID_الخاص_بك";
const JSONBIN_API_KEY = "ضع_هنا_MASTER_KEY_الخاص_بك";

const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

// بيانات الأدمن
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "123";

// جلب جميع البيانات من السيرفر
async function fetchServerData() {
    try {
        const response = await fetch(`${JSONBIN_URL}/latest`, {
            method: 'GET',
            headers: {
                'X-Master-Key': JSONBIN_API_KEY
            }
        });
        const data = await response.json();
        return data.record || { usersDB: {} };
    } catch (error) {
        console.error("خطأ في جلب البيانات من JSONBin:", error);
        return { usersDB: {} };
    }
}

// حفظ وتحديث البيانات على السيرفر
async function updateServerData(fullData) {
    try {
        const response = await fetch(JSONBIN_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': JSONBIN_API_KEY
            },
            body: JSON.stringify(fullData)
        });
        return await response.json();
    } catch (error) {
        console.error("خطأ في حفظ البيانات على JSONBin:", error);
    }
}
