$( document ).ready(function() {
    console.log( "ready!" );
    $('.cropBtn').attr('disabled', true);
    let rect;
    const cropInstance = [];
    let lock = false;
    const callback = function (id, value) {
        console.log("cropbox moved in from image# " + id);
        if (!lock) {
            lock = true;
            cropInstance.forEach(function (cropper, index) {
                if (index !== id) {
                    console.log("moving cropbox " + index);
                    // cropper.moveTo(value.x, value.y);
                    cropper.resizeTo(value.width, value.height);
                    cropper.moveTo(value.x, value.y);
                }
                if (cropInstance.length - 1 === index) lock = false;
            })
        }
    };
    let images = $(".large-image");
    for (let i = 0; i < images.length; i++) {
        let cropper = new Croppr(images[i], {
            startSize: [100, 100, 'px'],
            returnMode: "raw",
            onCropEnd: function (value) {
                console.log(value.x, value.y, value.width, value.height);
                let top = value.y;
                let right = value.x + value.width;
                let bottom = value.y + value.height;
                let left = value.x;
                let $clip = $('#clip');
                $clip.css('position', 'absolute');
                $clip.css('top', -1 * top);
                $clip.css('left', -1 * left);
                rect = 'rect(' + top + 'px, ' + right + 'px, ' + bottom + 'px, ' + left + 'px)';
                console.log(rect);
                $clip.css('clip', rect);
                callback(i, value)
            }
        });
        cropInstance.push(cropper);
    }
    
    // crop checkboxes -- gets's id of the enabled checkboxes
    let selected;
    $checkbox = $('.chk');
    $checkbox.click(checkArray(this, selected));
    // enable all crop checkboxes
    let clicked = false;
    $(".checkall").on("click", function () {
        ({ clicked, selected } = enableAllCropCheckBoxes(clicked, selected));
    });
            
    // crop button
    $("#cropBtn").click(function (e) {
        onCropButtonCLick(e, rect, selected);
    });
    // select images
    $checkbox = $('.checkhour');
    let ckArray = [];
    $checkbox.click(function() {
        checkArray1(ckArray);
    });
    
    // select all images using checkbox
    let click = false;
    $(".uncheck").on("click", function () {
        ({ click, ckArray } = selectAllImages(click, ckArray));
    });
    
    // gets id of the images to delete on delete button
    $("#deleteBtn").click(function (e) {
        deleteImages(e, ckArray);
    });
});

function checkArray(checkBox, selected) {
    let chkArray = [];
    $(".chk:checked").each(function () {
        chkArray.push($(checkBox).val());
    });
    selected = chkArray.join(',');
    /* check if there is selected checkboxes, by default the length is 1 as it contains one single comma */
    if (selected.length > 0) {
        document.getElementById(checkBox.id.replace('cb', 'bt')).disabled = false;
        console.log(chkArray);
    }
    else {
        document.getElementById(checkBox.id.replace('cb', 'bt')).disabled = true;
        console.log(chkArray);
    }
    return selected;
}

function enableAllCropCheckBoxes(clicked, selected) {
    $(".chk").prop("checked", !clicked);
    clicked = !clicked;
    let chkArray = [];
    $(".chk:checked").each(function () {
        chkArray.push($(this).val());
    });
    selected = chkArray.join(',');
    /* check if there is selected checkboxes, by default the length is 1 as it contains one single comma */
    if (selected.length > 0) {
        console.log("enable all crop buttons: " + chkArray);
        $('.cropBtn').attr('disabled', false);
    }
    else {
        console.log("disable all crop buttons: " + chkArray);
        $('.cropBtn').attr('disabled', true);
    }
    return { clicked, selected };
}

function onCropButtonCLick(e, rect, selected) {
    e.preventDefault();
    const data = { rect: rect };
    const data1 = { selected: selected };
    console.log(data);
    console.log(data1);
    $.ajax({
        type: "POST",
        url: window.location.href + "/cropImages",
        data: { data1: JSON.stringify(data1), data: JSON.stringify(data) },
        success: function (result) {
            location.href = window.location.href;
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function checkArray1(ckArray) {
    ckArray = $.map($checkbox, function (el) {
        if (el.checked) {
            return el.id;
        }
    });
    console.log(ckArray);
    document.getElementById("demo").innerHTML = ckArray;
    if (ckArray.length === 0) {
        document.getElementById("demo1").innerHTML = "No Image Selected";
    }
    if (ckArray.length === 1) {
        document.getElementById("demo1").innerHTML = "Are you sure you want to delete " + ckArray.length + " image?";
    }
    else {
        document.getElementById("demo1").innerHTML = "Are you sure you want to delete " + ckArray.length + " images?";
    }
    return ckArray;
}

function selectAllImages(click, ckArray) {
    $(".checkhour").prop("checked", !click);
    click = !click;
    ckArray = $.map($checkbox, function (el) {
        if (el.checked) {
            return el.id;
        }
    });
    console.log(ckArray);
    document.getElementById("demo").innerHTML = ckArray;
    if (ckArray.length === 1) {
        document.getElementById("demo1").innerHTML = "Are you sure you want to delete " + ckArray.length + " image?";
    }
    else {
        document.getElementById("demo1").innerHTML = "Are you sure you want to delete " + ckArray.length + " images?";
    }
    if (ckArray.length === 0) {
        document.getElementById("demo1").innerHTML = "No Image Selected";
    }
    return { click, ckArray };
}

function deleteImages(e, ckArray) {
    e.preventDefault();
    const data = { foo: ckArray };
    $.ajax({
        type: "POST",
        url: window.location.href + "/deleteImages",
        data: { images: JSON.stringify(ckArray) },
        success: function (result) {
            location.href = window.location.href;
            //                location.reload()
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function each(arr, callback) {
    let length = arr.length;
    let i;
    for (i = 0; i < length; i++) {
        callback.call(arr, arr[i], i, arr);
    }
    return arr;
}
