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
    try{const params = new URLSearchParams(window.location.search);
        const res = await fetch('http://localhost:3000/data/upload-paragraph',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'userID': params.get('id'),
                'title': title,
                'paragraph': paragraph
            })
                
        });

        if (!res.ok) {
            throw new Error(await res.json());
        }

        const data = await res.json();
        return data;
    }catch(err){
        console.log('Lỗi: ' + err);
    }
}