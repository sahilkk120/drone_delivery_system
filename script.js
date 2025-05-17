document.addEventListener('DOMContentLoaded', () => {
    const tableCards = document.getElementById('tableCards');
    const tableData = document.getElementById('tableData');
    const errorAlert = document.getElementById('errorAlert');
    const loadingSpinner = document.getElementById('loadingSpinner');

    // Show error alert
    function showError(message) {
        errorAlert.textContent = message;
        errorAlert.classList.remove('d-none');
    }

    // Hide error alert
    function hideError() {
        errorAlert.classList.add('d-none');
    }

    // Fetch table names and counts
    fetch('http://localhost:3000/tables')
        .then(response => response.json())
        .then(data => {
            tableCards.innerHTML = data.map(table => `
                <div class="col-md-3 mb-4">
                    <div class="card text-center" onclick="fetchTableData('${table.name}')">
                        <div class="card-body">
                            <h5 class="card-title">${table.name}</h5>
                            <p class="card-text">Rows: ${table.count}</p>
                        </div>
                    </div>
                </div>
            `).join('');
        })
        .catch(error => {
            console.error('Error fetching tables:', error);
            showError('Failed to load table list. Please try again.');
        });

    // Fetch table data on card click
    window.fetchTableData = function(tableName) {
        hideError();
        tableData.innerHTML = '';
        loadingSpinner.classList.remove('d-none');
        fetch(`http://localhost:3000/table/${tableName}`)
            .then(response => response.json())
            .then(data => {
                loadingSpinner.classList.add('d-none');
                if (data.length === 0) {
                    tableData.innerHTML = `<p>No data found for ${tableName}</p>`;
                    return;
                }
                // Generate table headers dynamically
                const headers = Object.keys(data[0]);
                const headerRow = headers.map(header => `<th>${header}</th>`).join('');
                // Generate table rows
                const rows = data.map(row => `
                    <tr>${headers.map(header => `<td>${row[header] || ''}</td>`).join('')}</tr>
                `).join('');
                tableData.innerHTML = `
                    <h3>${tableName} Data</h3>
                    <table class="table table-striped table-bordered">
                        <thead><tr>${headerRow}</tr></thead>
                        <tbody>${rows}</tbody>
                    </table>
                `;
            })
            .catch(error => {
                loadingSpinner.classList.add('d-none');
                console.error('Error fetching table data:', error);
                showError(`Failed to load data for ${tableName}. Please try again.`);
            });
    };
});