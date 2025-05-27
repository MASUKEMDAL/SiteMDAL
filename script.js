  // Pega elementos do modal de produto (detalhes do produto)
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modal-img');
  const modalTitulo = document.getElementById('modal-titulo');
  const modalPreco = document.getElementById('modal-preco');
  const modalSizeSelectorDiv = document.getElementById('modal-size-selector'); // Div do seletor de tamanho
  const productSizeSelect = document.getElementById('product-size'); // Elemento select do tamanho
  const modalCloseSpan = document.getElementById('modal-close'); // Pega o X do modal de detalhes
  const addToCartBtn = document.querySelector('.add-to-cart-btn');

    // Elementos para navegação de imagem no modal de detalhes
  const modalImgContainer = document.querySelector('.modal-img-container');
  const modalPrevImgBtn = document.getElementById('modal-prev-img');
  const modalNextImgBtn = document.getElementById('modal-next-img');

  let currentModalImages = []; // Array para armazenar as URLs das imagens do produto atual no modal
  let currentModalTitles = []; // Array para armazenar os títulos correspondentes
  let currentImageIndex = 0; // Índice da imagem atualmente exibida no modal

  // Elementos do Modal de Imagem Ampliada
  const imageModal = document.getElementById('image-modal');
  const expandedImage = document.getElementById('expanded-image');
  const imageModalCloseSpan = document.getElementById('image-modal-close');

  // Elementos do Modal de Pagamento
  const paymentModal = document.getElementById('payment-modal');
  const paymentModalCloseSpan = document.getElementById('payment-modal-close');
  const paymentDetailsDiv = document.getElementById('payment-details');

  // Elementos do Carrinho
  const cartItemsList = document.getElementById('cart-items');
  const cartTotalSpan = document.getElementById('cart-total');
  const cartItemCountSpan = document.getElementById('cart-item-count'); // Contador no título do carrinho
  const headerCartCountSpan = document.getElementById('cart-count'); // Contador no cabeçalho
  const btnCheckoutCard = document.getElementById('btn-checkout-card');
  const btnCheckoutPix = document.getElementById('btn-checkout-pix');
  const btnCheckoutPaypal = document.getElementById('btn-checkout-paypal');


  // Array para armazenar os itens do carrinho
  let cart = [];

  // --- Funções do Carrinho ---

  // Função para atualizar a exibição do carrinho
  function updateCartDisplay() {
    // Limpa a lista de itens atual
    cartItemsList.innerHTML = '';
    let total = 0;

    // Adiciona cada item do carrinho à lista
    cart.forEach((item, index) => {
      // Inclui o tamanho se existir
      const itemDisplayName = item.tamanho ? `${item.nome} (${item.tamanho})` : item.nome;
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <span>${itemDisplayName} - R$ ${item.preco.toFixed(2).replace('.', ',')}</span>
        <button class="remove-item-btn" data-index="${index}">Remover</button>
      `;
      cartItemsList.appendChild(listItem);
      total += item.preco;
    });

    // Atualiza o total e os contadores
    cartTotalSpan.innerText = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
    cartItemCountSpan.innerText = cart.length;
    headerCartCountSpan.innerText = cart.length; // Atualiza o contador no cabeçalho

    // Habilita/desabilita botões de checkout se o carrinho estiver vazio
    if (cart.length === 0) {
      btnCheckoutCard.disabled = true;
      btnCheckoutPix.disabled = true;
      btnCheckoutPaypal.disabled = true;
    } else {
      btnCheckoutCard.disabled = false;
      btnCheckoutPix.disabled = false;
      btnCheckoutPaypal.disabled = false;
    }
  }

  // Adiciona um item ao carrinho
  function addItemToCart(item) {
    cart.push(item);
    updateCartDisplay();
  }

  // Remove um item do carrinho pelo índice
  function removeItemFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
  }

  // --- Lógica dos Modais ---

  // Para cada botão de compra, adiciona evento de clique para abrir o modal de detalhes
  document.querySelectorAll('.comprar-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Pega os atributos de dados do botão
      const imgSrc = btn.getAttribute('data-img');
      const nomeProdutoInicial = btn.getAttribute('data-nome'); // Nome inicial do produto
      const precoProduto = parseFloat(btn.getAttribute('data-preco')); // Converte para número
      const produtoType = btn.getAttribute('data-produto-type'); // Pega o tipo de produto
      const imagensData = btn.getAttribute('data-imagens'); // Pega o atributo data-imagens (URLs)
      const titulosData = btn.getAttribute('data-titulos'); // Pega o atributo data-titulos

      // Atualiza o preço no modal (o preço é o mesmo para todas as cores)
      modalPreco.innerText = `Preço: R$ ${precoProduto.toFixed(2).replace('.', ',')}`; // Formata para exibir


      // Lógica para múltiplas imagens e títulos (apenas para produtos com data-imagens e data-titulos)
      if (produtoType === 'camiseta' && imagensData && titulosData) {
          currentModalImages = imagensData.split(','); // Divide as URLs por vírgula
          currentModalTitles = titulosData.split(','); // Divide os títulos por vírgula
          currentImageIndex = 0; // Começa na primeira imagem

          // Verifica se o número de imagens e títulos coincide
          if (currentModalImages.length !== currentModalTitles.length) {
              console.error("Número de imagens e títulos no data-atributos não coincide!");
              // Fallback para exibir apenas a primeira imagem e o título inicial
              modalImg.src = imgSrc;
              modalTitulo.innerText = nomeProdutoInicial;
              modalPrevImgBtn.style.display = 'none';
              modalNextImgBtn.style.display = 'none';
              currentModalImages = [imgSrc];
              currentModalTitles = [nomeProdutoInicial]; // Usar o nome inicial como único título
          } else {
             modalImg.src = currentModalImages[currentImageIndex]; // Exibe a primeira imagem
             modalTitulo.innerText = currentModalTitles[currentImageIndex]; // Exibe o primeiro título
             modalPrevImgBtn.style.display = 'flex'; // Mostra botões de navegação
             modalNextImgBtn.style.display = 'flex';
          }

           // Atualiza o atributo data-img do botão Add to Cart com a URL da imagem atual
          addToCartBtn.setAttribute('data-img', currentModalImages[currentImageIndex]);

      } else {
          // Para produtos com uma única imagem ou sem data-imagens/data-titulos
          currentModalImages = [imgSrc]; // Define apenas a imagem inicial como array
          currentModalTitles = [nomeProdutoInicial]; // Define apenas o título inicial como array
          currentImageIndex = 0;
          modalImg.src = imgSrc;
          modalTitulo.innerText = nomeProdutoInicial; // Exibe o título inicial
          modalPrevImgBtn.style.display = 'none'; // Esconde botões de navegação
          modalNextImgBtn.style.display = 'none';
           // Atualiza o atributo data-img do botão Add to Cart com a URL da imagem inicial
          addToCartBtn.setAttribute('data-img', imgSrc);
      }


      // Atualiza os atributos de dados do botão "Adicionar ao Carrinho" no modal
      // O nome do produto no carrinho será o nome inicial ou o nome da cor selecionada
      addToCartBtn.setAttribute('data-nome', modalTitulo.innerText); // Usa o título atual do modal
      addToCartBtn.setAttribute('data-preco', precoProduto);
      // O atributo data-img do botão "Adicionar ao Carrinho" já foi atualizado acima com a imagem correta
      addToCartBtn.setAttribute('data-produto-type', produtoType); // Passa o tipo para o botão

      // Mostra ou esconde o seletor de tamanho com base no tipo de produto
      if (produtoType === 'camiseta') {
          modalSizeSelectorDiv.style.display = 'block';
          // Resetar o seletor de tamanho para a opção padrão "Selecione o Tamanho"
          productSizeSelect.value = "";
      } else {
          modalSizeSelectorDiv.style.display = 'none';
      }

      // Mostra o modal de detalhes
      modal.style.display = 'flex';
    });
  });

    // Lógica para navegar entre as imagens no modal de detalhes
    modalPrevImgBtn.addEventListener('click', () => {
        if (currentModalImages.length > 1) {
            currentImageIndex = (currentImageIndex - 1 + currentModalImages.length) % currentModalImages.length;
            modalImg.src = currentModalImages[currentImageIndex]; // Atualiza a imagem
            modalTitulo.innerText = currentModalTitles[currentImageIndex]; // Atualiza o título
            // Atualiza os atributos data-img e data-nome do botão Add to Cart
            addToCartBtn.setAttribute('data-img', currentModalImages[currentImageIndex]);
            addToCartBtn.setAttribute('data-nome', currentModalTitles[currentImageIndex]); // Salva o nome da cor no carrinho
        }
    });

    modalNextImgBtn.addEventListener('click', () => {
        if (currentModalImages.length > 1) {
            currentImageIndex = (currentImageIndex + 1) % currentModalImages.length;
            modalImg.src = currentModalImages[currentImageIndex]; // Atualiza a imagem
            modalTitulo.innerText = currentModalTitles[currentImageIndex]; // Atualiza o título
             // Atualiza os atributos data-img e data-nome do botão Add to Cart
            addToCartBtn.setAttribute('data-img', currentModalImages[currentImageIndex]);
            addToCartBtn.setAttribute('data-nome', currentModalTitles[currentImageIndex]); // Salva o nome da cor no carrinho
        }
    });


  // Adiciona evento de clique ao botão "Adicionar ao Carrinho" no modal de detalhes
  addToCartBtn.addEventListener('click', () => {
    const nome = addToCartBtn.getAttribute('data-nome'); // Pega o nome (agora o nome da cor)
    const preco = parseFloat(addToCartBtn.getAttribute('data-preco'));
    const img = addToCartBtn.getAttribute('data-img'); // Opcional, se quiser exibir a imagem no carrinho
    const produtoType = addToCartBtn.getAttribute('data-produto-type');

    let tamanho = null; // Tamanho padrão é null

    // Se for camiseta, pega o tamanho selecionado e valida
    if (produtoType === 'camiseta') {
        tamanho = productSizeSelect.value;
        if (!tamanho) {
             alert('Por favor, selecione um tamanho para a camiseta.');
             return; // Impede adicionar ao carrinho se o tamanho não foi selecionado
        }
    }

    if (nome && preco) {
      // Adiciona o tamanho ao objeto do item
      addItemToCart({ nome: nome, preco: preco, img: img, tamanho: tamanho });
      modal.style.display = 'none'; // Fecha o modal após adicionar
    } else {
      // Isso só aconteceria se os atributos data-nome ou data-preco estivessem faltando
      alert('Erro ao adicionar item ao carrinho. Informações do produto incompletas.');
    }
  });

  // Adiciona evento de clique nas imagens dos produtos para abrir o modal de imagem ampliada
  document.querySelectorAll('.produto-img').forEach(img => {
      img.addEventListener('click', () => {
          const imgSrc = img.getAttribute('src');
          expandedImage.src = imgSrc; // Define a source da imagem ampliada
          imageModal.style.display = 'flex'; // Mostra o modal de imagem
      });
  });


  // Adiciona evento de clique para remover itens do carrinho (delegação de evento)
  cartItemsList.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-item-btn')) {
      const indexToRemove = parseInt(event.target.getAttribute('data-index'));
      removeItemFromCart(indexToRemove);
    }
  });

  // Fecha o modal de detalhes do produto ao clicar no X
  modalCloseSpan.onclick = () => {
    modal.style.display = 'none';
  };

  // Fecha o modal de imagem ampliada ao clicar no X
  imageModalCloseSpan.onclick = () => {
    imageModal.style.display = 'none';
  };

  // Fecha o modal de pagamento ao clicar no X
  paymentModalCloseSpan.onclick = () => {
    paymentModal.style.display = 'none';
  };


  // Fecha qualquer modal ao clicar fora da caixa de conteúdo
  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
     if (event.target == imageModal) {
       imageModal.style.display = 'none';
     }
     if (event.target == paymentModal) {
       paymentModal.style.display = 'none';
     }
  };

  // --- Lógica do Modal de Pagamento ---

  // Função para abrir o modal de pagamento com os detalhes corretos
  function openPaymentModal(paymentMethod) {
      if (cart.length === 0) {
          alert('Seu carrinho está vazio.');
          return;
      }

      paymentDetailsDiv.innerHTML = ''; // Limpa os detalhes anteriores

      const total = cart.reduce((sum, item) => sum + item.preco, 0); // Calcula o total do carrinho

      if (paymentMethod === 'card' || paymentMethod === 'paypal') {
          // Para Cartão ou PayPal, exibe um botão/link para o gateway de pagamento
          const paymentLink = getPaymentLink(paymentMethod, total, cart); // Função para obter o link (veja abaixo)

          if (paymentLink) {
              const linkElement = document.createElement('a');
              linkElement.href = paymentLink;
              linkElement.target = "_blank"; // Abre em nova aba
              // Usando classes CSS existentes para os botões de checkout
              if (paymentMethod === 'card') linkElement.classList.add('btn-card');
              else if (paymentMethod === 'paypal') linkElement.classList.add('btn-paypal');

              linkElement.innerText = `Pagar com ${paymentMethod === 'card' ? 'Cartão' : 'PayPal'}`;
              paymentDetailsDiv.appendChild(linkElement);
              paymentDetailsDiv.innerHTML += `<p style="margin-top: 15px;">Você será redirecionado para a página de pagamento ${paymentMethod === 'card' ? 'do Cartão' : 'do PayPal'}.</p>`;
          } else {
              paymentDetailsDiv.innerHTML = '<p>Não foi possível gerar o link de pagamento para esta opção.</p>';
          }

      } else if (paymentMethod === 'pix') {
          // Para Pix, exibe o QR Code e/ou a chave Pix
          const pixData = getPixData(total, cart); // Função para obter dados do Pix (veja abaixo)

          if (pixData && pixData.qrCodeImgUrl) {
              const qrCodeImg = document.createElement('img');
              qrCodeImg.src = pixData.qrCodeImgUrl;
              qrCodeImg.alt = "QR Code Pix";
              paymentDetailsDiv.appendChild(qrCodeImg);
          }

          if (pixData && pixData.pixKey) {
              paymentDetailsDiv.innerHTML += `<p>Chave Pix: <strong>${pixData.pixKey}</strong></p>`;

              // Botão para copiar a chave Pix
              const copyButton = document.createElement('button');
              copyButton.classList.add('copy-pix-btn');
              copyButton.innerText = 'Copiar Chave Pix';
              copyButton.onclick = () => {
                  navigator.clipboard.writeText(pixData.pixKey).then(() => {
                      alert('Chave Pix copiada para a área de transferência!');
                  }).catch(err => {
                      console.error('Erro ao copiar a chave Pix: ', err);
                      alert('Erro ao copiar a chave Pix.');
                  });
              };
              paymentDetailsDiv.appendChild(copyButton);
          } else if (!pixData || (!pixData.qrCodeImgUrl && !pixData.pixKey)) {
               paymentDetailsDiv.innerHTML = '<p>Não foi possível obter os dados do Pix para esta compra.</p>';
          }

          paymentDetailsDiv.innerHTML += `<p style="margin-top: 15px;">Total a pagar: <strong>R$ ${total.toFixed(2).replace('.', ',')}</strong></p>`;


      } else {
          paymentDetailsDiv.innerHTML = '<p>Forma de pagamento não suportada.</p>';
      }

      paymentModal.style.display = 'flex'; // Mostra o modal de pagamento
  }

  // Função EXEMPLO para obter o link de pagamento virtual
  // ** IMPORTANTE: SUBSTITUA ESTA LÓGICA COM SEUS LINKS REAIS **
  function getPaymentLink(method, total, items) {
      // Em um cenário real, você faria uma requisição para um backend
      // que se comunica com o gateway de pagamento (Mercado Pago, PagSeguro, etc.)
      // para gerar um link de checkout com base nos itens e total do carrinho.

      console.log(`Tentando gerar link para ${method}. Total: ${total}, Itens:`, items);

      // --- SUBSTITUA OS LINKS ABAIXO PELOS SEUS LINKS DE PAGAMENTO REAIS ---
      if (method === 'card') {
           // Exemplo de link de checkout genérico (pode não funcionar sem integração)
           return `https://seu-gateway-de-pagamento.com/checkout/card?amount=${total.toFixed(2)}`;
      } else if (method === 'paypal') {
           // Exemplo de link de checkout genérico do PayPal (pode não funcionar sem integração)
           return `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&amount=${total.toFixed(2)}¤cy_code=BRL&item_name=Compra MDAL`;
      }
      // --------------------------------------------------------------------

      return null; // Retorna null se não houver link configurado
  }

   // Função EXEMPLO para obter dados do Pix (QR Code e/ou Chave)
   // ** IMPORTANTE: SUBSTITUA ESTA LÓGICA COM SEUS DADOS REAIS **
  function getPixData(total, items) {
      // Em um cenário real, você faria uma requisição para um backend
      // que se comunica com a API Pix do seu banco ou gateway de pagamento
      // para gerar o QR Code dinâmico e/ou a chave Pix.

       console.log(`Tentando obter dados do Pix. Total: ${total}, Itens:`, items);

       // --- SUBSTITUA OS DADOS ABAIXO PELOS SEUS DADOS REAIS DO PIX ---
       return {
           // URL de uma imagem de QR Code Pix pré-gerada ou gerada por API
           qrCodeImgUrl: 'URL_DA_SUA_IMAGEM_QR_CODE_PIX_AQUI', // Ex: 'https://seusite.com/qrcodes/pix_mdal.png'
           // Sua chave Pix (CPF, CNPJ, email, telefone ou chave aleatória)
           pixKey: 'SUA_CHAVE_PIX_AQUI', // Ex: 'suachave@email.com' ou '123.456.789-00'
           // Outros dados do Pix, se necessário (como código copia e cola)
           // copyPasteCode: '00020126330014BR.GOV.BCB.PIX01110000000000000052040000530398656304F080'
       };
       // --------------------------------------------------------------

       // Se não tiver URL da imagem nem chave, retorne null ou um objeto vazio
       // return null;
  }


  // Eventos de clique para os botões de Finalizar Compra
  btnCheckoutCard.addEventListener('click', () => {
      openPaymentModal('card');
  });

  btnCheckoutPix.addEventListener('click', () => {
      openPaymentModal('pix');
  });

  btnCheckoutPaypal.addEventListener('click', () => {
      openPaymentModal('paypal');
  });


  // --- Lógica do Hall da Fama ---

  // Array de membros do Hall da Fama (substitua com os nomes e URLs das fotos reais)
  const hallOfFameMembers = [
    { nome: "Crazy Dragon", foto: "https://media.licdn.com/dms/image/v2/D4D03AQE_3zs32K8iHQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1724450909764?e=1752105600&v=beta&t=w6dgSipS6wKDY9tHwy1VBmPAYoPnvUHWRGw6grVVOCg" }, // Substitua URL_DA_FOTO_1
    { nome: "12 Bala", foto: "https://media.licdn.com/dms/image/v2/D4D03AQHlT171zmr3rw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1722853292227?e=1752105600&v=beta&t=ne8cLntZlcWWAA5VdhhLw9dVo05kdK2o2g1T2I0DN3I" }, // Substitua URL_DA_FOTO_2
    { nome: "Vizzky", foto: "https://media.licdn.com/dms/image/v2/D4D03AQERZaB-vCUVyQ/profile-displayphoto-shrink_800_800/B4DZPCa3.jGgAc-/0/1734133645686?e=1752105600&v=beta&t=00YXVygqsBs3f4Wwn9vMJ4CKIUswwQcvFBlXAv_CTJI" },
    { nome: "Samurai", foto: "https://media.licdn.com/dms/image/v2/D4D03AQE3PEy3O__bDQ/profile-displayphoto-shrink_400_400/B4DZanGkaVGcAg-/0/1746560241098?e=1752105600&v=beta&t=DX4enLWyscV92a9PtntFW2fccfpiOei9t3kosQY-ihg" },
    { nome: "Leitinho", foto: "https://media.licdn.com/dms/image/v2/D4D03AQEg9Ur4fFXbTQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1720365094005?e=1752105600&v=beta&t=chAE1N27xGgVlG0nBA8sMRyHn500bb2wl7_7kFNuZo0" },
    { nome: "Membro 6", foto: "https://via.placeholder.com/80" },
    { nome: "Membro 7", foto: "https://via.placeholder.com/80" },
    { nome: "Laurão", foto: "https://media.licdn.com/dms/image/v2/C4E03AQF78LT6C-O-RA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1650290231896?e=1752105600&v=beta&t=8kkHxYIF3J-n2tCqxCsaTbJsdL2Bx6pHgvMRHtrR6mI" },
    { nome: "Kaminari", foto: "https://media.licdn.com/dms/image/v2/D4D03AQEvrqH6rSb10A/profile-displayphoto-shrink_800_800/B4DZWdANrfHYAg-/0/1742095835938?e=1752105600&v=beta&t=CwabGPyPxucBFaL9Pfw9CyZ61P_o5jLN0BoVxi2QewM" },
    { nome: "Cabeça", foto: "https://media.licdn.com/dms/image/v2/D4D03AQFrREvxfyYfpA/profile-displayphoto-shrink_800_800/B4DZZuMX1pHIAc-/0/1745605459846?e=1752105600&v=beta&t=BoSV7zO88aZ5bjNEod8kUGKaA_7VrdPlTLj6fdRjaZk" },
    // Adicione mais membros aqui
  ];

  // Elemento onde os membros do Hall da Fama serão exibidos
  const hallOfFameContainer = document.getElementById('hall-da-fama-container');

  // Função para popular o Hall da Fama
  function populateHallOfFame() {
    hallOfFameContainer.innerHTML = ''; // Limpa o container atual

    hallOfFameMembers.forEach(member => {
      const memberDiv = document.createElement('div');
      memberDiv.classList.add('hall-da-fama-item');

      const img = document.createElement('img');
      img.src = member.foto;
      img.alt = member.nome;

      const nameSpan = document.createElement('span');
      nameSpan.classList.add('nome');
      nameSpan.innerText = member.nome;

      memberDiv.appendChild(img);
      memberDiv.appendChild(nameSpan);

      hallOfFameContainer.appendChild(memberDiv);
    });
  }

  // Chama a função para popular o Hall da Fama quando a página carregar
  populateHallOfFame();


  // --- Inicialização ---
  // Atualiza a exibição do carrinho ao carregar a página
  updateCartDisplay();
