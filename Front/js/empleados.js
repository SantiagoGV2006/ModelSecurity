/**
 * SecurityPQR System - Empleados Page JavaScript
 */

// Variables globales
let workersData = [];
let currentWorkerPage = 1;

// Get all workers
async function getAllWorkers() {
    try {
        showLoading();
        const data = await apiRequest(API_ENDPOINTS.WORKERS);
        workersData = data;
        renderWorkersTable(data);
        hideLoading();
    } catch (error) {
        console.error('Error fetching workers:', error);
        hideLoading();
    }
}

// Render workers table
function renderWorkersTable(workers, page = 1) {
    const tableBody = document.getElementById('workers-table');
    const pageSize = DEFAULT_PAGE_SIZE;
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, workers.length);
    const paginatedWorkers = workers.slice(startIndex, endIndex);
    
    tableBody.innerHTML = '';
    
    if (workers.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">No hay empleados registrados</td>
            </tr>
        `;
        return;
    }
    
    paginatedWorkers.forEach(worker => {
        const row = document.createElement('tr');
        
        // Create table cells
        row.innerHTML = `
            <td>${worker.workerId}</td>
            <td>${worker.firstName} ${worker.lastName}</td>
            <td>${worker.identityDocument}</td>
            <td>${worker.jobTitle}</td>
            <td>${worker.email}</td>
            <td>${worker.phone}</td>
            <td></td>
        `;
        
        // Add action buttons
        const actionsCell = row.cells[6];
        const actionButtons = createActionButtons({
            view: () => viewWorkerDetails(worker.workerId),
            edit: () => editWorker(worker.workerId),
            delete: () => confirmDeleteWorker(worker.workerId, `${worker.firstName} ${worker.lastName}`),
            custom: [
                {
                    icon: '<i class="fas fa-key"></i>',
                    title: 'Credenciales',
                    color: 'warning',
                    handler: () => manageWorkerLogin(worker.workerId, `${worker.firstName} ${worker.lastName}`)
                }
            ]
        });
        
        actionsCell.appendChild(actionButtons);
        tableBody.appendChild(row);
    });
    
    // Create pagination
    createPagination(
        workers.length,
        page,
        pageSize,
        'workers-pagination',
        (newPage) => {
            currentWorkerPage = newPage;
            renderWorkersTable(workers, newPage);
        }
    );
}

// View worker details
async function viewWorkerDetails(workerId) {
    try {
        showLoading();
        const worker = await apiRequest(API_ENDPOINTS.WORKER_BY_ID(workerId));
        
        // Populate modal with worker data (read-only)
        document.getElementById('workerModalTitle').textContent = 'Detalles del Empleado';
        document.getElementById('worker-id').value = worker.workerId;
        document.getElementById('worker-firstName').value = worker.firstName;
        document.getElementById('worker-lastName').value = worker.lastName;
        document.getElementById('worker-document').value = worker.identityDocument;
        document.getElementById('worker-jobTitle').value = worker.jobTitle;
        document.getElementById('worker-email').value = worker.email;
        document.getElementById('worker-phone').value = worker.phone;
        document.getElementById('worker-hireDate').value = formatDateForInput(worker.hireDate);
        
        // Make form fields read-only
        const formElements = document.querySelectorAll('#workerForm input, #workerForm select');
        formElements.forEach(element => {
            element.setAttribute('disabled', 'disabled');
        });
        
        // Hide save button
        document.getElementById('saveWorkerBtn').style.display = 'none';
        
        // Show modal
        const workerModal = new bootstrap.Modal(document.getElementById('workerModal'));
        workerModal.show();
        
        hideLoading();
    } catch (error) {
        console.error('Error fetching worker details:', error);
        hideLoading();
    }
}

// Edit worker
async function editWorker(workerId) {
    try {
        showLoading();
        const worker = await apiRequest(API_ENDPOINTS.WORKER_BY_ID(workerId));
        
        // Populate modal with worker data
        document.getElementById('workerModalTitle').textContent = 'Editar Empleado';
        document.getElementById('worker-id').value = worker.workerId;
        document.getElementById('worker-firstName').value = worker.firstName;
        document.getElementById('worker-lastName').value = worker.lastName;
        document.getElementById('worker-document').value = worker.identityDocument;
        document.getElementById('worker-jobTitle').value = worker.jobTitle;
        document.getElementById('worker-email').value = worker.email;
        document.getElementById('worker-phone').value = worker.phone;
        document.getElementById('worker-hireDate').value = formatDateForInput(worker.hireDate);
        
        // Enable form fields
        const formElements = document.querySelectorAll('#workerForm input, #workerForm select');
        formElements.forEach(element => {
            element.removeAttribute('disabled');
        });
        
        // Show save button
        document.getElementById('saveWorkerBtn').style.display = 'block';
        
        // Show modal
        const workerModal = new bootstrap.Modal(document.getElementById('workerModal'));
        workerModal.show();
        
        hideLoading();
    } catch (error) {
        console.error('Error fetching worker for edit:', error);
        hideLoading();
    }
}

// Add new worker
function addNewWorker() {
    // Reset form
    document.getElementById('workerForm').reset();
    document.getElementById('worker-id').value = '';
    
    // Set default values
    document.getElementById('worker-hireDate').value = formatDateForInput(new Date());
    
    // Set modal title
    document.getElementById('workerModalTitle').textContent = 'Agregar Empleado';
    
    // Enable form fields
    const formElements = document.querySelectorAll('#workerForm input, #workerForm select');
    formElements.forEach(element => {
        element.removeAttribute('disabled');
    });
    
    // Show save button
    document.getElementById('saveWorkerBtn').style.display = 'block';
    
    // Show modal
    const workerModal = new bootstrap.Modal(document.getElementById('workerModal'));
    workerModal.show();
}

// Save worker (create or update)
async function saveWorker() {
    try {
        showLoading();
        const workerId = document.getElementById('worker-id').value;
        const isUpdate = workerId !== '';
        
        // Collect form data
        const workerData = {
            firstName: document.getElementById('worker-firstName').value,
            lastName: document.getElementById('worker-lastName').value,
            identityDocument: document.getElementById('worker-document').value,
            jobTitle: document.getElementById('worker-jobTitle').value,
            email: document.getElementById('worker-email').value,
            phone: document.getElementById('worker-phone').value,
            hireDate: document.getElementById('worker-hireDate').value || null
        };
        
        if (isUpdate) {
            workerData.workerId = parseInt(workerId);
            await apiRequest(API_ENDPOINTS.WORKERS, 'PUT', workerData);
            showToast('Éxito', 'Empleado actualizado correctamente', 'success');
        } else {
            await apiRequest(API_ENDPOINTS.WORKERS, 'POST', workerData);
            showToast('Éxito', 'Empleado creado correctamente', 'success');
        }
        
        // Close modal
        const workerModal = bootstrap.Modal.getInstance(document.getElementById('workerModal'));
        workerModal.hide();
        
        // Refresh workers list
        await getAllWorkers();
        hideLoading();
    } catch (error) {
        console.error('Error saving worker:', error);
        hideLoading();
    }
}

// Manage worker login credentials
async function manageWorkerLogin(workerId, workerName) {
    try {
        showLoading();
        
        // Try to get existing login
        let workerLogin = null;
        const workerLogins = await apiRequest(API_ENDPOINTS.WORKER_LOGINS);
        workerLogin = workerLogins.find(login => login.workerId === workerId);
        
        // Populate modal with login data
        document.getElementById('workerLogin-workerId').value = workerId;
        
        if (workerLogin) {
            document.getElementById('workerLogin-id').value = workerLogin.id;
            document.getElementById('workerLogin-username').value = workerLogin.username;
            document.getElementById('workerLogin-password').value = workerLogin.password;
            document.getElementById('workerLogin-status').checked = workerLogin.status;
        } else {
            // New login
            document.getElementById('workerLogin-id').value = '';
            document.getElementById('workerLogin-username').value = '';
            document.getElementById('workerLogin-password').value = generateRandomPassword();
            document.getElementById('workerLogin-status').checked = true;
        }
        
        // Set up password toggle
        setupPasswordToggle('workerLogin-password', 'togglePasswordBtn');
        
        // Show modal
        const workerLoginModal = new bootstrap.Modal(document.getElementById('workerLoginModal'));
        workerLoginModal.show();
        
        hideLoading();
    } catch (error) {
        console.error('Error managing worker login:', error);
        hideLoading();
    }
}

// Save worker login
async function saveWorkerLogin() {
    try {
        showLoading();
        const loginId = document.getElementById('workerLogin-id').value;
        const isUpdate = loginId !== '';
        
        // Collect form data
        const loginData = {
            workerId: parseInt(document.getElementById('workerLogin-workerId').value),
            username: document.getElementById('workerLogin-username').value,
            password: document.getElementById('workerLogin-password').value,
            status: document.getElementById('workerLogin-status').checked
        };
        
        if (isUpdate) {
            loginData.id = parseInt(loginId);
            await apiRequest(API_ENDPOINTS.WORKER_LOGINS, 'PUT', loginData);
            showToast('Éxito', 'Credenciales actualizadas correctamente', 'success');
        } else {
            await apiRequest(API_ENDPOINTS.WORKER_LOGINS, 'POST', loginData);
            showToast('Éxito', 'Credenciales creadas correctamente', 'success');
        }
        
        // Close modal
        const workerLoginModal = bootstrap.Modal.getInstance(document.getElementById('workerLoginModal'));
        workerLoginModal.hide();
        hideLoading();
    } catch (error) {
        console.error('Error saving worker login:', error);
        hideLoading();
    }
}

// Confirm delete worker
function confirmDeleteWorker(workerId, workerName) {
    // Set up delete confirmation modal
    document.getElementById('delete-message').textContent = `¿Está seguro que desea eliminar el empleado ${workerName}?`;
    
    // Configure delete button
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    confirmDeleteBtn.onclick = async () => {
        await deleteWorker(workerId);
        
        // Close modal
        const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        deleteModal.hide();
    };
    
    // Show modal
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
}

// Delete worker
async function deleteWorker(workerId) {
    try {
        showLoading();
        await apiRequest(API_ENDPOINTS.WORKER_BY_ID(workerId), 'DELETE');
        
        showToast('Éxito', 'Empleado eliminado correctamente', 'success');
        
        // Refresh workers list
        await getAllWorkers();
        hideLoading();
    } catch (error) {
        console.error('Error deleting worker:', error);
        hideLoading();
    }
}

// Initialize worker page based on URL parameters
function initFromUrlParams() {
    const params = getUrlParams();
    
    if (params.action === 'new') {
        // Create new worker
        setTimeout(() => {
            addNewWorker();
        }, 500);
    } else if (params.action === 'view' && params.id) {
        // View worker details
        setTimeout(() => {
            viewWorkerDetails(params.id);
        }, 500);
    } else if (params.action === 'edit' && params.id) {
        // Edit worker
        setTimeout(() => {
            editWorker(params.id);
        }, 500);
    }
}

// Initialize workers page
function initWorkersPage() {
    // Check authentication
    if (!checkAuth()) return;
    
    // Set up event listeners
    document.getElementById('worker-add-btn').addEventListener('click', addNewWorker);
    document.getElementById('saveWorkerBtn').addEventListener('click', saveWorker);
    document.getElementById('saveWorkerLoginBtn').addEventListener('click', saveWorkerLogin);
    
    // Set up search functionality
    setupTableSearch('worker-search', 'workers-table', 1); // Search by name (column index 1)
    
    // Set up logout button
    initLogoutButton();
    
    // Load initial data
    getAllWorkers();
    
    // Initialize based on URL parameters
    initFromUrlParams();
}

// Initialize when document is ready
onDocumentReady(initWorkersPage);