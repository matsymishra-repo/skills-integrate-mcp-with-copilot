document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");
  const adminButton = document.getElementById("admin-button");
  const logoutButton = document.getElementById("logout-button");
  const adminStatus = document.getElementById("admin-status");
  const adminContainer = document.getElementById("admin-container");
  const adminForm = document.getElementById("admin-form");
  const adminNote = document.getElementById("admin-note");
  const emailInput = document.getElementById("email");

  let adminToken = loadAdminToken();
  let adminUsername = null;

  function saveAdminToken(token) {
    localStorage.setItem("adminToken", token);
    adminToken = token;
  }

  function loadAdminToken() {
    return localStorage.getItem("adminToken");
  }

  function clearAdminToken() {
    localStorage.removeItem("adminToken");
    adminToken = null;
    adminUsername = null;
  }

  function showMessage(text, type = "info") {
    messageDiv.textContent = text;
    messageDiv.className = type;
    messageDiv.classList.remove("hidden");

    setTimeout(() => {
      messageDiv.classList.add("hidden");
    }, 5000);
  }

  function updateAdminUI() {
    const loggedIn = !!adminToken && !!adminUsername;
    if (loggedIn) {
      adminButton.classList.add("hidden");
      logoutButton.classList.remove("hidden");
      adminStatus.textContent = `Logged in as ${adminUsername}`;
      adminStatus.classList.remove("hidden");
      adminContainer.classList.add("hidden");
      signupForm.querySelector("button[type=submit]").disabled = false;
      activitySelect.disabled = false;
      emailInput.disabled = false;
      adminNote.textContent = "Teacher login is active. You may register or unregister students.";
    } else {
      adminButton.classList.remove("hidden");
      logoutButton.classList.add("hidden");
      adminStatus.classList.add("hidden");
      signupForm.querySelector("button[type=submit]").disabled = true;
      activitySelect.disabled = true;
      emailInput.disabled = true;
      adminNote.textContent = "Teacher login is required to register or unregister students. Use the button above.";
    }
  }

  async function checkAdminStatus() {
    adminToken = loadAdminToken();
    if (!adminToken) {
      adminUsername = null;
      updateAdminUI();
      return;
    }

    try {
      const response = await fetch("/admin/me", {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      if (!response.ok) {
        clearAdminToken();
        updateAdminUI();
        return;
      }

      const data = await response.json();
      adminUsername = data.username;
      updateAdminUI();
    } catch (error) {
      clearAdminToken();
      updateAdminUI();
      console.error("Unable to verify admin status:", error);
    }
  }

  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      activitiesList.innerHTML = "";
      activitySelect.innerHTML = "<option value=\"\">-- Select an activity --</option>";

      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const spotsLeft = details.max_participants - details.participants.length;

        const participantsHTML =
          details.participants.length > 0
            ? `<div class="participants-section">
                <h5>Participants:</h5>
                <ul class="participants-list">
                  ${details.participants
                    .map(
                      (email) =>
                        `<li><span class="participant-email">${email}</span>${adminToken ? `<button class="delete-btn" data-activity="${name}" data-email="${email}">❌</button>` : ""}</li>`
                    )
                    .join("")}
                </ul>
              </div>`
            : `<p><em>No participants yet</em></p>`;

        activityCard.innerHTML = `
          <h4>${name}</h4>
          <p>${details.description}</p>
          <p><strong>Schedule:</strong> ${details.schedule}</p>
          <p><strong>Availability:</strong> ${spotsLeft} spots left</p>
          <div class="participants-container">
            ${participantsHTML}
          </div>
        `;

        activitiesList.appendChild(activityCard);

        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });

      document.querySelectorAll(".delete-btn").forEach((button) => {
        button.addEventListener("click", handleUnregister);
      });
    } catch (error) {
      activitiesList.innerHTML =
        "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  async function handleUnregister(event) {
    event.preventDefault();
    const button = event.target;
    const activity = button.getAttribute("data-activity");
    const email = button.getAttribute("data-email");

    if (!adminToken) {
      showMessage("Teacher login is required to unregister a student.", "error");
      return;
    }

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/unregister?email=${encodeURIComponent(email)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      const result = await response.json();
      if (response.ok) {
        showMessage(result.message, "success");
        fetchActivities();
      } else {
        if (response.status === 401) {
          clearAdminToken();
          updateAdminUI();
        }
        showMessage(result.detail || "An error occurred", "error");
      }
    } catch (error) {
      showMessage("Failed to unregister. Please try again.", "error");
      console.error("Error unregistering:", error);
    }
  }

  async function handleSignup(event) {
    event.preventDefault();

    if (!adminToken) {
      showMessage("Teacher login is required to sign up a student.", "error");
      return;
    }

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      const result = await response.json();
      if (response.ok) {
        showMessage(result.message, "success");
        signupForm.reset();
        fetchActivities();
      } else {
        if (response.status === 401) {
          clearAdminToken();
          updateAdminUI();
        }
        showMessage(result.detail || "An error occurred", "error");
      }
    } catch (error) {
      showMessage("Failed to sign up. Please try again.", "error");
      console.error("Error signing up:", error);
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById("admin-username").value;
    const password = document.getElementById("admin-password").value;

    try {
      const response = await fetch("/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();
      if (response.ok) {
        saveAdminToken(result.token);
        adminUsername = result.username;
        updateAdminUI();
        fetchActivities();
        showMessage("Teacher login successful!", "success");
      } else {
        showMessage(result.detail || "Invalid login credentials", "error");
      }
    } catch (error) {
      showMessage("Login failed. Please try again.", "error");
      console.error("Error during login:", error);
    }
  }

  async function handleLogout() {
    if (!adminToken) {
      clearAdminToken();
      updateAdminUI();
      return;
    }

    try {
      await fetch("/admin/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: adminToken }),
      });
    } catch (error) {
      console.error("Error during logout:", error);
    }

    clearAdminToken();
    updateAdminUI();
    fetchActivities();
    showMessage("Teacher has been logged out.", "info");
  }

  adminButton.addEventListener("click", () => {
    adminContainer.classList.toggle("hidden");
  });

  adminForm.addEventListener("submit", handleLogin);
  signupForm.addEventListener("submit", handleSignup);
  logoutButton.addEventListener("click", handleLogout);

  checkAdminStatus().then(fetchActivities);
});
