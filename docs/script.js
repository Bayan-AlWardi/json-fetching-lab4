document.getElementById('syncBtn').addEventListener('click', function() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'data/reference.json', false);  // Synchronous
  xhr.send();

  if (xhr.status === 200) {
      var reference = JSON.parse(xhr.responseText);
      var data1 = fetchDataSync(reference.data_location);

      appendDataToTable(data1.data);
  }
});

function fetchDataSync(url) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', `data/${url}`, false);  // Synchronous
  xhr.send();

  if (xhr.status === 200) {
      return JSON.parse(xhr.responseText);
  }
}

function appendDataToTable(data) {
  const tbody = document.querySelector('#dataTable tbody');
  tbody.innerHTML = '';  // Clear previous entries

  data.forEach(item => {
      let nameParts = item.name.split(' ');
      let row = `<tr>
                  <td>${nameParts[0]}</td>
                  <td>${nameParts[1]}</td>
                  <td>${item.id}</td>
                 </tr>`;
      tbody.insertAdjacentHTML('beforeend', row);
  });
}

document.getElementById('asyncBtn').addEventListener('click', function() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'data/reference.json', true);  // Asynchronous
  xhr.onload = function() {
      if (xhr.status === 200) {
          var reference = JSON.parse(xhr.responseText);
          fetchDataAsync(reference.data_location, appendDataToTable);
      }
  };
  xhr.send();
});

function fetchDataAsync(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', `data/${url}`, true);  // Asynchronous
  xhr.onload = function() {
      if (xhr.status === 200) {
          var data = JSON.parse(xhr.responseText);
          callback(data.data);
      }
  };
  xhr.send();
}

document.getElementById('fetchBtn').addEventListener('click', function() {
  fetch('data/reference.json')
  .then(response => response.json())
  .then(reference => {
      return fetch(`data/${reference.data_location}`);
  })
  .then(response => response.json())
  .then(data => {
      appendDataToTable(data.data);
  })
  .catch(error => console.error('Error fetching data:', error));
});
