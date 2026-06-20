// ==========================================================================
// DATA ARCHITECTURE MOCK (Basis Data Simulasi untuk Sinkronisasi Antar Halaman)
// ==========================================================================
const mockReviewAdmin = [
    {
        name: "Andini Putri (Anonim)",
        rating: 4,
        content: "Bapak kos ramah, tapi wifi sering RTO di jam malam. Kamar mandi luar cukup bersih.",
        tags: ["#IbuKosBaik", "#DekatKantin"]
    },
    {
        name: "Budi Prasetyo",
        rating: 2,
        content: "Kamarnya lembab di lantai bawah, sirkulasi udara agak kurang karena jendela menghadap langsung tembok tetangga.",
        tags: ["#FasilitasKurang"]
    },
    {
        name: "Siti Rahma",
        rating: 5,
        content: "Dekat banget sama halte, bapak kos super ramah, lingkungan tenang cocok buat mahasiswa tingkat akhir.",
        tags: ["#DekatKampus", "#IbuKosBaik"]
    }
];

// ==========================================================================
// ENGINE ROUTING SLIDE SYSTEM (Navigasi Antar Halaman Tanpa Reload)
// ==========================================================================
function switchPage(pageId) {
    // Sembunyikan semua kontainer visual halaman
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });
    // Reset status aktif link di navbar menu
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Nyalakan elemen halaman target
    const targetPage = document.getElementById('page-' + pageId);
    if(targetPage) {
        targetPage.classList.add('active');
    }
    
    // Sinkronisasi status aktif kelas CSS Navigasi
    if(pageId === 'beranda') document.getElementById('nav-beranda').classList.add('active');
    if(pageId === 'tulis') document.getElementById('nav-tulis').classList.add('active');
}

// ==========================================================================
// INTERACTIVE LOGIC MODULES (Eksekusi setelah DOM Siap)
// ==========================================================================
document.addEventListener("DOMContentLoaded", function() {

    // --- FEATURE 1: Sistem Pengisian Bintang Interaktif ---
    const stars = document.querySelectorAll('#starRatingContainer .icon-star-click');
    const ratingInput = document.getElementById('selectedRating');

    stars.forEach(star => {
        star.addEventListener('click', function() {
            const clickValue = parseInt(this.getAttribute('data-value'));
            ratingInput.value = clickValue;
            
            // Loop untuk mengaktifkan/menonaktifkan class pewarnaan bintang emas
            stars.forEach(s => {
                const sValue = parseInt(s.getAttribute('data-value'));
                if(sValue <= clickValue) {
                    s.classList.remove('bi-star', 'text-muted');
                    s.classList.add('bi-star-fill', 'star-active');
                } else {
                    s.classList.remove('bi-star-fill', 'star-active');
                    s.classList.add('bi-star', 'text-muted');
                }
            });
        });
    });

    // --- FEATURE 2: Pencarian & Live Filtering Kos ---
    const searchInput = document.getElementById('searchInput');
    const cards = document.querySelectorAll('.kos-card-item');

    function filterData(keyword) {
        const query = keyword.toLowerCase().trim();
        cards.forEach(card => {
            const name = card.getAttribute('data-name').toLowerCase();
            const loc = card.getAttribute('data-location').toLowerCase();
            
            if(name.includes(query) || loc.includes(query) || query === 'all' || query === '') {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    }

    if(searchInput) {
        searchInput.addEventListener('input', function() {
            filterData(this.value);
        });
    }

    // --- FEATURE 3: Filter Cepat Berdasarkan Dropdown Kampus ---
    document.querySelectorAll('.campus-filter').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const selectedCampus = this.getAttribute('data-campus');
            if(selectedCampus === 'All') {
                filterData('');
            } else {
                filterData(selectedCampus);
            }
            switchPage('beranda');
        });
    });

    // --- FEATURE 4: Filter Instan via Click Tag Populer ---
    document.querySelectorAll('.tag-filter').forEach(tagBtn => {
        tagBtn.addEventListener('click', function() {
            // Toggle status active tombol tag
            document.querySelectorAll('.tag-filter').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const tagValue = this.getAttribute('data-tag');
            // Simulasi filter text berbasis tag
            filterData(tagValue.replace('#', ''));
        });
    });

    // --- FEATURE 5: Alur Submit Form & Injeksi ke Live Feed ---
    const reviewForm = document.getElementById('reviewForm');
    if(reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const namaKos = document.getElementById('formNamaKos').value;
            const ratingVal = ratingInput.value;
            const textCerita = document.getElementById('formCerita').value;
            const anonChecked = document.querySelector('input[name="anonRadio"]:checked').value;

            if(ratingVal === "0") {
                alert("Mohon isi rating bintang terlebih dahulu dengan cara mengkliknya!");
                return;
            }

            // Injeksi komponen HTML baru ke dalam Live Feed Box Beranda
            const liveFeedContainer = document.getElementById('liveFeedContainer');
            const username = anonChecked === "Anonim" ? "@Maba_Anonim" : "@MahasiswaAktif";
            
            const newFeedHTML = `
                <div class="feed-item p-3 bg-white rounded shadow-sm border-start border-success border-4" style="animation: slideUp 0.4s ease;">
                    <div class="d-flex w-100 justify-content-between mb-1">
                        <strong class="text-success">${username}</strong>
                        <span class="badge bg-warning text-dark"><i class="bi bi-star-fill"></i> ${ratingVal}.0</span>
                    </div>
                    <p class="mb-2 text-muted small">"${textCerita}"</p>
                    <span class="feed-location"><i class="bi bi-arrow-right-short"></i> ${namaKos}</span>
                </div>
            `;

            liveFeedContainer.insertAdjacentHTML('afterbegin', newFeedHTML);
            alert('Sukses! Ulasan jujur kamu berhasil dikirim dan disinkronisasikan ke Live Feed Beranda.');
            
            // Reset Form State
            reviewForm.reset();
            stars.forEach(s => { s.classList.remove('bi-star-fill', 'star-active'); s.classList.add('bi-star', 'text-muted'); });
            ratingInput.value = "0";
            switchPage('beranda');
        });
    }

    // --- FEATURE 6: Sistem Pilih & Sinkronisasi Detail Admin Panel ---
    const tableRows = document.querySelectorAll('.admin-row-item');
    tableRows.forEach(row => {
        row.addEventListener('click', function() {
            // Hilangkan status warna baris aktif sebelumnya
            tableRows.forEach(r => r.classList.remove('table-active-row'));
            // Tambahkan warna hijau pastel pada baris yang aktif dipilih
            this.classList.add('table-active-row');

            const index = parseInt(this.getAttribute('data-index'));
            const dataSelected = mockReviewAdmin[index];

            if(dataSelected) {
                document.getElementById('detailName').innerText = dataSelected.name;
                document.getElementById('detailContent').innerText = `"${dataSelected.content}"`;
                
                // Regenerasi Bintang Komponen Detail
                let starsHTML = '';
                for(let i=1; i<=5; i++) {
                    starsHTML += i <= dataSelected.rating ? '<i class="bi bi-star-fill"></i>' : '<i class="bi bi-star"></i>';
                }
                document.getElementById('detailStars').innerHTML = starsHTML;

                // Regenerasi Kumpulan Tag Badge
                let tagsHTML = '';
                dataSelected.tags.forEach(t => {
                    tagsHTML += `<span class="badge bg-primary-subtle text-primary p-2 me-1">${t}</span>`;
                });
                document.getElementById('detailTagsContainer').innerHTML = tagsHTML;
            }
        });
    });

    // --- FEATURE 7: Modul Tombol Aksi Hapus/Tolak Admin ---
    const btnTolak = document.getElementById('btnTolakReview');
    if(btnTolak) {
        btnTolak.addEventListener('click', function() {
            if(confirm('Apakah Anda yakin ingin menolak berkas review mahasiswa ini?')) {
                document.getElementById('detailName').innerText = "Konten Ditolak";
                document.getElementById('detailContent').innerText = "Ulasan telah dihapus dari sistem antrean modifikasi karena tidak memenuhi standar pedoman komunitas.";
                document.getElementById('detailTagsContainer').innerHTML = "";
                
                // Cari baris aktif tabel dan berikan coretan visual
                const activeRow = document.querySelector('.table-active-row');
                if(activeRow) {
                    activeRow.style.opacity = '0.4';
                    activeRow.querySelector('.badge').className = "badge bg-danger";
                    activeRow.querySelector('.badge').innerText = "DITOLAK";
                }
            }
        });
    }
});