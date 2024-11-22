function showForm(action) {
    document.getElementById('browse').style.display = (action === 'browse') ? 'block' : 'none';
    document.getElementById('insert').style.display = (action === 'insert') ? 'block' : 'none';
    document.getElementById('update').style.display = (action === 'update') ? 'block' : 'none';
    document.getElementById('delete').style.display = (action === 'delete') ? 'block' : 'none';
}

function newCustomer() { 
    showForm('insert'); 
}

function updateCustomer(customerID) {
    // Select the row using the data-id attribute
    const row = document.querySelector(`tr[data-id="${customerID}"]`);

    // Ensure the row exists before trying to access its data
    if (!row) {
        console.error(`Row with customerID ${customerID} not found.`);
        return;
    }

    // Extract data from the row
    const email = row.querySelector('.email').textContent.trim();
    const firstName = row.querySelector('.first-name').textContent.trim();
    const lastName = row.querySelector('.last-name').textContent.trim();

    // Populate the form fields
    document.getElementById('updateCustomerID').value = customerID;
    document.getElementById('updateEmail').value = email;
    document.getElementById('updateFirstName').value = firstName;
    document.getElementById('updateLastName').value = lastName;

    // Show the update form
    showForm('update');
}

function deleteCustomer(customerID) {
    document.getElementById('deleteCustomerID').value = customerID;
    showForm('delete');
}

function filterFunction() {
    var input = document.getElementById("customerFilter").value.toUpperCase();
    var table = document.getElementById("customerTable");
    var tr = table.getElementsByTagName("tr");

    for (i = 1; i < tr.length; i++) {
        var tdEmail = (tr[i].getElementsByTagName("td")[0]);
        var tdFirstName = (tr[i].getElementsByTagName("td")[1]);
        var tdLastName = (tr[i].getElementsByTagName("td")[2]);

        var fullinfo = (tdEmail.textContent + " " + tdFirstName.textContent + " " + tdLastName.textContent).toUpperCase();

        if (fullinfo.includes(input)) {
            tr[i].style.display = "";
        }
        else {
            tr[i].style.display = "none";
        }
    }
}

window.onload = function () {
    showForm('browse');
};