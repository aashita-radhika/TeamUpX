
async function fetchProfiles() {
  const userData = localStorage.getItem('user');
  if (!userData) {
    alert('You must be logged in to view profiles');
    window.location.href = '/login/login.html';
    return;
  }

  const token = JSON.parse(userData).accessToken;
  if (!token) {
    alert('Invalid token, please login again');
    window.location.href = '/login/login.html';
    return;
  }

  try {
    const res = await fetch('/api/profile/all', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    if (!res.ok) {
      throw new Error('Failed to fetch profiles');
    }

    const profiles = await res.json();
    const container = document.getElementById('profiles');

    if (profiles.length === 0) {
      container.innerHTML = '<p>No profiles found.</p>';
      return;
    }

    // Render summary cards
    container.innerHTML = profiles.map((profile, index) => `
      <div class="profile-card" data-index="${index}">
        <h3>${profile.fullName}</h3>
        <p><strong>Bio:</strong> ${profile.bio}</p>
        <p><strong>Skills:</strong> ${profile.skills.length ? profile.skills.join(', ') : 'N/A'}</p>
      </div>
    `).join('');

    // Add click event listeners to cards
    document.querySelectorAll('.profile-card').forEach(card => {
      card.addEventListener('click', () => {
        const i = card.getAttribute('data-index');
        showProfileModal(profiles[i]);
      });
    });

  } catch (error) {
    alert(error.message);
  }
}

function showProfileModal(profile) {
  const modal = document.getElementById('profileModal');
  const modalBody = document.getElementById('modalBody');

  modalBody.innerHTML = `
    <h2>${profile.fullName}</h2>
    <p><strong>College:</strong> ${profile.college || 'N/A'}</p>
    <p><strong>Bio:</strong> ${profile.bio || 'N/A'}</p>
    <p><strong>Year of Study:</strong> ${profile.yearOfStudy || 'N/A'}</p>
    <p><strong>Skills:</strong> ${profile.skills.length ? profile.skills.join(', ') : 'N/A'}</p>
    <p><strong>Past Experiences:</strong> ${profile.pastExperience || 'N/A'}</p>
    <p><strong>Achievements:</strong> ${profile.achievements || 'N/A'}</p>
    <p><strong>GitHub:</strong> ${profile.github ? `<a href="${profile.github}" target="_blank">${profile.github}</a>` : 'N/A'}</p>
    <p><strong>LinkedIn:</strong> ${profile.linkedIn ? `<a href="${profile.linkedIn}" target="_blank">${profile.linkedIn}</a>` : 'N/A'}</p>
    <p><strong>Resume:</strong> ${profile.resume ? `<a href="${profile.resume}" target="_blank">View Resume</a>` : 'N/A'}</p>
  `;

  modal.style.display = 'block';

  // Close modal on clicking the close button
  document.getElementById('modalClose').onclick = () => {
    modal.style.display = 'none';
  };

  // Close modal on clicking outside modal content
  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };
}

// Load profiles immediately on page load
fetchProfiles();

// Optional: refresh profiles every 10 seconds
setInterval(fetchProfiles, 10000);
