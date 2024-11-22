function showForm(action) {
    document.getElementById('browse').style.display = (action === 'browse') ? 'block' : 'none';
    document.getElementById('insert').style.display = (action === 'insert') ? 'block' : 'none';
    document.getElementById('update').style.display = (action === 'update') ? 'block' : 'none';
    document.getElementById('delete').style.display = (action === 'delete') ? 'block' : 'none';
}

function newLibraryItem() { 
    showForm('insert'); 
}

function updateLibraryItem(customerID, gameID) {
    showForm('update');
}

function deleteLibraryItem(customerID, gameID) {
    showForm('delete');
}

window.onload = function () {
    showForm('browse');
};