/**
 * SecurityPQR System - PQRs Page JavaScript
 */

// Variables globales
let pqrsData = [];
let currentPqrPage = 1;

// Get all PQRs
async function getAllPqrs() {
    try {
        showLoading();
        const data = await apiRequest(API_ENDPOINTS.PQRS);
        pqrsData = data;
        renderPqrsTable(data);
        hideLoading();
    } catch (error) {
        console.error('Error fetching PQRs:', error);
        hideLoading();
    }
}

// Render PQRs table
function renderPqrsTable(pqrs, page = 1) {
    const tableBody = document.getElementById('pqrs-table');
    const pageSize = DEFAULT_PAGE_SIZE;
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, pqrs.length);
    const paginatedPqrs = pqrs.slice(startIndex, endIndex);
    
    tableBody.innerHTML = '';
    
    if (pqrs.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">No hay PQRs registrados</td>
            </tr>
        `;
        return;
    }
    
    paginatedPqrs.forEach(pqr => {
        const row = document.createElement('tr');
        
        // Create table cells
        row.innerHTML = `
            <td>${pqr.pqrId}</td>
            <td>${pqr.pqrType}</td>
            <td>${pqr.clientName || 'Cliente ' + pqr.clientId}</td>
            <td>${pqr.workerName || 'Empleado ' + pqr.workerId}</td>
            <td></td>
            <td>${formatDate(pqr.creationDate)}</td>
            <td></td>
        `;
        
        // Add status badge
        const statusCell = row.cells[4];
        statusCell.appendChild(createStatusBadge(pqr.pqrStatus));
        
        // Add action buttons
        const actionsCell = row.cells[6];
        const actionButtons = createActionButtons({
            view: () => viewPqrDetails(pqr.pqrId),
            edit: () => editPqr(pqr.pqrId),
            delete: () => confirmDeletePqr(pqr.pqrId, pqr.pqrType)
        });
        
        actionsCell.appendChild(actionButtons);
        tableBody.appendChild(row);
    });
    
    // Create pagination
    createPagination(
        pqrs.length,
        page,
        pageSize,
        'pqrs-pagination',
        (newPage) => {
            currentPqrPage = newPage;
            renderPqrsTable(pqrs, newPage);
        }
    );
}

// Filter PQRs by status
function filterPqrsByStatus(status) {
    const filteredPqrs = status 
        ? pqrsData.filter(pqr => pqr.pqrStatus === status)
        : pqrsData;
    
    renderPqrsTable(filteredPqrs, 1);
}

// View PQR details
async function viewPqrDetails(pqrId) {
    try {
        showLoading();
        const pqr = await apiRequest(API_ENDPOINTS.PQR_BY_ID(pqrId));
        
        // Populate modal with PQR data (read-only)
        document.getElementById('pqrModalTitle').textContent = 'Detalles del PQR';
        document.getElementById('pqr-id').value = pqr.pqrId;
        document.getElementById('pqr-type').value = pqr.pqrType;
        document.getElementById('pqr-status').value = pqr.pqrStatus;
        document.getElementById('pqr-clientId').value = pqr.clientId;
        document.getElementById('pqr-workerId').value = pqr.workerId;
        document.getElementById('pqr-description').value = pqr.description;
        document.getElementById('pqr-creationDate').value = formatDateTimeForInput(pqr.creationDate);
        document.getElementById('pqr-resolutionDate').value = formatDateTimeForInput(pqr.resolutionDate);
        
        // Make form fields read-only
        const formElements = document.querySelectorAll('#pqrForm input, #pqrForm select, #pqrForm textarea');
        formElements.forEach(element => {
            element.setAttribute('disabled', 'disabled');
        });
        
        // Hide save button
        document.getElementById('savePqrBtn').style.display = 'none';
        
        // Show modal
        const pqrModal = new bootstrap.Modal(document.getElementById('pqrModal'));
        pqrModal.show();
        
        hideLoading();
    } catch (error) {
        console.error('Error fetching PQR details:', error);
        hideLoading();
    }
}

// Edit PQR
async function editPqr(pqrId) {
    try {
        showLoading();
        const pqr = await apiRequest(API_ENDPOINTS.PQR_BY_ID(pqrId));
        
        // Load clients and workers for dropdowns
        await loadClientsDropdown();
        await loadWorkersDropdown();
        
        // Populate modal with PQR data
        document.getElementById('pqrModalTitle').textContent = 'Editar PQR';
        document.getElementById('pqr-id').value = pqr.pqrId;
        document.getElementById('pqr-type').value = pqr.pqrType;
        document.getElementById('pqr-status').value = pqr.pqrStatus;
        document.getElementById('pqr-clientId').value = pqr.clientId;
        document.getElementById('pqr-workerId').value = pqr.workerId;
        document.getElementById('pqr-description').value = pqr.description;
        document.getElementById('pqr-creationDate').value = formatDateTimeForInput(pqr.creationDate);
        document.getElementById('pqr-resolutionDate').value = formatDateTimeForInput(pqr.resolutionDate);
        
        // Enable form fields
        const formElements = document.querySelectorAll('#pqrForm input, #pqrForm select, #pqrForm textarea');
        formElements.forEach(element => {
            element.removeAttribute('disabled');
        });
        
        // Show save button
        document.getElementById('savePqrBtn').style.display = 'block';
        
        // Show modal
        const pqrModal = new bootstrap.Modal(document.getElementById('pqrModal'));
        pqrModal.show();
        
        hideLoading();
    } catch (error) {
        console.error('Error fetching PQR for edit:', error);
        hideLoading();
    }
}

// Add new PQR
async function addNewPqr() {
    try {
        showLoading();
        
        // Load clients and workers for dropdowns
        await loadClientsDropdown();
        await loadWorkersDropdown();
        
        // Reset form
        document.getElementById('pqrForm').reset();
        document.getElementById('pqr-id').value = '';
        
        // Set default values
        document.getElementById('pqr-creationDate').value = formatDateTimeForInput(new Date());
        document.getElementById('pqr-status').value = PQR_STATUSES.PENDING;
        
        // Set modal title
        document.getElementById('pqrModalTitle').textContent = 'Agregar PQR';
        
        // Enable form fields
        const formElements = document.querySelectorAll('#pqrForm input, #pqrForm select, #pqrForm textarea');
        formElements.forEach(element => {
            element.removeAttribute('disabled');
        });
        
        // Show save button
        document.getElementById('savePqrBtn').style.display = 'block';
        
        // Show modal
        const pqrModal = new bootstrap.Modal(document.getElementById('pqrModal'));
        pqrModal.show();
        
        hideLoading();
    } catch (error) {
        console.error('Error preparing new PQR form:', error);
        hideLoading();
    }
}

// Load clients dropdown
async function loadClientsDropdown() {
    try {
        const clientsSelect = document.getElementById('pqr-clientId');
        const clients = await apiRequest(API_ENDPOINTS.CLIENTS);
        
        // Clear previous options
        clientsSelect.innerHTML = '<option value="">Seleccionar cliente...</option>';
        
        // Add client options
        clients.forEach(client => {
            const option = document.createElement('option');
            option.value = client.clientId;
            option.textContent = `${client.firstName} ${client.lastName} (${client.identityDocument})`;
            clientsSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading clients dropdown:', error);
    }
}

// Load workers dropdown
async function loadWorkersDropdown() {
    try {
        const workersSelect = document.getElementById('pqr-workerId');
        const workers = await apiRequest(API_ENDPOINTS.WORKERS);
        
        // Clear previous options
        workersSelect.innerHTML = '<option value="">Seleccionar empleado...</option>';
        
        // Add worker options
        workers.forEach(worker => {
            const option = document.createElement('option');
            option.value = worker.workerId;
            option.textContent = `${worker.firstName} ${worker.lastName} (${worker.jobTitle})`;
            workersSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading workers dropdown:', error);
    }
}

// Save PQR (create or update)
async function savePqr() {
    try {
        showLoading();
        const pqrId = document.getElementById('pqr-id').value;
        const isUpdate = pqrId !== '';
        
        // Collect form data
        const pqrData = {
            pqrType: document.getElementById('pqr-type').value,
            pqrStatus: document.getElementById('pqr-status').value,
            clientId: parseInt(document.getElementById('pqr-clientId').value),
            workerId: parseInt(document.getElementById('pqr-workerId').value),
            description: document.getElementById('pqr-description').value,
            creationDate: document.getElementById('pqr-creationDate').value,
            resolutionDate: document.getElementById('pqr-resolutionDate').value || null
        };
        
        if (isUpdate) {
            pqrData.pqrId = parseInt(pqrId);
            await apiRequest(API_ENDPOINTS.PQRS, 'PUT', pqrData);
            showToast('Éxito', 'PQR actualizado correctamente', 'success');
        } else {
            await apiRequest(API_ENDPOINTS.PQRS, 'POST', pqrData);
            showToast('Éxito', 'PQR creado correctamente', 'success');
        }
        
        // Close modal
        const pqrModal = bootstrap.Modal.getInstance(document.getElementById('pqrModal'));
        pqrModal.hide();
        
        // Refresh PQRs list
        await getAllPqrs();
        hideLoading();
    } catch (error) {
        console.error('Error saving PQR:', error);
        hideLoading();
    }
}

// Confirm delete PQR
function confirmDeletePqr(pqrId, pqrType) {
    // Set up delete confirmation modal
    document.getElementById('delete-message').textContent = `¿Está seguro que desea eliminar el PQR de tipo ${pqrType} con ID ${pqrId}?`;
    
    // Configure delete button
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    confirmDeleteBtn.onclick = async () => {
        const isPermanent = document.getElementById('permanent-delete').checked;
        await deletePqr(pqrId, isPermanent);
        
        // Close modal
        const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        deleteModal.hide();
    };
    
    // Show modal
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
}

// Delete PQR
async function deletePqr(pqrId, isPermanent = false) {
    try {
        showLoading();
        const url = isPermanent 
            ? API_ENDPOINTS.PQR_PERMANENT_DELETE(pqrId) 
            : API_ENDPOINTS.PQR_BY_ID(pqrId);
        
        await apiRequest(url, 'DELETE');
        
        showToast(
            'Éxito', 
            isPermanent ? 'PQR eliminado permanentemente' : 'PQR eliminado correctamente', 
            'success'
        );
        
        // Refresh PQRs list
        await getAllPqrs();
        hideLoading();
    } catch (error) {
        console.error('Error deleting PQR:', error);
        hideLoading();
    }
}

// Initialize PQR page based on URL parameters
function initFromUrlParams() {
    const params = getUrlParams();
    
    if (params.action === 'new') {
        // Create new PQR
        setTimeout(() => {
            addNewPqr();
        }, 500);
    } else if (params.action === 'view' && params.id) {
        // View PQR details
        setTimeout(() => {
            viewPqrDetails(params.id);
        }, 500);
    } else if (params.action === 'edit' && params.id) {
        // Edit PQR
        setTimeout(() => {
            editPqr(params.id);
        }, 500);
    }
}

// Initialize PQRs page
function initPqrsPage() {
    // Check authentication
    if (!checkAuth()) return;
    
    // Set up event listeners
    document.getElementById('pqr-add-btn').addEventListener('click', addNewPqr);
    document.getElementById('savePqrBtn').addEventListener('click', savePqr);
    
    // Set up filter
    const statusFilter = document.getElementById('pqr-status-filter');
    statusFilter.addEventListener('change', () => {
        filterPqrsByStatus(statusFilter.value);
    });
    
    // Set up search functionality
    setupTableSearch('pqr-search', 'pqrs-table', 2); // Search by client name (column index 2)
    
    // Set up logout button
    initLogoutButton();
    
    // Load initial data
    getAllPqrs();
    
    // Initialize based on URL parameters
    initFromUrlParams();
}

// Initialize when document is ready
onDocumentReady(initPqrsPage);