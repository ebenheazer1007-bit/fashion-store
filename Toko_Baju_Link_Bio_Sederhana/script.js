
const ukuranTersedia = ["S", "M", "L", "XL", "XXL"];

const produk = [
  {
    id: 1,
    nama: "Kaos Basic Hitam",
    kategori: "kaos",
    harga: 75000,
    gambar: "./images/kaos-1.jpg"
  },
  {
    id: 2,
    nama: "Kaos Basic Putih",
    kategori: "kaos",
    harga: 75000,
    gambar: "./images/kaos-2.jpg"
  },
  {
    id: 3,
    nama: "Kaos Oversize ",
    kategori: "kaos",
    harga: 95000,
    gambar: "./images/kaos-3.jpg"
  },
  {
    id: 4,
    nama: "Kaos Graphic Streetwear",
    kategori: "kaos",
    harga: 110000,
    gambar: "./images/kaos-4.jpg"
  },
  {
    id: 5,
    nama: "Kaos Polo Casual",
    kategori: "kaos",
    harga: 105000,
    gambar: "./images/kaos-5.jpg"
  },
  {
    id: 6,
    nama: "Kemeja Polos Hitam",
    kategori: "kemeja",
    harga: 135000,
    gambar: "./images/kemeja-1.jpg"
  },
  {
    id: 7,
    nama: "Kemeja Oxford Putih",
    kategori: "kemeja",
    harga: 145000,
    gambar: "./images/kemeja-2.jpg"
  },
  {
    id: 8,
    nama: "Kemeja Flanel Kotak",
    kategori: "kemeja",
    harga: 155000,
    gambar: "./images/kemeja-3.jpg"
  },
  {
    id: 9,
    nama: "Kemeja Casual Navy",
    kategori: "kemeja",
    harga: 150000,
    gambar: "./images/kemeja-4.jpg"
  },
  {
    id: 10,
    nama: "Kemeja Linen Beige",
    kategori: "kemeja",
    harga: 165000,
    gambar: "./images/kemeja-5.jpg"
  }
];

let keranjang = [];

const formatRupiah = angka =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(angka);

function pilihanUkuran(id) {
  return `
    <label class="size-label" for="ukuran-${id}">
      Pilih ukuran:
    </label>

    <select class="size-select" id="ukuran-${id}">
      <option value="">-- Pilih ukuran --</option>
      ${ukuranTersedia.map(ukuran =>
        `<option value="${ukuran}">${ukuran}</option>`
      ).join("")}
    </select>
  `;
}

function tampilProduk(kategori = "semua", kataKunci = "") {
  const list = document.getElementById("productList");

  const hasil = produk.filter(item => {
    const cocokKategori =
      kategori === "semua" || item.kategori === kategori;

    const cocokCari =
      item.nama.toLowerCase().includes(kataKunci.toLowerCase()) ||
      item.kategori.toLowerCase().includes(kataKunci.toLowerCase());

    return cocokKategori && cocokCari;
  });

  if (hasil.length === 0) {
    list.innerHTML = `
      <div class="empty">Produk tidak ditemukan.</div>
    `;
    return;
  }

  list.innerHTML = hasil.map(item => `
    <article class="product">
      <div class="product-image-wrap">
        <img
          src="${item.gambar}"
          alt="${item.nama}"
          loading="lazy"
          onerror="this.onerror=null;this.src='./images/foto.jpg';"
        >
      </div>

      <div class="product-info">
        <small class="category-label">
          ${item.kategori.toUpperCase()}
        </small>

        <h3>${item.nama}</h3>

        <div class="price">${formatRupiah(item.harga)}</div>

        ${pilihanUkuran(item.id)}

        <button class="add-btn"
          onclick="tambahKeranjang(${item.id})">
          + Tambah ke Keranjang
        </button>
      </div>
    </article>
  `).join("");
}

function tambahKeranjang(id) {
  const data = produk.find(item => item.id === id);
  const ukuran = document.getElementById(`ukuran-${id}`).value;

  if (!ukuran) {
    alert("Silakan pilih ukuran baju terlebih dahulu!");
    document.getElementById(`ukuran-${id}`).focus();
    return;
  }

  const item = keranjang.find(
    x => x.id === id && x.ukuran === ukuran
  );

  if (item) {
    item.jumlah++;
  } else {
    keranjang.push({
      id: id,
      ukuran: ukuran,
      jumlah: 1
    });
  }

  updateJumlahKeranjang();
  tampilKeranjang();

  alert(`${data.nama} ukuran ${ukuran} ditambahkan ke keranjang.`);
}

function ubahJumlah(index, nilai) {
  keranjang[index].jumlah += nilai;

  if (keranjang[index].jumlah <= 0) {
    keranjang.splice(index, 1);
  }

  tampilKeranjang();
  updateJumlahKeranjang();
}

function hapusProduk(index) {
  keranjang.splice(index, 1);
  tampilKeranjang();
  updateJumlahKeranjang();
}

function updateJumlahKeranjang() {
  const jumlah = keranjang.reduce(
    (total, item) => total + item.jumlah,
    0
  );

  document.getElementById("jumlahKeranjang").textContent = jumlah;
}

function hitungTotal() {
  return keranjang.reduce((total, item) => {
    const data = produk.find(x => x.id === item.id);
    return total + data.harga * item.jumlah;
  }, 0);
}

function tampilKeranjang() {
  const list = document.getElementById("cartList");

  if (keranjang.length === 0) {
    list.innerHTML = `
      <div class="empty">Keranjang masih kosong.</div>
    `;

    document.getElementById("totalHarga").textContent =
      formatRupiah(0);

    return;
  }

  list.innerHTML = keranjang.map((item, index) => {
    const data = produk.find(x => x.id === item.id);
    const subtotal = data.harga * item.jumlah;

    return `
      <div class="cart-item">
        <img
          src="${data.gambar}"
          alt="${data.nama}"
          onerror="this.onerror=null;this.src='./images/foto.jpg';"
        >

        <div>
          <h4>${data.nama}</h4>
          <p>Ukuran: <b>${item.ukuran}</b></p>
          <p>${formatRupiah(data.harga)} × ${item.jumlah}</p>

          <div class="quantity">
            <button onclick="ubahJumlah(${index}, -1)">−</button>
            <span>${item.jumlah}</span>
            <button onclick="ubahJumlah(${index}, 1)">+</button>
          </div>

          <p class="subtotal">
            <b>${formatRupiah(subtotal)}</b>
          </p>

          <button class="delete"
            onclick="hapusProduk(${index})">
            Hapus
          </button>
        </div>
      </div>
    `;
  }).join("");

  document.getElementById("totalHarga").textContent =
    formatRupiah(hitungTotal());
}

function bukaKeranjang() {
  document.getElementById("cartModal").classList.add("show");
  tampilKeranjang();
}

function tutupKeranjang() {
  document.getElementById("cartModal").classList.remove("show");
}

function checkoutWhatsApp() {
  if (keranjang.length === 0) {
    alert("Keranjang masih kosong.");
    return;
  }

  let pesan = "Halo Fashion Store, saya ingin memesan:\n\n";

  keranjang.forEach(item => {
    const data = produk.find(x => x.id === item.id);

    pesan +=
      `- ${data.nama} | Ukuran ${item.ukuran} | ` +
      `${item.jumlah} pcs | ` +
      `${formatRupiah(data.harga * item.jumlah)}\n`;
  });

  pesan +=
    `\nTotal: ${formatRupiah(hitungTotal())}` +
    "\n\nNama:\nAlamat:\nCatatan:";

  // Ganti dengan nomor WhatsApp toko kamu.
  const nomorWhatsApp = "6282274390654";

  window.open(
    `https://wa.me/${nomorWhatsApp}?text=${encodeURIComponent(pesan)}`,
    "_blank"
  );
}

// Pencarian produk
document.getElementById("searchInput")
  .addEventListener("input", function () {
    const kategoriAktif =
      document.querySelector(".filter-btn.active").dataset.category;

    tampilProduk(kategoriAktif, this.value);
  });

// Filter kategori
document.querySelectorAll(".filter-btn").forEach(button => {
  button.addEventListener("click", function () {
    document.querySelectorAll(".filter-btn").forEach(btn => {
      btn.classList.remove("active");
    });

    this.classList.add("active");

    tampilProduk(
      this.dataset.category,
      document.getElementById("searchInput").value
    );
  });
});

// Tutup keranjang ketika area luar diklik
document.getElementById("cartModal")
  .addEventListener("click", function (event) {
    if (event.target === this) {
      tutupKeranjang();
    }
  });

// Jalankan toko
tampilProduk();
tampilKeranjang();
updateJumlahKeranjang();
