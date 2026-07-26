document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
      document.querySelectorAll('.dashboard-section').forEach(s => s.classList.remove('active'));
      this.classList.add('active');
      document.getElementById(this.getAttribute('data-section')).classList.add('active');
    });
  });

  document.getElementById('logoutBtn').addEventListener('click', async function (e) {
    e.preventDefault();
    if (confirm('Are you sure you want to logout?')) {
      try {
        await apiFetch('/api/auth/logout', { method: 'POST' });
      } catch (err) {
        // ignore - navigating away regardless
      }
      window.location.href = '/login.html';
    }
  });

  loadDashboard();

  // Add Client Modal
  const addClientBtn = document.getElementById('addClientBtn');
  const addClientModal = new bootstrap.Modal(document.getElementById('addClientModal'));
  const addClientForm = document.getElementById('addClientForm');

  addClientBtn.addEventListener('click', function () {
    addClientModal.show();
  });

  addClientForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(addClientForm);
    const body = Object.fromEntries(formData.entries());

    try {
      await apiFetch('/api/sales/clients', {
        method: 'POST',
        body: JSON.stringify(body)
      });
      addClientModal.hide();
      addClientForm.reset();
      alert('Client added successfully!');
      loadDashboard();
    } catch (err) {
      alert(err.message);
    }
  });

  // Search / filter clients
  const clientSearch = document.getElementById('clientSearch');
  const statusFilter = document.getElementById('statusFilter');

  clientSearch.addEventListener('input', function () {
    filterClients(this.value.toLowerCase(), statusFilter.value);
  });
  statusFilter.addEventListener('change', function () {
    filterClients(clientSearch.value.toLowerCase(), this.value);
  });

  function filterClients(searchTerm, statusFilterValue) {
    document.querySelectorAll('#clients .client-card').forEach(card => {
      const farmName = card.querySelector('h5').textContent.toLowerCase();
      const email = card.querySelectorAll('p')[0].textContent.toLowerCase();
      const phone = card.querySelectorAll('p')[1].textContent.toLowerCase();
      const status = card.querySelector('.badge').textContent;

      const matchesSearch = farmName.includes(searchTerm) || email.includes(searchTerm) || phone.includes(searchTerm);
      const matchesStatus = !statusFilterValue || status === statusFilterValue;

      card.closest('.col-md-4').style.display = (matchesSearch && matchesStatus) ? 'block' : 'none';
    });
  }

  // New Lead form
  const leadForm = document.getElementById('leadForm');
  leadForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!validateLeadForm()) return;

    const formData = new FormData(leadForm);
    const body = Object.fromEntries(formData.entries());

    try {
      await apiFetch('/api/sales/leads', {
        method: 'POST',
        body: JSON.stringify(body)
      });
      alert('New lead added successfully!');
      leadForm.reset();
      loadDashboard();
    } catch (err) {
      alert(err.message);
    }
  });

  function validateLeadForm() {
    let farmName = document.getElementById('farmName').value.trim();
    let ownerName = document.getElementById('ownerName').value.trim();
    let phoneNumber = document.getElementById('phoneNumber').value.trim();
    let leadSource = document.getElementById('leadSource').value.trim();
    let farmNameErr = document.getElementById('farmNameErr');
    let ownerNameErr = document.getElementById('ownerNameErr');
    let phoneNumberErr = document.getElementById('phoneNumberErr');
    let leadSourceErr = document.getElementById('leadSourceErr');
    let errFlag = false;

    if (farmName === '') {
      farmNameErr.innerHTML = 'Farm name is required!';
      errFlag = true;
    } else {
      farmNameErr.innerHTML = '';
    }
    if (ownerName === '') {
      ownerNameErr.innerHTML = 'Owner name is required!';
      errFlag = true;
    } else {
      ownerNameErr.innerHTML = '';
    }
    if (phoneNumber === '') {
      phoneNumberErr.innerHTML = 'Phone number is required!';
      errFlag = true;
    } else {
      phoneNumberErr.innerHTML = '';
    }
    if (leadSource === '') {
      leadSourceErr.innerHTML = 'Please select lead source!';
      errFlag = true;
    } else {
      leadSourceErr.innerHTML = '';
    }
    return !errFlag;
  }
});

async function loadDashboard() {
  let data;
  try {
    data = await apiFetch('/api/sales/dashboard');
  } catch (err) {
    if (err.status === 401) {
      window.location.href = '/login.html';
      return;
    }
    alert(err.message);
    return;
  }

  document.getElementById('totalSales').textContent = `${data.totalSales || 0} shs`;
  document.getElementById('totalClients').textContent = data.totalClients || 0;
  document.getElementById('newLeadsCount').textContent = data.newLeadsCount || 0;

  renderClients(data.clients || []);
  renderOrders(data.orders || []);
  renderLeads(data.leads || []);
}

function renderClients(clients) {
  const container = document.getElementById('clientsList');
  if (clients.length === 0) {
    container.innerHTML = '<div class="col-12"><p>No clients found.</p></div>';
    return;
  }

  container.innerHTML = clients.map(client => `
    <div class="col-md-4 mb-3">
      <div class="client-card">
        <h5 class="mb-2">${client.farmerFAddress || client.farmerFName}</h5>
        <p class="text-muted mb-1">${client.farmerFEmail}</p>
        <p class="text-muted mb-2">${client.farmerFNumber}</p>
        <div class="d-flex justify-content-between align-items-center">
          <span class="badge bg-success">${client.status || 'Active'}</span>
        </div>
        <div class="mt-3">
          <button class="btn btn-sm btn-primary me-2">Contact</button>
          <button class="btn btn-sm btn-outline-info">History</button>
        </div>
      </div>
    </div>
  `).join('');
}

function renderOrders(orders) {
  const tbody = document.getElementById('ordersTable');
  if (orders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6">No orders found</td></tr>';
    return;
  }

  tbody.innerHTML = orders.map(order => {
    const badgeClass = order.status === 'Pending' ? 'bg-warning'
      : order.status === 'Approved' ? 'bg-success'
      : 'bg-danger';
    return `
      <tr>
        <td>${order._id.toString().slice(-6)}</td>
        <td>${order.farmerName}</td>
        <td>${order.typeChicks}</td>
        <td>${order.numChicks}</td>
        <td><span class="badge ${badgeClass}">${order.status}</span></td>
        <td><button class="btn btn-sm btn-info">View</button></td>
      </tr>
    `;
  }).join('');
}

function renderLeads(leads) {
  const tbody = document.getElementById('leadsTable');
  if (leads.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6">No leads found</td></tr>';
    return;
  }

  tbody.innerHTML = leads.map(lead => `
    <tr>
      <td>${lead.farmName}</td>
      <td>${lead.ownerName}</td>
      <td>${lead.phoneNumber}</td>
      <td>${lead.leadSource}</td>
      <td><span class="badge bg-primary">${lead.status}</span></td>
      <td>
        <button class="btn btn-sm btn-success me-1" type="button"><i class="bi bi-telephone"></i> Call</button>
        <button class="btn btn-sm btn-primary" type="button" onclick="convertLead('${lead._id}')"><i class="bi bi-arrow-up-circle"></i> Convert</button>
      </td>
    </tr>
  `).join('');
}

function convertLead(id) {
  apiFetch(`/api/sales/leads/${id}/convert`, { method: 'POST' })
    .then(() => loadDashboard())
    .catch(err => alert(err.message || 'Failed to convert lead'));
}
