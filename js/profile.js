document.addEventListener("DOMContentLoaded", async function () {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = localStorage.getItem('currentUser');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    // التحقق من تسجيل الدخول
    if (!isLoggedIn || !currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // عرض اسم/رقم المستخدم
    const userEmailEl = document.getElementById('userEmail');
    if (userEmailEl) userEmailEl.innerText = currentUser;

    // 1. إذا كان المسجل هو الأدمن
    if (isAdmin) {
        if (document.getElementById('totalBalance')) document.getElementById('totalBalance').innerText = "∞";
        if (document.getElementById('depositAmount')) document.getElementById('depositAmount').innerText = "∞";
        if (document.getElementById('vipLevel')) document.getElementById('vipLevel').innerText = "مدير النظام";
        
        const adminBtn = document.getElementById('adminBtn');
        if (adminBtn) adminBtn.style.display = 'block';
        return;
    }

    // 2. إذا كان مستخدماً عادياً: جلب بياناته أونلاين من JSONBin
    try {
        let serverData = await fetchServerData();
        let usersDB = serverData.usersDB || {};
        let myData = usersDB[currentUser];

        if (myData) {
            // عرض القيم الحقيقية المسجلة بالحساب
            document.getElementById('totalBalance').innerText = myData.balance !== undefined ? myData.balance : 0;
            document.getElementById('depositAmount').innerText = myData.deposit !== undefined ? myData.deposit : 0;
            document.getElementById('vipLevel').innerText = myData.vipLevel || 'VIP0';
        } else {
            // إذا لم تتوفر بيانات (حساب جديد تماماً) -> تصفير الكل
            document.getElementById('totalBalance').innerText = "0";
            document.getElementById('depositAmount').innerText = "0";
            document.getElementById('vipLevel').innerText = "VIP0";
        }
    } catch (error) {
        console.error("خطأ في جلب بيانات المستخدم:", error);
        document.getElementById('totalBalance').innerText = "0";
        document.getElementById('depositAmount').innerText = "0";
        document.getElementById('vipLevel').innerText = "VIP0";
    }
});

// تسجيل الخروج
function handleLogout() {
    if (confirm('هل أنت تأكد من تسجيل الخروج؟')) {
        localStorage.clear();
        window.location.href = 'login.html';
    }
}
