function showForm(action) {
    document.getElementById('browse').style.display = (action === 'browse') ? 'block' : 'none';
    document.getElementById('insert').style.display = (action === 'insert') ? 'block' : 'none';
    document.getElementById('update').style.display = (action === 'update') ? 'block' : 'none';
    document.getElementById('delete').style.display = (action === 'delete') ? 'block' : 'none';
}

function newReview() { 
    showForm('insert'); 
}

function updateReview(reviewID) {
    // Select the row using the data-id attribute
    const row = document.querySelector(`tr[data-id="${reviewID}"]`);

    // Ensure the row exists before trying to access its data
    if (!row) {
        console.error(`Row with reviewID ${reviewID} not found.`);
        return;
    }

    // Extract data from the row
    const rating = row.querySelector('.rating').textContent.trim();
    const comment = row.querySelector('.comment').textContent.trim();

    // Populate the form fields
    document.getElementById('updateReviewID').value = reviewID;
    document.getElementById('updateRating').value = rating;
    document.getElementById('updateComment').value = comment;

    // Show the update form
    showForm('update');
}

function deleteReview(reviewID) {
    document.getElementById('deleteReviewID').value = reviewID;
    showForm('delete');
}

window.onload = function () {
    showForm('browse');
};