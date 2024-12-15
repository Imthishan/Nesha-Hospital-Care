document.addEventListener("DOMContentLoaded", function () {
    //  retrieve cart data and total amount from the URL parameters
    const { cartData, totalAmount } = getURLParams();

    // displaying order details, total amount, and the payment form
    const orderDetailsContainer = document.querySelector("#order-details");
    const totalDisplay = document.querySelector("#total-amount-display");
    const paymentForm = document.querySelector("#final-payment-form");

    // Display each cart item as a paragraph inside the order details container
    cartData.forEach(item => {
        const detail = document.createElement("p");
        detail.textContent = `${item.name} x ${item.quantity} = LKR ${item.total}`;
        orderDetailsContainer.appendChild(detail);
    });

    // display total amount
    totalDisplay.textContent = totalAmount;

    // payment form submission
    paymentForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the default form submission behavior

        // Extract  values from the payment form 
        const cardNumber = paymentForm.querySelector("input[id='card-number']").value.trim();
        console.log(cardNumber); // Debug: Log the card number for verification
        const expiryDate = paymentForm.querySelector("input[id='expiry-date']").value.trim();
        const cvv = paymentForm.querySelector("input[id='cvv']").value.trim();

        // Correcting card number to 16 digit
        if (!cardNumber.match(/^\d{16}$/)) {
            alert("Please enter a valid 16-digit card number.");
            return; // Stop further execution if validation fails
        }

        // expiry date format to MM/YY
        if (!expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
            alert("Please enter a valid expiry date in MM/YY format.");
            return;
        }

        // CVV format to 3-digit number
        if (!cvv.match(/^\d{3}$/)) {
            alert("Please enter a valid 3-digit CVV.");
            return;
        }

        // Calculate the delivery date as 2 days from today
        const today = new Date();
        const deliveryDate = new Date(today);
        deliveryDate.setDate(today.getDate() + 2);

        // Converting date to readable string
        const formattedDate = deliveryDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });

        // Displaying thank you message and delivery date
        alert(
            `Thank you for your purchase!\nYour order will be delivered by ${formattedDate}.`
        );

        // Reset form
        paymentForm.reset();
    });
});

//extracting and parsing URL parameters
function getURLParams() {
    
    const params = new URLSearchParams(window.location.search);
    return {
    
        cartData: JSON.parse(decodeURIComponent(params.get("cart-data"))),
        totalAmount: params.get("total-amount"),
    };
}
