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
