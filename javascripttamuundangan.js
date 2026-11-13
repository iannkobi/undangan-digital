// Koleksi template kata pengantar untuk berbagai jenis acara
const daftarTemplate = {
    nikah: "Kepada Yth.\nBapak/Ibu/Saudara/i [nama]\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam acara pernikahan kami.\n\nInfo lengkap & lokasi acara:\n[link]\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Anda berkenan hadir. Terima kasih.",
    
    ultah: "Halo [nama]!\n\nDatang yuk ke acara perayaan ulang tahunku! Kehadiranmu bakal bikin acaranya makin seru dan berkesan.\n\nCek detail waktu & tempat acaranya di link ini ya:\n[link]\n\nDitunggu kehadirannya!",
    
    syukuran: "Kepada Yth.\nBapak/Ibu/Saudara/i [nama]\n\nDengan penuh rasa syukur, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam acara syukuran kami.\n\nDetail acara dapat dilihat melalui tautan berikut:\n[link]\n\nAtas kehadiran dan doa restunya, kami ucapkan terima kasih."
};

let urlDasarAktif = "";
let teksSiapKirim = "";
let timerKetik;

// Inisialisasi saat halaman pertama kali dibuka
window.addEventListener('DOMContentLoaded', () => {
    ubahTemplatePesan();
    
    // Otomatis memuat index.html jika berada di folder yang sama sebagai contoh awal
    const lokasiSekarang = window.location.href;
    const urlDefault = lokasiSekarang.substring(0, lokasiSekarang.lastIndexOf('/') + 1) + "index.html";
    document.getElementById('input-url').value = urlDefault;
    muatWebsiteUndangan();
});

// Mengisi input URL otomatis jika memilih dari dropdown preset lokal
function pilihPresetLokal() {
    const fileTerpilih = document.getElementById('pilih-preset').value;
    if (fileTerpilih) {
        const lokasiSekarang = window.location.href;
        const urlLengkap = lokasiSekarang.substring(0, lokasiSekarang.lastIndexOf('/') + 1) + fileTerpilih;
        document.getElementById('input-url').value = urlLengkap;
        
        // Otomatis menyesuaikan tema pesan WhatsApp
        if (fileTerpilih.includes('ulang-tahun')) {
            document.getElementById('jenis-acara').value = 'ultah';
        } else if (fileTerpilih.includes('syukuran')) {
            document.getElementById('jenis-acara').value = 'syukuran';
        } else {
            document.getElementById('jenis-acara').value = 'nikah';
        }
        ubahTemplatePesan();
        muatWebsiteUndangan();
    }
}

// Mengganti teks pesan WhatsApp sesuai jenis acara
function ubahTemplatePesan() {
    const jenis = document.getElementById('jenis-acara').value;
    document.getElementById('template-pesan').value = daftarTemplate[jenis];
    updateLivePreview();
}

// Memuat link website undangan ke dalam layar HP (iframe)
function muatWebsiteUndangan() {
    let inputUrl = document.getElementById('input-url').value.trim();
    
    if (!inputUrl) {
        alert("Silakan masukkan alamat link website undangan terlebih dahulu!");
        return;
    }

    // Bersihkan parameter ?to= lama jika pengguna menempelkan link yang sudah ada parameternya
    if (inputUrl.includes('?')) {
        inputUrl = inputUrl.split('?')[0];
    }

    urlDasarAktif = inputUrl;
    
    // Ubah indikator status menjadi aktif
    const statusDot = document.getElementById('status-preview');
    statusDot.textContent = "Terhubung";
    statusDot.classList.add('aktif');

    updateLivePreview();
}

// Memperbarui pratinjau di layar HP dan merakit link setiap kali nama tamu diketik
function updateLivePreview() {
    if (!urlDasarAktif) return;

    const namaTamu = document.getElementById('input-nama').value.trim();
    const template = document.getElementById('template-pesan').value;
    
    // Rakit URL akhir dengan parameter ?to=NamaTamu
    const linkFinal = namaTamu 
        ? `${urlDasarAktif}?to=${encodeURIComponent(namaTamu)}` 
        : urlDasarAktif;

    // Tampilkan link di kotak hasil
    document.getElementById('hasil-link').textContent = linkFinal;

    // Susun pesan WhatsApp
    const namaUntukPesan = namaTamu || "Tamu Undangan";
    teksSiapKirim = template
        .replace(/\[nama\]/g, namaUntukPesan)
        .replace(/\[link\]/g, linkFinal);

    // Update tombol kirim WhatsApp
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(teksSiapKirim)}`;
    document.getElementById('btn-kirim-wa').href = waUrl;

    // Beri jeda 500ms setelah selesai mengetik agar iframe tidak berkedip terus-menerus
    clearTimeout(timerKetik);
    timerKetik = setTimeout(() => {
        document.getElementById('iframe-undangan').src = linkFinal;
    }, 500);
}

// Fungsi menyalin pesan dan link ke clipboard
function salinPesan() {
    if (!urlDasarAktif) {
        alert("Muat link website undangan terlebih dahulu!");
        return;
    }
    navigator.clipboard.writeText(teksSiapKirim).then(() => {
        alert("Kata pengantar dan link undangan berhasil disalin!");
    });
}