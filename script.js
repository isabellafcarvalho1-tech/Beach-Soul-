(() => {
  const config = window.BEACH_SOUL_CONFIG || {};
  const products = (window.BEACH_SOUL_PRODUCTS || []).filter(p => p.active !== false);
  const money = value => new Intl.NumberFormat('pt-BR',{style:'currency',currency:config.currency || 'BRL'}).format(Number(value)||0);
  const $ = id => document.getElementById(id);
  let activeFilter = 'todos';
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem('beachSoulCart') || '[]'); } catch(e) { cart = []; }
  let toastTimer;

  $('year').textContent = new Date().getFullYear();
  if (config.instagramUrl) $('instagram-link').href = config.instagramUrl;
  else $('instagram-link').addEventListener('click', e => { e.preventDefault(); showToast('Adicione o link do Instagram em config.js.'); });
  if (config.whatsappNumber) $('whatsapp-link').href = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent('Olá! Conheci a Beach Soul pelo site e gostaria de saber mais sobre os produtos.')}`;
  else $('whatsapp-link').addEventListener('click', e => { e.preventDefault(); showToast('Adicione o número do WhatsApp em config.js.'); });

  function showToast(message) {
    const toast = $('toast'); toast.textContent = message; toast.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
  }
  function saveCart() { localStorage.setItem('beachSoulCart', JSON.stringify(cart)); renderCart(); }
  function renderProducts() {
    const grid = $('product-grid');
    let visible = products.filter(p => activeFilter === 'todos' || p.category === activeFilter);
    const sort = $('sort-products').value;
    if (sort === 'price-asc') visible.sort((a,b) => a.price-b.price);
    if (sort === 'price-desc') visible.sort((a,b) => b.price-a.price);
    if (sort === 'name') visible.sort((a,b) => a.name.localeCompare(b.name,'pt-BR'));
    if (!visible.length) { grid.innerHTML = '<p class="no-products">Nenhum produto nesta categoria por enquanto.</p>'; return; }
    grid.innerHTML = visible.map(p => `
      <article class="product-card">
        <div class="product-image-wrap">
          <img class="product-image" src="${escapeAttr(p.image)}" alt="${escapeAttr(p.name)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.hidden=false">
          <div class="product-placeholder" hidden>beach soul</div>
          ${p.badge ? `<span class="product-badge">${escapeHtml(p.badge)}</span>` : ''}
          <button class="quick-add" data-add="${escapeAttr(p.id)}">Adicionar à sacola +</button>
        </div>
        <div class="product-info">
          <h3 class="product-name">${escapeHtml(p.name)}</h3>
          <p class="product-description">${escapeHtml(p.description || '')}</p>
          <div class="product-bottom"><span class="product-price">${Number(p.price)>0 ? money(p.price) : 'Preço a cadastrar'}</span><button class="quick-add-mobile" data-add="${escapeAttr(p.id)}">Adicionar +</button></div>
        </div>
      </article>`).join('');
    grid.querySelectorAll('[data-add]').forEach(btn => btn.addEventListener('click', () => addToCart(btn.dataset.add)));
  }
  function escapeHtml(value) { return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function escapeAttr(value) { return escapeHtml(value); }
  function addToCart(id) {
    const product = products.find(p => p.id === id); if (!product) return;
    if (!(Number(product.price) > 0)) { showToast('Cadastre o preço deste produto antes de adicioná-lo à sacola.'); return; }
    const existing = cart.find(item => item.id === id);
    if (existing) existing.qty += 1; else cart.push({id,qty:1});
    saveCart(); openCart(); showToast('Produto adicionado à sacola.');
  }
  function renderCart() {
    cart = cart.filter(item => products.some(p => p.id === item.id) && item.qty > 0);
    const count = cart.reduce((sum,item) => sum + item.qty, 0);
    $('cart-count').textContent = count;
    $('cart-items').innerHTML = cart.map(item => {
      const p = products.find(prod => prod.id === item.id);
      return `<div class="cart-item">
        <img class="cart-thumb" src="${escapeAttr(p.image)}" alt="" onerror="this.style.visibility='hidden'">
        <div><h3>${escapeHtml(p.name)}</h3><p>${money(p.price)}</p>
          <div class="qty-control"><button data-qty="${p.id}" data-delta="-1" aria-label="Diminuir quantidade">−</button><span>${item.qty}</span><button data-qty="${p.id}" data-delta="1" aria-label="Aumentar quantidade">+</button></div>
        </div>
        <div class="cart-item-end"><strong>${money(p.price*item.qty)}</strong><button class="remove-item" data-remove="${p.id}">Remover</button></div>
      </div>`;
    }).join('');
    $('cart-empty').style.display = cart.length ? 'none' : 'flex';
    $('cart-footer').style.display = cart.length ? 'block' : 'none';
    $('cart-subtotal').textContent = money(cart.reduce((sum,item) => sum + products.find(p=>p.id===item.id).price*item.qty,0));
    $('cart-items').querySelectorAll('[data-qty]').forEach(btn => btn.addEventListener('click', () => {
      const item = cart.find(i => i.id === btn.dataset.qty); if (!item) return;
      item.qty += Number(btn.dataset.delta); if (item.qty <= 0) cart = cart.filter(i => i.id !== item.id); saveCart();
    }));
    $('cart-items').querySelectorAll('[data-remove]').forEach(btn => btn.addEventListener('click', () => { cart = cart.filter(i => i.id !== btn.dataset.remove); saveCart(); }));
  }
  function openCart() { $('overlay').hidden = false; $('cart-drawer').classList.add('open'); $('cart-drawer').setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; }
  function closeCart() { $('overlay').hidden = true; $('cart-drawer').classList.remove('open'); $('cart-drawer').setAttribute('aria-hidden','true'); document.body.style.overflow=''; }
  $('open-cart').addEventListener('click', openCart); $('close-cart').addEventListener('click', closeCart); $('overlay').addEventListener('click', closeCart);
  $('continue-shopping').addEventListener('click', closeCart);
  $('menu-toggle').addEventListener('click', () => { const nav = $('main-nav'); const open = nav.classList.toggle('open'); $('menu-toggle').setAttribute('aria-expanded',String(open)); });
  $('main-nav').querySelectorAll('a').forEach(a => a.addEventListener('click', () => { $('main-nav').classList.remove('open'); $('menu-toggle').setAttribute('aria-expanded','false'); }));
  document.querySelectorAll('.filter').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(b => b.classList.remove('active')); btn.classList.add('active'); activeFilter = btn.dataset.filter; renderProducts();
  }));
  $('sort-products').addEventListener('change', renderProducts);
  $('checkout').addEventListener('click', () => {
    if (!cart.length) return;
    if (!config.whatsappNumber) { showToast('Configure o WhatsApp em config.js para habilitar a finalização.'); return; }
    const lines = cart.map(item => { const p = products.find(prod => prod.id === item.id); return `• ${p.name} — ${item.qty} un. — ${money(p.price*item.qty)}`; });
    const total = cart.reduce((sum,item) => sum + products.find(p=>p.id===item.id).price*item.qty,0);
    const message = `Olá! Gostaria de finalizar meu pedido na Beach Soul:\n\n${lines.join('\n')}\n\nSubtotal: ${money(total)}\n\nPoderiam confirmar disponibilidade, frete e formas de pagamento?`;
    window.open(`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(message)}`,'_blank','noopener');
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCart(); });
  renderProducts(); renderCart();
})();