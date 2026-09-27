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

  const productForm = document.getElementById('productForm');
  productForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!validateProductForm()) return;

    const formData = new FormData(productForm);
    const body = Object.fromEntries(formData.entries());

    try {
      await apiFetch('/api/admin/products', {
        method: 'POST',
        body: JSON.stringify(body)
      });
      alert('Product added');
      productForm.reset();
      loadDashboard();
    } catch (err) {
      alert(err.message);
    }
  });

  function validateProductForm() {
    let productName = document.getElementById('productName').value.trim();
    let productCategory = document.getElementById('productCategory').value.trim();
    let productStock = document.getElementById('productStock').value.trim();
    let productNameErr = document.getElementById('productNameErr');
    let productCategoryErr = document.getElementById('productCategoryErr');
    let productStockErr = document.getElementById('productStockErr');
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
    if (productStock === '') {
      productStockErr.innerHTML = "Stock can't be empty!";
      errFlag = true;
    } else {
      productStockErr.innerHTML = '';
    }
    return !errFlag;
  }
});

async function loadDashboard() {
  let data;
  try {
    data = await apiFetch('/api/admin/dashboard');
  } catch (err) {
    if (err.status === 401) {
      window.location.href = '/login.html';
      return;
    }
    alert(err.message);
    return;
  }

  document.getElementById('totalFarmers').textContent = data.totalFarmers || 0;
  document.getElementById('totalSalesReps').textContent = data.totalSalesReps || 0;
  document.getElementById('totalBrooderManagers').textContent = data.totalBrooderManagers || 0;
  document.getElementById('totalRequests').textContent = data.totalRequests || 0;
  document.getElementById('completedOrders').textContent = data.completedOrders || 0;
  document.getElementById('totalPayments').textContent = `${data.totalRevenue || 0} shs`;
  document.getElementById('unreadMessages').textContent = data.unreadMessages || 0;

  renderUsersTable(data.users || []);
  renderRequestsTable(data.farmerRequests || []);
  renderStockTable(data.stockItems || []);
  renderMessagesTable(data.messages || []);
}

function renderUsersTable(users) {
  const tbody = document.getElementById('adminUsersTable');
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
        <td>${u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</td>
        <td class="action-buttons">
          ${suspendBtn}
          <button class="btn btn-sm btn-danger" onclick="deleteUser('${u._id}')">Delete</button>
        </td>
      </tr>
    `;
  }).join('');
}

function renderRequestsTable(requests) {
  const tbody = document.getElementById('adminRequestsTable');
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
         <button class="btn btn-sm btn-danger" onclick="rejectRequest('${request._id}')">Reject</button>`
      : '-';

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
  const tbody = document.getElementById('adminStockTable');
  if (stockItems.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4">No stock items found</td></tr>';
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
        <td><span class="badge ${badgeClass}">${badgeText}</span></td>
      </tr>
    `;
  }).join('');
}

function renderMessagesTable(messages) {
  const tbody = document.getElementById('adminMessagesTable');
  if (messages.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7">No messages found</td></tr>';
    return;
  }

  tbody.innerHTML = messages.map(m => {
    const statusBadge = m.status === 'Read' ? 'bg-secondary' : 'bg-success';
    const markReadBtn = m.status !== 'Read'
      ? `<button class="btn btn-sm btn-outline-secondary" onclick="markMessageRead('${m._id}')">Mark Read</button>`
      : '';
    return `
      <tr>
        <td>${m.createdAt ? new Date(m.createdAt).toLocaleDateString() : 'N/A'}</td>
        <td>${m.name}</td>
        <td>${m.email}</td>
        <td>${m.subject}</td>
        <td>${m.message}</td>
        <td><span class="badge ${statusBadge}">${m.status}</span></td>
        <td class="action-buttons">
          <button class="btn btn-sm btn-primary" onclick="window.location.href='mailto:${m.email}'">Reply</button>
          ${markReadBtn}
        </td>
      </tr>
    `;
  }).join('');
}

function approveRequest(id) {
  apiFetch(`/api/admin/requests/${id}/approve`, { method: 'POST' })
    .then(() => loadDashboard())
    .catch(err => alert(err.message || 'Failed to approve request'));
}

function rejectRequest(id) {
  apiFetch(`/api/admin/requests/${id}/reject`, { method: 'POST' })
    .then(() => loadDashboard())
    .catch(err => alert(err.message || 'Failed to reject request'));
}

function suspendUser(id) {
  apiFetch(`/api/admin/users/${id}/suspend`, { method: 'POST' })
    .then(() => loadDashboard())
    .catch(err => alert(err.message || 'Failed to suspend user'));
}

function deleteUser(id) {
  if (!confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
  apiFetch(`/api/admin/users/${id}`, { method: 'DELETE' })
    .then(() => loadDashboard())
    .catch(err => alert(err.message || 'Failed to delete user'));
}

function markMessageRead(id) {
  apiFetch(`/api/contact/${id}/read`, { method: 'POST' })
    .then(() => loadDashboard())
    .catch(err => alert(err.message || 'Failed to mark message read'));
}
