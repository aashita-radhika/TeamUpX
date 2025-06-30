
const user = JSON.parse(localStorage.getItem("user"));
if (!user || !user.accessToken) {
    alert("Please log in to create your profile.");
    window.location.href = "../login/login.html";
}

document.getElementById("profileForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
        fullName: form.fullName.value,
        college: form.college.value,
        yearOfStudy: form.yearOfStudy.value,
        bio: form.bio.value,
        skills: form.skills.value.split(',').map(s => s.trim()),
        pastExperience: form.pastExperience.value,
        achievements: form.achievements.value,
        resume: form.resume.value,
        github: form.github.value,
        linkedIn: form.linkedIn.value
    };

    try {
        const res = await fetch("/api/profile/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.accessToken}`,
            },
            body: JSON.stringify(data)
        });

        if (!res.ok) throw new Error("Profile creation failed");
        const profile = await res.json();
        alert("Profile created!");
        window.location.href = "/homepage.html"; // or any page you want to go next
    } catch (err) {
        alert(err.message);
    }
});
