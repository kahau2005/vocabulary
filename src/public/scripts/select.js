window.onload = async () => {
    const btnConfirm = document.querySelector('.confirm');
    const wordContainer = document.querySelector('.words'); // Đảm bảo chọn đúng phần tử
    const params = new URLSearchParams(window.location.search);
    const docId = params.get('docId');
    const selectedWords = [];
    
    if (!docId) {
        console.log('Không tìm thấy ID tài liệu!');
        return;
    }

    const docData = await getDocData(docId); 

    const paragraph = docData ? docData.paragraph : null; 

    if (paragraph) {
        const words = paragraph.split(/\s+/); 
        wordContainer.innerHTML = ''; 
        words.forEach(word => {
            const span = document.createElement('span'); 
            span.textContent = word; 
            
            span.addEventListener('click', () => {
                span.classList.toggle('words-selected'); 
                const index = selectedWords.indexOf(span.textContent);
                if (index > -1) {
                    selectedWords.splice(index, 1);
                } else {
                    selectedWords.push(span.textContent);
                }
                console.log('Selected Words:', selectedWords);
            });

            wordContainer.appendChild(span);
        });
    } else {
        console.log('Không tìm thấy đoạn văn bản hoặc đoạn văn bản trống!');
    }

    // Thay đổi ở đây: sử dụng uploadSelectedWord thay vì uploadWords
    btnConfirm.addEventListener('click', () => {
        uploadSelectedWord(docId, selectedWords); // Sử dụng hàm uploadSelectedWord
        window.location.href =`/preview?docId=${docId}`;
    });
};

getDocData = async (idDoc) => {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const res = await fetch('https://vocabulary-dy7w.onrender.com/data/get-doc', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                'idDoc': idDoc
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

    } catch (err) {
        console.log('Lỗi: ' + err);
    }
}

uploadSelectedWord = async (idDoc, selectedWords) => {
    const accessToken = localStorage.getItem('accessToken');
    try {
        const res = await fetch('https://vocabulary-dy7w.onrender.com/data/upload-words', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                'idDoc': idDoc,
                'selectedWords': selectedWords
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
        console.log(data);

    } catch (err) {
        console.log('Lỗi: ' + err);
    }
}
