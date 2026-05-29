/*
Alecia's Kitchen payment setup — GitHub no-folders version.

Venmo username is already set to: mikeandalecia

PayPal:
Open payment.html and replace PAYPAL_CLIENT_ID with your real PayPal Client ID.

Ebook download:
Replace PRODUCT_DOWNLOAD_URL below with your ebook URL if you want the download button to appear after payment.
*/

const AK_PAYMENT_CONFIG = {
  productName: "Unbroken Promises: The Promise Behind Alecia’s Kitchen",
  price: "4.99",
  currency: "USD",
  venmoUsername: "mikeandalecia",
  venmoNote: "Unbroken Promises ebook",
  downloadUrl: "PRODUCT_DOWNLOAD_URL"
};

function akShowPaymentMessage(message, isError = false) {
  const box = document.getElementById("ak-payment-message");
  if (!box) return;

  box.textContent = message;
  box.style.display = "block";
  box.style.borderLeftColor = isError ? "#a33" : "#4b8f37";
}

function akSetDownloadLink() {
  const download = document.getElementById("ak-download-link");
  if (!download) return;

  if (AK_PAYMENT_CONFIG.downloadUrl && AK_PAYMENT_CONFIG.downloadUrl !== "PRODUCT_DOWNLOAD_URL") {
    download.href = AK_PAYMENT_CONFIG.downloadUrl;
    download.classList.remove("ak-hidden");
  }
}

function akOpenVenmo() {
  const username = AK_PAYMENT_CONFIG.venmoUsername;

  if (!username || username === "YOUR_VENMO_USERNAME") {
    akShowPaymentMessage("Venmo username is missing in payments.js.", true);
    return;
  }

  const amount = encodeURIComponent(AK_PAYMENT_CONFIG.price);
  const note = encodeURIComponent(AK_PAYMENT_CONFIG.venmoNote);
  const webUrl = `https://venmo.com/u/${encodeURIComponent(username)}?txn=pay&amount=${amount}&note=${note}`;

  window.open(webUrl, "_blank", "noopener,noreferrer");
}

document.addEventListener("DOMContentLoaded", function () {
  akSetDownloadLink();

  const venmoBtn = document.getElementById("ak-venmo-button");
  if (venmoBtn) {
    venmoBtn.addEventListener("click", akOpenVenmo);
  }

  if (typeof paypal === "undefined") {
    akShowPaymentMessage(
      "PayPal buttons are not loaded yet. Replace PAYPAL_CLIENT_ID in payment.html with your real PayPal Client ID.",
      true
    );
    return;
  }

  paypal.Buttons({
    style: {
      layout: "vertical",
      color: "gold",
      shape: "pill",
      label: "paypal"
    },

    createOrder: function (data, actions) {
      return actions.order.create({
        purchase_units: [
          {
            description: AK_PAYMENT_CONFIG.productName,
            invoice_id: "AK-" + Date.now(),
            custom_id: "unbroken-promises-alecias-kitchen-ebook",
            amount: {
              currency_code: AK_PAYMENT_CONFIG.currency,
              value: AK_PAYMENT_CONFIG.price,
              breakdown: {
                item_total: {
                  currency_code: AK_PAYMENT_CONFIG.currency,
                  value: AK_PAYMENT_CONFIG.price
                }
              }
            },
            items: [
              {
                name: "Unbroken Promises: The Promise Behind Alecia’s Kitchen",
                description: "Digital ebook by Michael Sargent. Seller: Alecia Underwood / Michael Sargent.",
                unit_amount: {
                  currency_code: AK_PAYMENT_CONFIG.currency,
                  value: AK_PAYMENT_CONFIG.price
                },
                quantity: "1",
                category: "DIGITAL_GOODS"
              }
            ]
          }
        ],

        payment_source: {
          paypal: {
            experience_context: {
              brand_name: "Alecia Underwood / Michael Sargent",
              shipping_preference: "NO_SHIPPING",
              user_action: "PAY_NOW",
              payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED"
            }
          }
        }
      });
    },

    onApprove: function (data, actions) {
      return actions.order.capture().then(function (details) {
        const name = details?.payer?.name?.given_name || "friend";

        akShowPaymentMessage(
          `Thank you, ${name}! Your payment was completed. Check your email or use the download link if it is enabled.`
        );

        akSetDownloadLink();
      });
    },

    onCancel: function () {
      akShowPaymentMessage("Payment was cancelled. No charge was made.", true);
    },

    onError: function (err) {
      console.error(err);
      akShowPaymentMessage(
        "PayPal had a problem loading or processing the payment. Check your Client ID and PayPal setup.",
        true
      );
    }
  }).render("#paypal-button-container");
});
