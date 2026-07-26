// Wires the login and signup forms to the backend API.
// Client-side field validation (validateForm()) is defined inline on each
// page and left untouched — this file only handles the actual submission.

const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!validateForm()) return;

    const farmerFEmail = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const data = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ farmerFEmail, password })
      });

      const dashboardByRole = {
        farmer: '/farmerDash.html',
        salesRep: '/salesRepDash.html',
        brooderManager: '/managerDash.html'
      };
      window.location.href = dashboardByRole[data.role] || '/';
    } catch (err) {
      alert(err.message);
    }
  });
}

const farmerRegForm = document.getElementById('farmerRegForm');
if (farmerRegForm) {
  farmerRegForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(farmerRegForm);
    const body = Object.fromEntries(formData.entries());

    try {
      await apiFetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(body)
      });
      window.location.href = '/login.html';
    } catch (err) {
      alert(err.message);
    }
  });
}
