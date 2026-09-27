document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const section = this.getAttribute('data-section');
      document.querySelectorAll('.dashboard-section').forEach(s => s.classList.remove('active'));
      document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
      document.getElementById(section).classList.add('active');
      this.classList.add('active');
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

  // Add Stock Modal
  const addStockBtn = document.getElementById('addStockBtn');
  const addStockModal = new bootstrap.Modal(document.getElementById('addStockModal'));
  const addStockForm = document.getElementById('addStockForm');

  addStockBtn.addEventListener('click', function () {
    addStockModal.show();
  });

  addStockForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(addStockForm);
    const body = Object.fromEntries(formData.entries());

    try {
      await apiFetch('/api/manager/stock', {
        method: 'POST',
        body: JSON.stringify(body)
      });
      addStockModal.hide();
      addStockForm.reset();
      alert('Stock added');
      loadDashboard();
    } catch (err) {
      alert(err.message || 'Failed to add stock');
    }
  });

  const productForm = document.getElementById('productForm');
  productForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!validateProductForm()) return;

    const formData = new FormData(productForm);
    const body = Object.fromEntries(formData.entries());

    try {
      await apiFetch('/api/manager/products', {
        method: 'POST',
        body: JSON.stringify(body)
      });
      alert('Product added');
      productForm.reset();
    } catch (err) {
      alert(err.message);
    }
  });

  function validateProductForm() {
    let productName = document.getElementById('productName').value.trim();
    let productCategory = document.getElementById('productCategory').value.trim();
    let productPrice = document.getElementById('productPrice').value.trim();
    let productStock = document.getElementById('productStock').value.trim();
    let productDescription = document.getElementById('productDescription').value.trim();
    let productNameErr = document.getElementById('productNameErr');
    let productCategoryErr = document.getElementById('productCategoryErr');
    let productPriceErr = document.getElementById('productPriceErr');
    let productStockErr = document.getElementById('productStockErr');
    let productDescriptionErr = document.getElementById('productDescriptionErr');
    let errFlag = false;

    if (productName === '') {
      productNameErr.innerHTML = 'Enter Product!';
      errFlag = true;
    } else {
      productNameErr.innerHTML = '';
    }
    if (productCategory === '') {
      productCategoryErr.innerHTML = 'Select Product Category!';
      errFlag = true;
    } else {
      productCategoryErr.innerHTML = '';
    }
    if (productPrice === '') {
      productPriceErr.innerHTML = 'Price is Required!';
      errFlag = true;
    } else {
      productPriceErr.innerHTML = '';
    }
    if (productStock === '') {
      productStockErr.innerHTML = "Stock can't be empty!";
      errFlag = true;
    } else {
      productStockErr.innerHTML = '';
    }
    if (productDescription === '') {
      productDescriptionErr.innerHTML = 'Description is Required!';
      errFlag = true;
    } else {
      productDescriptionErr.innerHTML = '';
    }
    return !errFlag;
  }
});

let currentRequests = [];
let currentUsers = [];
let currentStockItems = [];

async function loadDashboard() {
  let data;
  try {
    data = await apiFetch('/api/manager/dashboard');
  } catch (err) {
    if (err.status === 401) {
      window.location.href = '/login.html';
      return;
    }
    alert(err.message);
    return;
  }

  document.getElementById('totalFarmers').textContent = data.totalFarmers || 0;
  document.getElementById('totalRequests').textContent = data.totalRequests || 0;
  document.getElementById('completedOrders').textContent = data.completedOrders || 0;
  document.getElementById('totalPayments').textContent = `${data.totalRevenue || 0} shs`;

  currentRequests = data.farmerRequests || [];
  currentUsers = data.users || [];
  currentStockItems = data.stockItems || [];

  renderRequestsTable(currentRequests);
  renderStockTable(currentStockItems);
  renderUsersTable(currentUsers);
  renderPaymentsTable(currentRequests);
  renderStockStats(currentStockItems);
  renderProductsList(currentStockItems);
}

function renderStockStats(stockItems) {
  const totalItems = stockItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const lowStock = stockItems.filter(item => item.quantity > 0 && item.quantity <= 50).length;
  const outOfStock = stockItems.filter(item => item.quantity === 0).length;

  document.getElementById('totalStockItems').textContent = totalItems;
  document.getElementById('lowStockAlert').textContent = lowStock;
  document.getElementById('outOfStockCount').textContent = outOfStock;
}

function renderRequestsTable(requests) {
  const tbody = document.getElementById('managerRequestsTable');
  if (requests.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9">No requests found</td></tr>';
    return;
  }

  tbody.innerHTML = requests.map(request => {
    const badgeClass = request.status === 'Pending' ? 'bg-warning'
      : request.status === 'Approved' ? 'bg-success'
      : 'bg-danger';

    const actions = request.status === 'Pending'
      ? `<button class="btn btn-sm btn-success" onclick="approveRequest('${request._id}')">Approve</button>
         <button class="btn btn-sm btn-danger" onclick="rejectRequest('${request._id}')">Reject</button>
         <button class="btn btn-sm btn-info" onclick="showRequestDetails('${request._id}')">Details</button>`
      : `<button class="btn btn-sm btn-info" onclick="showRequestDetails('${request._id}')">Details</button>`;

    return `
      <tr>
        <td>${request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'N/A'}</td>
        <td>${request._id.toString().slice(-6)}</td>
        <td>${request.farmerName}</td>
        <td>${request.typeChicks}</td>
        <td>${request.numChicks}</td>
        <td>${request.chickFeeds || '-'}</td>
        <td>${request.feedsQuantity || '-'}</td>
        <td><span class="badge ${badgeClass}">${request.status}</span></td>
        <td class="action-buttons">${actions}</td>
      </tr>
    `;
  }).join('');
}

function renderStockTable(stockItems) {
  const tbody = document.getElementById('manageStockTable');
  if (stockItems.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6">No stock items found</td></tr>';
    return;
  }

  tbody.innerHTML = stockItems.map(item => {
    const badgeClass = item.quantity > 50 ? 'bg-success' : 'bg-warning';
    const badgeText = item.quantity > 50 ? 'In-Stock' : 'Low Stock';
    return `
      <tr>
        <td>${item.chickType}</td>
        <td>${item.category}</td>
        <td>${item.quantity}</td>
        <td>-</td>
        <td>-</td>
        <td><span class="badge ${badgeClass}">${badgeText}</span></td>
      </tr>
    `;
  }).join('');
}

function renderUsersTable(users) {
  const tbody = document.getElementById('managerUsersTable');
  if (users.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7">No users found</td></tr>';
    return;
  }

  tbody.innerHTML = users.map(u => {
    const statusBadge = u.status === 'Suspended' ? 'bg-danger' : 'bg-success';
    const suspendBtn = u.status !== 'Suspended'
      ? `<button class="btn btn-sm btn-warning" onclick="suspendUser('${u._id}')">Suspend</button>`
      : '';
    return `
      <tr>
        <td>${u._id.toString().slice(-6)}</td>
        <td>${u.farmerFName}</td>
        <td><span class="badge bg-success">${u.userFRole}</span></td>
        <td>${u.farmerFEmail}</td>
        <td><span class="badge ${statusBadge}">${u.status || 'Active'}</span></td>
        <td>${u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Never'}</td>
        <td class="action-buttons">
          <button class="btn btn-sm btn-info" onclick="viewUser('${u._id}')">View</button>
          ${suspendBtn}
          <button class="btn btn-sm btn-danger" onclick="deleteUser('${u._id}')">Delete</button>
        </td>
      </tr>
    `;
  }).join('');
}

function approveRequest(id) {
  apiFetch(`/api/manager/requests/${id}/approve`, { method: 'POST' })
    .then(() => loadDashboard())
    .catch(err => alert(err.message || 'Failed to approve request'));
}

function rejectRequest(id) {
  apiFetch(`/api/manager/requests/${id}/reject`, { method: 'POST' })
    .then(() => loadDashboard())
    .catch(err => alert(err.message || 'Failed to reject request'));
}

function suspendUser(id) {
  apiFetch(`/api/manager/users/${id}/suspend`, { method: 'POST' })
    .then(() => loadDashboard())
    .catch(err => alert(err.message || 'Failed to suspend user'));
}

function deleteUser(id) {
  if (!confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
  apiFetch(`/api/manager/users/${id}`, { method: 'DELETE' })
    .then(() => loadDashboard())
    .catch(err => alert(err.message || 'Failed to delete user'));
}

function viewUser(id) {
  const u = currentUsers.find(user => user._id === id);
  if (!u) {
    alert('User not found');
    return;
  }
  alert(`User Details:\nName: ${u.farmerFName}\nEmail: ${u.farmerFEmail}\nRole: ${u.userFRole}\nStatus: ${u.status || 'Active'}\nJoined: ${u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}`);
}

function showRequestDetails(id) {
  const r = currentRequests.find(req => req._id === id);
  if (!r) {
    alert('Request not found');
    return;
  }
  alert(`Request Details:\nID: ${r._id.slice(-6)}\nFarmer: ${r.farmerName}\nChick Type: ${r.typeChicks}\nQuantity: ${r.numChicks}\nFeeds: ${r.chickFeeds || '-'}\nFeeds Quantity: ${r.feedsQuantity || '-'}\nStatus: ${r.status}\nNotes: ${r.notes || 'None'}`);
}

function requestCost(r) {
  return (r.numChicks || 0) * 2500 + (r.feedsQuantity || 0) * 5000;
}

function renderPaymentsTable(requests) {
  const tbody = document.getElementById('managerPaymentsTable');
  const payable = requests.filter(r => !['Cancelled', 'Rejected'].includes(r.status));

  if (payable.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8">No records found</td></tr>';
    return;
  }

  tbody.innerHTML = payable.map(r => {
    const isPaid = r.status === 'Completed';
    const statusBadge = isPaid ? 'bg-success' : 'bg-warning';
    const statusLabel = isPaid ? 'Paid' : 'Outstanding';
    const action = isPaid
      ? `<button class="btn btn-sm btn-primary" onclick="showReceipt('${r._id}')">Receipt</button>`
      : `<button class="btn btn-sm btn-info" onclick="followUp('${(r.farmerName || '').replace(/'/g, "\\'")}')">Follow Up</button>`;
    return `
      <tr>
        <td>${r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'N/A'}</td>
        <td>${r._id.toString().slice(-6)}</td>
        <td>${r.farmerName}</td>
        <td>${r._id.toString().slice(-6)}</td>
        <td>${(r.numChicks || 0) * 2500} shs</td>
        <td>${(r.feedsQuantity || 0) * 5000} shs</td>
        <td><span class="badge ${statusBadge} status-badge">${statusLabel}</span></td>
        <td>${action}</td>
      </tr>
    `;
  }).join('');
}

function followUp(farmerName) {
  const user = currentUsers.find(u => u.farmerFName === farmerName);
  if (!user || !user.farmerFNumber) {
    alert(`No stored phone number found for ${farmerName}.`);
    return;
  }
  window.location.href = `tel:${user.farmerFNumber}`;
}

function showReceipt(id) {
  const r = currentRequests.find(req => req._id === id);
  if (!r) {
    alert('Request not found');
    return;
  }
  const body = document.getElementById('receiptModalBody');
  body.innerHTML = `
    <p><strong>Receipt for Request ${r._id.slice(-6)}</strong></p>
    <p><strong>Farmer:</strong> ${r.farmerName}</p>
    <p><strong>Date:</strong> ${r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'N/A'}</p>
    <p><strong>Chick Type:</strong> ${r.typeChicks} (x${r.numChicks})</p>
    <p><strong>Feeds:</strong> ${r.chickFeeds || '-'} ${r.feedsQuantity ? `(x${r.feedsQuantity})` : ''}</p>
    <p><strong>Chicks Amount:</strong> ${(r.numChicks || 0) * 2500} shs</p>
    <p><strong>Feeds Amount:</strong> ${(r.feedsQuantity || 0) * 5000} shs</p>
    <p><strong>Total:</strong> ${requestCost(r)} shs</p>
    <p><strong>Status:</strong> Paid (Completed)</p>
  `;
  new bootstrap.Modal(document.getElementById('receiptModal')).show();
}

function renderProductsList(stockItems) {
  const container = document.getElementById('currentProductsList');
  if (stockItems.length === 0) {
    container.innerHTML = '<div class="list-group-item">No records found</div>';
    return;
  }

  container.innerHTML = stockItems.map(item => `
    <div class="list-group-item d-flex justify-content-between align-items-center">
      ${item.chickType} <span class="text-muted">(${item.category})</span>
      <div><span class="badge bg-primary rounded-pill me-2">Qty: ${item.quantity}</span><button class="btn btn-sm btn-outline-danger" onclick="removeStock('${item._id}')">Remove</button></div>
    </div>
  `).join('');
}

function removeStock(id) {
  if (!confirm('Remove this stock item? This cannot be undone.')) return;
  apiFetch(`/api/manager/stock/${id}`, { method: 'DELETE' })
    .then(() => loadDashboard())
    .catch(err => alert(err.message || 'Failed to remove stock item'));
}
