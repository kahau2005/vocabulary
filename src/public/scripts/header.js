window.onload = () => {
    const userGreating = document.querySelector('.user-area > span');
    const userData = localStorage.getItem('user-data');
    if(userData){
        console.log(userData);
        userGreating.innerText = 'Chào, ' + JSON.parse(userData).name;
    }else{
        console.log('Không có dữ liệu người dùng!');
        window.location.href = '/login';
    }
    
}