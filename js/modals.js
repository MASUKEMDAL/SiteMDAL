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
        this.setupMemberModal();
    }

    setupEventListeners() {
        // Close modals when clicking outside
        window.addEventListener('click', (event) => {
            const modals = ['modal', 'image-modal', 'member-modal'];
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

    setupMemberModal() {
        // Hall of Fame member clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('.hall-of-fame-item')) {
                const memberItem = e.target.closest('.hall-of-fame-item');
                const img = memberItem.querySelector('img');
                const name = memberItem.querySelector('.nome').textContent;
                
                if (img && name) {
                    this.openMemberModal(img.src, name);
                }
            }
        });
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

    openMemberModal(imageSrc, memberName) {
        const memberModal = document.getElementById('member-modal');
        const memberPhoto = document.getElementById('member-photo');
        const memberNameElement = document.getElementById('member-name');
        const memberDescription = document.getElementById('member-description');

        if (memberModal && memberPhoto && memberNameElement && memberDescription) {
            memberPhoto.src = imageSrc;
            memberNameElement.textContent = memberName;
            
            // Get member description based on name
            const description = this.getMemberDescription(memberName);
            memberDescription.textContent = description;
            
            memberModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    getMemberDescription(memberName) {
        const descriptions = {
            "Crazy Dragon": "Membro fundador da MDAL, conhecido por sua criatividade e energia contagiante. Sempre presente nos momentos mais importantes da comunidade.",
            "12 Bala": "Veterano respeitado da MDAL, traz experiência e sabedoria para o grupo. Sua dedicação é inspiradora para todos os membros.",
            "Vizzky": "Talentoso e inovador, Vizzky contribui com ideias únicas e uma perspectiva fresca para os projetos da MDAL.",
            "Samurai": "Com honra e disciplina, Samurai representa os valores tradicionais da MDAL. Sua lealdade é inquestionável.",
            "Leitinho": "Membro carismático e divertido, Leitinho traz alegria e descontração para a comunidade MDAL.",
            "Laurão": "Líder natural e estrategista, Laurão ajuda a guiar a MDAL em direção ao sucesso e crescimento.",
            "Kaminari": "Energético como um raio, Kaminari traz dinamismo e velocidade para todos os projetos da MDAL.",
            "Cabeça": "Pensador e filósofo do grupo, Cabeça sempre tem uma perspectiva interessante sobre os desafios da MDAL.",
            "Buya": "Membro criativo e inovador, Buya traz novas ideias e perspectivas frescas para a comunidade MDAL.",
            "Lemes": "Dedicado e confiável, Lemes é sempre presente nos momentos importantes da MDAL.",
            "Garigas (O cantor gostoso)": "Talento musical excepcional, Garigas encanta a todos com sua voz e carisma únicos.",
            "Guys": "Membro versátil e adaptável, Guys contribui em diversas áreas do universo MDAL.",
            "Paixão": "Com energia contagiante, Paixão inspira todos ao seu redor na comunidade MDAL.",
            "Luan": "Estratégico e analítico, Luan ajuda a tomar as melhores decisões para o crescimento da MDAL.",
            "Vinicin": "Jovem talento em ascensão, Vinicin representa o futuro promissor da comunidade MDAL."
        };

        return descriptions[memberName] || "Membro valioso da comunidade MDAL, contribuindo para o crescimento e sucesso do grupo.";
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    closeAllModals() {
        const modals = ['modal', 'image-modal', 'member-modal'];
        modals.forEach(modalId => this.closeModal(modalId));
    }
}

// Initialize modal manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.modalManager = new ModalManager();
});

// Export for use in other modules
window.ModalManager = ModalManager;