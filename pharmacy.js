document.addEventListener("DOMContentLoaded", function () {
    const categoriesContainer = document.querySelector("#categories");
    const cartTable = document.querySelector("#order-table");
    const totalDisplay = document.querySelector("#total-price");
    const cartDataField = document.querySelector("#cart-data");
    const totalAmountField = document.querySelector("#total-amount");

    let cart = [];

    fetch('pharmacy.json')
        .then(response => response.json())
        .then(data => populateMedicines(data.medicines))
        .catch(error => console.error("Error loading JSON:", error));

    function populateMedicines(medicines) {
        for (const category in medicines) {
            const section = document.createElement("div");
            section.classList.add("category");
            section.innerHTML = `<h3>${category}</h3>`;

            medicines[category].forEach(item => {
                const itemContainer = document.createElement("div");
                itemContainer.classList.add("medicine-item");

                const image = document.createElement("img");
                image.src = item.image || "";
                image.alt = item.name;
                image.classList.add("medicine-image");

                const label = document.createElement("label");
                label.textContent = `${item.name} - LKR ${item.price}`;

                const quantityInput = document.createElement("input");
                quantityInput.type = "number";
                quantityInput.min = 0;
                quantityInput.value = 0;
                quantityInput.classList.add("quantity");
                quantityInput.dataset.name = item.name;
                quantityInput.dataset.price = item.price;

                quantityInput.addEventListener("input", function () {
                    const quantity = parseInt(this.value) || 0;
                    updateCartWithInput(item.name, item.price, quantity);
                });

                itemContainer.appendChild(image);
                itemContainer.appendChild(label);
                itemContainer.appendChild(quantityInput);
                section.appendChild(itemContainer);
            });

            categoriesContainer.appendChild(section);
        }
    }

    function updateCartWithInput(name, price, quantity) {
        const existingItem = cart.find(item => item.name === name);

        if (quantity > 0) {
            if (existingItem) {
                existingItem.quantity = quantity;
                existingItem.total = price * quantity;
            } else {
                cart.push({ name, price, quantity, total: price * quantity });
            }
        } else {
            cart = cart.filter(item => item.name !== name);
        }

        updateCart();
    }

    function updateCart() {
        cartTable.innerHTML = "";
        let totalPrice = 0;

        cart.forEach((item, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>LKR ${item.price}</td>
                <td>LKR ${item.total}</td>
                <td><button class="remove-item" data-index="${index}">Remove</button></td>
            `;
            cartTable.appendChild(row);
            totalPrice += item.total;
        });

        totalDisplay.textContent = totalPrice;
        cartDataField.value = JSON.stringify(cart);
        totalAmountField.value = totalPrice;

        document.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", function () {
                const index = parseInt(this.dataset.index);
                cart.splice(index, 1);
                updateCart();
            });
        });
    }

    document.querySelector("#save-favourites").addEventListener("click", function () {
        localStorage.setItem("favourites", JSON.stringify(cart));
        alert("Favourites saved successfully!");
    });

    document.querySelector("#apply-favourites").addEventListener("click", function () {
        const favourites = JSON.parse(localStorage.getItem("favourites"));
        if (favourites) {
            cart = favourites;
            updateCart();
        } 
        else {
            alert("No favourites found!");
        }
    });
});
