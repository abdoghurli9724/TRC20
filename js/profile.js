document.addEventListener("DOMContentLoaded", function () {
    // جلب اسم المستخدم من التخزين المحلي
    const currentUser = localStorage.getItem('currentUser');
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
