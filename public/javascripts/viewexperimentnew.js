let selectedImageIds = new Set();
let selectedImageTopCheckBoxIds = new Set();

$( document ).ready(function() {
    console.log( "ready!" );
    //Disable all crop buttons on page load
    $('.cropBtn').prop('disabled', true);
    //Click listener for class 'checkboxImageTop'
    $('.checkboxImageTop').click(function () {
        let clickedCheckBox = this;
        let checkBoxId = clickedCheckBox.id;
        updateSelectedItems(checkBoxId);
    });
    //Click listener for 'Select All' button
    $('#btnSelectAll').click(function () {
        checkAllImageTopCheckBoxes(true);
    });
    //Click listener for 'Unselect All' button
    $('#btnUnselectAll').click(function () {
        checkAllImageTopCheckBoxes(false);
    });
});

function checkAllImageTopCheckBoxes(isChecked) {
    let allImageTopCheckBoxesList = document.querySelectorAll('.checkboxImageTop');
    for (i = 0; i < allImageTopCheckBoxesList.length; i++) {
        let checkBoxId  = allImageTopCheckBoxesList[i].id;
        $('#'+checkBoxId).prop('checked', isChecked);
        updateSelectedItems(checkBoxId);
    }
}

function updateSelectedItems(clickedCheckBoxId) {
    let imageId = clickedCheckBoxId.replace('cbIt', '');
    let isChecked = $('#'+clickedCheckBoxId).is(':checked'); 
    console.log(isChecked);
    if(isChecked) {
        selectedImageIds.add(imageId);
        selectedImageTopCheckBoxIds.add(clickedCheckBoxId);
    } else {
        selectedImageIds.delete(imageId);
        selectedImageTopCheckBoxIds.delete(clickedCheckBoxId);
    }
    console.log(selectedImageIds);
}