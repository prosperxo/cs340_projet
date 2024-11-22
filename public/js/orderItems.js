function showForm(action) {
    document.getElementById('browse').style.display = (action === 'browse') ? 'block' : 'none';
    document.getElementById('insert').style.display = (action === 'insert') ? 'block' : 'none';
    document.getElementById('update').style.display = (action === 'update') ? 'block' : 'none';
    document.getElementById('delete').style.display = (action === 'delete') ? 'block' : 'none';
}

function newOrderItem() { 
    showForm('insert'); 
}

function updateOrderItem(saleID, gameID) {
    showForm('update');
}

function deleteOrderItem(saleID, gameID) {
    showForm('delete');
}

window.onload = function () {
    showForm('browse');
};