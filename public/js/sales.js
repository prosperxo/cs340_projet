function showForm(action) {
    document.getElementById('browse').style.display = (action === 'browse') ? 'block' : 'none';
    document.getElementById('insert').style.display = (action === 'insert') ? 'block' : 'none';
    document.getElementById('update').style.display = (action === 'update') ? 'block' : 'none';
    document.getElementById('delete').style.display = (action === 'delete') ? 'block' : 'none';
}

function newSale() { 
    showForm('insert'); 
}

function updateSale(saleID) {
    // Select the row using the data-id attribute
    const row = document.querySelector(`tr[data-id="${saleID}"]`);

    // Ensure the row exists before trying to access its data
    if (!row) {
        console.error(`Row with saleID ${saleID} not found.`);
        return;
    }

    // Extract data from the row
    const totalAmount = row.querySelector('.totalAmount').textContent.trim();

    // Populate the form fields
    document.getElementById('updateSaleID').value = saleID;
    document.getElementById('updateTotalAmount').value = totalAmount;

    // Show the update form
    showForm('update');
}

function deleteSale(saleID) {
    document.getElementById('deleteSaleID').value = saleID;
    showForm('delete');
}

window.onload = function () {
    showForm('browse');
};