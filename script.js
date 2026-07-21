// Target the theme switch button
const toggleBtn = document.getElementById('theme-toggle');

// Check for saved theme preference, otherwise check system preferences
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Determine initial theme state
const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

// Apply initial theme on load
document.documentElement.setAttribute('data-theme', initialTheme);

// Handle click event to toggle theme
toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    let newTheme = 'light';
    
    if (currentTheme === 'light') {
        newTheme = 'dark';
    }
    
    // Apply changes to DOM and persist to localStorage
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});


function hitung() {
  const data = [];
  for (let i = 1; i <= 7; i++) {
      const nilai = parseInt(document.getElementById(`hari${i}`).value);
      if (isNaN(nilai)) {
          document.getElementById('error').textContent = "Mohon isi semua data";
          return;
      }
      data.push(nilai);
  }
  document.getElementById('error').textContent = "";

  // Hitung rata-rata
  const total = data.reduce((jumlah, nilai) => jumlah + nilai, 0);
  const rataRata = total / data.length;

  // Hitung modus
  const frekuensi = {};
  data.forEach(nilai => {
      frekuensi[nilai] = (frekuensi[nilai] || 0) + 1;
  });

  let modus = data[0];
  let freqMax = 0;
  for (let nilai in frekuensi) {
      if (frekuensi[nilai] > freqMax) {
          freqMax = frekuensi[nilai];
          modus = nilai;
      }
  }

  // Hitung standar deviasi
  const variance = data.reduce((jumlah, nilai) => jumlah + Math.pow(nilai - rataRata, 2), 0) / data.length;
  const standarDeviasi = Math.sqrt(variance);

  // Tampilkan hasil
  const output = document.getElementById("output");
  output.classList.remove("hidden");
  if (freqMax == 1) {
      output.innerHTML = `
          <strong>Hasil Perhitungan:</strong><br>
          Rata-rata produk terjual: ${rataRata.toFixed(2)} produk per hari.<br>
          Penjualan paling sering terjadi: Tidak ada.<br>
          Standar deviasi: ${standarDeviasi.toFixed(2)}.
      `;
  } else {
      output.innerHTML = `
          <strong>Hasil Perhitungan:</strong><br>
          Rata-rata produk terjual: ${rataRata.toFixed(2)} produk per hari.<br>
          Penjualan paling sering terjadi: ${modus} produk dan terjadi sebanyak ${freqMax} hari.<br>
          Standar deviasi: ${standarDeviasi.toFixed(2)}.
      `;
  }

  // Buat atau update grafik
  const ctx = document.getElementById('grafikPenjualan');
  ctx.classList.remove("hidden");
  ctx.getContext('2d');

  // Hapus grafik lama jika ada
  if (window.grafikInstance) {
      window.grafikInstance.destroy();
  }

  // Buat grafik baru
  window.grafikInstance = new Chart(ctx, {
      type: 'line',
      data: {
          labels: ['Hari 1', 'Hari 2', 'Hari 3', 'Hari 4', 'Hari 5', 'Hari 6', 'Hari 7'],
          datasets: [{
              label: 'Penjualan per Hari',
              data: data,
              borderColor: 'rgba(128, 128, 128, 1)',
              backgroundColor: 'rgba(93, 93, 93, 0.2)',
              borderWidth: 2,
              tension: 0,
              fill: true,
              pointRadius: 4
          }]
      },
      options: {
          responsive: true,
          scales: {
              y: {
                  beginAtZero: true,
                  title: { display: true, text: 'Jumlah Terjual' }
              },
              x: {
                  title: { display: true, text: 'Hari' }
              }
          }
      }
  });  
  
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: 'smooth'
  });
}
