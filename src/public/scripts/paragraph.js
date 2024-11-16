window.onload = () => {
    const titleField = document.getElementById('inp-title');
    const contentField = document.getElementById('inp-paragraph');
    const btnSubmit = document.querySelector('.btn-contain > button');
    btnSubmit.addEventListener('click', async() => {
        let title = titleField.value;
        let paragraph = contentField.value;
        const data = await submitParagraph(title, paragraph);
        console.log(data);
        window.location.href = `/select?docId=${data._id}`;
    })
}

submitParagraph = async(title, paragraph) => {
    const accessToken = localStorage.getItem('accessToken');
    try{const params = new URLSearchParams(window.location.search);
        const res = await fetch('http://localhost:3000/data/upload-paragraph',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                'userID': params.get('id'),
                'title': title,
                'paragraph': paragraph
            })
                
        });

        if (!res.ok) {
            if (res.status === 401 || res.status === 403) {
                window.location.href = '/login';
            } else {
                console.log('Lỗi khi gọi API!');
            }
            throw new Error(await res.json());
        }

        const data = await res.json();
        return data;
    }catch(err){
        console.log('Lỗi: ' + err);
    }
}