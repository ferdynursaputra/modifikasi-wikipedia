const url =
  'https://en.wikipedia.org/w/api.php?action=query&list=search&srlimit=20&format=json&origin=*&srsearch=';

const formDOM = document.querySelector('.form');
const inputDOM = document.querySelector('.form-input');
const resultsDOM = document.querySelector('.results');
const historyDOM = document.querySelector('.history'); // Tempat menampilkan riwayat pencarian

formDOM.addEventListener('submit', (e) => {
  e.preventDefault();
  const value = inputDOM.value;
  if (!value) {
    resultsDOM.innerHTML =
      '<div class="error"> please enter valid search term</div>';
    return;
  }
  // Menyimpan pencarian ke localStorage
  saveSearchHistory(value);
  fetchPages(value);
});

// Fungsi untuk menyimpan riwayat pencarian ke localStorage
const saveSearchHistory = (searchValue) => {
  let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  if (!searchHistory.includes(searchValue)) {
    searchHistory.unshift(searchValue); // Tambah pencarian terbaru di awal
    if (searchHistory.length > 5) {
      searchHistory.pop(); // Hapus pencarian terlama jika lebih dari 5
    }
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }
  renderHistory(searchHistory);
};

// Fungsi untuk menampilkan riwayat pencarian dari localStorage
const renderHistory = (history) => {
  if (history.length > 0) {
    const historyList = history
      .map((item) => {
        return `<button class="history-item" data-search="${item}">${item}</button>`;
      })
      .join('');
    historyDOM.innerHTML = `
      <h4>Histori Pencarian</h4>
      <div class="history-list">
        ${historyList}
      </div>
      <button class="clear-history-btn">Clear History</button>
    `;
  } else {
    historyDOM.innerHTML = '<p>No search history available.</p>';
  }
};

// Menampilkan pencarian sesuai riwayat yang ada di localStorage saat pertama kali buka
window.addEventListener('load', () => {
  const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  renderHistory(searchHistory);
});

// Fungsi untuk memuat halaman hasil pencarian
const fetchPages = async (searchValue) => {
  resultsDOM.innerHTML = '<div class="loading"></div>';
  try {
    const response = await fetch(`${url}${searchValue}`);
    const data = await response.json();
    const results = data.query.search;
    if (results.length < 1) {
      resultsDOM.innerHTML =
        '<div class="error">no matching results. Please try again</div>';
      return;
    }
    renderResults(results);
  } catch (error) {
    resultsDOM.innerHTML = '<div class="error"> there was an error...</div>';
  }
};

// Fungsi untuk menampilkan hasil pencarian
const renderResults = (list) => {
  const cardsList = list
    .map((item) => {
      const { title, snippet, pageid } = item;
      return `<a href=http://en.wikipedia.org/?curid=${pageid} target="_blank">
            <h4>${title}</h4>
            <p>
              ${snippet}
            </p>
          </a>`;
    })
    .join('');
  resultsDOM.innerHTML = `<div class="articles">
          ${cardsList}
        </div>`;
};

// Menambahkan event listener untuk riwayat pencarian
historyDOM.addEventListener('click', (e) => {
  if (e.target.classList.contains('history-item')) {
    const searchValue = e.target.dataset.search;
    inputDOM.value = searchValue; // Isi input dengan kata kunci dari riwayat
    fetchPages(searchValue); // Lakukan pencarian
  } else if (e.target.classList.contains('clear-history-btn')) {
    localStorage.removeItem('searchHistory'); // Hapus riwayat pencarian
    renderHistory([]); // Bersihkan tampilan riwayat
  }
});

// Ambil elemen untuk toggle dark mode
const darkModeToggle = document.querySelector('.dark-mode-toggle');

// Periksa apakah mode gelap sudah diaktifkan sebelumnya
const darkModeStatus = localStorage.getItem('darkMode');

// Jika mode gelap sebelumnya diaktifkan, terapkan
if (darkModeStatus === 'enabled') {
  document.body.classList.add('dark-mode');
}

// Toggle dark mode
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');

  // Simpan status dark mode di localStorage
  if (document.body.classList.contains('dark-mode')) {
    localStorage.setItem('darkMode', 'enabled');
  } else {
    localStorage.setItem('darkMode', 'disabled');
  }
});
