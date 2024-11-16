window.onload = async () => {
    const btnExport = document.querySelector('.btn-excel');
    const dialog = document.querySelector('.dialog');
    const populateTable = (data) => {
        const tbody = document.querySelector("table tbody");
    
        tbody.innerHTML = '';
    
        data.forEach(item => {
            const row = document.createElement("tr");
    
            const wordCell = document.createElement("td");
            wordCell.textContent = item.word;
    
            const posCell = document.createElement("td");
            posCell.textContent = item.pos;
    
            const ipaCell = document.createElement("td");
            ipaCell.textContent = item.ipa;
    
            const enMeaningCell = document.createElement("td");
            enMeaningCell.textContent = item.en_meaning;
    
            const vnMeaningCell = document.createElement("td");
            vnMeaningCell.textContent = item.vn_meaning;
    
            const exampleCell = document.createElement("td");
            exampleCell.textContent = item.example;
    
            row.appendChild(wordCell);
            row.appendChild(posCell);
            row.appendChild(ipaCell);
            row.appendChild(enMeaningCell);
            row.appendChild(vnMeaningCell);
            row.appendChild(exampleCell);
    
         
            tbody.appendChild(row);
        });
    };

    getWordList = async() => {
        const params = new URLSearchParams(window.location.search);
        const accessToken = localStorage.getItem('accessToken');
        try {
            const res = await fetch('https://vocabulary-dy7w.onrender.com/data/get-doc', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    'idDoc': params.get('docId')
                })
            });
            if (res.ok) {
                const data = await res.json();
                return data.words;
            } else {
                if (res.status === 401 || res.status === 403) {
                    window.location.href = '/login';
                } else {
                    console.log('Lỗi khi gọi API!');
                }
                const errorText = await res.text();
                console.log("Lỗi: " + errorText);
            }
        } catch (err) {
            console.log('Lỗi ' + err);
        }
    };
    
    getWordData = async (words) => {
        const params = new URLSearchParams(window.location.search);
        const accessToken = localStorage.getItem('accessToken');
        try {
            const res = await fetch('https://vocabulary-dy7w.onrender.com/data/word-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`

                },
                body: JSON.stringify({
                    'words': words
                })
            });
            if (res.ok) {
                const data = await res.json();
                return data;
            } else {
                if (res.status === 401 || res.status === 403) {
                    window.location.href = '/login';
                } else {
                    console.log('Lỗi khi gọi API!');
                }
                const errorText = await res.text();
                alert('Gemini không phản hồi! Hãy tải lại trang!');
                console.log("Lỗi: " + errorText);
            }
        } catch (err) {
            console.log('Lỗi ' + err);
        }
    };

    const fetchInChunks = async (words, chunkSize, delay) => {
        let allWordsData = [];

        for (let i = 0; i < words.length; i += chunkSize) {
       
            const chunk = words.slice(i, i + chunkSize);

            const wordsData = await getWordData(chunk);

            allWordsData = allWordsData.concat(wordsData);

            populateTable(allWordsData);

            if (i + chunkSize < words.length) {
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    };
    const words = await getWordList();
    await fetchInChunks(words, 10, 10000); 
    dialog.style.display = 'none';
    btnExport.addEventListener('click', () => {
        const table = document.querySelector("table");
        const workbook = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });
        XLSX.writeFile(workbook, "word_data.xlsx");
    })
};
