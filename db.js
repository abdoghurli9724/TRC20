// ==========================================
// VirtualMall DB Engine - JSONBin Integration
// ==========================================

const JSONBIN_CONFIG = {
  BIN_ID: "6ab64fc4ffd5d160532d8642",
  API_KEY: "$2a$10$ivwSTRMoM3LWu6xcGn1TuOwDAt1Od36P/ifB92r0AgPfmP6ZeuEyy",
  MASTER_KEY: "$2a$10$ivwSTRMoM3LWu6xcGn1TuOwDAt1Od36P/ifB92r0AgPfmP6ZeuEyy",
  BASE_URL: "https://api.jsonbin.io/v3/b"
};

const DEFAULT_DATABASE = {
  users: [
    {
      username: "088888888",
      password: "123",
      balance: 100.00,
      depositBalance: 50.00,
      totalDeposit: 50.00,
      vip: "VIP1",
      referralCode: "REF888",
      invitedBy: null,
      completedTasksToday: [],
      lastTaskResetDate: new Date().toISOString().split('T')[0],
      history: [
        {
          id: "TX1001",
          type: "deposit",
          title: "إيداع أولي",
          amount: 50.00,
          status: "completed",
          date: new Date().toLocaleString('ar-EG')
        }
      ]
    }
  ],
  depositRequests: [],
  withdrawRequests: [],
  vipPackages: [
    { id: "VIP0", name: "عضوية VIP0 (تجريبي)", price: 0, tasks: 2, taskProfit: 0.25, dailyIncome: 0.50, monthlyIncome: 15.00, yearlyIncome: 180.00, referralCommission: 0.10 },
    { id: "VIP1", name: "عضوية VIP1 الاحترافية", price: 20, tasks: 6, taskProfit: 3.50, dailyIncome: 21.00, monthlyIncome: 630.00, yearlyIncome: 7560.00, referralCommission: 0.10 },
    { id: "VIP2", name: "عضوية VIP2 الذهبية", price: 50, tasks: 6, taskProfit: 5.00, dailyIncome: 30.00, monthlyIncome: 900.00, yearlyIncome: 10800.00, referralCommission: 0.10 },
    { id: "VIP3", name: "عضوية VIP3 الماسية", price: 100, tasks: 10, taskProfit: 8.00, dailyIncome: 80.00, monthlyIncome: 2400.00, yearlyIncome: 28800.00, referralCommission: 0.10 },
    { id: "VIP7", name: "عضوية VIP 7", price: 200, tasks: 5, taskProfit: 5.00, dailyIncome: 25.00, monthlyIncome: 450.00, yearlyIncome: 5400.00, referralCommission: 0.10 }
  ],
  systemStats: {
    totalVolume: 5000.00,
    activeUsersCount: 1
  }
};

async function getCloudDB() {
  if (!JSONBIN_CONFIG.BIN_ID || JSONBIN_CONFIG.BIN_ID === "YOUR_BIN_ID_HERE") {
    return getLocalDB();
  }

  try {
    const response = await fetch(`${JSONBIN_CONFIG.BASE_URL}/${JSONBIN_CONFIG.BIN_ID}/latest`, {
      method: "GET",
      headers: {
        "X-Master-Key": JSONBIN_CONFIG.MASTER_KEY || JSONBIN_CONFIG.API_KEY,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`فشل جلب البيانات السحابية: ${response.statusText}`);
    }

    const data = await response.json();
    const dbData = data.record;
    localStorage.setItem("TRC20_LOCAL_BACKUP", JSON.stringify(dbData));
    return dbData;
  } catch (error) {
    console.error("خطأ في الاتصال بـ JSONBin:", error);
    return getLocalDB();
  }
}

async function updateCloudDB(newDatabase) {
  localStorage.setItem("TRC20_LOCAL_BACKUP", JSON.stringify(newDatabase));

  if (!JSONBIN_CONFIG.BIN_ID || JSONBIN_CONFIG.BIN_ID === "YOUR_BIN_ID_HERE") {
    return true;
  }

  try {
    const response = await fetch(`${JSONBIN_CONFIG.BASE_URL}/${JSONBIN_CONFIG.BIN_ID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": JSONBIN_CONFIG.MASTER_KEY || JSONBIN_CONFIG.API_KEY
      },
      body: JSON.stringify(newDatabase)
    });

    if (!response.ok) {
      throw new Error(`فشل تحديث البيانات السحابية: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error("خطأ في تحديث JSONBin:", error);
    return false;
  }
}

function getLocalDB() {
  const localData = localStorage.getItem("TRC20_LOCAL_BACKUP");
  if (!localData) {
    localStorage.setItem("TRC20_LOCAL_BACKUP", JSON.stringify(DEFAULT_DATABASE));
    return DEFAULT_DATABASE;
  }
  return JSON.parse(localData);
}

async function getCurrentUser() {
  const currentUsername = localStorage.getItem("currentUser");
  if (!currentUsername) return null;

  const db = await getCloudDB();
  return db.users.find(u => u.username === currentUsername) || null;
}

async function updateUserData(username, updatedFields) {
  const db = await getCloudDB();
  const userIndex = db.users.findIndex(u => u.username === username);

  if (userIndex !== -1) {
    db.users[userIndex] = { ...db.users[userIndex], ...updatedFields };
    await updateCloudDB(db);
    return db.users[userIndex];
  }
  return null;
}

function logoutUser() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

function generateTransactionId() {
  return "TX" + Math.floor(100000 + Math.random() * 900000);
}

function generateReferralCode() {
  return "REF" + Math.floor(100000 + Math.random() * 900000);
}

(async function initDatabaseEngine() {
  const db = await getCloudDB();
  if (!db || !db.users) {
    await updateCloudDB(DEFAULT_DATABASE);
  }
})();
