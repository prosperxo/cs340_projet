function showForm(action) {
    document.getElementById('browse').style.display = (action === 'browse') ? 'block' : 'none';
    document.getElementById('insert').style.display = (action === 'insert') ? 'block' : 'none';
    document.getElementById('update').style.display = (action === 'update') ? 'block' : 'none';
    document.getElementById('delete').style.display = (action === 'delete') ? 'block' : 'none';
}

function newOrderItem() { 
    showForm('insert'); 
}

function updateOrderItem(orderItemID) {
    // Select the row using the data-id attribute
    const row = document.querySelector(`tr[data-id="${orderItemID}"]`);

    // Ensure the row exists before trying to access its data
    if (!row) {
        console.error(`Row with orderItemID ${orderItemID} not found.`);
        return;
    }

    // Extract data from the row
    const quantity = row.querySelector('.quantity').textContent.trim();
    const price = row.querySelector('.price').textContent.trim();

    // Populate the form fields
    document.getElementById('updateOrderItemID').value = orderItemID;
    document.getElementById('updateQuantity').value = quantity;
    document.getElementById('updatePrice').value = price;

    // Show the update form
    showForm('update');
}

function deleteOrderItem(orderItemID) {
    document.getElementById('deleteOrderItemID').value = orderItemID;
    showForm('delete');
}

window.onload = function () {
    showForm('browse');
};