# Beach Soul — vitrine com carrinho

Site estático responsivo com catálogo, filtros, sacola de compras, atualização de quantidades e finalização do pedido pelo WhatsApp. O carrinho fica salvo no navegador do cliente.

## Antes de publicar
1. O logo enviado foi incorporado como `assets/logo.png`. Confira o recorte e substitua pelo arquivo original em alta resolução, se disponível.
2. Coloque as fotos reais na pasta `assets/`.
3. Edite `products.js`: nome, descrição, preço, categoria, tamanhos, imagem e destaque de cada produto. O site não permite adicionar itens com preço zero.
4. Edite `config.js`: número de WhatsApp com código do país e DDD (apenas números), Instagram e link da Shopee.
5. Teste todos os links, preços, imagens e fluxo do carrinho em celular e computador.

## Como adicionar uma foto
Copie, por exemplo, `biquini-marrom.jpg` para `assets/` e defina no produto:
`image: "assets/biquini-marrom.jpg"`

## Como publicar gratuitamente
Uma opção é usar GitHub Pages para este site estático:
1. Crie uma conta no GitHub, se ainda não tiver.
2. Crie um repositório novo e envie todos os arquivos e a pasta `assets`.
3. No repositório, abra **Settings → Pages**.
4. Em **Build and deployment**, selecione a publicação a partir da branch principal e a pasta raiz (`/root` ou `/`, conforme a interface).
5. Salve e aguarde a publicação. O GitHub mostrará o endereço público do site.
6. Teste o endereço e todos os botões.

Os nomes das opções podem mudar. Consulte a documentação atual do serviço antes da publicação.

## Limitações importantes
- Esta é uma vitrine com carrinho no navegador, não uma plataforma de pagamentos.
- Não processa cartão, Pix, frete, estoque sincronizado, cupons ou pedidos em banco de dados.
- O pedido é enviado para o WhatsApp para confirmação manual de disponibilidade, frete e pagamento.
- O carrinho depende do navegador/dispositivo usado pela cliente.
- Não há painel administrativo; para alterar o catálogo, edite `products.js` e publique os arquivos novamente.
- O site usa Google Fonts quando há conexão; há fontes alternativas locais do sistema caso não carreguem.
- Os textos, produtos e preços de exemplo devem ser revisados e substituídos por informações reais antes de divulgar.

## Arquivos
- `index.html`: estrutura e textos do site.
- `styles.css`: identidade visual, responsividade e componentes.
- `products.js`: catálogo editável.
- `config.js`: links e contatos.
- `script.js`: filtros, carrinho e finalização pelo WhatsApp.
- `assets/`: logo, favicon e imagens dos produtos.
