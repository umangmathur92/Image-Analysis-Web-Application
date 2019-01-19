$( document ).ready(function() {
    console.log( "ready!" );
    $('.cropBtn').attr('disabled', true);
});

function enableBtn(btnId, isEnabled) {
    document.getElementById(btnId).disabled = isEnabled;
}