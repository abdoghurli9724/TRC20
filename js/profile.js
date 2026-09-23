document.addEventListener("DOMContentLoaded", function () {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = localStorage.getItem('currentUser');

    // إذا لم يكن هناك تسجيل دخول ينقله فوراً للوجن
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }

    // عرض بيانات المستخدم الحالي
    if (currentUser) {
        const userEmailElem = document.getElementById('userEmail');
        if (userEmailElem) {
            userEmailElem.innerText = currentUser;
        }
    }
});

// دالة تسجيل الخروج
function handleLogout() {
    if (confirm('هل أنت تأكد من تسجيل الخروج؟')) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
}
