document.addEventListener("DOMContentLoaded", () => {
  const productNameInput = document.getElementById("product-name");
  const productPriceInput = document.getElementById("product-price");
  const productQuantityInput = document.getElementById("product-quantity");
  const addProductButton = document.getElementById("add-product");
  const productItemsList = document.getElementById("product-items");
  const totalPriceDisplay = document.getElementById("total-price");

  let products = [];

  // Carregar dados do localStorage
  if (localStorage.getItem("products")) {
    products = JSON.parse(localStorage.getItem("products"));
    updateProductList();
    updateTotalPrice();
  }

  addProductButton.addEventListener("click", () => {
    const productName = productNameInput.value;
    const productPrice = parseFloat(productPriceInput.value);
    const productQuantity = parseInt(productQuantityInput.value);

    if (productName && productPrice && productQuantity) {
      const product = { name: productName, price: productPrice, quantity: productQuantity };
      products.push(product);

      updateProductList();
      updateTotalPrice();
    }

    productNameInput.value = "";
    productPriceInput.value = "";
    productQuantityInput.value = "";
  });

  function updateTotalPrice() {
    const total = products.reduce((sum, product) => sum + product.price * product.quantity, 0);
    totalPriceDisplay.textContent = `Valor Total: R$${total.toFixed(2)}`;
  }

  function removeProduct(index) {
    products.splice(index, 1);
    updateProductList();
    updateTotalPrice();
  }

  function updateProductList() {
    productItemsList.innerHTML = "";
    products.forEach((product, index) => {
      const listItem = document.createElement("li");
      listItem.classList.add("list-group-item")
      listItem.innerHTML = `${product.name} - R$${product.price.toFixed(2)} x ${product.quantity} = R$${(product.price * product.quantity).toFixed(2)}
        <button class="remove-button btn btn-danger btn-sm" data-index="${index}">Remover</button>`;
      productItemsList.appendChild(listItem);
    });

    const removeButtons = document.querySelectorAll(".remove-button");
    removeButtons.forEach(button => {
      button.addEventListener("click", (event) => {
        const index = event.target.getAttribute("data-index");
        removeProduct(index);
      });
    });

    // Salvar dados no localStorage
    localStorage.setItem("products", JSON.stringify(products));
  }

  updateProductList();
});
