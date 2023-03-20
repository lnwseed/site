last_account = {};
last_ref = '';
auth.onsubmit = async (e) => {
    e.preventDefault();
    showLoading('ระบบกำลังตรวจสอบความถูกต้อง...');
    let request = await apiRequest('/api', 'POST', {
        request: 'requestTmnOtp',
        data: GetFormData(e.target.id)
    }, {
        'Content-Type': 'application/json'
    });
    if (request.code === "NMLD-200") {
        last_account = GetFormData(e.target.id);
        showLoading('กำลังส่งรหัส OTP ไปยัง ' + GetFormData(e.target.id).username + '');
        document.getElementById('status_text_verify').innerHTML = ('ระบบได้ส่งรหัส OTP ไปที่ ' + request.data.mobile_number + ' | REF : ' + request.data.otp_reference)
        document.getElementById('inoud_kk34').innerHTML = ('REF : ' + request.data.otp_reference)
        last_ref = request.data.otp_reference;
        setTimeout(() => {
            setVisible('default', false);
            setVisible('loading', false);
            setVisible('verify', true);
            setVisible('verified', false);
        }, 3000)
    } else {
        setVisible('default', true);
        setVisible('loading', false);
        setVisible('verify', false);
        setVisible('verified', false);
        CustomAlert(request.alert.type, request.alert.title, request.alert.subtitle, request.alert.btn);
    }
};

verify_f.onsubmit = async (e) => {
    e.preventDefault();
    showLoading('ระบบกำลังตรวจสอบความถูกต้อง...');
    let data = GetFormData(e.target.id);
    data.ref = last_ref;
    let request = await apiRequest('/api', 'POST', {
        request: 'verifyTmnOtp',
        account: last_account,
        data: data
    }, {
        'Content-Type': 'application/json'
    });
    if (request.code === "NMLD-200") {
        showLoading('ระบบกำลังยืนยันการทำรายการ...');
        document.getElementById('status_text_verified').innerHTML = ('ลงทะเบียน ' + last_account.username + ' เรียบร้อยแล้ว')
        document.getElementById('auth').reset();
        document.getElementById('verify_f').reset();
        setTimeout(() => {
            setVisible('default', false);
            setVisible('loading', false);
            setVisible('verify', false);
            setVisible('verified', true);
        }, 3000)
    } else {
        setVisible('default', false);
        setVisible('loading', false);
        setVisible('verify', true);
        setVisible('verified', false);
        CustomAlert(request.alert.type, request.alert.title, request.alert.subtitle, request.alert.btn);
    }
};