document.addEventListener("DOMContentLoaded", async function () {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = localStorage.getItem('currentUser');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }

    if (currentUser) {
        document.getElementById('userEmail').innerText = currentUser;
    }

    // إظهار زر التحكم للأدمن
    if (isAdmin) {
        const adminBtn = document.getElementById('adminBtn');
        if (adminBtn) adminBtn.style.display = 'block';

        document.getElementById('totalBalance').innerText = "∞";
        document.getElementById('depositAmount').innerText = "∞";
        document.querySelector('.vip-badge span').innerText = "مُدير النظام";
    } 
    // جلب أحدث بيانات للعضو من السيرفر
    else {
        let serverData = await fetchServerData();
        let usersDB = serverData.usersDB || {};
        let myData = usersDB[currentUser];

        if (myData) {
            document.getElementById('totalBalance').innerText = myData.balance;
            document.getElementById('depositAmount').innerText = myData.deposit;
            document.querySelector('.vip-badge span').innerText = myData.vipLevel;
        }
    }
});

function handleLogout() {
    if (confirm('هل أنت تأكد من تسجيل الخروج؟')) {
        localStorage.clear();
        window.location.href = 'login.html';
    }
}
