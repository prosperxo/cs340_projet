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
    // Select the row using the data-id attribute
    const row = document.querySelector(`tr[data-id="${gameID}"]`);

    // Ensure the row exists before trying to access its data
    if (!row) {
        console.error(`Row with gameID ${gameID} not found.`);
        return;
    }

    // Extract data from the row
    const title = row.querySelector('.title').textContent.trim();
    const releaseDate = row.querySelector('.releaseDate').textContent.trim();
    const genre = row.querySelector('.genre').textContent.trim();
    const platform = row.querySelector('.platform').textContent.trim();
    const avgRating = row.querySelector('.avgRating').textContent.trim();
    const copiesSold = row.querySelector('.copiesSold').textContent.trim();

    // Populate the form fields
    document.getElementById('updateGameID').value = gameID;
    document.getElementById('updateTitle').value = title;
    document.getElementById('updateReleaseDate').value = releaseDate;
    document.getElementById('updateGenre').value = genre;
    document.getElementById('updatePlatform').value = platform;
    document.getElementById('updateAvgRating').value = avgRating;
    document.getElementById('updateCopiesSold').value = copiesSold;


    // Show the update form
    showForm('update');
}

function deleteGame(gameID) {
    document.getElementById('deleteGameID').value = gameID;
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