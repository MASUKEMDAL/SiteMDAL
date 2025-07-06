// Shopping Cart functionality
class ShoppingCart {
    constructor() {
        this.cart = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCartDisplay();
    }

    setupEventListeners() {
        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart-btn')) {
                this.handleAddToCart(e.target);
            }
            
            if (e.target.classList.contains('remove-item-btn')) {
                this.handleRemoveFromCart(e.target);
            }
        });

        // WhatsApp checkout button
        const whatsappButton = document.getElementById('btn-checkout-whatsapp');
        if (whatsappButton) {
            whatsappButton.addEventListener('click', () => {
                this.handleWhatsAppCheckout();
            });
        }
    }

    handleAddToCart(button) {
        const nome = button.getAttribute('data-nome');
        const preco = parseFloat(button.getAttribute('data-preco'));
        const img = button.getAttribute('data-img');
        const produtoType = button.getAttribute('data-produto-type');

        let tamanho = null;

        // Check if size is required for shirts
        if (produtoType === 'camiseta') {
            const sizeSelect = document.getElementById('product-size');
            if (sizeSelect) {
                tamanho = sizeSelect.value;
                if (!tamanho) {
                    this.showNotification('Por favor, selecione um tamanho para a camiseta.', 'warning');
                    return;
                }
            }
        }

        if (nome && !isNaN(preco)) {
            const item = {
                id: this.generateId(),
                nome,
                preco,
                img,
                tamanho,
                produtoType
            };

            this.addItem(item);
            this.closeModal();
            this.showNotification('Item adicionado ao carrinho!', 'success');
        } else {
            this.showNotification('Erro ao adicionar item ao carrinho.', 'error');
        }
    }

    handleRemoveFromCart(button) {
        const index = parseInt(button.getAttribute('data-index'));
        this.removeItem(index);
        this.showNotification('Item removido do carrinho.', 'info');
    }

    handleWhatsAppCheckout() {
        if (this.cart.length === 0) {
            this.showNotification('Seu carrinho está vazio.', 'warning');
            return;
        }

        const message = this.generateWhatsAppMessage();
        const whatsappUrl = `https://wa.me/5534998829396?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }

    generateWhatsAppMessage() {
        let message = "🛒 *Pedido MDAL*\n\n";
        message += "Olá! Gostaria de finalizar meu pedido:\n\n";

        this.cart.forEach((item, index) => {
            const displayName = item.tamanho ? `${item.nome} (${item.tamanho})` : item.nome;
            message += `${index + 1}. ${displayName} - ${MDALWebsite.formatPrice(item.preco)}\n`;
        });

        message += `\n💰 *Total: ${MDALWebsite.formatPrice(this.getTotal())}*\n\n`;
        message += "Aguardo informações sobre formas de pagamento e entrega. Obrigado!";

        return message;
    }

    addItem(item) {
        this.cart.push(item);
        this.updateCartDisplay();
        this.saveToLocalStorage();
    }

    removeItem(index) {
        if (index >= 0 && index < this.cart.length) {
            this.cart.splice(index, 1);
            this.updateCartDisplay();
            this.saveToLocalStorage();
        }
    }

    updateCartDisplay() {
        this.updateCartList();
        this.updateCartTotal();
        this.updateCartCount();
        this.updateCheckoutButtons();
    }

    updateCartList() {
        const cartItemsList = document.getElementById('cart-items');
        if (!cartItemsList) return;

        cartItemsList.innerHTML = '';

        this.cart.forEach((item, index) => {
            const displayName = item.tamanho ? `${item.nome} (${item.tamanho})` : item.nome;
            const listItem = document.createElement('li');
            
            listItem.innerHTML = `
                <div class="cart-item-info">
                    <span class="cart-item-name">${displayName}</span>
                    <span class="cart-item-price">${MDALWebsite.formatPrice(item.preco)}</span>
                </div>
                <button class="remove-item-btn" data-index="${index}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
            `;
            
            cartItemsList.appendChild(listItem);
        });
    }

    updateCartTotal() {
        const cartTotalElement = document.getElementById('cart-total');
        if (cartTotalElement) {
            const total = this.getTotal();
            cartTotalElement.textContent = `Total: ${MDALWebsite.formatPrice(total)}`;
        }
    }

    updateCartCount() {
        const countElements = [
            document.getElementById('cart-count'),
            document.getElementById('cart-item-count')
        ];

        countElements.forEach(element => {
            if (element) {
                element.textContent = this.cart.length;
            }
        });
    }

    updateCheckoutButtons() {
        const checkoutButton = document.getElementById('btn-checkout-whatsapp');
        const isEmpty = this.cart.length === 0;

        if (checkoutButton) {
            checkoutButton.disabled = isEmpty;
            checkoutButton.style.opacity = isEmpty ? '0.5' : '1';
            checkoutButton.style.cursor = isEmpty ? 'not-allowed' : 'pointer';
        }
    }

    getTotal() {
        return this.cart.reduce((sum, item) => sum + item.preco, 0);
    }

    generateId() {
        return Date.now() + Math.random().toString(36).substr(2, 9);
    }

    closeModal() {
        const modal = document.getElementById('modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add styles if not already present
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: var(--background-light);
                    color: var(--text-primary);
                    padding: 1rem 1.5rem;
                    border-radius: var(--radius-base);
                    box-shadow: var(--shadow-lg);
                    z-index: 10000;
                    transform: translateX(100%);
                    transition: transform 0.3s ease;
                    max-width: 300px;
                    border-left: 4px solid;
                }
                
                .notification-success { border-left-color: #2ecc71; }
                .notification-error { border-left-color: #e74c3c; }
                .notification-warning { border-left-color: #f39c12; }
                .notification-info { border-left-color: #3498db; }
                
                .notification.show {
                    transform: translateX(0);
                }
                
                .notification-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 1rem;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    font-size: 1.2rem;
                    padding: 0;
                    line-height: 1;
                }
                
                .notification-close:hover {
                    color: var(--text-primary);
                }
            `;
            document.head.appendChild(styles);
        }

        // Add to DOM
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Auto-hide after 5 seconds
        const autoHide = setTimeout(() => this.hideNotification(notification), 5000);

        // Manual close
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            clearTimeout(autoHide);
            this.hideNotification(notification);
        });
    }

    hideNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    saveToLocalStorage() {
        try {
            localStorage.setItem('mdal-cart', JSON.stringify(this.cart));
        } catch (error) {
            console.warn('Could not save cart to localStorage:', error);
        }
    }

    loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem('mdal-cart');
            if (saved) {
                this.cart = JSON.parse(saved);
                this.updateCartDisplay();
            }
        } catch (error) {
            console.warn('Could not load cart from localStorage:', error);
        }
    }

    clearCart() {
        this.cart = [];
        this.updateCartDisplay();
        this.saveToLocalStorage();
    }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cart = new ShoppingCart();
    window.cart.loadFromLocalStorage();
});

// Export for use in other modules
window.ShoppingCart = ShoppingCart;