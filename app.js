const defaultReviewData = [
    // --- ULASAN ASLI ---
    { id: 1, name: "Andini Putri", campus: "UI", kosName: "Kos Putri Muslimah Asri", rating: 5, content: "Kamarnya estetik sesuai foto, wifi lancar buat nge-zoom. Cuma airnya kalau musim kemarau agak sedikit kuning.", tags: ["#IbuKosBaik", "#WifiNgebut"], status: "TERBIT", date: "15/06/2026" },
    { id: 2, name: "Budi Prasetyo", campus: "UGM", kosName: "Pondok Putra Barokah", rating: 4, content: "Bapak kosnya ramah pol, sering dikasih takjil pas puasa. Tapi minusnya kalau malam gerbang digembok jam 10 pas.", tags: ["#IbuKosBaik", "#DekatTempatMakan"], status: "TERBIT", date: "14/06/2026" },
    { id: 3, name: "Siti Rahma", campus: "ITB", kosName: "Kos Campur Edelweiss", rating: 2, content: "Kamarnya lembab di lantai bawah, sirkulasi udara agak kurang karena jendela menghadap langsung tembok tetangga.", tags: ["#AirBersihLancar"], status: "MODERASI", date: "13/06/2026" },
    // --- REVIEW BOT (MEYAKINKAN PENGGUNA) ---
    { id: 4, name: "Nadia Salsabila (Maba UI)", campus: "UI", kosName: "Kos Putri Muslimah Asri", rating: 5, content: "Super recommended! Keamanan terjamin banget karena ada CCTV dan portal ditutup jam 11 malam. Ibu kosnya sering ngasih makanan gratis kalau weekend. Gak nyesel milih tipe eksklusif di sini.", tags: ["#IbuKosBaik", "#BebasJamMalam"], status: "TERBIT", date: "18/06/2026" },
    { id: 5, name: "Rina Melati", campus: "UI", kosName: "Kos Putri Muslimah Asri", rating: 5, content: "Fasilitasnya juara. Pas baru masuk kamarnya wangi dan bersih. Udah perpanjang 2 semester karena nyaman banget buat nugas akhir dan suasananya gak berisik.", tags: ["#WifiNgebut", "#AirBersihLancar"], status: "TERBIT", date: "17/06/2026" },
    { id: 6, name: "Alya Maharani", campus: "UI", kosName: "Kos Putri Muslimah Asri", rating: 4, content: "Secara keseluruhan worth it dengan harga sewanya. Kamar mandinya selalu dikuras rutin sama penjaga. Dekat banget sama gerbang kampus, tinggal jalan kaki 5 menit sampai.", tags: ["#DekatKampus"], status: "TERBIT", date: "10/06/2026" }
];

if (!localStorage.getItem('kosvibe_reviews')) {
    localStorage.setItem('kosvibe_reviews', JSON.stringify(defaultReviewData));
}

document.addEventListener("DOMContentLoaded", function() {
    const reviews = JSON.parse(localStorage.getItem('kosvibe_reviews'));
    
    // LOGIN STATE
    const loginBtn = document.getElementById('auth-nav-btn');
    if (loginBtn && localStorage.getItem('kosvibe_user')) {
        loginBtn.innerHTML = `<i class="bi bi-person-circle"></i> Keluar`;
        loginBtn.href = "#";
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('kosvibe_user');
            window.location.reload();
        });
    }

    // BERANDA LOGIC
    if (document.getElementById('liveFeedContainer')) {
        renderLiveFeed(reviews);
        const searchInput = document.getElementById('searchInput');
        const searchButton = document.getElementById('searchButton');
        
        function runSearch() {
            const query = searchInput.value.toLowerCase().trim();
            const cards = document.querySelectorAll('.kos-card-item');
            cards.forEach(card => {
                const name = card.getAttribute('data-name').toLowerCase();
                const loc = card.getAttribute('data-location').toLowerCase();
                card.style.display = (name.includes(query) || loc.includes(query) || query === '') ? "block" : "none";
            });
        }
        if(searchInput) searchInput.addEventListener('input', runSearch);
        if(searchButton) searchButton.addEventListener('click', runSearch);

        document.querySelectorAll('.campus-filter, .tag-filter').forEach(elem => {
            elem.addEventListener('click', function(e) {
                e.preventDefault();
                let filterVal = this.getAttribute('data-campus') || this.getAttribute('data-tag').replace('#','');
                searchInput.value = filterVal === 'All' ? '' : filterVal;
                runSearch();
            });
        });
    }

    // TULIS REVIEW LOGIC
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        const stars = document.querySelectorAll('#starRatingContainer .icon-star-click');
        const ratingInput = document.getElementById('selectedRating');

        stars.forEach(star => {
            star.addEventListener('click', function() {
                const clickValue = parseInt(this.getAttribute('data-value'));
                ratingInput.value = clickValue;
                stars.forEach(s => {
                    if(parseInt(s.getAttribute('data-value')) <= clickValue) {
                        s.className = "bi bi-star-fill text-warning icon-star-click";
                    } else {
                        s.className = "bi bi-star text-muted icon-star-click";
                    }
                });
            });
        });

        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (ratingInput.value === "0") {
                alert("Silakan pilih rating bintang terlebih dahulu!"); return;
            }
            const checkedTags = [];
            if(document.getElementById('t1').checked) checkedTags.push("#IbuKosBaik");
            if(document.getElementById('t2').checked) checkedTags.push("#WifiNgebut");
            if(document.getElementById('t3').checked) checkedTags.push("#AirBersihLancar");
            if(document.getElementById('t4').checked) checkedTags.push("#BebasJamMalam");

            const anonRadio = document.querySelector('input[name="anonRadio"]:checked').value;
            const userName = anonRadio === "Anonim" ? "Anonim Mahasiswa" : (localStorage.getItem('kosvibe_user') || "User Umum");

            reviews.push({
                id: reviews.length + 1, name: userName, campus: "Umum", kosName: document.getElementById('formNamaKos').value,
                rating: parseInt(ratingInput.value), content: document.getElementById('formCerita').value,
                tags: checkedTags, status: "MODERASI", date: new Date().toLocaleDateString('id-ID')
            });
            localStorage.setItem('kosvibe_reviews', JSON.stringify(reviews));
            alert("Ulasan dikirim! Menunggu persetujuan admin.");
            window.location.href = "index.html";
        });
    }

    // DETAIL KOS LOGIC
    if (document.getElementById('detailReviewContainer')) {
        const activeReviews = reviews.filter(r => r.kosName === "Kos Putri Muslimah Asri" && r.status === "TERBIT");
        let htmlFeed = "";
        activeReviews.forEach(r => {
            let starsHTML = Array(r.rating).fill('<i class="bi bi-star-fill text-warning"></i>').join('') + Array(5 - r.rating).fill('<i class="bi bi-star text-muted"></i>').join('');
            htmlFeed += `<div class="p-3 bg-white rounded shadow-sm border mb-3">
                <div class="d-flex w-100 justify-content-between mb-1"><strong class="text-success">@${r.name}</strong><div>${starsHTML}</div></div>
                <p class="mb-2 text-muted small">"${r.content}"</p>
                <div>${r.tags.map(t => `<span class="badge bg-light text-dark border me-1">${t}</span>`).join('')}</div>
            </div>`;
        });
        document.getElementById('detailReviewContainer').innerHTML = htmlFeed || "<p class='text-muted small'>Belum ada ulasan terbit.</p>";
    }

    // ADMIN LOGIC
    if (document.getElementById('adminTableBody')) {
        let tableHTML = "";
        reviews.forEach((r, idx) => {
            let badgeColor = r.status === "TERBIT" ? "bg-success" : (r.status === "MODERASI" ? "bg-warning text-dark" : "bg-danger");
            tableHTML += `<tr class="admin-row-item" id="row-${idx}" onclick="inspectReview(${idx})">
                <td><strong>${r.kosName}</strong></td><td>${r.campus}</td><td>${r.date}</td>
                <td><span class="badge ${badgeColor} px-3 py-2">${r.status}</span></td></tr>`;
        });
        document.getElementById('adminTableBody').innerHTML = tableHTML;

        window.inspectReview = function(index) {
            const dataSelected = reviews[index];
            document.querySelectorAll('.admin-row-item').forEach(r => r.classList.remove('table-active-row'));
            document.getElementById(`row-${index}`).classList.add('table-active-row');
            document.getElementById('detailName').innerText = dataSelected.name;
            document.getElementById('detailContent').innerText = `"${dataSelected.content}"`;
            document.getElementById('detailStars').innerHTML = Array(dataSelected.rating).fill('<i class="bi bi-star-fill text-warning"></i>').join('') + Array(5 - dataSelected.rating).fill('<i class="bi bi-star text-muted"></i>').join('');
            document.getElementById('detailTagsContainer').innerHTML = dataSelected.tags.map(t => `<span class="badge bg-primary-subtle text-primary p-2 me-1">${t}</span>`).join('');

            document.getElementById('btnSetuju').onclick = function() {
                reviews[index].status = "TERBIT"; localStorage.setItem('kosvibe_reviews', JSON.stringify(reviews));
                alert("Ulasan disetujui!"); window.location.reload();
            };
            document.getElementById('btnTolakReview').onclick = function() {
                reviews[index].status = "DITOLAK"; localStorage.setItem('kosvibe_reviews', JSON.stringify(reviews));
                alert("Ulasan ditolak."); window.location.reload();
            };
        };
    }
});

function renderLiveFeed(reviews) {
    const liveFeedContainer = document.getElementById('liveFeedContainer');
    let feedHTML = "";
    reviews.filter(r => r.status === "TERBIT").forEach(r => {
        feedHTML += `<div class="feed-item p-3 bg-white rounded shadow-sm border-start border-primary border-4 mb-3">
            <div class="d-flex w-100 justify-content-between mb-1"><strong class="text-primary-dark">@${r.name}</strong><span class="badge bg-warning text-dark"><i class="bi bi-star-fill"></i> ${r.rating}.0</span></div>
            <p class="mb-2 text-muted small">"${r.content}"</p><span class="feed-location"><i class="bi bi-arrow-right-short"></i> ${r.kosName}</span>
        </div>`;
    });
    liveFeedContainer.innerHTML = feedHTML;
}