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
    showForm('update');
}

function deleteCustomer(customerID) {
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