function showForm(action) {
    document.getElementById('browse').style.display = (action === 'browse') ? 'block' : 'none';
    document.getElementById('insert').style.display = (action === 'insert') ? 'block' : 'none';
    document.getElementById('update').style.display = (action === 'update') ? 'block' : 'none';
    document.getElementById('delete').style.display = (action === 'delete') ? 'block' : 'none';
}

function newGame() { 
    showForm('insert'); 
}

function updateGame(gameID) {
    showForm('update');
}

function deleteGame(gameID) {
    showForm('delete');
}

function filterFunction() {
    var input = document.getElementById("gameFilter").value.toUpperCase();
    var table = document.getElementById("gameTable");
    var tr = table.getElementsByTagName("tr");

    for (i = 1; i < tr.length; i++) {
        var title = (tr[i].getElementsByTagName("td")[0]);
        var genre = (tr[i].getElementsByTagName("td")[2]);
        var platform = (tr[i].getElementsByTagName("td")[3]);

        var fullinfo = (title.textContent + " " + genre.textContent + " " + platform.textContent).toUpperCase();

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