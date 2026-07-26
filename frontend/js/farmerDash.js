document.addEventListener('DOMContentLoaded', function () {
  // Sidebar navigation - unchanged from the original inline script
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const section = this.getAttribute('data-section');

      document.querySelectorAll('.dashboard-section').forEach(s => {
        s.classList.remove('active');
      });
      document.querySelectorAll('.sidebar-link').forEach(l => {
        l.classList.remove('active');
      });

      document.getElementById(section).classList.add('active');
      this.classList.add('active');
    });
  });

  // Logout
  document.getElementById('logoutBtn').addEventListener('click', async function (e) {
    e.preventDefault();
    if (confirm('Are you sure you want to logout?')) {
      try {
        await apiFetch('/api/auth/logout', { method: 'POST' });
      } catch (err) {
        // ignore - we're navigating away regardless
      }
      window.location.href = '/login.html';
    }
  });

  loadDashboard();

  // Quick Request Modal
  const quickRequestBtn = document.getElementById('quickRequestBtn');
  const quickRequestModal = new bootstrap.Modal(document.getElementById('quickRequestModal'));
  const saveQuickRequestBtn = document.getElementById('saveQuickRequestBtn');

  quickRequestBtn.addEventListener('click', function () {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    document.getElementById('quickDeliveryDate').value = nextWeek.toISOString().split('T')[0];
    quickRequestModal.show();
  });

  saveQuickRequestBtn.addEventListener('click', async function (e) {
    e.preventDefault();

    const quickChickType = document.getElementById('quickChickType').value.trim();
    const quickQuantity = document.getElementById('quickQuantity').value.trim();
    const quickDeliveryDate = document.getElementById('quickDeliveryDate').value;

    if (!quickChickType || !quickQuantity || !quickDeliveryDate) {
      alert('Please fill in all fields!');
      return;
    }
    if (quickQuantity < 100 || quickQuantity > 500) {
      alert('Quantity must be between 100 and 500 chicks!');
      return;
    }

    try {
      await apiFetch('/api/farmer/quick-request', {
        method: 'POST',
        body: JSON.stringify({ quickChickType, quickQuantity, quickDeliveryDate })
      });
      quickRequestModal.hide();
      document.getElementById('quickRequestForm').reset();
      loadDashboard();
    } catch (err) {
      alert(err.message);
    }
  });

  // New Request form
  const newRequestForm = document.getElementById('newRequestForm');
  newRequestForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!validateRequestForm()) return;

    const formData = new FormData(newRequestForm);
    const body = Object.fromEntries(formData.entries());

    try {
      await apiFetch('/api/farmer/new-request', {
        method: 'POST',
        body: JSON.stringify(body)
      });
      alert('Request submitted successfully!');
      newRequestForm.reset();
      loadDashboard();
    } catch (err) {
      alert(err.message);
    }
  });

  function validateRequestForm() {
    let errFlag = false;

    let chickType = document.getElementById('chickType').value.trim();
    let chicksQuantity = document.getElementById('chicksQuantity').value.trim();
    let farmerType = document.getElementById('farmerType').value.trim();

    document.querySelectorAll('.showerr').forEach(err => err.innerText = '');

    if (chickType === "") {
      document.getElementById('chickTypeErr').innerText = "Please select chick type";
      errFlag = true;
    }
    if (chicksQuantity === "" || isNaN(chicksQuantity) || Number(chicksQuantity) < 100) {
      document.getElementById('chicksQuantityErr').innerText = "Enter valid number of chicks (minimum 100)";
      errFlag = true;
    }
    if (farmerType === "") {
      document.getElementById('farmerTypeErr').innerText = "Please select farmer type";
      errFlag = true;
    }

    return !errFlag;
  }

  // Profile form
  const editProfileBtn = document.getElementById('editProfileBtn');
  const profileForm = document.getElementById('profileForm');
  const profileInputs = profileForm.querySelectorAll('input');
  profileInputs.forEach(input => input.disabled = true);

  editProfileBtn.addEventListener('click', function () {
    const isEditing = !profileInputs[0].disabled;

    if (isEditing) {
      profileInputs.forEach(input => input.disabled = true);
      this.innerHTML = '<i class="bi bi-pencil me-1"></i>Edit Profile';
      this.className = 'btn btn-outline-primary btn-sm';
    } else {
      profileInputs.forEach(input => input.disabled = false);
      this.innerHTML = '<i class="bi bi-check me-1"></i>Save Changes';
      this.className = 'btn btn-success btn-sm';
    }
  });

  profileForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!validateProfileForm()) return;

    const formData = new FormData(profileForm);
    const body = Object.fromEntries(formData.entries());

    try {
      await apiFetch('/api/farmer/update-profile', {
        method: 'POST',
        body: JSON.stringify(body)
      });
      alert('Profile updated successfully!');
      loadDashboard();
    } catch (err) {
      alert(err.message);
    }
  });

  function validateProfileForm() {
    let errFlag = false;

    let fullName = document.getElementById("fullName").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let location = document.getElementById("location").value.trim();

    document.querySelectorAll('.showerr').forEach(err => err.innerHTML = '');

    if (fullName === "") {
      document.getElementById("fullNameErr").innerHTML = "Full name is required";
      errFlag = true;
    }
    if (email === "") {
      document.getElementById("emailErr").innerHTML = "Email is required";
      errFlag = true;
    }
    if (phone === "") {
      document.getElementById("phoneErr").innerHTML = "Phone number is required";
      errFlag = true;
    }
    if (location === "") {
      document.getElementById("locationErr").innerHTML = "Farm location is required";
      errFlag = true;
    }

    return !errFlag;
  }

  // Search / filter
  const requestSearch = document.getElementById('requestSearch');
  const statusFilter = document.getElementById('statusFilter');

  requestSearch.addEventListener('input', function () {
    filterRequests(this.value.toLowerCase(), statusFilter.value);
  });
  statusFilter.addEventListener('change', function () {
    filterRequests(requestSearch.value.toLowerCase(), this.value);
  });

  function filterRequests(searchTerm, statusFilterValue) {
    const requestRows = document.querySelectorAll('#farmerRequestsTable tr');
    requestRows.forEach(row => {
      if (row.cells.length < 8) return;

      const requestId = row.cells[1].textContent.toLowerCase();
      const chickType = row.cells[2].textContent.toLowerCase();
      const status = row.cells[6].textContent;

      const matchesSearch = requestId.includes(searchTerm) || chickType.includes(searchTerm);
      const matchesStatus = !statusFilterValue || status.includes(statusFilterValue);

      row.style.display = (matchesSearch && matchesStatus) ? '' : 'none';
    });
  }
});

async function loadDashboard() {
  let data;
  try {
    data = await apiFetch('/api/farmer/dashboard');
  } catch (err) {
    if (err.status === 401) {
      window.location.href = '/login.html';
      return;
    }
    alert(err.message);
    return;
  }

  document.getElementById('farmerName').textContent = data.user ? data.user.farmerFName : 'Farmer';
  document.getElementById('totalRequestsCount').textContent = data.totalRequests || 0;
  document.getElementById('pendingRequestsCount').textContent = data.pendingRequests || 0;
  document.getElementById('completedOrdersCount').textContent = data.completedOrders || 0;
  document.getElementById('totalSpentAmount').textContent = data.totalSpent || 0;

  document.getElementById('totalPaidAmount').textContent = `${data.totalPaid || 0} shs`;
  document.getElementById('pendingPaymentAmount').textContent = `${data.pendingPayment || 0} shs`;
  document.getElementById('nextDueAmount').textContent = `${data.nextDue || 0} shs`;

  document.getElementById('pendingDeliveriesCount').textContent = data.pendingDeliveries || 0;
  document.getElementById('inTransitCount').textContent = data.inTransit || 0;
  document.getElementById('deliveredCount').textContent = data.delivered || 0;
  document.getElementById('scheduledCount').textContent = data.scheduled || 0;

  if (data.user) {
    document.getElementById('profileName').textContent = data.user.farmerFName || 'Farmer Name';
    document.getElementById('profileEmail').textContent = data.user.farmerFEmail || 'email@example.com';
    document.getElementById('fullName').value = data.user.farmerFName || '';
    document.getElementById('email').value = data.user.farmerFEmail || '';
    document.getElementById('phone').value = data.user.farmerFNumber || '';
    document.getElementById('location').value = data.user.farmerFAddress || '';
  }

  const tbody = document.getElementById('farmerRequestsTable');
  const requests = data.chickRequests || [];

  if (requests.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8">No requests found</td></tr>';
    return;
  }

  tbody.innerHTML = requests.map(request => {
    const badgeClass = request.status === 'Pending' ? 'bg-warning'
      : request.status === 'Approved' ? 'bg-success'
      : request.status === 'Cancelled' ? 'bg-danger'
      : 'bg-info';

    const cancelBtn = request.status === 'Pending'
      ? `<button class="btn btn-sm btn-danger" onclick="cancelRequest('${request._id}')">Cancel</button>`
      : '';

    return `
      <tr>
        <td>${new Date(request.createdAt).toLocaleDateString()}</td>
        <td>${request._id.toString().slice(-6)}</td>
        <td>${request.typeChicks}</td>
        <td>${request.numChicks}</td>
        <td>-</td>
        <td>-</td>
        <td><span class="badge ${badgeClass}">${request.status}</span></td>
        <td class="action-buttons">
          <button class="btn btn-sm btn-info me-1" onclick="viewRequest('${request._id}')">View</button>
          ${cancelBtn}
        </td>
      </tr>
    `;
  }).join('');
}

function viewRequest(id) {
  apiFetch(`/api/farmer/requests/${id}`)
    .then(data => {
      alert(`Request Details:\nID: ${data._id.slice(-6)}\nType: ${data.typeChicks}\nQuantity: ${data.numChicks}\nStatus: ${data.status}\nNotes: ${data.notes || 'None'}`);
    })
    .catch(err => alert(err.message || 'Error fetching details'));
}

function cancelRequest(id) {
  if (confirm('Are you sure you want to cancel this request?')) {
    apiFetch(`/api/farmer/requests/${id}/cancel`, { method: 'POST' })
      .then(() => {
        alert('Request cancelled successfully');
        loadDashboard();
      })
      .catch(err => alert(err.message || 'Error cancelling request'));
  }
}
