// إعدادات JSONBin.io (استبدل القيم بالتالي من حسابك)
const JSONBIN_BIN_ID = '6ab41ca8ffd5d1605327a369';
const JSONBIN_API_KEY = '$2a$10$ivwSTRMoM3LWu6xcGn1TuOwDAt1Od36P/ifB92r0AgPfmP6ZeuEyy';
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

// جلب قائمة المستخدمين من JSONBin
async function getUsers() {
    try {
        const response = await fetch(JSONBIN_URL + '/latest', {
            method: 'GET',
            headers: {
                'X-Master-Key': JSONBIN_API_KEY
            }
        });
        const data = await response.json();
        return data.record.users || [];
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}

// حفظ حساب جديد في JSONBin
async function handleRegister(event) {
    event.preventDefault();
    const emailInput = document.getElementById('regEmail').value.trim();
    const passInput = document.getElementById('regPass').value.trim();
    const statusMsg = document.getElementById('statusMsg');

    statusMsg.style.color = '#ff9800';
    statusMsg.innerText = 'جاري جلب البيانات والتسجيل...';

    const users = await getUsers();

    // التحقق من وجود الحساب مسبقاً
    const userExists = users.some(u => u.email === emailInput);
    if (userExists) {
        statusMsg.style.color = '#f44336';
        statusMsg.innerText = 'هذا البريد أو الرقم مسجل بالفعل!';
        return;
    }

    // إضافة الحساب الجديد
    users.push({ email: emailInput, password: passInput, createdAt: new Date().toISOString() });

    try {
        const response = await fetch(JSONBIN_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': JSONBIN_API_KEY
            },
            body: JSON.stringify({ users: users })
        });

        if (response.ok) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', emailInput);
            window.location.href = 'index.html';
        } else {
            statusMsg.style.color = '#f44336';
            statusMsg.innerText = 'حدث خطأ أثناء حفظ البيانات.';
        }
    } catch (error) {
        console.error('Register Error:', error);
        statusMsg.style.color = '#f44336';
        statusMsg.innerText = 'فشل الاتصال بالخادم.';
    }
}

// التحقق من بيانات تسجيل الدخول مقابل JSONBin
async function handleLogin(event) {
    event.preventDefault();
    const emailInput = document.getElementById('loginEmail').value.trim();
    const passInput = document.getElementById('loginPass').value.trim();
    const statusMsg = document.getElementById('statusMsg');

    statusMsg.style.color = '#ff9800';
    statusMsg.innerText = 'جاري التحقق من البيانات...';

    const users = await getUsers();

    // المطابقة الدقيقة بين الإدخال والبيانات المخزنة
    const validUser = users.find(u => u.email === emailInput && u.password === passInput);

    if (validUser) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', validUser.email);
        window.location.href = 'index.html';
    } else {
        statusMsg.style.color = '#f44336';
        statusMsg.innerText = 'بيانات الدخول غير صحيحة!';
    }
}

// وظائف نافذة الدفع والدعم
function openPaymentModal(level, price) {
    document.getElementById('payTitle').innerText = 'ترقية إلى ' + level;
    document.getElementById('payAmount').innerText = price + ' USDT';
    document.getElementById('paymentModal').style.display = 'flex';
}

function closePaymentModal() {
    document.getElementById('paymentModal').style.display = 'none';
}

function copyWallet() {
    const address = document.getElementById('walletAddress').innerText;
    navigator.clipboard.writeText(address);
    alert('تم نسخ عنوان المحفظة!');
}

function submitTransaction(event) {
    event.preventDefault();
    const txid = document.getElementById('txidInput').value;
    alert('تم إرسال رقم العملية (TXID) بنجاح للمدير.\n\nرقم العملية: ' + txid + '\nسيتم التفعيل فور التحقق.');
    document.getElementById('txidInput').value = '';
    closePaymentModal();
}
