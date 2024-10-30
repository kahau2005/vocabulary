window.onload = async () => {
    const itemsContainer = document.querySelector('.my-docs');
    const btnAdd = document.querySelector('.add');
    const myDocs = await getMydoc();
    loadDocuments(itemsContainer, myDocs.units);
    
    btnAdd.addEventListener('click', () => {
        const params = new URLSearchParams(window.location.search);
        window.location.href = `/input-paragraph?id=${params.get('id')}`;
    });
}

getMydoc = async () => {
    const params = new URLSearchParams(window.location.search);
    try {
        const res = await fetch('http://localhost:3000/data/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'userId': params.get('id')
            })
        });

        if (!res.ok) {
            throw new Error(await res.json());
        }

        const data = await res.json();
        return data;
    } catch (err) {
        console.log('Lỗi: ' + err);
        return null; // Trả về null nếu có lỗi xảy ra
    }
}

loadDocuments = (container, docs) => {
    console.log(docs);
    container.innerHTML = '';
    if (docs.length <= 0) {
        container.innerHTML = 'Chưa có tài liệu được lưu!';
    }else{
        docs.forEach(async doc => {
            const docData = await getDocData(doc);
            container.innerHTML += `<div class="item">${docData.title}</div>`;
        });
    }
}

getDocData = async (idDoc) => {
    try{
        const res = await fetch('http://localhost:3000/data/get-doc',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'idDoc': idDoc
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
