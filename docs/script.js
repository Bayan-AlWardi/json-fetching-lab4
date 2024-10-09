// Synchronous XMLHttpRequest
document.getElementById('sync').addEventListener('click', () => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'data/reference.json', false);
    xhr.send();

    const refData = JSON.parse(xhr.responseText);
    loadFileSync(refData.data_location);
});

function loadFileSync(filename) {
    const tableBody = document.querySelector('#data-table tbody');
    tableBody.innerHTML = ''; // Clear the table before loading new data

    // Load data1.json
    const xhr1 = new XMLHttpRequest();
    xhr1.open('GET', `data/${filename}`, false);
    xhr1.send();
    const data1 = JSON.parse(xhr1.responseText);
    displayData(data1.data);

    // Load data2.json (from data1.json's data_location field)
    const xhr2 = new XMLHttpRequest();
    xhr2.open('GET', `data/${data1.data_location}`, false);
    xhr2.send();
    const data2 = JSON.parse(xhr2.responseText);
    displayData(data2.data);

    // Load data3.json
    const xhr3 = new XMLHttpRequest();
    xhr3.open('GET', 'data/data3.json', false);
    xhr3.send();
    const data3 = JSON.parse(xhr3.responseText);
    displayData(data3.data);
}

// Asynchronous XMLHttpRequest with Callbacks
document.getElementById('async-callback').addEventListener('click', () => {
    const tableBody = document.querySelector('#data-table tbody');
    tableBody.innerHTML = ''; // Clear the table before loading new data

    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'data/reference.json');
    xhr.onload = function() {
        const refData = JSON.parse(xhr.responseText);
        loadFileAsync(refData.data_location, function(data1) {
            displayData(data1.data);

            loadFileAsync(data1.data_location, function(data2) {
                displayData(data2.data);

                loadFileAsync('data3.json', function(data3) {
                    displayData(data3.data);
                });
            });
        });
    };
    xhr.send();
});

function loadFileAsync(filename, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `data/${filename}`);
    xhr.onload = function() {
        const data = JSON.parse(xhr.responseText);
        callback(data);
    };
    xhr.send();
}

// Fetch API with Promises
document.getElementById('fetch-promises').addEventListener('click', () => {
    const tableBody = document.querySelector('#data-table tbody');
    tableBody.innerHTML = ''; // Clear the table before loading new data

    fetch('data/reference.json')
        .then(response => response.json())
        .then(refData => fetch(`data/${refData.data_location}`))
        .then(response => response.json())
        .then(data1 => {
            displayData(data1.data);
            return fetch(`data/${data1.data_location}`);
        })
        .then(response => response.json())
        .then(data2 => {
            displayData(data2.data);
            return fetch('data/data3.json');
        })
        .then(response => response.json())
        .then(data3 => {
            displayData(data3.data);
        })
        .catch(err => console.error('Error fetching data:', err));
});

// Function to display data in the table
function displayData(data) {
    const tableBody = document.querySelector('#data-table tbody');

    // Display each item in a new table row
    data.forEach(item => {
        const [firstName, lastName] = item.name.split(' ');
        const grades = item.grades ? item.grades.join(', ') : 'N/A'; // Format grades as a string

        const row = `
            <tr>
                <td>${firstName}</td>
                <td>${lastName}</td>
                <td>${item.id}</td>
                <td>${item.address || 'N/A'}</td>
                <td>${grades}</td>
            </tr>
        `;

        tableBody.insertAdjacentHTML('beforeend', row); // Insert row into the table
    });
}
