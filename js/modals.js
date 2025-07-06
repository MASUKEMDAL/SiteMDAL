// Modal functionality
class ModalManager {
    constructor() {
        this.currentModalImages = [];
        this.currentModalTitles = [];
        this.currentImageIndex = 0;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupProductModals();
        this.setupImageModal();
        this.setupPaymentModal();
    }

    setupEventListeners() {
        // Close modals when clicking outside
        window.addEventListener('click', (event) => {
            const modals = ['modal', 'image-modal', 'payment-modal'];
            modals.forEach(modalId => {
                const modal = document.getElementById(modalId);
                if (event.target === modal) {
                    this.closeModal(modalId);
                }
            });
        });

        // Close modals with Escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    setupProductModals() {
        // Product purchase buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('comprar-btn')) {
                this.openProductModal(e.target);
            }
        });

        // Modal close buttons
        const closeButtons = document.querySelectorAll('.close');
        closeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // Image navigation in product modal
        const prevBtn = document.getElementById('modal-prev-img');
        const nextBtn = document.getElementById('modal-next-img');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.navigateModalImage(-1));
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.navigateModalImage(1));
        }
    }

    setupImageModal() {
        // Product image clicks for enlarged view
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('product-image')) {
                this.openImageModal(e.target.src);
            }
        });
    }

    setupPaymentModal() {
        // Payment modal will be handled by the cart system
        window.PaymentModal = {
            open: (method, total, items) => {
                this.openPaymentModal(method, total, items);
            }
        };
    }

    openProductModal(button) {
        const modal = document.getElementById('modal');
        const modalImg = document.getElementById('modal-img');
        const modalTitulo = document.getElementById('modal-titulo');
        const modalPreco = document.getElementById('modal-preco');
        const modalSizeSelector = document.getElementById('modal-size-selector');
        const productSizeSelect = document.getElementById('product-size');
        const addToCartBtn = document.querySelector('.add-to-cart-btn');
        const prevBtn = document.getElementById('modal-prev-img');
        const nextBtn = document.getElementById('modal-next-img');

        if (!modal || !button) return;

        // Get product data
        const imgSrc = button.getAttribute('data-img');
        const nomeProduto = button.getAttribute('data-nome');
        const precoProduto = parseFloat(button.getAttribute('data-preco'));
        const produtoType = button.getAttribute('data-produto-type');
        const imagensData = button.getAttribute('data-imagens');
        const titulosData = button.getAttribute('data-titulos');

        // Set price
        modalPreco.textContent = `Preço: ${MDALWebsite.formatPrice(precoProduto)}`;

        // Handle multiple images
        if (produtoType === 'camiseta' && imagensData && titulosData) {
            this.currentModalImages = imagensData.split(',');
            this.currentModalTitles = titulosData.split(',');
            this.currentImageIndex = 0;

            if (this.currentModalImages.length !== this.currentModalTitles.length) {
                console.error('Mismatch between images and titles count');
                this.setupSingleImage(modalImg, modalTitulo, imgSrc, nomeProduto, prevBtn, nextBtn);
            } else {
                this.setupMultipleImages(modalImg, modalTitulo, prevBtn, nextBtn);
            }
        } else {
            this.setupSingleImage(modalImg, modalTitulo, imgSrc, nomeProduto, prevBtn, nextBtn);
        }

        // Setup size selector
        if (produtoType === 'camiseta') {
            modalSizeSelector.style.display = 'block';
            productSizeSelect.value = '';
        } else {
            modalSizeSelector.style.display = 'none';
        }

        // Update add to cart button
        this.updateAddToCartButton(addToCartBtn, nomeProduto, precoProduto, imgSrc, produtoType);

        // Show modal
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    setupSingleImage(modalImg, modalTitulo, imgSrc, nomeProduto, prevBtn, nextBtn) {
        this.currentModalImages = [imgSrc];
        this.currentModalTitles = [nomeProduto];
        this.currentImageIndex = 0;
        
        modalImg.src = imgSrc;
        modalTitulo.textContent = nomeProduto;
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
    }

    setupMultipleImages(modalImg, modalTitulo, prevBtn, nextBtn) {
        modalImg.src = this.currentModalImages[this.currentImageIndex];
        modalTitulo.textContent = this.currentModalTitles[this.currentImageIndex];
        prevBtn.style.display = 'flex';
        nextBtn.style.display = 'flex';
    }

    navigateModalImage(direction) {
        if (this.currentModalImages.length <= 1) return;

        this.currentImageIndex += direction;
        
        if (this.currentImageIndex < 0) {
            this.currentImageIndex = this.currentModalImages.length - 1;
        } else if (this.currentImageIndex >= this.currentModalImages.length) {
            this.currentImageIndex = 0;
        }

        const modalImg = document.getElementById('modal-img');
        const modalTitulo = document.getElementById('modal-titulo');
        const addToCartBtn = document.querySelector('.add-to-cart-btn');

        if (modalImg && modalTitulo) {
            modalImg.src = this.currentModalImages[this.currentImageIndex];
            modalTitulo.textContent = this.currentModalTitles[this.currentImageIndex];
            
            // Update add to cart button with current image and title
            if (addToCartBtn) {
                addToCartBtn.setAttribute('data-img', this.currentModalImages[this.currentImageIndex]);
                addToCartBtn.setAttribute('data-nome', this.currentModalTitles[this.currentImageIndex]);
            }
        }
    }

    updateAddToCartButton(button, nome, preco, img, produtoType) {
        if (!button) return;

        const currentTitle = this.currentModalTitles[this.currentImageIndex] || nome;
        const currentImg = this.currentModalImages[this.currentImageIndex] || img;

        button.setAttribute('data-nome', currentTitle);
        button.setAttribute('data-preco', preco);
        button.setAttribute('data-img', currentImg);
        button.setAttribute('data-produto-type', produtoType);
    }

    openImageModal(imageSrc) {
        const imageModal = document.getElementById('image-modal');
        const expandedImage = document.getElementById('expanded-image');

        if (imageModal && expandedImage) {
            expandedImage.src = imageSrc;
            imageModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    openPaymentModal(method, total, items) {
        const paymentModal = document.getElementById('payment-modal');
        const paymentDetails = document.getElementById('payment-details');

        if (!paymentModal || !paymentDetails) return;

        paymentDetails.innerHTML = '';

        if (method === 'card' || method === 'paypal') {
            this.setupCardOrPayPalPayment(paymentDetails, method, total, items);
        } else if (method === 'pix') {
            this.setupPixPayment(paymentDetails, total, items);
        }

        paymentModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    setupCardOrPayPalPayment(container, method, total, items) {
        const paymentLink = this.getPaymentLink(method, total, items);
        
        if (paymentLink) {
            const linkElement = document.createElement('a');
            linkElement.href = paymentLink;
            linkElement.target = '_blank';
            linkElement.className = `btn btn-${method === 'card' ? 'card' : 'paypal'}`;
            linkElement.textContent = `Pagar com ${method === 'card' ? 'Cartão' : 'PayPal'}`;
            
            container.appendChild(linkElement);
            
            const description = document.createElement('p');
            description.textContent = `Você será redirecionado para a página de pagamento ${method === 'card' ? 'do Cartão' : 'do PayPal'}.`;
            description.style.marginTop = '1rem';
            container.appendChild(description);
        } else {
            container.innerHTML = '<p>Não foi possível gerar o link de pagamento para esta opção.</p>';
        }
    }

    setupPixPayment(container, total, items) {
        const pixData = this.getPixData(total, items);
        
        if (pixData && pixData.qrCodeImgUrl) {
            const qrCodeImg = document.createElement('img');
            qrCodeImg.src = pixData.qrCodeImgUrl;
            qrCodeImg.alt = 'QR Code Pix';
            qrCodeImg.style.maxWidth = '200px';
            qrCodeImg.style.margin = '1rem auto';
            qrCodeImg.style.display = 'block';
            container.appendChild(qrCodeImg);
        }

        if (pixData && pixData.pixKey) {
            const keyInfo = document.createElement('p');
            keyInfo.innerHTML = `Chave Pix: <strong>${pixData.pixKey}</strong>`;
            container.appendChild(keyInfo);

            const copyButton = document.createElement('button');
            copyButton.className = 'btn btn-primary';
            copyButton.textContent = 'Copiar Chave Pix';
            copyButton.style.marginTop = '1rem';
            
            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(pixData.pixKey).then(() => {
                    if (window.cart) {
                        window.cart.showNotification('Chave Pix copiada!', 'success');
                    }
                }).catch(() => {
                    if (window.cart) {
                        window.cart.showNotification('Erro ao copiar chave Pix', 'error');
                    }
                });
            });
            
            container.appendChild(copyButton);
        }

        const totalInfo = document.createElement('p');
        totalInfo.innerHTML = `<strong>Total a pagar: ${MDALWebsite.formatPrice(total)}</strong>`;
        totalInfo.style.marginTop = '1rem';
        totalInfo.style.fontSize = '1.2rem';
        container.appendChild(totalInfo);
    }

    getPaymentLink(method, total, items) {
        // Mock payment links - replace with real payment gateway integration
        console.log(`Generating ${method} payment link for total: ${total}, items:`, items);
        
        if (method === 'card') {
            return `https://seu-gateway-de-pagamento.com/checkout/card?amount=${total.toFixed(2)}`;
        } else if (method === 'paypal') {
            return `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&amount=${total.toFixed(2)}&currency_code=BRL&item_name=Compra MDAL`;
        }
        
        return null;
    }

    getPixData(total, items) {
        // Mock PIX data - replace with real PIX API integration
        console.log(`Generating PIX data for total: ${total}, items:`, items);
        
        return {
            qrCodeImgUrl: 'https://via.placeholder.com/200x200/2a2a2a/ffffff?text=QR+CODE+PIX',
            pixKey: 'suachave@email.com', // Replace with real PIX key
            copyPasteCode: '00020126330014BR.GOV.BCB.PIX01110000000000000052040000530398656304F080'
        };
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    closeAllModals() {
        const modals = ['modal', 'image-modal', 'payment-modal'];
        modals.forEach(modalId => this.closeModal(modalId));
    }
}

// Initialize modal manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.modalManager = new ModalManager();
});

// Export for use in other modules
window.ModalManager = ModalManager;