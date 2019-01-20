//IDs of all selected(ticked) checkboxes above each image(Check Box Image Top).
//Example: cbIt1, cbIt2, cbIt3
let selectedImageTopCheckBoxIds = new Set(); 
//IDs of all images for whom the checkbox above image is selected(ticked)
//Example: 1, 2, 3, 4 (The values of this set correspond to the set of 'selectedImageTopCheckBoxIds')
let selectedImageIds = new Set(); 

//IDs of all selected toggle buttons below each image(toggle button is actually a checkbox with CSS)
//Example: cbToggle1, cbToggle2, cbToggle3
let selectedImagesCropToggleCheckBoxIds = new Set(); 
//IDs of all images for whom the crop toggle button is Selected(True). i.e, the images which have been selected for cropping
//Example: 1, 2, 3, 4 (The values of this set correspond to the set of 'selectedImagesCropToggleCheckBoxIds')
let selectedImagesForCroppingIds = new Set(); 

//TODO: 4 sets are being maintained above. This number can be reduced to 2.

$( document ).ready(function() {
    // Disable all crop buttons on page load
    $('.cropBtn').prop('disabled', true);
    // Click listener for class 'checkboxImageTop'
    $('.checkboxImageTop').click(function () {
        let clickedCheckBox = this;
        let checkBoxId = clickedCheckBox.id;
        updateSelectedItems(checkBoxId);
    });
    // Click listener for 'Crop' button beneath each image
    $('.checkBoxToggleCrop').click(function () {
        let clickedToggleCheckBox = this;
        let toggleCheckBoxId = clickedToggleCheckBox.id;
        let cropButtonId = toggleCheckBoxId.replace('cbToggle', 'btnCrop');
        toggleCropButtonEnablement(toggleCheckBoxId, cropButtonId);
    });
    // Click listener for 'Select All' button
    $('#btnSelectAll').click(function () {
        checkAllImageTopCheckBoxes(true);
    });
    // Click listener for 'Unselect All' button
    $('#btnUnselectAll').click(function () {
        checkAllImageTopCheckBoxes(false);
    });
    $('#btnEnableCrop').click(function () {
        enableAllCropButtons(true);
    });
    $('#btnDisableCrop').click(function () {
        enableAllCropButtons(false);
    });
    $("#deleteBtn").click(function (e) {
        deleteImages(e);
    });
    $('.cropBtn').click(function() {
        let imageIdArray = Array.from(selectedImagesForCroppingIds);
        window.alert('Fire event here !!' + '\nIDs of images to be cropped are: ' + imageIdArray);
    });
});

function enableAllCropButtons(isCropEnabled) {
    $('.checkBoxToggleCrop').prop('checked', isCropEnabled);
    $('.cropBtn').attr('disabled', !isCropEnabled);
    if(isCropEnabled) {
        let allcheckBoxToggleCropList = document.querySelectorAll('.checkBoxToggleCrop');
        for (i = 0; i < allcheckBoxToggleCropList.length; i++) {
            let toggleCheckBoxId  = allcheckBoxToggleCropList[i].id;
            let imageId = toggleCheckBoxId.replace('cbToggle', '');
            selectedImagesCropToggleCheckBoxIds.add(toggleCheckBoxId);
            selectedImagesForCroppingIds.add(imageId);
        }
    } else {
        selectedImagesCropToggleCheckBoxIds.clear();
        selectedImagesForCroppingIds.clear();
    } 
}

function checkAllImageTopCheckBoxes(isChecked) {
    let allImageTopCheckBoxesList = document.querySelectorAll('.checkboxImageTop');
    for (i = 0; i < allImageTopCheckBoxesList.length; i++) {
        let checkBoxId  = allImageTopCheckBoxesList[i].id;
        $('#'+checkBoxId).prop('checked', isChecked);
        updateSelectedItems(checkBoxId);
    }
}

function toggleCropButtonEnablement(toggleCheckBoxId, cropButtonId) {
    let imageId = toggleCheckBoxId.replace('cbToggle', '');
    let isChecked = $('#'+toggleCheckBoxId).is(':checked'); 
    $('#'+cropButtonId).prop("disabled", isChecked ? false : true);
    if(isChecked) {
        selectedImagesCropToggleCheckBoxIds.add(toggleCheckBoxId);
        selectedImagesForCroppingIds.add(imageId);
    } else {
        selectedImagesCropToggleCheckBoxIds.delete(toggleCheckBoxId);
        selectedImagesForCroppingIds.delete(imageId);
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
    let imageIdArray = Array.from(selectedImageIds);
    $("#demo").text(imageIdArray);
    $("#demo1").text("Are you sure you want to delete " + imageIdArray.length + " image(s) ?");
    if (imageIdArray.length === 0) {
        $("#demo1").text("No Image Selected");
    }
}

function deleteImages(e) {
    e.preventDefault();
    let imageIdArray = Array.from(selectedImageIds);
    const data = { foo: imageIdArray };
    $.ajax({
        type: "POST",
        url: window.location.href + "/deleteImages",
        data: { images: JSON.stringify(imageIdArray) },
        success: function (result) {
            location.href = window.location.href;
            //                location.reload()
        },
        error: function (err) {
            console.log(err);
        }
    });
}