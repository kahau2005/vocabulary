window.onload = function(){
    const startBtn = document.querySelector('.app-intro > button');
    startBtn.addEventListener('click', () => {
        window.location.href = '/login';
    });
}
