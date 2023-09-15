document.addEventListener("DOMContentLoaded", function () {
    const itemList = document.getElementById("item-list");
    const calculateChangeButton = document.getElementById("calculate-change");
    const addButton = document.getElementById("add-button");
    const itemNameInput = document.getElementById("item-name");
    const itemQuantityInput = document.getElementById("item-quantity");
    const itemPriceInput = document.getElementById("item-price");
    const amountPaidInput = document.getElementById("amount-paid");
    const totalPriceDisplay = document.getElementById("total-price");
    const changeDisplay = document.getElementById("change-container");
    const historyList = document.getElementById("history-list");
    const downloadExcelButton = document.getElementById("download-excel");
    const loginForm = document.getElementById("login-form");
    const kasirContent = document.getElementById("kasir-content");
    const navbar = document.getElementById("navbar")
    const loginButton = document.getElementById("login-button");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const loginStatus = document.getElementById("login-status"); // Elemen teks status login

    let totalHarga = 0;
    let itemsData = [];
    let deletedItems = [];
    let isLoggedIn = false; // Menyimpan status login pengguna

    calculateChangeButton.addEventListener("click", function () {
        const amountPaid = parseFloat(amountPaidInput.value);
        const change = amountPaid - totalHarga;

        changeDisplay.style.display = "block";
        changeDisplay.innerHTML = `
            <span class="currency-label">Total Kembalian:</span>
            <span id="change">${formatCurrency(change)}</span> RP
        `;
    });

    // Fungsi untuk memeriksa login
    function checkLogin(username, password) {
        if (username === "admin" && password === "!KasirAdminfotocopy#%1610") {
            return true; // Login berhasil
        }
        return false; // Login gagal
    }

    // Event listener untuk tombol login
    loginButton.addEventListener("click", function () {
        const username = usernameInput.value;
        const password = passwordInput.value;

        if (checkLogin(username, password)) {
            // Jika login berhasil, tampilkan konten kasir dan sembunyikan form login
            loginForm.style.display = "none";
            kasirContent.style.display = "block";
            navbar.style.display = "block"
            isLoggedIn = true;
            // Tampilkan teks status login yang berhasil
            loginStatus.textContent = "Login berhasil!";
            loginStatus.style.color = "green";
        } else {
            // Tampilkan teks status login yang gagal
            loginStatus.textContent = "Login gagal. Username atau password salah.";
            loginStatus.style.color = "red";
        }
    });

    // Fungsi untuk memeriksa status login sebelum menjalankan tindakan kasir
    function checkLoginStatus() {
        if (!isLoggedIn) {
            alert("Anda harus login terlebih dahulu.");
        }
        return isLoggedIn;
    }

    // ... (lanjutkan dengan kode JavaScript Anda yang lain) ...

    function formatCurrency(amount) {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
    }

    function addItem(itemName, itemQuantity, itemPrice) {
        const newRow = document.createElement("tr");
        const totalPrice = itemQuantity * itemPrice;

        newRow.innerHTML = `
            <td>${itemName}</td>
            <td>${itemQuantity}</td>
            <td>${formatCurrency(itemPrice)}</td>
            <td>${formatCurrency(totalPrice)}</td>
            <td><button class="delete-button">Hapus</button></td>
        `;

        const deleteButton = newRow.querySelector(".delete-button");
        deleteButton.addEventListener("click", function () {
            itemList.removeChild(newRow);
            totalHarga -= totalPrice;
            updateTotalPrice();
            const index = itemsData.findIndex(item => item.name === itemName);
            if (index !== -1) {
                const deletedItem = itemsData.splice(index, 1)[0];
                deletedItems.push(deletedItem);
                updateHistory();
            }
        });

        itemList.appendChild(newRow);
        totalHarga += totalPrice;
        updateTotalPrice();
        
        itemsData.push({ name: itemName, quantity: itemQuantity, price: itemPrice });
    }

    function renderItems() {
        itemsData.forEach(item => {
            addItem(item.name, item.quantity, item.price);
        });
    }

    function updateTotalPrice() {
        totalPriceDisplay.textContent = formatCurrency(totalHarga);
    }

    function updateHistory() {
        const historyItem = document.createElement("li");
        historyItem.classList.add("history-item");
        historyItem.textContent = `Hapus: ${deletedItems[deletedItems.length - 1].name}`;
        historyList.appendChild(historyItem);
    }

    addButton.addEventListener("click", function () {
        const itemName = itemNameInput.value;
        const itemQuantity = parseInt(itemQuantityInput.value);
        const itemPrice = parseFloat(itemPriceInput.value);

        if (itemName && !isNaN(itemQuantity) && !isNaN(itemPrice)) {
            addItem(itemName, itemQuantity, itemPrice);
            itemNameInput.value = "";
            itemQuantityInput.value = "";
            itemPriceInput.value = "";
        } else {
            alert("Mohon masukkan data yang valid.");
        }
    });

    downloadExcelButton.addEventListener("click", function () {
        downloadExcel();
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            addButton.click();
        }
    });
    
    // Fungsi untuk mengunduh file Excel (CSV)
    function downloadExcel() {
        const data = [["Nama Barang", "Jumlah", "Harga Barang", "Jumlah Uang Pembeli", "Kembalian"]];

        itemsData.forEach(item => {
            const subtotal = item.quantity * item.price;
            const row = [item.name, item.quantity, item.price, amountPaidInput.value, amountPaidInput.value - subtotal];
            data.push(row);
        });

        const csvContent = "data:text/csv;charset=utf-8," + data.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "data_barang.csv");
        document.body.appendChild(link);
        link.click();
    }
});

function tampilkanDiv(divId) {
    // Sembunyikan semua div
    for (let i = 1; i <= 3; i++) {
        const div = document.getElementById(`div${i}`);
        if (div) {
            div.style.display = 'none';
        }
    }

    // Tampilkan div yang sesuai
    const divToShow = document.getElementById(`div${divId}`);
    if (divToShow) {
        divToShow.style.display = 'block';
    }
}

document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
});
