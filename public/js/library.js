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
    // Select the row using the data-id attribute
    const row = document.querySelector(`tr[data-id="(${customerID},${gameID})"]`);

    // Ensure the row exists before trying to access its data
    if (!row) {
        console.error(`Row with libraryID (${customerID},${gameID}) not found.`);
        return;
    }
    
    // Populate the form fields
    document.getElementById('updateLibraryID').value = `(${customerID},${gameID})`;
    document.getElementById('updateCustomerID').value = customerID;
    document.getElementById('updateGameID').value = gameID;

    // Show the update form
    showForm('update');
}

function deleteLibraryItem(customerID, gameID) {
    document.getElementById('deleteLibraryID').value = `(${customerID},${gameID})`;
    showForm('delete');
}

window.onload = function () {
    showForm('browse');
};