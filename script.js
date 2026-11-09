// ====== Data Siswa (file 4) ======
const MAKSIMAL_NIS = 10;
const penyimpananSiswa = "dataSiswa4";

const formSiswa = document.getElementById("form-siswa");
const dataSiswa = document.getElementById("data-siswa");
const inputNis = document.getElementById("nis");

let daftarSiswa = [];

// ====== PENYIMPANAN ======
try {
  const dataTersimpan = localStorage.getItem(penyimpananSiswa);
  daftarSiswa = dataTersimpan ? JSON.parse(dataTersimpan) : [];

  if (!Array.isArray(daftarSiswa)) {
    throw new Error("Format data siswa tersimpan tidak valid.");
  }
} catch (error) {
  console.error("Gagal membaca data siswa dari penyimpanan browser:", error);
  alert("Data siswa tersimpan tidak dapat dibaca. Silakan periksa penyimpanan browser.");
}

function simpanDataSiswa() {
  try {
    localStorage.setItem(penyimpananSiswa, JSON.stringify(daftarSiswa));
    return true;
  } catch (error) {
    console.error("Gagal menyimpan data siswa:", error);
    alert("Data tidak dapat disimpan di browser ini.");
    return false;
  }
}

// Batasi NIS: hanya angka dan maksimal 10 digit
inputNis.addEventListener("input", () => {
  inputNis.value = inputNis.value.replace(/\D/g, "").slice(0, MAKSIMAL_NIS);
});

// ====== MENAMPILKAN TABEL ======
function tampilkanDataSiswa() {
  dataSiswa.replaceChildren();

  if (daftarSiswa.length === 0) {
    const barisKosong = document.createElement("tr");
    const selKosong = document.createElement("td");
    selKosong.colSpan = 8;
    selKosong.className = "empty-state";
    selKosong.textContent = "Belum ada data siswa.";
    barisKosong.append(selKosong);
    dataSiswa.append(barisKosong);
    return;
  }

  // ===== PERULANGAN 1: mengulang setiap data siswa =====
  for (let index = 0; index < daftarSiswa.length; index++) {
    const siswa = daftarSiswa[index];
    const baris = document.createElement("tr");

    const isiSel = [
      index + 1,
      siswa.nis,
      siswa.nama,
      siswa.kelas,
      siswa.jenisKelamin,
      siswa.agama,
      siswa.alamat,
    ];

    // ===== PERULANGAN 2: mengulang pembuatan sel tabel =====
    for (let kolom = 0; kolom < isiSel.length; kolom++) {
      const sel = document.createElement("td");

      if (kolom === 1) {
        // Kolom NIS dibuat badge
        const badge = document.createElement("span");
        badge.className = "badge-nis";
        badge.textContent = isiSel[kolom];
        sel.append(badge);
      } else {
        sel.textContent = isiSel[kolom];
      }

      baris.append(sel);
    }

    // Kolom Aksi
    const selAksi = document.createElement("td");
    const tombolHapus = document.createElement("button");
    tombolHapus.type = "button";
    tombolHapus.className = "btn-hapus";
    tombolHapus.textContent = "Hapus";
    tombolHapus.dataset.index = index;
    selAksi.append(tombolHapus);
    baris.append(selAksi);

    dataSiswa.append(baris);
  }
}

// ====== TAMBAH DATA ======
formSiswa.addEventListener("submit", (event) => {
  event.preventDefault();

  const nis = inputNis.value.trim();

  // Validasi NIS: hanya angka, maksimal 10 digit
  if (!/^[0-9]{1,10}$/.test(nis)) {
    alert("NIS harus berupa angka dan maksimal 10 digit.");
    inputNis.focus();
    return;
  }

  const pilihanJenisKelamin = document.querySelector(
    'input[name="jenis-kelamin"]:checked'
  );

  if (!pilihanJenisKelamin) {
    alert("Silakan pilih jenis kelamin.");
    return;
  }

  const siswaBaru = {
    nis: nis,
    nama: document.getElementById("nama").value.trim(),
    kelas: document.getElementById("kelas").value.trim(),
    jenisKelamin: pilihanJenisKelamin.value,
    agama: document.getElementById("agama").value,
    alamat: document.getElementById("alamat").value.trim(),
  };

  daftarSiswa.push(siswaBaru);

  if (!simpanDataSiswa()) {
    daftarSiswa.pop();
    return;
  }

  tampilkanDataSiswa();
  formSiswa.reset();
  inputNis.focus();
});

// ====== HAPUS SATU DATA ======
dataSiswa.addEventListener("click", (event) => {
  const tombolHapus = event.target.closest(".btn-hapus");
  if (!tombolHapus) return;

  const index = Number(tombolHapus.dataset.index);
  const dataDihapus = daftarSiswa.splice(index, 1)[0];

  if (!simpanDataSiswa()) {
    daftarSiswa.splice(index, 0, dataDihapus);
    return;
  }

  tampilkanDataSiswa();
});

tampilkanDataSiswa();
