document.addEventListener("DOMContentLoaded", function() {
    const ctaButton = document.querySelector(".cta-main");

    ctaButton.addEventListener("click", function() {
        // alert("Redirecting to Find Teammates!");
        window.location.href = "/FindTeam/team.html";
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const userToken = localStorage.getItem("userToken");
    const signupButton = document.getElementById("signupButton");
    const navBar = document.getElementById("navbar");

    if (userToken) {
        // User is logged in, replace button with user icon
        signupButton.innerHTML = `<i class="fa-solid fa-user"></i>`;
        signupButton.href = "/register/register.html";  // You can make this go to a profile page
    }
});
