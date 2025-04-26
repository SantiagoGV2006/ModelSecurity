/**
 * SecurityPQR System - Main JavaScript file
 * This file contains all the functionality for the application
 */

/*** Configuration ***/
// API Base URL
const API_BASE_URL = 'http://localhost:5163/api';

// API Endpoints
const API_ENDPOINTS = {
    // Clients
    CLIENTS: `${API_BASE_URL}/Client`,
    CLIENT_BY_ID: (id) => `${API_BASE_URL}/Client/${id}`,
    CLIENT_PERMANENT_DELETE: (id) => `${API_BASE_URL}/Client/permanent/${id}`,
    
    // PQRs
    PQRS: `${API_BASE_URL}/Pqr`,
    PQR_BY_ID: (id) => `${API_BASE_URL}/Pqr/${id}`,
    PQR_PERMANENT_DELETE: (id) => `${API_BASE_URL}/Pqr/permanent/${id}`,
    
    // Workers
    WORKERS: `${API_BASE_URL}/Worker`,
    WORKER_BY_ID: (id) => `${API_BASE_URL}/Worker/${id}`,
    
    // Worker Logins
    WORKER_LOGINS: `${API_BASE_URL}/WorkerLogin`,
    WORKER_LOGIN_BY_ID: (id) => `${API_BASE_URL}/WorkerLogin/${id}`,
    WORKER_LOGIN_PERMANENT_DELETE: (id) => `${API_BASE_URL}/WorkerLogin/permanent/${id}`,
    
    // Users
    USERS: `${API_BASE_URL}/User`,
    USER_BY_ID: (id) => `${API_BASE_URL}/User/${id}`,
    USER_PERMANENT_DELETE: (id) => `${API_BASE_URL}/User/permanent/${id}`,
    
    // Roles
    ROLES: `${API_BASE_URL}/Rol`,
    ROLE_BY_ID: (id) => `${API_BASE_URL}/Rol/${id}`,
    ROLE_PERMANENT_DELETE: (id) => `${API_BASE_URL}/Rol/permanent/${id}`,
    
    // Role User Assignments
    ROL_USERS: `${API_BASE_URL}/RolUser`,
    ROL_USER_BY_ID: (id) => `${API_BASE_URL}/RolUser/${id}`,
    ROL_USER_PERMANENT_DELETE: (id) => `${API_BASE_URL}/RolUser/permanent/${id}`,
    
    // Modules
    MODULES: `${API_BASE_URL}/Module`,
    MODULE_BY_ID: (id) => `${API_BASE_URL}/Module/${id}`,
    MODULE_PERMANENT_DELETE: (id) => `${API_BASE_URL}/Module/permanent/${id}`,
    
    // Forms
    FORMS: `${API_BASE_URL}/Form`,
    FORM_BY_ID: (id) => `${API_BASE_URL}/Form/${id}`,
    FORM_PERMANENT_DELETE: (id) => `${API_BASE_URL}/Form/permanent/${id}`,
    
    // Form Modules
    FORM_MODULES: `${API_BASE_URL}/FormModule`,
    FORM_MODULE_BY_ID: (id) => `${API_BASE_URL}/FormModule/${id}`,
    
    // Permissions
    PERMISSIONS: `${API_BASE_URL}/Permission`,
    PERMISSION_BY_ID: (id) => `${API_BASE_URL}/Permission/${id}`,
    PERMISSION_PERMANENT_DELETE: (id) => `${API_BASE_URL}/Permission/permanent/${id}`,
    
    // Role Form Permissions
    ROL_FORM_PERMISSIONS: `${API_BASE_URL}/RolFormPermission`,
    ROL_FORM_PERMISSION_BY_ID: (id) => `${API_BASE_URL}/RolFormPermission/${id}`,
    ROL_FORM_PERMISSIONS_BY_ROL_ID: (rolId) => `${API_BASE_URL}/RolFormPermission/rol/${rolId}`,
    ROL_FORM_PERMISSION_PERMANENT_DELETE: (id) => `${API_BASE_URL}/RolFormPermission/permanent/${id}`,
    
    // Logins
    LOGINS: `${API_BASE_URL}/Login`,
    LOGIN_BY_ID: (id) => `${API_BASE_URL}/Login/${id}`
};

// Default Pagination Settings
const DEFAULT_PAGE_SIZE = 10;

// HTTP Request Headers
const HTTP_HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

// Local Storage Keys
const STORAGE_KEYS = {
    AUTH_TOKEN: 'securitypqr_auth_token',
    USER_INFO: 'securitypqr_user_info',
    REMEMBER_ME: 'securitypqr_remember_me'
};

// Toast Notification Settings
const TOAST_SETTINGS = {
    DELAY: 5000, // 5 seconds
    AUTOHIDE: true
};

// PQR Status Options
const PQR_STATUSES = {
    PENDING: 'Pendiente',
    IN_PROCESS: 'En Proceso',
    RESOLVED: 'Resuelto',
    CLOSED: 'Cerrado'
};

// PQR Types
const PQR_TYPES = {
    PETITION: 'Petición',
    COMPLAINT: 'Queja',
    CLAIM: 'Reclamo',
    SUGGESTION: 'Sugerencia'
};

// Client Types
const CLIENT_TYPES = {
    INDIVIDUAL: 'Particular',
    BUSINESS: 'Empresarial',
    VIP: 'VIP'
};

// Socioeconomic Stratification Options
const SOCIOECONOMIC_STRATA = [1, 2, 3, 4, 5, 6];

/*** Utility Functions ***/

// Show toast notification
function showToast(title, message, type = 'info') {
    const toastEl = document.getElementById('toast-notification');
    const toastTitle = document.getElementById('toast-title');
    const toastMessage = document.getElementById('toast-message');
    
    // Set toast content
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    
    // Set toast type/color
    const toast = new bootstrap.Toast(toastEl, {
        delay: TOAST_SETTINGS.DELAY,
        autohide: TOAST_SETTINGS.AUTOHIDE
    });
    
    // Remove existing color classes
    toastEl.classList.remove('bg-success', 'bg-danger', 'bg-warning', 'bg-info');
    
    // Add appropriate color class based on type
    switch (type) {
        case 'success':
            toastEl.classList.add('bg-success', 'text-white');
            break;
        case 'error':
            toastEl.classList.add('bg-danger', 'text-white');
            break;
        case 'warning':
            toastEl.classList.add('bg-warning');
            break;
        default:
            toastEl.classList.add('bg-info', 'text-white');
    }
    
    // Show the toast
    toast.show();
}

// Display error message
function showError(message) {
    document.getElementById('error-message').textContent = message;
    showPage('error-page');
}

// Show loading overlay
function showLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.classList.remove('d-none');
    loadingOverlay.classList.add('d-flex');
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.classList.remove('d-flex');
    loadingOverlay.classList.add('d-none');
}

// Format date for display
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Format date for input fields (YYYY-MM-DD)
function formatDateForInput(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

// Format date-time for input fields (YYYY-MM-DDThh:mm)
function formatDateTimeForInput(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
}

// Create pagination controls
function createPagination(totalItems, currentPage, pageSize, elementId, onPageChange) {
    const totalPages = Math.ceil(totalItems / pageSize);
    const paginationElement = document.getElementById(elementId);
    
    // Clear current pagination
    paginationElement.innerHTML = '';
    
    if (totalPages <= 1) {
        return;
    }
    
    // Create pagination element
    const nav = document.createElement('nav');
    const ul = document.createElement('ul');
    ul.classList.add('pagination');
    
    // Add Previous button
    const prevLi = document.createElement('li');
    prevLi.classList.add('page-item');
    if (currentPage === 1) {
        prevLi.classList.add('disabled');
    }
    const prevLink = document.createElement('a');
    prevLink.classList.add('page-link');
    prevLink.href = '#';
    prevLink.setAttribute('aria-label', 'Previous');
    prevLink.innerHTML = '<span aria-hidden="true">&laquo;</span>';
    prevLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    });
    prevLi.appendChild(prevLink);
    ul.appendChild(prevLi);
    
    // Determine page range to display
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }
    
    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
        const pageLi = document.createElement('li');
        pageLi.classList.add('page-item');
        if (i === currentPage) {
            pageLi.classList.add('active');
        }
        const pageLink = document.createElement('a');
        pageLink.classList.add('page-link');
        pageLink.href = '#';
        pageLink.textContent = i;
        pageLink.addEventListener('click', (e) => {
            e.preventDefault();
            onPageChange(i);
        });
        pageLi.appendChild(pageLink);
        ul.appendChild(pageLi);
    }
    
    // Add Next button
    const nextLi = document.createElement('li');
    nextLi.classList.add('page-item');
    if (currentPage === totalPages) {
        nextLi.classList.add('disabled');
    }
    const nextLink = document.createElement('a');
    nextLink.classList.add('page-link');
    nextLink.href = '#';
    nextLink.setAttribute('aria-label', 'Next');
    nextLink.innerHTML = '<span aria-hidden="true">&raquo;</span>';
    nextLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    });
    nextLi.appendChild(nextLink);
    ul.appendChild(nextLi);
    
    nav.appendChild(ul);
    paginationElement.appendChild(nav);
}

// Show specified page and hide others
function showPage(pageId) {
    // Hide all content pages
    document.querySelectorAll('.content-page').forEach(page => {
        page.classList.add('d-none');
    });
    
    // Show the specified page
    const page = document.getElementById(pageId);
    if (page) {
        page.classList.remove('d-none');
    }
    
    // Update active navigation link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Find and activate corresponding nav link
    if (pageId === 'home-page') {
        document.getElementById('home-link').classList.add('active');
    } else {
        document.querySelector(`.nav-link[data-page="${pageId}"]`)?.classList.add('active');
    }
}

// Handle API Error
function handleApiError(error) {
    hideLoading();
    console.error('API Error:', error);
    
    if (error.response) {
        // Server responded with an error status
        const statusCode = error.response.status;
        const errorMessage = error.response.data && error.response.data.message 
            ? error.response.data.message 
            : 'Error en la solicitud al servidor';
            
        switch (statusCode) {
            case 400:
                showToast('Error de Validación', errorMessage, 'error');
                break;
            case 401:
                showToast('No Autorizado', 'Sesión expirada o credenciales inválidas', 'error');
                // Redirect to login page after token expiration
                setTimeout(() => {
                    logout();
                }, 2000);
                break;
            case 403:
                showToast('Acceso Denegado', 'No tiene permisos para realizar esta acción', 'error');
                break;
            case 404:
                showToast('No Encontrado', errorMessage, 'error');
                break;
            case 500:
                showToast('Error del Servidor', errorMessage, 'error');
                break;
            default:
                showToast('Error', errorMessage, 'error');
        }
    } else if (error.request) {
        // No response received
        showToast('Error de Conexión', 'No se pudo conectar con el servidor', 'error');
    } else {
        // Setup or other error
        showToast('Error', error.message || 'Ocurrió un error inesperado', 'error');
    }
}

// Create status badge
function createStatusBadge(status) {
    const badge = document.createElement('span');
    badge.classList.add('badge', 'rounded-pill');
    
    switch (status) {
        case PQR_STATUSES.PENDING:
            badge.classList.add('bg-warning', 'text-dark');
            break;
        case PQR_STATUSES.IN_PROCESS:
            badge.classList.add('bg-primary');
            break;
        case PQR_STATUSES.RESOLVED:
            badge.classList.add('bg-success');
            break;
        case PQR_STATUSES.CLOSED:
            badge.classList.add('bg-secondary');
            break;
        case true:
        case 'Activo':
            badge.classList.add('bg-success');
            status = 'Activo';
            break;
        case false:
        case 'Inactivo':
            badge.classList.add('bg-danger');
            status = 'Inactivo';
            break;
        default:
            badge.classList.add('bg-info');
    }
    
    badge.textContent = status;
    return badge;
}

// Create action buttons for tables
function createActionButtons(actions) {
    const btnGroup = document.createElement('div');
    btnGroup.classList.add('btn-action-group');
    
    if (actions.view) {
        const viewBtn = document.createElement('button');
        viewBtn.type = 'button';
        viewBtn.classList.add('btn', 'btn-info', 'btn-sm');
        viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
        viewBtn.title = 'Ver detalle';
        viewBtn.addEventListener('click', actions.view);
        btnGroup.appendChild(viewBtn);
    }
    
    if (actions.edit) {
        const editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.classList.add('btn', 'btn-primary', 'btn-sm');
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.title = 'Editar';
        editBtn.addEventListener('click', actions.edit);
        btnGroup.appendChild(editBtn);
    }
    
    if (actions.delete) {
        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.classList.add('btn', 'btn-danger', 'btn-sm');
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteBtn.title = 'Eliminar';
        deleteBtn.addEventListener('click', actions.delete);
        btnGroup.appendChild(deleteBtn);
    }
    
    if (actions.custom) {
        actions.custom.forEach(customAction => {
            const customBtn = document.createElement('button');
            customBtn.type = 'button';
            customBtn.classList.add('btn', `btn-${customAction.color || 'secondary'}`, 'btn-sm');
            customBtn.innerHTML = customAction.icon || '';
            customBtn.title = customAction.title || '';
            customBtn.addEventListener('click', customAction.handler);
            btnGroup.appendChild(customBtn);
        });
    }
    
    return btnGroup;
}

// Make API request with authorization
async function apiRequest(url, method = 'GET', data = null) {
    // Get auth token
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    
    // Set up headers with auth token if available
    const headers = { ...HTTP_HEADERS };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
        const response = await fetch(url, {
            method,
            headers,
            body: data ? JSON.stringify(data) : null
        });
        
        // Handle non-successful responses
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw {
                response: {
                    status: response.status,
                    data: errorData
                }
            };
        }
        
        // Parse and return JSON response if content exists
        if (response.status !== 204) { // 204 No Content
            return await response.json();
        }
        
        return true; // Success without content
    } catch (error) {
        handleApiError(error);
        throw error;
    }
}

// Reset a form
function resetForm(formId) {
    document.getElementById(formId).reset();
}

// Auth functions
function isLoggedIn() {
    return !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
}

function logout() {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_INFO);
    showPage('login-page');
}

// Handle form submission with validation
function handleFormSubmit(formId, submitHandler) {
    const form = document.getElementById(formId);
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Check form validity
        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add('was-validated');
            return;
        }
        
        try {
            showLoading();
            await submitHandler();
        } catch (error) {
            console.error('Form submission error:', error);
        } finally {
            hideLoading();
        }
    });
}

// Generate random password
function generateRandomPassword(length = 10) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

// Toggle password visibility
function setupPasswordToggle(passwordInputId, toggleBtnId) {
    const passwordInput = document.getElementById(passwordInputId);
    const toggleBtn = document.getElementById(toggleBtnId);
    
    if (passwordInput && toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
            } else {
                passwordInput.type = 'password';
                toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
            }
        });
    }
}

// Filter table rows based on search input
function setupTableSearch(searchInputId, tableId, columnIndex) {
    const searchInput = document.getElementById(searchInputId);
    const table = document.getElementById(tableId);
    
    if (searchInput && table) {
        searchInput.addEventListener('keyup', () => {
            const searchText = searchInput.value.toLowerCase();
            const rows = table.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                const cell = row.cells[columnIndex];
                if (cell) {
                    const text = cell.textContent.toLowerCase();
                    row.style.display = text.includes(searchText) ? '' : 'none';
                }
            });
        });
    }
}

/*** Clients Module ***/
let clientsData = [];
let currentClientPage = 1;

// Get all clients
async function getAllClients() {
    try {
        showLoading();
        const data = await apiRequest(API_ENDPOINTS.CLIENTS);
        clientsData = data;
        renderClientsTable(data);
        updateClientCount(data.length);
        hideLoading();
    } catch (error) {
        console.error('Error fetching clients:', error);
        hideLoading();
    }
}

// Render clients table
function renderClientsTable(clients, page = 1) {
    const tableBody = document.getElementById('clients-table');
    const pageSize = DEFAULT_PAGE_SIZE;
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, clients.length);
    const paginatedClients = clients.slice(startIndex, endIndex);
    
    tableBody.innerHTML = '';
    
    if (clients.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">No hay clientes registrados</td>
            </tr>
        `;
        return;
    }
    
    paginatedClients.forEach(client => {
        const row = document.createElement('tr');
        
        // Create table cells
        row.innerHTML = `
            <td>${client.clientId}</td>
            <td>${client.firstName} ${client.lastName}</td>
            <td>${client.identityDocument}</td>
            <td>${client.clientType}</td>
            <td>${client.email}</td>
            <td>${client.phone || 'N/A'}</td>
            <td></td>
        `;
        
        // Add action buttons
        const actionsCell = row.cells[6];
        const actionButtons = createActionButtons({
            view: () => viewClientDetails(client.clientId),
            edit: () => editClient(client.clientId),
            delete: () => confirmDeleteClient(client.clientId, `${client.firstName} ${client.lastName}`)
        });
        
        actionsCell.appendChild(actionButtons);
        tableBody.appendChild(row);
    });
    
    // Create pagination
    createPagination(
        clients.length,
        page,
        pageSize,
        'clients-pagination',
        (newPage) => {
            currentClientPage = newPage;
            renderClientsTable(clients, newPage);
        }
    );
}

// Update client count in dashboard
function updateClientCount(count) {
    const countElement = document.getElementById('client-count');
    if (countElement) {
        countElement.textContent = count;
    }
}

// View client details
async function viewClientDetails(clientId) {
    try {
        showLoading();
        const client = await apiRequest(API_ENDPOINTS.CLIENT_BY_ID(clientId));
        
        // Populate modal with client data (read-only)
        document.getElementById('clientModalTitle').textContent = 'Detalles del Cliente';
        document.getElementById('client-id').value = client.clientId;
        document.getElementById('client-firstName').value = client.firstName;
        document.getElementById('client-lastName').value = client.lastName;
        document.getElementById('client-document').value = client.identityDocument;
        document.getElementById('client-type').value = client.clientType;
        document.getElementById('client-email').value = client.email;
        document.getElementById('client-phone').value = client.phone || '';
        document.getElementById('client-address').value = client.address;
        document.getElementById('client-stratification').value = client.socioeconomicStratification || '';
        
        // Make form fields read-only
        const formElements = document.querySelectorAll('#clientForm input, #clientForm select');
        formElements.forEach(element => {
            element.setAttribute('disabled', 'disabled');
        });
        
        // Hide save button
        document.getElementById('saveClientBtn').style.display = 'none';
        
        // Show modal
        const clientModal = new bootstrap.Modal(document.getElementById('clientModal'));
        clientModal.show();
        
        hideLoading();
    } catch (error) {
        console.error('Error fetching client details:', error);
        hideLoading();
    }
}

// Edit client
async function editClient(clientId) {
    try {
        showLoading();
        const client = await apiRequest(API_ENDPOINTS.CLIENT_BY_ID(clientId));
        
        // Populate modal with client data
        document.getElementById('clientModalTitle').textContent = 'Editar Cliente';
        document.getElementById('client-id').value = client.clientId;
        document.getElementById('client-firstName').value = client.firstName;
        document.getElementById('client-lastName').value = client.lastName;
        document.getElementById('client-document').value = client.identityDocument;
        document.getElementById('client-type').value = client.clientType;
        document.getElementById('client-email').value = client.email;
        document.getElementById('client-phone').value = client.phone || '';
        document.getElementById('client-address').value = client.address;
        document.getElementById('client-stratification').value = client.socioeconomicStratification || '';
        
        // Enable form fields
        const formElements = document.querySelectorAll('#clientForm input, #clientForm select');
        formElements.forEach(element => {
            element.removeAttribute('disabled');
        });
        
        // Show save button
        document.getElementById('saveClientBtn').style.display = 'block';
        
        // Show modal
        const clientModal = new bootstrap.Modal(document.getElementById('clientModal'));
        clientModal.show();
        
        hideLoading();
    } catch (error) {
        console.error('Error fetching client for edit:', error);
        hideLoading();
    }
}

// Add new client
function addNewClient() {
    // Reset form
    document.getElementById('clientForm').reset();
    document.getElementById('client-id').value = '';
    
    // Set modal title
    document.getElementById('clientModalTitle').textContent = 'Agregar Cliente';
    
    // Enable form fields
    const formElements = document.querySelectorAll('#clientForm input, #clientForm select');
    formElements.forEach(element => {
        element.removeAttribute('disabled');
    });
    
    // Show save button
    document.getElementById('saveClientBtn').style.display = 'block';
    
    // Show modal
    const clientModal = new bootstrap.Modal(document.getElementById('clientModal'));
    clientModal.show();
}

// Save client (create or update)
async function saveClient() {
    try {
        const clientId = document.getElementById('client-id').value;
        const isUpdate = clientId !== '';
        
        // Collect form data
        const clientData = {
            firstName: document.getElementById('client-firstName').value,
            lastName: document.getElementById('client-lastName').value,
            identityDocument: document.getElementById('client-document').value,
            clientType: document.getElementById('client-type').value,
            email: document.getElementById('client-email').value,
            phone: document.getElementById('client-phone').value || null,
            address: document.getElementById('client-address').value,
            socioeconomicStratification: document.getElementById('client-stratification').value || null
        };
        
        if (isUpdate) {
            clientData.clientId = parseInt(clientId);
            await apiRequest(API_ENDPOINTS.CLIENTS, 'PUT', clientData);
            showToast('Éxito', 'Cliente actualizado correctamente', 'success');
        } else {
            await apiRequest(API_ENDPOINTS.CLIENTS, 'POST', clientData);
            showToast('Éxito', 'Cliente creado correctamente', 'success');
        }
        
        // Close modal
        const clientModal = bootstrap.Modal.getInstance(document.getElementById('clientModal'));
        clientModal.hide();
        
        // Refresh clients list
        await getAllClients();
    } catch (error) {
        console.error('Error saving client:', error);
    }
}

// Confirm delete client
function confirmDeleteClient(clientId, clientName) {
    // Set up delete confirmation modal
    document.getElementById('delete-message').textContent = `¿Está seguro que desea eliminar el cliente ${clientName}?`;
    
    // Configure delete button
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    confirmDeleteBtn.onclick = async () => {
        const isPermanent = document.getElementById('permanent-delete').checked;
        await deleteClient(clientId, isPermanent);
        
        // Close modal
        const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        deleteModal.hide();
    };
    
    // Show modal
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
}

// Delete client
async function deleteClient(clientId, isPermanent = false) {
    try {
        showLoading();
        const url = isPermanent 
            ? API_ENDPOINTS.CLIENT_PERMANENT_DELETE(clientId) 
            : API_ENDPOINTS.CLIENT_BY_ID(clientId);
        
        await apiRequest(url, 'DELETE');
        
        showToast(
            'Éxito', 
            isPermanent ? 'Cliente eliminado permanentemente' : 'Cliente eliminado correctamente', 
            'success'
        );
        
        // Refresh clients list
        await getAllClients();
        hideLoading();
    } catch (error) {
        console.error('Error deleting client:', error);
        hideLoading();
    }
}

// Initialize clients page
function initClientsPage() {
    // Set up event listeners
    document.getElementById('client-add-btn').addEventListener('click', addNewClient);
    document.getElementById('saveClientBtn').addEventListener('click', saveClient);
    
    // Set up search functionality
    setupTableSearch('client-search', 'clients-table', 1); // Search by name (column index 1)
    
    // Load initial data
    getAllClients();
}

// Load recent clients for dashboard
async function loadRecentClients() {
    try {
        const clients = await apiRequest(API_ENDPOINTS.CLIENTS);
        const recentClientsTable = document.getElementById('recent-clients');
        
        if (clients.length === 0) {
            recentClientsTable.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center">No hay clientes registrados</td>
                </tr>
            `;
            return;
        }
        
        // Display only the 5 most recent clients
        const recentClients = clients.slice(0, 5);
        recentClientsTable.innerHTML = '';
        
        recentClients.forEach(client => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${client.clientId}</td>
                <td>${client.firstName} ${client.lastName}</td>
                <td>${client.identityDocument}</td>
                <td></td>
            `;
            
            // Add action buttons
            const actionsCell = row.cells[3];
            const actionButtons = createActionButtons({
                view: () => viewClientDetails(client.clientId)
            });
            
            actionsCell.appendChild(actionButtons);
            recentClientsTable.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading recent clients:', error);
    }
}

/*** PQRs Module ***/
let pqrsData = [];
let currentPqrPage = 1;

// Get all PQRs
async function getAllPqrs() {
    try {
        showLoading();
        const data = await apiRequest(API_ENDPOINTS.PQRS);
        pqrsData = data;
        renderPqrsTable(data);
        updatePqrCount(data.length);
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

// Update PQR count in dashboard
function updatePqrCount(count) {
    const countElement = document.getElementById('pqr-count');
    if (countElement) {
        countElement.textContent = count;
    }
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
        // Also refresh recent PQRs on dashboard if we're on home page
        if (!document.getElementById('home-page').classList.contains('d-none')) {
            loadRecentPqrs();
        }
    } catch (error) {
        console.error('Error saving PQR:', error);
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
        // Also refresh recent PQRs on dashboard if we're on home page
        if (!document.getElementById('home-page').classList.contains('d-none')) {
            loadRecentPqrs();
        }
        hideLoading();
    } catch (error) {
        console.error('Error deleting PQR:', error);
        hideLoading();
    }
}

// Load recent PQRs for dashboard
async function loadRecentPqrs() {
    try {
        const pqrs = await apiRequest(API_ENDPOINTS.PQRS);
        const recentPqrsTable = document.getElementById('recent-pqrs');
        
        if (pqrs.length === 0) {
            recentPqrsTable.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">No hay PQRs registrados</td>
                </tr>
            `;
            return;
        }
        
        // Display only the 5 most recent PQRs
        const recentPqrs = pqrs.slice(0, 5);
        recentPqrsTable.innerHTML = '';
        
        recentPqrs.forEach(pqr => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${pqr.pqrId}</td>
                <td>${pqr.pqrType}</td>
                <td>${pqr.clientName || 'Cliente ' + pqr.clientId}</td>
                <td></td>
                <td>${formatDate(pqr.creationDate)}</td>
                <td></td>
            `;
            
            // Add status badge
            const statusCell = row.cells[3];
            statusCell.appendChild(createStatusBadge(pqr.pqrStatus));
            
            // Add action buttons
            const actionsCell = row.cells[5];
            const actionButtons = createActionButtons({
                view: () => viewPqrDetails(pqr.pqrId),
                edit: () => editPqr(pqr.pqrId)
            });
            
            actionsCell.appendChild(actionButtons);
            recentPqrsTable.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading recent PQRs:', error);
    }
}

// Initialize PQRs page
function initPqrsPage() {
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
    
    // Load initial data
    getAllPqrs();
}

/*** Workers Module ***/
let workersData = [];
let currentWorkerPage = 1;

// Get all workers
async function getAllWorkers() {
    try {
        showLoading();
        const data = await apiRequest(API_ENDPOINTS.WORKERS);
        workersData = data;
        renderWorkersTable(data);
        updateWorkerCount(data.length);
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

// Update worker count in dashboard
function updateWorkerCount(count) {
    const countElement = document.getElementById('worker-count');
    if (countElement) {
        countElement.textContent = count;
    }
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
        const workerId = document.getElementById('worker-id').value;
        const isUpdate = workerId !== '';
        
        // Collect form data
        const workerData = {
            firstName: document.getElementById('worker-firstName').value,
            lastName: document.getElementById('worker-lastName').value,
            identityDocument: document.getElementById('worker-document').value,
            jobTitle: document.getElementById('worker-jobTitle').value,
            email: document.getElementById('worker-email').value,
            phone: parseInt(document.getElementById('worker-phone').value),
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
    } catch (error) {
        console.error('Error saving worker:', error);
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
    } catch (error) {
        console.error('Error saving worker login:', error);
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

// Load recent workers for dashboard
async function loadRecentWorkers() {
    try {
        const workers = await apiRequest(API_ENDPOINTS.WORKERS);
        const recentWorkersTable = document.getElementById('recent-workers');
        
        if (workers.length === 0) {
            recentWorkersTable.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center">No hay empleados registrados</td>
                </tr>
            `;
            return;
        }
        
        // Display only the 5 most recent workers
        const recentWorkers = workers.slice(0, 5);
        recentWorkersTable.innerHTML = '';
        
        recentWorkers.forEach(worker => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${worker.workerId}</td>
                <td>${worker.firstName} ${worker.lastName}</td>
                <td>${worker.jobTitle}</td>
                <td></td>
            `;
            
            // Add action buttons
            const actionsCell = row.cells[3];
            const actionButtons = createActionButtons({
                view: () => viewWorkerDetails(worker.workerId)
            });
            
            actionsCell.appendChild(actionButtons);
            recentWorkersTable.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading recent workers:', error);
    }
}

// Initialize workers page
function initWorkersPage() {
    // Set up event listeners
    document.getElementById('worker-add-btn').addEventListener('click', addNewWorker);
    document.getElementById('saveWorkerBtn').addEventListener('click', saveWorker);
    document.getElementById('saveWorkerLoginBtn').addEventListener('click', saveWorkerLogin);
    
    // Set up search functionality
    setupTableSearch('worker-search', 'workers-table', 1); // Search by name (column index 1)
    
    // Load initial data
    getAllWorkers();
}

/*** Users Module ***/
let usersData = [];
let currentUserPage = 1;

// Get all users
async function getAllUsers() {
    try {
        showLoading();
        const data = await apiRequest(API_ENDPOINTS.USERS);
        usersData = data;
        renderUsersTable(data);
        updateUserCount(data.length);
        hideLoading();
    } catch (error) {
        console.error('Error fetching users:', error);
        hideLoading();
    }
}

// Render users table
function renderUsersTable(users, page = 1) {
    const tableBody = document.getElementById('users-table');
    const pageSize = DEFAULT_PAGE_SIZE;
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, users.length);
    const paginatedUsers = users.slice(startIndex, endIndex);
    
    tableBody.innerHTML = '';
    
    if (users.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">No hay usuarios registrados</td>
            </tr>
        `;
        return;
    }
    
    paginatedUsers.forEach(user => {
        const row = document.createElement('tr');
        
        // Create table cells
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${formatDate(user.createAt)}</td>
            <td><span class="badge bg-secondary">${user.roleCount || 0} roles</span></td>
            <td></td>
        `;
        
        // Add action buttons
        const actionsCell = row.cells[5];
        const actionButtons = createActionButtons({
            view: () => viewUserDetails(user.id),
            edit: () => editUser(user.id),
            delete: () => confirmDeleteUser(user.id, user.name),
            custom: [
                {
                    icon: '<i class="fas fa-user-tag"></i>',
                    title: 'Asignar Roles',
                    color: 'warning',
                    handler: () => manageUserRoles(user.id, user.name)
                }
            ]
        });
        
        actionsCell.appendChild(actionButtons);
        tableBody.appendChild(row);
    });
    
    // Create pagination
    createPagination(
        users.length,
        page,
        pageSize,
        'users-pagination',
        (newPage) => {
            currentUserPage = newPage;
            renderUsersTable(users, newPage);
        }
    );
}

// Update user count in dashboard
function updateUserCount(count) {
    const countElement = document.getElementById('user-count');
    if (countElement) {
        countElement.textContent = count;
    }
}

// View user details
async function viewUserDetails(userId) {
    try {
        showLoading();
        const user = await apiRequest(API_ENDPOINTS.USER_BY_ID(userId));
        
        // Load workers dropdown
        await loadWorkersDropdownForUser();
        
        // Populate modal with user data (read-only)
        document.getElementById('userModalTitle').textContent = 'Detalles del Usuario';
        document.getElementById('user-id').value = user.id;
        document.getElementById('user-name').value = user.name;
        document.getElementById('user-email').value = user.email;
        document.getElementById('user-password').value = '********'; // Mask password
        document.getElementById('user-workerId').value = user.workerId || '';
        
        // Make form fields read-only
        const formElements = document.querySelectorAll('#userForm input, #userForm select');
        formElements.forEach(element => {
            element.setAttribute('disabled', 'disabled');
        });
        
        // Hide save button
        document.getElementById('saveUserBtn').style.display = 'none';
        
        // Show modal
        const userModal = new bootstrap.Modal(document.getElementById('userModal'));
        userModal.show();
        
        hideLoading();
    } catch (error) {
        console.error('Error fetching user details:', error);
        hideLoading();
    }
}

// Edit user
async function editUser(userId) {
    try {
        showLoading();
        const user = await apiRequest(API_ENDPOINTS.USER_BY_ID(userId));
        
        // Load workers dropdown
        await loadWorkersDropdownForUser();
        
        // Populate modal with user data
        document.getElementById('userModalTitle').textContent = 'Editar Usuario';
        document.getElementById('user-id').value = user.id;
        document.getElementById('user-name').value = user.name;
        document.getElementById('user-email').value = user.email;
        document.getElementById('user-password').value = ''; // Clear password field
        document.getElementById('user-workerId').value = user.workerId || '';
        
        // Enable form fields
        const formElements = document.querySelectorAll('#userForm input, #userForm select');
        formElements.forEach(element => {
            element.removeAttribute('disabled');
        });
        
        // Set up password toggle
        setupPasswordToggle('user-password', 'toggleUserPasswordBtn');
        
        // Show save button
        document.getElementById('saveUserBtn').style.display = 'block';
        
        // Show modal
        const userModal = new bootstrap.Modal(document.getElementById('userModal'));
        userModal.show();
        
        hideLoading();
    } catch (error) {
        console.error('Error fetching user for edit:', error);
        hideLoading();
    }
}

// Load workers dropdown for user form
async function loadWorkersDropdownForUser() {
    try {
        const workersSelect = document.getElementById('user-workerId');
        const workers = await apiRequest(API_ENDPOINTS.WORKERS);
        
        // Clear previous options
        workersSelect.innerHTML = '<option value="">Ninguno</option>';
        
        // Add worker options
        workers.forEach(worker => {
            const option = document.createElement('option');
            option.value = worker.workerId;
            option.textContent = `${worker.firstName} ${worker.lastName} (${worker.jobTitle})`;
            workersSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading workers dropdown for user form:', error);
    }
}

// Add new user
async function addNewUser() {
    try {
        showLoading();
        
        // Load workers dropdown
        await loadWorkersDropdownForUser();
        
        // Reset form
        document.getElementById('userForm').reset();
        document.getElementById('user-id').value = '';
        document.getElementById('user-password').value = generateRandomPassword();
        
        // Set modal title
        document.getElementById('userModalTitle').textContent = 'Agregar Usuario';
        
        // Enable form fields
        const formElements = document.querySelectorAll('#userForm input, #userForm select');
        formElements.forEach(element => {
            element.removeAttribute('disabled');
        });
        
        // Set up password toggle
        setupPasswordToggle('user-password', 'toggleUserPasswordBtn');
        
        // Show save button
        document.getElementById('saveUserBtn').style.display = 'block';
        
        // Show modal
        const userModal = new bootstrap.Modal(document.getElementById('userModal'));
        userModal.show();
        
        hideLoading();
    } catch (error) {
        console.error('Error preparing new user form:', error);
        hideLoading();
    }
}

// Save user (create or update)
async function saveUser() {
    try {
        const userId = document.getElementById('user-id').value;
        const isUpdate = userId !== '';
        
        // Collect form data
        const userData = {
            name: document.getElementById('user-name').value,
            email: document.getElementById('user-email').value,
            workerId: document.getElementById('user-workerId').value || null
        };
        
        // Add password only if it's not empty (for updates)
        const password = document.getElementById('user-password').value;
        if (password && password !== '********') {
            userData.password = password;
        }
        
        if (isUpdate) {
            userData.id = parseInt(userId);
            await apiRequest(API_ENDPOINTS.USERS, 'PUT', userData);
            showToast('Éxito', 'Usuario actualizado correctamente', 'success');
        } else {
            // Password is required for new users
            if (!userData.password) {
                showToast('Error', 'La contraseña es obligatoria para nuevos usuarios', 'error');
                return;
            }
            await apiRequest(API_ENDPOINTS.USERS, 'POST', userData);
            showToast('Éxito', 'Usuario creado correctamente', 'success');
        }
        
        // Close modal
        const userModal = bootstrap.Modal.getInstance(document.getElementById('userModal'));
        userModal.hide();
        
        // Refresh users list
        await getAllUsers();
    } catch (error) {
        console.error('Error saving user:', error);
    }
}

// Manage user roles
async function manageUserRoles(userId, userName) {
    try {
        showLoading();
        
        // Get all roles
        const roles = await apiRequest(API_ENDPOINTS.ROLES);
        
        // Get user's roles
        const rolUsers = await apiRequest(API_ENDPOINTS.ROL_USERS);
        const userRolIds = rolUsers
            .filter(rolUser => rolUser.userId === userId)
            .map(rolUser => rolUser.rolId);
        
        // Create checkboxes for each role
        const container = document.getElementById('roles-checkbox-container');
        container.innerHTML = '';
        
        if (roles.length === 0) {
            container.innerHTML = '<div class="text-center p-3">No hay roles disponibles</div>';
        } else {
            roles.forEach(role => {
                const isChecked = userRolIds.includes(role.id);
                
                const div = document.createElement('div');
                div.classList.add('form-check', 'mb-2');
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.classList.add('form-check-input');
                checkbox.id = `role-${role.id}`;
                checkbox.value = role.id;
                checkbox.checked = isChecked;
                
                const label = document.createElement('label');
                label.classList.add('form-check-label');
                label.htmlFor = `role-${role.id}`;
                label.textContent = `${role.name} - ${role.description || 'Sin descripción'}`;
                
                div.appendChild(checkbox);
                div.appendChild(label);
                container.appendChild(div);
            });
        }
        
        // Store user ID
        document.getElementById('userRoles-userId').value = userId;
        
        // Show modal
        document.querySelector('#userRolesModal .modal-title').textContent = `Asignar Roles - ${userName}`;
        const userRolesModal = new bootstrap.Modal(document.getElementById('userRolesModal'));
        userRolesModal.show();
        
        hideLoading();
    } catch (error) {
        console.error('Error managing user roles:', error);
        hideLoading();
    }
}

// Save user roles
async function saveUserRoles() {
    try {
        showLoading();
        const userId = parseInt(document.getElementById('userRoles-userId').value);
        
        // Get all role checkboxes
        const roleCheckboxes = document.querySelectorAll('#roles-checkbox-container input[type="checkbox"]');
        const selectedRoleIds = Array.from(roleCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => parseInt(checkbox.value));
        
        // Get current user roles
        const rolUsers = await apiRequest(API_ENDPOINTS.ROL_USERS);
        const currentUserRoles = rolUsers.filter(rolUser => rolUser.userId === userId);
        const currentRoleIds = currentUserRoles.map(rolUser => rolUser.rolId);
        
        // Determine roles to add and remove
        const rolesToAdd = selectedRoleIds.filter(id => !currentRoleIds.includes(id));
        const rolesToRemove = currentUserRoles.filter(rolUser => !selectedRoleIds.includes(rolUser.rolId));
        
        // Add new roles
        for (const rolId of rolesToAdd) {
            await apiRequest(API_ENDPOINTS.ROL_USERS, 'POST', {
                userId: userId,
                rolId: rolId
            });
        }
        
        // Remove roles
        for (const rolUser of rolesToRemove) {
            await apiRequest(API_ENDPOINTS.ROL_USER_BY_ID(rolUser.id), 'DELETE');
        }
        
        showToast('Éxito', 'Roles actualizados correctamente', 'success');
        
        // Close modal
        const userRolesModal = bootstrap.Modal.getInstance(document.getElementById('userRolesModal'));
        userRolesModal.hide();
        
        // Refresh users list
        await getAllUsers();
        
        hideLoading();
    } catch (error) {
        console.error('Error saving user roles:', error);
        hideLoading();
    }
}

// Confirm delete user
function confirmDeleteUser(userId, userName) {
    // Set up delete confirmation modal
    document.getElementById('delete-message').textContent = `¿Está seguro que desea eliminar el usuario ${userName}?`;
    
    // Configure delete button
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    confirmDeleteBtn.onclick = async () => {
        const isPermanent = document.getElementById('permanent-delete').checked;
        await deleteUser(userId, isPermanent);
        
        // Close modal
        const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        deleteModal.hide();
    };
    
    // Show modal
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
}

// Delete user
async function deleteUser(userId, isPermanent = false) {
    try {
        showLoading();
        const url = isPermanent 
            ? API_ENDPOINTS.USER_PERMANENT_DELETE(userId) 
            : API_ENDPOINTS.USER_BY_ID(userId);
        
        await apiRequest(url, 'DELETE');
        
        showToast(
            'Éxito', 
            isPermanent ? 'Usuario eliminado permanentemente' : 'Usuario eliminado correctamente', 
            'success'
        );
        
        // Refresh users list
        await getAllUsers();
        hideLoading();
    } catch (error) {
        console.error('Error deleting user:', error);
        hideLoading();
    }
}

// Initialize users page
function initUsersPage() {
    // Set up event listeners
    document.getElementById('user-add-btn').addEventListener('click', addNewUser);
    document.getElementById('saveUserBtn').addEventListener('click', saveUser);
    document.getElementById('saveUserRolesBtn').addEventListener('click', saveUserRoles);
    
    // Set up search functionality
    setupTableSearch('user-search', 'users-table', 1); // Search by name (column index 1)
    
    // Load initial data
    getAllUsers();
}

/*** Roles Module ***/
let rolesData = [];

// Get all roles
async function getAllRoles() {
    try {
        showLoading();
        const data = await apiRequest(API_ENDPOINTS.ROLES);
        rolesData = data;
        renderRolesTable(data);
        hideLoading();
    } catch (error) {
        console.error('Error fetching roles:', error);
        hideLoading();
    }
}

// Render roles table
function renderRolesTable(roles) {
    const tableBody = document.getElementById('roles-table');
    
    tableBody.innerHTML = '';
    
    if (roles.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">No hay roles registrados</td>
            </tr>
        `;
        return;
    }
    
    roles.forEach(role => {
        const row = document.createElement('tr');
        
        // Create table cells
        row.innerHTML = `
            <td>${role.id}</td>
            <td>${role.name}</td>
            <td>${role.description || 'Sin descripción'}</td>
            <td>${formatDate(role.createAt)}</td>
            <td></td>
        `;
        
        // Add action buttons
        const actionsCell = row.cells[4];
        const actionButtons = createActionButtons({
            edit: () => editRole(role.id),
            delete: () => confirmDeleteRole(role.id, role.name),
            custom: [
                {
                    icon: '<i class="fas fa-shield-alt"></i>',
                    title: 'Permisos',
                    color: 'warning',
                    handler: () => manageRolePermissions(role.id, role.name)
                }
            ]
        });
        
        actionsCell.appendChild(actionButtons);
        tableBody.appendChild(row);
    });
}

// Edit role
async function editRole(roleId) {
    try {
        showLoading();
        const role = await apiRequest(API_ENDPOINTS.ROLE_BY_ID(roleId));
        
        // Populate modal with role data
        document.getElementById('roleModalTitle').textContent = 'Editar Rol';
        document.getElementById('role-id').value = role.id;
        document.getElementById('role-name').value = role.name;
        document.getElementById('role-description').value = role.description || '';
        
        // Show modal
        const roleModal = new bootstrap.Modal(document.getElementById('roleModal'));
        roleModal.show();
        
        hideLoading();
    } catch (error) {
        console.error('Error fetching role for edit:', error);
        hideLoading();
    }
}

// Add new role
function addNewRole() {
    // Reset form
    document.getElementById('roleForm').reset();
    document.getElementById('role-id').value = '';
    
    // Set modal title
    document.getElementById('roleModalTitle').textContent = 'Agregar Rol';
    
    // Show modal
    const roleModal = new bootstrap.Modal(document.getElementById('roleModal'));
    roleModal.show();
}

// Save role (create or update)
async function saveRole() {
    try {
        const roleId = document.getElementById('role-id').value;
        const isUpdate = roleId !== '';
        
        // Collect form data
        const roleData = {
            name: document.getElementById('role-name').value,
            description: document.getElementById('role-description').value || null
        };
        
        if (isUpdate) {
            roleData.id = parseInt(roleId);
            await apiRequest(API_ENDPOINTS.ROLES, 'PUT', roleData);
            showToast('Éxito', 'Rol actualizado correctamente', 'success');
        } else {
            await apiRequest(API_ENDPOINTS.ROLES, 'POST', roleData);
            showToast('Éxito', 'Rol creado correctamente', 'success');
        }
        
        // Close modal
        const roleModal = bootstrap.Modal.getInstance(document.getElementById('roleModal'));
        roleModal.hide();
        
        // Refresh roles list
        await getAllRoles();
    } catch (error) {
        console.error('Error saving role:', error);
    }
}

// Manage role permissions
async function manageRolePermissions(roleId, roleName) {
    try {
        showLoading();
        
        // Get all forms
        const forms = await apiRequest(API_ENDPOINTS.FORMS);
        
        // Get role form permissions
        const rolePermissions = await apiRequest(API_ENDPOINTS.ROL_FORM_PERMISSIONS_BY_ROL_ID(roleId));
        
        // Create permissions table
        const permissionsTable = document.getElementById('permissions-table');
        permissionsTable.innerHTML = '';
        
        if (forms.length === 0) {
            permissionsTable.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">No hay formularios disponibles</td>
                </tr>
            `;
        } else {
            forms.forEach(form => {
                const formPermission = rolePermissions.find(rp => rp.formId === form.id);
                let canRead = false;
                let canCreate = false;
                let canUpdate = false;
                let canDelete = false;
                let permissionId = null;
                
                if (formPermission) {
                    const permission = formPermission.permission;
                    canRead = permission.can_Read;
                    canCreate = permission.can_Create;
                    canUpdate = permission.can_Update;
                    canDelete = permission.can_Delete;
                    permissionId = permission.id;
                }
                
                const row = document.createElement('tr');
                row.dataset.formId = form.id;
                row.dataset.permissionId = permissionId || '';
                
                row.innerHTML = `
                    <td>${form.name} (${form.code})</td>
                    <td class="text-center">
                        <div class="form-check d-flex justify-content-center">
                            <input class="form-check-input" type="checkbox" value="1" 
                                id="perm-read-${form.id}" ${canRead ? 'checked' : ''}>
                        </div>
                    </td>
                    <td class="text-center">
                        <div class="form-check d-flex justify-content-center">
                            <input class="form-check-input" type="checkbox" value="1" 
                                id="perm-create-${form.id}" ${canCreate ? 'checked' : ''}>
                        </div>
                    </td>
                    <td class="text-center">
                        <div class="form-check d-flex justify-content-center">
                            <input class="form-check-input" type="checkbox" value="1" 
                                id="perm-update-${form.id}" ${canUpdate ? 'checked' : ''}>
                        </div>
                    </td>
                    <td class="text-center">
                        <div class="form-check d-flex justify-content-center">
                            <input class="form-check-input" type="checkbox" value="1" 
                                id="perm-delete-${form.id}" ${canDelete ? 'checked' : ''}>
                        </div>
                    </td>
                `;
                
                permissionsTable.appendChild(row);
            });
        }
        
        // Store role ID
        document.getElementById('rolePermissions-roleId').value = roleId;
        
        // Show modal
        document.querySelector('#rolePermissionsModal .modal-title').textContent = `Permisos - ${roleName}`;
        const rolePermissionsModal = new bootstrap.Modal(document.getElementById('rolePermissionsModal'));
        rolePermissionsModal.show();
        
        hideLoading();
    } catch (error) {
        console.error('Error managing role permissions:', error);
        hideLoading();
    }
}

// Save role permissions
async function saveRolePermissions() {
    try {
        showLoading();
        const roleId = parseInt(document.getElementById('rolePermissions-roleId').value);
        
        // Get all permission rows
        const permissionRows = document.querySelectorAll('#permissions-table tr[data-form-id]');
        
        // Process each row
        for (const row of permissionRows) {
            const formId = parseInt(row.dataset.formId);
            const permissionId = row.dataset.permissionId ? parseInt(row.dataset.permissionId) : null;
            
            // Get permission values
            const canRead = document.getElementById(`perm-read-${formId}`).checked;
            const canCreate = document.getElementById(`perm-create-${formId}`).checked;
            const canUpdate = document.getElementById(`perm-update-${formId}`).checked;
            const canDelete = document.getElementById(`perm-delete-${formId}`).checked;
            
            // Skip if all permissions are false and there's no existing permission
            if (!canRead && !canCreate && !canUpdate && !canDelete && !permissionId) {
                continue;
            }
            
            // Create or update permission
            if (permissionId) {
                // Update existing permission
                await apiRequest(API_ENDPOINTS.PERMISSIONS, 'PUT', {
                    id: permissionId,
                    can_Read: canRead,
                    can_Create: canCreate,
                    can_Update: canUpdate,
                    can_Delete: canDelete
                });
            } else {
                // Create new permission and role-form-permission
                const permission = await apiRequest(API_ENDPOINTS.PERMISSIONS, 'POST', {
                    can_Read: canRead,
                    can_Create: canCreate,
                    can_Update: canUpdate,
                    can_Delete: canDelete
                });
                
                await apiRequest(API_ENDPOINTS.ROL_FORM_PERMISSIONS, 'POST', {
                    rolId: roleId,
                    formId: formId,
                    permissionId: permission.id
                });
            }
        }
        
        showToast('Éxito', 'Permisos actualizados correctamente', 'success');
        
        // Close modal
        const rolePermissionsModal = bootstrap.Modal.getInstance(document.getElementById('rolePermissionsModal'));
        rolePermissionsModal.hide();
        
        hideLoading();
    } catch (error) {
        console.error('Error saving role permissions:', error);
        hideLoading();
    }
}

// Confirm delete role
function confirmDeleteRole(roleId, roleName) {
    // Set up delete confirmation modal
    document.getElementById('delete-message').textContent = `¿Está seguro que desea eliminar el rol ${roleName}?`;
    
    // Configure delete button
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    confirmDeleteBtn.onclick = async () => {
        const isPermanent = document.getElementById('permanent-delete').checked;
        await deleteRole(roleId, isPermanent);
        
        // Close modal
        const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        deleteModal.hide();
    };
    
    // Show modal
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
}

// Delete role
async function deleteRole(roleId, isPermanent = false) {
    try {
        showLoading();
        const url = isPermanent 
            ? API_ENDPOINTS.ROLE_PERMANENT_DELETE(roleId) 
            : API_ENDPOINTS.ROLE_BY_ID(roleId);
        
        await apiRequest(url, 'DELETE');
        
        showToast(
            'Éxito', 
            isPermanent ? 'Rol eliminado permanentemente' : 'Rol eliminado correctamente', 
            'success'
        );
        
        // Refresh roles list
        await getAllRoles();
        hideLoading();
    } catch (error) {
        console.error('Error deleting role:', error);
        hideLoading();
    }
}

// Initialize roles page
function initRolesPage() {
    // Set up event listeners
    document.getElementById('role-add-btn').addEventListener('click', addNewRole);
    document.getElementById('saveRoleBtn').addEventListener('click', saveRole);
    document.getElementById('saveRolePermissionsBtn').addEventListener('click', saveRolePermissions);
    
    // Load initial data
    getAllRoles();
}

/*** Forms Module ***/
let formsData = [];

// Get all forms
async function getAllForms() {
    try {
        showLoading();
        const data = await apiRequest(API_ENDPOINTS.FORMS);
        formsData = data;
        renderFormsTable(data);
        hideLoading();
    } catch (error) {
        console.error('Error fetching forms:', error);
        hideLoading();
    }
}

// Render forms table
function renderFormsTable(forms) {
    const tableBody = document.getElementById('forms-table');
    
    tableBody.innerHTML = '';
    
    if (forms.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">No hay formularios registrados</td>
            </tr>
        `;
        return;
    }
    
    forms.forEach(form => {
        const row = document.createElement('tr');
        
        // Create table cells
        row.innerHTML = `
            <td>${form.id}</td>
            <td>${form.name}</td>
            <td>${form.code}</td>
            <td></td>
            <td>${formatDate(form.createAt)}</td>
            <td></td>
        `;
        
        // Add status badge
        const statusCell = row.cells[3];
        statusCell.appendChild(createStatusBadge(form.active));
        
        // Add action buttons
        const actionsCell = row.cells[5];
        const actionButtons = createActionButtons({
            edit: () => editForm(form.id),
            delete: () => confirmDeleteForm(form.id, form.name)
        });
        
        actionsCell.appendChild(actionButtons);
        tableBody.appendChild(row);
    });
}

// Edit form
async function editForm(formId) {
    try {
        showLoading();
        const form = await apiRequest(API_ENDPOINTS.FORM_BY_ID(formId));
        
        // Populate modal with form data
        document.getElementById('formModalTitle').textContent = 'Editar Formulario';
        document.getElementById('form-id').value = form.id;
        document.getElementById('form-name').value = form.name;
        document.getElementById('form-code').value = form.code;
        document.getElementById('form-active').checked = form.active;
        
        // Show modal
        const formModal = new bootstrap.Modal(document.getElementById('formModal'));
        formModal.show();
        
        hideLoading();
    } catch (error) {
        console.error('Error fetching form for edit:', error);
        hideLoading();
    }
}

// Add new form
function addNewForm() {
    // Reset form
    document.getElementById('formForm').reset();
    document.getElementById('form-id').value = '';
    document.getElementById('form-active').checked = true;
    
    // Set modal title
    document.getElementById('formModalTitle').textContent = 'Agregar Formulario';
    
    // Show modal
    const formModal = new bootstrap.Modal(document.getElementById('formModal'));
    formModal.show();
}

// Save form (create or update)
async function saveForm() {
    try {
        const formId = document.getElementById('form-id').value;
        const isUpdate = formId !== '';
        
        // Collect form data
        const formData = {
            name: document.getElementById('form-name').value,
            code: document.getElementById('form-code').value,
            active: document.getElementById('form-active').checked
        };
        
        if (isUpdate) {
            formData.id = parseInt(formId);
            await apiRequest(API_ENDPOINTS.FORMS, 'PUT', formData);
            showToast('Éxito', 'Formulario actualizado correctamente', 'success');
        } else {
            await apiRequest(API_ENDPOINTS.FORMS, 'POST', formData);
            showToast('Éxito', 'Formulario creado correctamente', 'success');
        }
        
        // Close modal
        const formModal = bootstrap.Modal.getInstance(document.getElementById('formModal'));
        formModal.hide();
        
        // Refresh forms list
        await getAllForms();
    } catch (error) {
        console.error('Error saving form:', error);
    }
}

// Confirm delete form
function confirmDeleteForm(formId, formName) {
    // Set up delete confirmation modal
    document.getElementById('delete-message').textContent = `¿Está seguro que desea eliminar el formulario ${formName}?`;
    
    // Configure delete button
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    confirmDeleteBtn.onclick = async () => {
        const isPermanent = document.getElementById('permanent-delete').checked;
        await deleteForm(formId, isPermanent);
        
        // Close modal
        const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        deleteModal.hide();
    };
    
    // Show modal
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
}

// Delete form
async function deleteForm(formId, isPermanent = false) {
    try {
        showLoading();
        const url = isPermanent 
            ? API_ENDPOINTS.FORM_PERMANENT_DELETE(formId) 
            : API_ENDPOINTS.FORM_BY_ID(formId);
        
        await apiRequest(url, 'DELETE');
        
        showToast(
            'Éxito', 
            isPermanent ? 'Formulario eliminado permanentemente' : 'Formulario eliminado correctamente', 
            'success'
        );
        
        // Refresh forms list
        await getAllForms();
        hideLoading();
    } catch (error) {
        console.error('Error deleting form:', error);
        hideLoading();
    }
}

// Initialize forms page
function initFormsPage() {
    // Set up event listeners
    document.getElementById('form-add-btn').addEventListener('click', addNewForm);
    document.getElementById('saveFormBtn').addEventListener('click', saveForm);
    
    // Load initial data
    getAllForms();
}

/*** Modules Module ***/
let modulesData = [];

// Get all modules
async function getAllModules() {
    try {
        showLoading();
        const data = await apiRequest(API_ENDPOINTS.MODULES);
        modulesData = data;
        renderModulesTable(data);
        hideLoading();
    } catch (error) {
        console.error('Error fetching modules:', error);
        hideLoading();
    }
}

// Render modules table
function renderModulesTable(modules) {
    const tableBody = document.getElementById('modules-table');
    
    tableBody.innerHTML = '';
    
    if (modules.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">No hay módulos registrados</td>
            </tr>
        `;
        return;
    }
    
    modules.forEach(module => {
        const row = document.createElement('tr');
        
        // Create table cells
        row.innerHTML = `
            <td>${module.id}</td>
            <td>${module.code}</td>
            <td></td>
            <td>${formatDate(module.createAt)}</td>
            <td></td>
        `;
        
        // Add status badge
        const statusCell = row.cells[2];
        statusCell.appendChild(createStatusBadge(module.active));
        
        // Add action buttons
        const actionsCell = row.cells[4];
        const actionButtons = createActionButtons({
            edit: () => editModule(module.id),
            delete: () => confirmDeleteModule(module.id, module.code)
        });
        
        actionsCell.appendChild(actionButtons);
        tableBody.appendChild(row);
    });
}

// Edit module
async function editModule(moduleId) {
    try {
        showLoading();
        const module = await apiRequest(API_ENDPOINTS.MODULE_BY_ID(moduleId));
        
        // Populate modal with module data
        document.getElementById('moduleModalTitle').textContent = 'Editar Módulo';
        document.getElementById('module-id').value = module.id;
        document.getElementById('module-code').value = module.code;
        document.getElementById('module-active').checked = module.active;
        
        // Show modal
        const moduleModal = new bootstrap.Modal(document.getElementById('moduleModal'));
        moduleModal.show();
        
        hideLoading();
    } catch (error) {
        console.error('Error fetching module for edit:', error);
        hideLoading();
    }
}

// Add new module
function addNewModule() {
    // Reset form
    document.getElementById('moduleForm').reset();
    document.getElementById('module-id').value = '';
    document.getElementById('module-active').checked = true;
    
    // Set modal title
    document.getElementById('moduleModalTitle').textContent = 'Agregar Módulo';
    
    // Show modal
    const moduleModal = new bootstrap.Modal(document.getElementById('moduleModal'));
    moduleModal.show();
}

// Save module (create or update)
async function saveModule() {
    try {
        const moduleId = document.getElementById('module-id').value;
        const isUpdate = moduleId !== '';
        
        // Collect form data
        const moduleData = {
            code: document.getElementById('module-code').value,
            active: document.getElementById('module-active').checked
        };
        
        if (isUpdate) {
            moduleData.id = parseInt(moduleId);
            await apiRequest(API_ENDPOINTS.MODULES, 'PUT', moduleData);
            showToast('Éxito', 'Módulo actualizado correctamente', 'success');
        } else {
            await apiRequest(API_ENDPOINTS.MODULES, 'POST', moduleData);
            showToast('Éxito', 'Módulo creado correctamente', 'success');
        }
        
        // Close modal
        const moduleModal = bootstrap.Modal.getInstance(document.getElementById('moduleModal'));
        moduleModal.hide();
        
        // Refresh modules list
        await getAllModules();
    } catch (error) {
        console.error('Error saving module:', error);
    }
}

// Confirm delete module
function confirmDeleteModule(moduleId, moduleCode) {
    // Set up delete confirmation modal
    document.getElementById('delete-message').textContent = `¿Está seguro que desea eliminar el módulo ${moduleCode}?`;
    
    // Configure delete button
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    confirmDeleteBtn.onclick = async () => {
        const isPermanent = document.getElementById('permanent-delete').checked;
        await deleteModule(moduleId, isPermanent);
        
        // Close modal
        const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        deleteModal.hide();
    };
    
    // Show modal
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
}

// Delete module
async function deleteModule(moduleId, isPermanent = false) {
    try {
        showLoading();
        const url = isPermanent 
            ? API_ENDPOINTS.MODULE_PERMANENT_DELETE(moduleId) 
            : API_ENDPOINTS.MODULE_BY_ID(moduleId);
        
        await apiRequest(url, 'DELETE');
        
        showToast(
            'Éxito', 
            isPermanent ? 'Módulo eliminado permanentemente' : 'Módulo eliminado correctamente', 
            'success'
        );
        
        // Refresh modules list
        await getAllModules();
        hideLoading();
    } catch (error) {
        console.error('Error deleting module:', error);
        hideLoading();
    }
}

// Initialize modules page
function initModulesPage() {
    // Set up event listeners
    document.getElementById('module-add-btn').addEventListener('click', addNewModule);
    document.getElementById('saveModuleBtn').addEventListener('click', saveModule);
    
    // Load initial data
    getAllModules();
}

/*** Permissions Module ***/
let permissionsData = [];

// Get all permissions
async function getAllPermissions() {
    try {
        showLoading();
        const data = await apiRequest(API_ENDPOINTS.PERMISSIONS);
        permissionsData = data;
        renderPermissionsTable(data);
        hideLoading();
    } catch (error) {
        console.error('Error fetching permissions:', error);
        hideLoading();
    }
}

// Render permissions table
function renderPermissionsTable(permissions) {
    const tableBody = document.getElementById('permissions-list-table');
    
    tableBody.innerHTML = '';
    
    if (permissions.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">No hay permisos registrados</td>
            </tr>
        `;
        return;
    }
    
    permissions.forEach(permission => {
        const row = document.createElement('tr');
        
        // Create table cells
        row.innerHTML = `
            <td>${permission.id}</td>
            <td>${getBadgeForPermission(permission.can_Read, 'Lectura')}</td>
            <td>${getBadgeForPermission(permission.can_Create, 'Creación')}</td>
            <td>${getBadgeForPermission(permission.can_Update, 'Actualización')}</td>
            <td>${getBadgeForPermission(permission.can_Delete, 'Eliminación')}</td>
            <td>${formatDate(permission.createAt)}</td>
            <td></td>
        `;
        
        // Add action buttons
        const actionsCell = row.cells[6];
        const actionButtons = createActionButtons({
            edit: () => editPermission(permission.id),
            delete: () => confirmDeletePermission(permission.id)
        });
        
        actionsCell.appendChild(actionButtons);
        tableBody.appendChild(row);
    });
}

// Get badge for permission
function getBadgeForPermission(value, label) {
    const badgeClass = value ? 'bg-success' : 'bg-secondary';
    return `<span class="badge ${badgeClass}">${value ? '✓ ' + label : '✗ ' + label}</span>`;
}

// Edit permission
async function editPermission(permissionId) {
    try {
        showLoading();
        const permission = await apiRequest(API_ENDPOINTS.PERMISSION_BY_ID(permissionId));
        
        // Populate modal with permission data
        document.getElementById('permissionModalTitle').textContent = 'Editar Permiso';
        document.getElementById('permission-id').value = permission.id;
        document.getElementById('permission-can-read').checked = permission.can_Read;
        document.getElementById('permission-can-create').checked = permission.can_Create;
        document.getElementById('permission-can-update').checked = permission.can_Update;
        document.getElementById('permission-can-delete').checked = permission.can_Delete;
        
        // Show modal
        const permissionModal = new bootstrap.Modal(document.getElementById('permissionModal'));
        permissionModal.show();
        
        hideLoading();
    } catch (error) {
        console.error('Error fetching permission for edit:', error);
        hideLoading();
    }
}

// Add new permission
function addNewPermission() {
    // Reset form
    document.getElementById('permissionForm').reset();
    document.getElementById('permission-id').value = '';
    
    // Set modal title
    document.getElementById('permissionModalTitle').textContent = 'Agregar Permiso';
    
    // Show modal
    const permissionModal = new bootstrap.Modal(document.getElementById('permissionModal'));
    permissionModal.show();
}

// Save permission (create or update)
async function savePermission() {
    try {
        const permissionId = document.getElementById('permission-id').value;
        const isUpdate = permissionId !== '';
        
        // Collect form data
        const permissionData = {
            can_Read: document.getElementById('permission-can-read').checked,
            can_Create: document.getElementById('permission-can-create').checked,
            can_Update: document.getElementById('permission-can-update').checked,
            can_Delete: document.getElementById('permission-can-delete').checked
        };
        
        if (isUpdate) {
            permissionData.id = parseInt(permissionId);
            await apiRequest(API_ENDPOINTS.PERMISSIONS, 'PUT', permissionData);
            showToast('Éxito', 'Permiso actualizado correctamente', 'success');
        } else {
            await apiRequest(API_ENDPOINTS.PERMISSIONS, 'POST', permissionData);
            showToast('Éxito', 'Permiso creado correctamente', 'success');
        }
        
        // Close modal
        const permissionModal = bootstrap.Modal.getInstance(document.getElementById('permissionModal'));
        permissionModal.hide();
        
        // Refresh permissions list
        await getAllPermissions();
    } catch (error) {
        console.error('Error saving permission:', error);
    }
}

// Confirm delete permission
function confirmDeletePermission(permissionId) {
    // Set up delete confirmation modal
    document.getElementById('delete-message').textContent = `¿Está seguro que desea eliminar el permiso #${permissionId}?`;
    
    // Configure delete button
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    confirmDeleteBtn.onclick = async () => {
        const isPermanent = document.getElementById('permanent-delete').checked;
        await deletePermission(permissionId, isPermanent);
        
        // Close modal
        const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        deleteModal.hide();
    };
    
    // Show modal
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
}

// Delete permission
async function deletePermission(permissionId, isPermanent = false) {
    try {
        showLoading();
        const url = isPermanent 
            ? API_ENDPOINTS.PERMISSION_PERMANENT_DELETE(permissionId) 
            : API_ENDPOINTS.PERMISSION_BY_ID(permissionId);
        
        await apiRequest(url, 'DELETE');
        
        showToast(
            'Éxito', 
            isPermanent ? 'Permiso eliminado permanentemente' : 'Permiso eliminado correctamente', 
            'success'
        );
        
        // Refresh permissions list
        await getAllPermissions();
        hideLoading();
    } catch (error) {
        console.error('Error deleting permission:', error);
        hideLoading();
    }
}

// Initialize permissions page
function initPermissionsPage() {
    // Set up event listeners
    document.getElementById('permission-add-btn').addEventListener('click', addNewPermission);
    document.getElementById('savePermissionBtn').addEventListener('click', savePermission);
    
    // Load initial data
    getAllPermissions();
}

/*** Login/Authentication ***/

// Handle login form submission
async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;
    
    try {
        showLoading();
        
        // Call login API (this is a mock since we don't have actual authentication in the API)
        // In a real application, you would make a call to an authentication endpoint
        // For demo purposes, we'll just simulate a successful login
        
        // Simulate API call
        setTimeout(() => {
            // Store auth token and user info in local storage
            const token = 'mock_jwt_token';
            const userInfo = {
                id: 1,
                username: username,
                name: 'Administrador',
                role: 'Admin'
            };
            
            localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
            localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo));
            
            if (rememberMe) {
                localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true');
            } else {
                localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
            }
            
            // Update UI with user info
            document.getElementById('user-info').textContent = `Usuario: ${userInfo.name}`;
            
            // Navigate to home page
            showPage('home-page');
            
            // Load dashboard data
            loadDashboardData();
            
            hideLoading();
        }, 1000);
    } catch (error) {
        console.error('Login error:', error);
        hideLoading();
        
        showToast('Error de Autenticación', 'Usuario o contraseña incorrectos', 'error');
    }
}

// Load dashboard data
async function loadDashboardData() {
    try {
        // Load counts and recent items for dashboard
        const loadDataPromises = [
            getAllClients(),
            getAllPqrs(),
            getAllWorkers(),
            getAllUsers(),
            loadRecentPqrs(),
            loadRecentClients(),
            loadRecentWorkers()
        ];
        
        // Wait for all data to load
        await Promise.all(loadDataPromises);
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const userInfo = localStorage.getItem(STORAGE_KEYS.USER_INFO);
    
    if (token && userInfo) {
        const user = JSON.parse(userInfo);
        document.getElementById('user-info').textContent = `Usuario: ${user.name}`;
        
        // Navigate to home page
        showPage('home-page');
        
        // Load dashboard data
        loadDashboardData();
    } else {
        // Navigate to login page
        showPage('login-page');
    }
}

// Initialize the application
function initApp() {
    // Set up event handlers for navigation
    document.getElementById('home-link').addEventListener('click', () => {
        showPage('home-page');
        loadDashboardData();
    });
    
    document.getElementById('view-clients').addEventListener('click', () => {
        showPage('clients-page');
        initClientsPage();
    });
    
    document.getElementById('add-client').addEventListener('click', () => {
        showPage('clients-page');
        initClientsPage();
        setTimeout(() => {
            addNewClient();
        }, 500);
    });
    
    document.getElementById('view-pqrs').addEventListener('click', () => {
        showPage('pqrs-page');
        initPqrsPage();
    });
    
    document.getElementById('add-pqr').addEventListener('click', () => {
        showPage('pqrs-page');
        initPqrsPage();
        setTimeout(() => {
            addNewPqr();
        }, 500);
    });
    
    document.getElementById('view-workers').addEventListener('click', () => {
        showPage('workers-page');
        initWorkersPage();
    });
    
    document.getElementById('add-worker').addEventListener('click', () => {
        showPage('workers-page');
        initWorkersPage();
        setTimeout(() => {
            addNewWorker();
        }, 500);
    });
    
    document.getElementById('view-users').addEventListener('click', () => {
        showPage('users-page');
        initUsersPage();
    });
    
    document.getElementById('add-user').addEventListener('click', () => {
        showPage('users-page');
        initUsersPage();
        setTimeout(() => {
            addNewUser();
        }, 500);
    });
    
    document.getElementById('view-roles').addEventListener('click', () => {
        showPage('roles-page');
        initRolesPage();
    });
    
    document.getElementById('view-modules').addEventListener('click', () => {
        showPage('modules-page');
        initModulesPage();
    });
    
    document.getElementById('view-forms').addEventListener('click', () => {
        showPage('forms-page');
        initFormsPage();
    });
    
    document.getElementById('view-permissions').addEventListener('click', () => {
        showPage('permissions-page');
        initPermissionsPage();
    });
    
    // Set up dashboard card links
    document.getElementById('footer-clients-link').addEventListener('click', () => {
        showPage('clients-page');
        initClientsPage();
    });
    
    document.getElementById('footer-pqrs-link').addEventListener('click', () => {
        showPage('pqrs-page');
        initPqrsPage();
    });
    
    document.getElementById('footer-workers-link').addEventListener('click', () => {
        showPage('workers-page');
        initWorkersPage();
    });
    
    document.getElementById('footer-users-link').addEventListener('click', () => {
        showPage('users-page');
        initUsersPage();
    });
    
    // Set up login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Set up password toggle in login form
    setupPasswordToggle('login-password', 'toggleLoginPasswordBtn');
    
    // Set up logout button
    document.getElementById('logout-btn').addEventListener('click', () => {
        logout();
    });
    
    // Set up back to home button on error page
    document.getElementById('back-to-home-btn').addEventListener('click', () => {
        showPage('home-page');
        loadDashboardData();
    });
    
    // Check authentication status
    checkAuth();
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', initApp);