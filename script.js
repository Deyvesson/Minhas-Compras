document.addEventListener("DOMContentLoaded", () => {
  const productNameInput = document.getElementById("product-name");
  const productPriceInput = document.getElementById("product-price");
  const productQuantityInput = document.getElementById("product-quantity");
  const addProductButton = document.getElementById("add-product");
  const productItemsList = document.getElementById("product-items");
  const totalPriceDisplay = document.getElementById("total-price");
  const editModal = new bootstrap.Modal(document.getElementById('editModal'));
  let currentEditIndex = undefined;

  let products = [];

  // Carregar dados do localStorage
  if (localStorage.getItem("products")) {
    products = JSON.parse(localStorage.getItem("products"));
    updateProductList();
    updateTotalPrice();
  }

  // Adicionar novos produtos
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
      listItem.className = "list-group-item px-1"

      listItem.textContent = `${product.name} - R$${product.price.toFixed(2)} x ${product.quantity} = R$${(product.price * product.quantity).toFixed(2)}`

      //Edit Button
      const editButton = document.createElement('button');
      editButton.className = 'btn btn-sm btn-warning px-3 mx-1';
      editButton.innerHTML = `<i class="bi bi-pencil-square"></i>`;
      editButton.setAttribute("data-index", index)
      editButton.onclick = function () {
        openEditModal(index);
      };
      listItem.appendChild(editButton);

      //Remove Button
      const removeButton = document.createElement('button');
      removeButton.className = 'btn btn-sm btn-danger px-3';
      removeButton.innerHTML = `<i class="bi bi-trash"></i>`;
      removeButton.setAttribute("data-index", index)
      removeButton.onclick = function () {
        removeProduct(index);
      };
      listItem.appendChild(removeButton);

      //Adicionar item a Lista
      productItemsList.appendChild(listItem);
    });

    // Salvar dados no localStorage
    localStorage.setItem("products", JSON.stringify(products));
  }

  // Abrir modal ao clicar em Editar
  function openEditModal(index) {
    currentEditIndex = index
    console.log(products[currentEditIndex])
    document.getElementById('edit-product-name').value = products[currentEditIndex].name
    document.getElementById('edit-product-price').value = products[currentEditIndex].price.toFixed(2)
    document.getElementById('edit-product-quantity').value = products[currentEditIndex].quantity
    editModal.show();
  }

  //
  const editItemForm = document.getElementById('editItemForm');
  editItemForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (products[currentEditIndex]) {
      products[currentEditIndex].name = document.getElementById('edit-product-name').value
      products[currentEditIndex].price = parseFloat(document.getElementById('edit-product-price').value)
      products[currentEditIndex].quantity = parseInt(document.getElementById('edit-product-quantity').value)
      updateProductList();
      updateTotalPrice();
      editModal.hide();
    }
  });

  updateProductList();
});
