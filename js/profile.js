// profile.js - VirtualMall Profile & Account Management Logic

let currentProfileUser = null;

// Initialize Profile Page Data
async function initProfilePage() {
  const activeUsername = localStorage.getItem('currentUser');
  if (!activeUsername) {
    window.location.href = 'login.html';
    return;
  }

  try {
    currentProfileUser = await getCurrentUser();
    if (!currentProfileUser) {
      logoutUser();
      return;
    }

    renderProfileData(currentProfileUser);
    setupRealtimeSync();

  } catch (error) {
    console.error('Error initializing profile page:', error);
  }
}

// Render User Data to UI Elements
function renderProfileData(user) {
  if (!user) return;

  const usernameEl = document.getElementById('profileUsername') || document.getElementById('displayUsername');
  const refCodeEl = document.getElementById('profileRefCode') || document.getElementById('displayRefCode');
  const vipEl = document.getElementById('profileVip') || document.getElementById('vipText');
  
  const balanceEl = document.getElementById('profileBalance');
  const todayEarningsEl = document.getElementById('profileTodayEarnings');
  const teamCommissionsEl = document.getElementById('profileTeamCommissions');
  const totalDepositEl = document.getElementById('profileTotalDeposit') || document.getElementById('displayTotalDeposit');
  const totalWithdrawEl = document.getElementById('profileTotalWithdraw');

  if (usernameEl) usernameEl.innerText = user.username;
  if (refCodeEl) refCodeEl.innerText = user.referralCode || '-----';
  if (vipEl) vipEl.innerText = user.vip || 'VIP0';

  if (balanceEl) balanceEl.innerText = '$' + parseFloat(user.balance || 0).toFixed(2);
  if (todayEarningsEl) todayEarningsEl.innerText = '$' + parseFloat(user.todayEarnings || 0).toFixed(2);
  if (teamCommissionsEl) teamCommissionsEl.innerText = '$' + parseFloat(user.teamCommissions || 0).toFixed(2);
  if (totalDepositEl) totalDepositEl.innerText = '$' + parseFloat(user.totalDeposit || 0).toFixed(2);
  if (totalWithdrawEl) totalWithdrawEl.innerText = '$' + parseFloat(user.totalWithdraw || 0).toFixed(2);
}

// Real-time Cloud Sync Listener
function setupRealtimeSync() {
  setInterval(async () => {
    const activeUsername = localStorage.getItem('currentUser');
    if (!activeUsername) return;

    try {
      const freshUser = await getCurrentUser();
      if (freshUser) {
        currentProfileUser = freshUser;
        renderProfileData(currentProfileUser);
      }
    } catch (err) {
      console.error('Realtime sync error:', err);
    }
  }, 10000);
}

// Copy Referral Link to Clipboard
function copyReferralLink() {
  if (!currentProfileUser || !currentProfileUser.referralCode) return;
  
  const baseUrl = window.location.origin + window.location.pathname.replace('profile.html', 'register.html');
  const fullRefLink = baseUrl + '?ref=' + currentProfileUser.referralCode;

  navigator.clipboard.writeText(fullRefLink).then(() => {
    alert('تم نسخ رابط الدعوة بنجاح!');
  }).catch(err => {
    console.error('Copy failed:', err);
    alert('تعذر نسخ الرابط تلقائياً، يمكنك نسخ كود الدعوة يدوياً');
  });
}

// Handle User Logout
function handleProfileLogout() {
  if (confirm('هل أنت تأكد من رغبتك في تسجيل الخروج؟')) {
    logoutUser();
  }
}

// Auto Bind Profile Events on DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
  const profileLogoutBtn = document.getElementById('profileLogoutBtn') || document.getElementById('accountLogoutBtn');
  if (profileLogoutBtn) {
    profileLogoutBtn.addEventListener('click', handleProfileLogout);
  }

  const copyRefBtn = document.getElementById('copyRefBtn');
  if (copyRefBtn) {
    copyRefBtn.addEventListener('click', copyReferralLink);
  }

  // Initialize Page Data if on relevant pages
  if (document.getElementById('profileUsername') || document.getElementById('displayUsername')) {
    initProfilePage();
  }
});
