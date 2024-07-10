document.addEventListener("DOMContentLoaded", () => {
  const productNameInput = document.getElementById("product-name");
  const productPriceInput = document.getElementById("product-price");
  const productQuantityInput = document.getElementById("product-quantity");
  const newItemForm = document.getElementById('newItemForm');
  const productItemsList = document.getElementById("product-items");
  const totalPriceDisplay = document.getElementById("total-price");
  const editModal = new bootstrap.Modal(document.getElementById('editModal'));
  const buttonClearList = document.getElementById("buttonClearList");
  let currentEditIndex = undefined;

  let products = [];

  // Carregar dados do localStorage
  if (localStorage.getItem("products")) {
    products = JSON.parse(localStorage.getItem("products"));
    updateProductList();
    updateTotalPrice();
  }

  // Adicionar novo produto a lista
  newItemForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const productName = productNameInput.value;
    const productPrice = parseFloat(productPriceInput.value);
    const productQuantity = parseInt(productQuantityInput.value);

    const product = {
      name: productName,
      price: productPrice || 0,
      quantity: productQuantity || 0
    };

    products.push(product);

    newItemForm.reset()
    updateProductList();
    updateTotalPrice();
  });

  // Atualizar o valor total
  function updateTotalPrice() {
    const total = products.reduce((sum, product) => sum + product.price * product.quantity, 0);
    //totalPriceDisplay.textContent = `Valor Total: R$${total.toFixed(2)}`;
    totalPriceDisplay.textContent = `Valor Total: ${total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
  }

  //Remover o produto de acordo com o index
  function removeProduct(index) {
    products.splice(index, 1);
    updateProductList();
    updateTotalPrice();
  }

  // Atualizar a lista de produtos
  function updateProductList() {
    productItemsList.innerHTML = "";
    products.forEach((product, index) => {
      const listItem = document.createElement("li");
      listItem.className = "list-group-item px-1"
      // Adicioar o texto com nome e valor do item
      //listItem.textContent = `${product.name} - R$${product.price.toFixed(2)} x ${product.quantity} = R$${(product.price * product.quantity).toFixed(2)}`
      listItem.textContent = `${product.name} - ${product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} x ${product.quantity} = ${(product.price * product.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`

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

  // Editar produto
  const editItemForm = document.getElementById('editItemForm');
  editItemForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (products[currentEditIndex]) {
      products[currentEditIndex].name = document.getElementById('edit-product-name').value
      products[currentEditIndex].price = parseFloat(document.getElementById('edit-product-price').value) || 0
      products[currentEditIndex].quantity = parseInt(document.getElementById('edit-product-quantity').value) || 0
      updateProductList();
      updateTotalPrice();
      editModal.hide();
    }
  });

  //Limpar Lista de produtos
  buttonClearList.addEventListener("click", () => {
    products = [];
    updateProductList();
    updateTotalPrice();
    location.reload();
  })

});
