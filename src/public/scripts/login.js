window.onload = () => {
    const submitBtn = document.querySelector('.login-page > .container > .login-area > form > input[type=submit]');
    submitBtn.addEventListener('click', async (ev)=>{
        ev.preventDefault();
        const userInp = document.querySelectorAll('.login-page > .container > .login-area > form > input');
        let username = userInp[0].value;
        let password = userInp[1].value;
        await login(username, password);
    });
}

login = async (username, password) => {
    try{
        const res = await fetch('http://localhost:3000/v1/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'username': username,
                'password': password
            })
        });

        if (!res.ok) {
            throw new Error(await res.json());
        }

        const data = await res.json();
        window.location.href = `/home?id=${data._id}`;
      
    }catch(err){
        console.log('Lỗi Call API: ', err);
    }
}