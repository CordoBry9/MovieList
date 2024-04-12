    // Display the message the user generated
function displayMessage() {

    // var is global to this scope 
    // let is more tightly defined in scope, chat gpt this

    let inputBox = document.getElementById('message');
    let message = inputBox.value;

    Swal.fire({
        title: "App Name", //change to actual app name
        text: message,
        icon: "success",
        backdrop: false,
      });
}

