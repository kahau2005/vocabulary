window.onload = () => {
    const submitBtn = document.querySelector('.login-page > .container > .login-area > form > input[type=submit]');
    
    submitBtn.addEventListener('click', async (ev) => {
        ev.preventDefault(); // Ngừng hành động mặc định của nút submit
        
        const userInp = document.querySelectorAll('.login-page > .container > .login-area > form > input');
        let username = userInp[0].value;
        let password = userInp[1].value;
        
        // Kiểm tra nếu tên đăng nhập hoặc mật khẩu bị bỏ trống
        if (!username || !password) {
            alert("Vui lòng điền đủ thông tin!");
            return;
        }

        await login(username, password);
    });
}

// Hàm xử lý đăng nhập
const login = async (username, password) => {
    try {
        // Gửi yêu cầu đăng nhập
        const res = await fetch('https://vocabulary-jund.onrender.com/v1/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'username': username,
                'password': password,
            }),
        });

        // Kiểm tra xem yêu cầu có thành công không
        if (!res.ok) {
            if (res.status === 401 || res.status === 403) {
                window.location.href = '/login';
            } else {
                console.log('Lỗi khi gọi API!');
            }
            const errorData = await res.json();
            throw new Error(errorData.message || 'Lỗi đăng nhập');
        }

        // Nhận dữ liệu từ server
        const data = await res.json();

        // Lưu accessToken vào localStorage
        localStorage.setItem('accessToken', data.accessToken);

        // Chuyển hướng tới trang home
        window.location.href = `/home?id=${data._id}`;

    } catch (err) {
        // Hiển thị lỗi nếu có sự cố khi gọi API
        console.error('Lỗi Call API: ', err);
        alert('Đăng nhập thất bại, vui lòng thử lại!');
    }
}
