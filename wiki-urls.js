// Fungsi untuk mencari artikel berdasarkan input pengguna
async function searchWikipedia(searchValue) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srlimit=20&format=json&origin=*&srsearch=${searchValue}`;

  const response = await fetch(url);
  const data = await response.json();

  return data.query.search; // Mengembalikan hasil pencarian
}

// Fungsi untuk membuat URL halaman Wikipedia berdasarkan pageid
function generatePageUrl(pageid) {
  return `https://en.wikipedia.org/?curid=${pageid}`;
}

// Menangani event pencarian
document.getElementById('searchButton').addEventListener('click', async function() {
  const searchValue = document.getElementById('searchInput').value; // Ambil nilai input pencarian

  if (searchValue) {
    const results = await searchWikipedia(searchValue);
    displayResults(results); // Tampilkan hasil pencarian
  }
});

// Menampilkan hasil pencarian
function displayResults(results) {
  const resultsContainer = document.getElementById('resultsContainer');
  resultsContainer.innerHTML = ''; // Mengosongkan hasil sebelumnya

  results.forEach(result => {
    const resultElement = document.createElement('div');
    resultElement.classList.add('result-item');
    const pageUrl = generatePageUrl(result.pageid); // Dapatkan URL halaman berdasarkan pageid
    resultElement.innerHTML = `<a href="${pageUrl}" target="_blank">${result.title}</a>`;
    resultsContainer.appendChild(resultElement);
  });
}
