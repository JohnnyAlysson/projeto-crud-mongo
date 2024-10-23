// API endpoints
const API_URL = 'http://localhost:3000/api/products';

// DOM Elements
const itemsList = document.getElementById('itemsList');
const addItemBtn = document.getElementById('addItemBtn');
const itemModal = document.getElementById('itemModal');
const closeModal = document.getElementById('closeModal');
const saveItemBtn = document.getElementById('saveItem');
const categoryDropdown = document.getElementById('categoryDropdown');
const dropdownSelected = categoryDropdown.querySelector('.dropdown-selected span');

let editingItemId = null;

// Event Listeners
addItemBtn.addEventListener('click', () => openModal());
closeModal.addEventListener('click', () => closeModalHandler());
saveItemBtn.addEventListener('click', saveItem);
categoryDropdown.addEventListener('click', toggleDropdown);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchItems();
    setupDropdownOptions();
});

// Fetch items from API
async function fetchItems() {
    try {
        const response = await fetch(API_URL);
        const items = await response.json();
        renderItems(items);
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}

// Render items in the list
function renderItems(items) {
    itemsList.innerHTML = '';
    items.forEach(item => {
        const itemElement = createItemElement(item);
        itemsList.appendChild(itemElement);
    });
}

// Create item card element
function createItemElement(item) {
    const div = document.createElement('div');
    div.className = 'item-card';
    div.innerHTML = `
        <div class="item-info">
            <span class="item-name">${item.name}</span>
            <span class="item-quantity">${item.quantity} ${item.unit || 'un.'}</span>
            <span class="item-category" data-category="${item.category}">${item.category}</span>
        </div>
        <div class="item-actions">
            <button class="action-button edit-btn" data-id="${item._id}">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
            </button>
            <button class="action-button delete-btn" data-id="${item._id}">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            </button>
        </div>
    `;

    // Add event listeners for edit and delete buttons
    div.querySelector('.edit-btn').addEventListener('click', () => openModal(item));
    div.querySelector('.delete-btn').addEventListener('click', () => deleteItem(item._id));

    return div;
}

// Modal handlers
function openModal(item = null) {
    const modalTitle = itemModal.querySelector('h2');
    const itemNameInput = document.getElementById('itemName');
    const itemQuantityInput = document.getElementById('itemQuantity');
    const itemUnitSelect = document.getElementById('itemUnit');

    if (item) {
        modalTitle.textContent = 'Editar Item';
        itemNameInput.value = item.name;
        itemQuantityInput.value = item.quantity;
        itemUnitSelect.value = item.unit || 'un';
        dropdownSelected.textContent = item.category;
        editingItemId = item._id;
    } else {
        modalTitle.textContent = 'Adicionar Item';
        itemNameInput.value = '';
        itemQuantityInput.value = '1';
        itemUnitSelect.value = 'un';
        dropdownSelected.textContent = 'Selecione uma categoria';
        editingItemId = null;
    }
    
    itemModal.classList.add('active');
}

function closeModalHandler() {
    itemModal.classList.remove('active');
    editingItemId = null;
}

// Dropdown handlers
function setupDropdownOptions() {
    const options = categoryDropdown.querySelectorAll('.option');
    options.forEach(option => {
        option.addEventListener('click', () => {
            dropdownSelected.textContent = option.textContent;
            categoryDropdown.classList.remove('active');
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!categoryDropdown.contains(e.target)) {
            categoryDropdown.classList.remove('active');
        }
    });
}

function toggleDropdown(e) {
    e.stopPropagation();
    categoryDropdown.classList.toggle('active');
}

// API Operations
async function saveItem() {
    const itemName = document.getElementById('itemName').value;
    const itemCategory = dropdownSelected.textContent;
    const itemQuantity = document.getElementById('itemQuantity').value;
    const itemUnit = document.getElementById('itemUnit').value;

    if (!itemName || itemCategory === 'Selecione uma categoria' || !itemQuantity) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    const itemData = {
        name: itemName,
        category: itemCategory.toLowerCase(),
        quantity: parseInt(itemQuantity),
        unit: itemUnit
    };

    try {
        if (editingItemId) {
            // Update existing item
            await fetch(`${API_URL}/${editingItemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(itemData),
            });
        } else {
            // Create new item
            await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(itemData),
            });
        }

        closeModalHandler();
        fetchItems();
    } catch (error) {
        console.error('Error saving item:', error);
        alert('Erro ao salvar o item. Por favor, tente novamente.');
    }
}

async function deleteItem(id) {
    if (!confirm('Tem certeza que deseja excluir este item?')) {
        return;
    }

    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        fetchItems();
    } catch (error) {
        console.error('Error deleting item:', error);
        alert('Erro ao excluir o item. Por favor, tente novamente.');
    }
}

// Utility Functions
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Add loading state handlers
function showLoading() {
    itemsList.innerHTML = '<div class="loading">Carregando...</div>';
}

function hideLoading() {
    const loading = itemsList.querySelector('.loading');
    if (loading) {
        loading.remove();
    }
}

// Error handling
function handleError(error) {
    console.error('Error:', error);
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = 'Ocorreu um erro. Por favor, tente novamente.';
    itemsList.appendChild(errorMessage);
}

// Add some animations
function addItemAnimation(element) {
    element.style.animation = 'fadeIn 0.3s ease-in';
}

// Add this to your CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .loading {
        text-align: center;
        padding: 2rem;
        color: var(--gray-200);
    }

    .error-message {
        text-align: center;
        padding: 1rem;
        color: #ff6b6b;
        background-color: var(--gray-400);
        border-radius: 6px;
        margin: 1rem 0;
    }
`;
document.head.appendChild(style);

// Initialize tooltips
function initTooltips() {
    const buttons = document.querySelectorAll('.action-button');
    buttons.forEach(button => {
        button.setAttribute('title', button.classList.contains('edit-btn') ? 'Editar' : 'Excluir');
    });
}

// Add responsive handling
function handleResponsive() {
    const isMobile = window.innerWidth <= 768;
    const itemCards = document.querySelectorAll('.item-card');
    
    itemCards.forEach(card => {
        if (isMobile) {
            card.classList.add('mobile');
        } else {
            card.classList.remove('mobile');
        }
    });
}

window.addEventListener('resize', handleResponsive);
document.addEventListener('DOMContentLoaded', () => {
    handleResponsive();
    initTooltips();
});