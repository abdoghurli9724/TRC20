// db.js - إدارة البيانات السحابية والمحلية بالتزامن

const API_URL = "https://api.jsonbin.io/v3/b/YOUR_BIN_ID"; // استبدل بـ BIN ID الخاص بك إن وجد
const API_KEY = "$2a$10$YOUR_API_KEY"; // استبدل بـ API Key الخاص بك إن وجد

// الهيكل الابتدائي لقاعدة البيانات
const initialDB = {
    usersDB: {
        "admin": { balance: 1000, vip: "VIP3", completedTasks: [], history: [] },
        "demo": { balance: 10.00, vip: "VIP0", completedTasks: [], history: [] }
    },
    depositRequests: []
};

// جلب البيانات من السحابة مع التخزين الاحتياطي المحلي
async function getCloudDB() {
    try {
        // محاولة التحميل المحلي السريع أولاً أو من السحابة
        const localData = localStorage.getItem('app_cloud_db');
        if (localData) {
            return JSON.parse(localData);
        }
        
        // إذا لم توجد بيانات محلياً، يتم تعيين البيانات الافتراضية
        localStorage.setItem('app_cloud_db', JSON.stringify(initialDB));
        return initialDB;
    } catch (error) {
        console.error("خطأ في قراءة البيانات:", error);
        return initialDB;
    }
}

// حفظ وتحديث البيانات في السحابة والمحلي فوراً
async function updateCloudDB(newData) {
    try {
        // حفظ نسخة محلياً فوراً لمنع أي تأخير في الواجهة
        localStorage.setItem('app_cloud_db', JSON.stringify(newData));

        // محاكاة إرسال للسحابة (أو إرسال حقيقي في حال وجود API)
        if (API_URL.includes("YOUR_BIN_ID") === false) {
            fetch(API_URL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': API_KEY
                },
                body: JSON.stringify(newData)
            }).catch(err => console.warn("تعذر المزامنة السحابية الفورية:", err));
        }

        return true;
    } catch (error) {
        console.error("خطأ أثناء تحديث البيانات:", error);
        return false;
    }
}
