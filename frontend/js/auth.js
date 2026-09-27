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
        brooderManager: '/managerDash.html',
        admin: '/adminDash.html'
      };
      window.location.href = dashboardByRole[data.role] || '/';
    } catch (err) {
      alert(err.message);
    }
  });
}

const farmerRegForm = document.getElementById('farmerRegForm');
if (farmerRegForm) {
  // Fields that only apply to the Farmer role. Shown/hidden based on the
  // selected role, and stripped from the submitted body for other roles so
  // the frontend never sends fields the backend doesn't expect for that role.
  const farmerOnlyFieldGroups = [
    'ageField', 'genderField', 'farmerFAddressField',
    'ninField', 'farmerTypeField', 'recommenderNameField', 'recommenderNinField'
  ];
  const farmerOnlyFieldNames = [
    'age', 'gender', 'farmerFAddress', 'farmerFNIN',
    'farmerFType', 'farmerFRecommenderName', 'farmerFRecommenderNIN'
  ];

  const roleSelect = document.getElementById('userFRole');
  function toggleFarmerFields() {
    const isFarmer = roleSelect.value === 'Farmer';
    farmerOnlyFieldGroups.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = isFarmer ? '' : 'none';
    });
  }
  if (roleSelect) {
    roleSelect.addEventListener('change', toggleFarmerFields);
    toggleFarmerFields();
  }

  farmerRegForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(farmerRegForm);
    const body = Object.fromEntries(formData.entries());

    if (body.userFRole !== 'Farmer') {
      farmerOnlyFieldNames.forEach(name => delete body[name]);
    }

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
