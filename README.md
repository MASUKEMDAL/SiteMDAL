# 🌑 MDAL – MAKE THE M

Bem-vindo(a) ao repositório oficial do projeto **MDAL – MAKE THE M**, um site interativo de e-commerce e universo autoral de moda, música, cultura e narrativa original. Este projeto faz parte da expansão do universo **MDAL – As Crônicas de Masuke**, combinando tecnologia, design e storytelling com uma pegada sombria e criativa.

---

## 🧾 Descrição

Este site foi desenvolvido **100% em HTML, CSS e JavaScript puro (vanilla)**, sem frameworks, com foco total em performance, imersão visual e experiência do usuário.  
Aqui você encontra camisetas, acessórios, planos de assinatura, além de música original, patrocinadores e muito mais!

---

## 🚀 Funcionalidades

- 🛒 Sistema completo de **loja virtual**
- 👕 **Produtos com múltiplas imagens**, variações e tamanhos
- 🎨 **Design dark** estilizado com responsividade total
- 💳 Modal de compra com seleção de tamanho e formas de pagamento (Cartão, Pix, PayPal)
- 🎵 Seção com música autoral disponível no Spotify
- 📦 **Box Mystery** com produtos surpresa
- 🛍️ Planos de assinatura mensais com benefícios escalonados
- 🧠 Galeria de patrocinadores e **Hall da Fama MDAL**
- 🔊 Áudio de fundo ambiente

---

## 🖼️ Tecnologias Utilizadas

- `HTML5`
- `CSS3`
- `JavaScript (ES6+)`
- 🎨 Sem frameworks — 100% Vanilla!

---

## 📦 Como Executar o Projeto

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/mdal-make-the-m.git

# 2. Acesse a pasta do projeto
cd mdal-make-the-m

# 3. Abra o index.html em seu navegador
# ou utilize a extensão Live Server no VS Code para melhor experiência
📸 Screenshots
Loja de Camisetas	Seção Musical	Carrinho de Compras

🧩 Estrutura do Projeto
bash
Copiar
Editar
mdal-make-the-m/
├── index.html
├── style.css
├── script.js
├── /assets
│   ├── imagens/
│   └── audio/
└── README.md
🔐 Licença
Este projeto está sob a licença MIT.
Sinta-se livre para estudar, compartilhar e expandir — com os devidos créditos.

🛒 Lógica do Carrinho, Modais e Pagamento
Este projeto contém um script JavaScript robusto responsável por toda a interatividade de compra, visualização de produtos e finalização de pedidos. Abaixo estão as principais funcionalidades implementadas:

✅ Funcionalidades Gerais
Modal de Detalhes do Produto:

Exibe imagens e informações detalhadas do produto.

Suporte à navegação entre múltiplas imagens e variações de cor/título.

Botão de "Adicionar ao Carrinho" com seletor de tamanho (para camisetas).

Carrinho de Compras:

Adiciona/remover produtos com ou sem variações de tamanho.

Atualiza o total e contador em tempo real.

Exibição clara dos produtos selecionados.

Modal de Pagamento:

Suporte para 3 formas de pagamento: Cartão, Pix e PayPal.

Geração de link (fictício) para pagamento via cartão e PayPal.

Exibição de QR Code e chave Pix com botão de cópia.

🖼 Modal de Imagem Ampliada
Permite ampliar a visualização da imagem do produto ao clicar sobre ela.

Fecha ao clicar fora da imagem ou no botão de fechar.

🧾 Modais e Eventos
Modais de detalhes, pagamento e imagem têm controle por clique externo e botões de fechar.

O botão "Finalizar Compra" abre o modal correspondente à forma de pagamento escolhida.

🌟 Hall da Fama (Extra)
Seção que exibe membros especiais com suas fotos.

Renderizado dinamicamente via JavaScript com base em um array de objetos (nome + foto).

🔧 Estrutura do Código (Simplificada)
updateCartDisplay(): atualiza a lista do carrinho.

addItemToCart() e removeItemFromCart(): manipulam os produtos do carrinho.

openPaymentModal(): exibe o modal com base na forma de pagamento.

getPaymentLink() e getPixData(): retornam dados fictícios de pagamento.

Eventos nos botões .comprar-btn, .add-to-cart-btn, e nos ícones de fechar controlam toda a lógica da UI.

🛠 Integração com Back-end
⚠️ Atualmente, os links de pagamento e dados Pix são mockados (fictícios). Para uso real, substitua as funções getPaymentLink() e getPixData() por chamadas a uma API de pagamento real (ex: Mercado Pago, Stripe, PagSeguro, API Pix do seu banco etc).

✨ Contato e Redes
📧 E-mail: matheusmarferreira@hotmail.com
📸 Instagram: @MasukeMDAL
💻 GitHub: github.com/masukemdal

Se curtir, dá uma estrela ⭐ no repositório e compartilha com a comunidade!
MAKE THE M.
