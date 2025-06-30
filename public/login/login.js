// document.getElementById('loginForm').addEventListener('submit', async (e) => {
//     e.preventDefault();

//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;

//     const res = await fetch('/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password })
//     });

//     const data = await res.json();
//     if (res.ok) {
//         alert('Login successful');
//         window.location.href = '/profile/profile.html';
//     } else {
//         alert(data.message || 'Login failed');
//     }
// });


document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
        // Save the entire user object including token
        localStorage.setItem('user', JSON.stringify(data));

        // alert('Login successful');
        window.location.href = '/homepage.html'; // Redirect to profile creation page
    } else {
        alert(data.message || 'Login failed');
    }
});
