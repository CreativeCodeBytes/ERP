document.addEventListener('DOMContentLoaded', function() {
    const table = document.getElementById('materialTable');
    const tbody = table.querySelector('tbody');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    // Sample data
    const materials = [
        { id: 1, batchNo: 'B001', name: 'MAIZE', unit: 'kg', quantity: 89, inDate: '2024-08-24' },
        { id: 2, batchNo: 'B002', name: 'MONENSIN SODIUM(MONIVET-200)', unit: 'KG', quantity: 0.150, inDate: '2024-05-15' },
        { id: 3, batchNo: 'B003', name: 'FIBER DIGESTING', unit: 'KG', quantity: 5, inDate: '2023-07-05' },
        { id: 4, batchNo: 'B004', name: 'YEAST CULTURE(RUMIYEAST)', unit: 'KG', quantity: 3, inDate: '2023-05-04' },
        { id: 5, batchNo: 'B005', name: 'ORGANIC MINERAL MIXTURE(INTRON)', unit: 'KG', quantity: 1, inDate: '2023-02-05' },
    ];

    function renderTable(data) {
        tbody.innerHTML = '';
        data.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.batchNo}</td>
                <td>${item.name}</td>
                <td>${item.unit}</td>
                <td>${item.quantity}</td>
                <td>${item.inDate}</td>
                <td><button class="edit-btn" data-id="${item.id}">Edit</button></td>
            `;
            tbody.appendChild(row);
        });
    }

    renderTable(materials);

    // Search functionality
    searchBtn.addEventListener('click', function() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredMaterials = materials.filter(item => 
            item.name.toLowerCase().includes(searchTerm) ||
            item.batchNo.toLowerCase().includes(searchTerm)
        );
        renderTable(filteredMaterials);
    });

    // Copy to clipboard
    document.getElementById('copyBtn').addEventListener('click', function() {
        const elTable = document.querySelector('table');
        let range, sel;
        
        if (document.createRange && window.getSelection) {
            range = document.createRange();
            sel = window.getSelection();
            sel.removeAllRanges();
            try {
                range.selectNodeContents(elTable);
                sel.addRange(range);
            } catch (e) {
                range.selectNode(elTable);
                sel.addRange(range);
            }
            document.execCommand('copy');
        }
        sel.removeAllRanges();
        alert('Table copied to clipboard!');
    });

    // Export to CSV
    document.getElementById('csvBtn').addEventListener('click', function() {
        let csv = [];
        let rows = document.querySelectorAll('table tr');
        
        for (let i = 0; i < rows.length; i++) {
            let row = [], cols = rows[i].querySelectorAll('td, th');
            
            for (let j = 0; j < cols.length; j++) 
                row.push(cols[j].innerText);
            
            csv.push(row.join(','));        
        }

        downloadCSV(csv.join('\n'), 'material_list.csv');
    });

    function downloadCSV(csv, filename) {
        let csvFile = new Blob([csv], {type: "text/csv"});
        let downloadLink = document.createElement("a");
        downloadLink.download = filename;
        downloadLink.href = window.URL.createObjectURL(csvFile);
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
    }

    // Export to Excel
    document.getElementById('excelBtn').addEventListener('click', function() {
        let wb = XLSX.utils.table_to_book(document.querySelector('table'), {sheet: "Material List"});
        XLSX.writeFile(wb, 'material_list.xlsx');
    });

    // Export to PDF
    // document.getElementById('pdfBtn').addEventListener('click', function() {
    //     const { jsPDF } = window.jspdf;
    //     const doc = new jsPDF();
    //     doc.autoTable({ html: '#materialTable' });
    //     doc.save('material_list.pdf');
    // });
    document.getElementById('pdfBtn').addEventListener('click', function() {
        window.print();
    });

    // Print
    document.getElementById('printBtn').addEventListener('click', function() {
        window.print();
    });

    // Edit functionality (placeholder)
    tbody.addEventListener('click', function(e) {
        if (e.target.classList.contains('edit-btn')) {
            const id = e.target.getAttribute('data-id');
            alert(`Edit functionality for item ${id} to be implemented.`);
        }
    });

    document.getElementById('homeBtn').addEventListener('click', function() {
        window.location.href = 'Dashboard.html';
    });

    document.getElementById('manufacturingBtn').addEventListener('click', function() {
        alert('Manufacturing Material button clicked. Implement navigation to manufacturing material page.');
    });

    document.getElementById('materialListBtn').addEventListener('click', function() {
        alert('You are already on the Material List page.');
    });
});