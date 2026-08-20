(function() {
  'use strict';

  const API = '/api';
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  const state = {
    products: [],
    cart: [],
    filter: 'all',
    sort: 'featured',
    calcResults: null,
    chart: null
  };

  function formatMoney(n) {
    if (typeof n !== 'number' || isNaN(n)) return '$0';
    return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }
  function formatMoneyDecimal(n) {
    if (typeof n !== 'number' || isNaN(n)) return '$0.00';
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  // Product photos are real, category-matched Unsplash images (curated IDs stored
  // in products.json), served through Unsplash's own resizing CDN — no more random
  // unrelated stock photos. If a specific photo ever fails to load, onerror below
  // swaps in a themed inline gradient placeholder (no extra network round-trip,
  // so it always renders) instead of a mismatched image.
  function productImg(photoId, w=500, h=500) {
    return `https://images.unsplash.com/photo-${photoId}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;
  }
  function productImgFallback(category) {
    const icons = {
      solar: '<path d="M12 2v3M12 19v3M5 5l2 2M17 17l2 2M2 12h3M19 12h3M5 19l2-2M17 7l2-2" stroke="white" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="12" r="4.5" fill="white"/>',
      chargers: '<path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" fill="white"/>',
      home: '<path d="M4 11l8-7 8 7v9a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-9z" fill="white"/>',
      lifestyle: '<path d="M12 21s-7-4.6-9.3-9C1 8.5 2.5 5 6.2 5 8.4 5 10 6.3 12 8.5 14 6.3 15.6 5 17.8 5 21.5 5 23 8.5 21.3 12 19 16.4 12 21 12 21z" fill="white"/>'
    };
    const gradients = { solar: ['#3a6d4d','#1a3a2e'], chargers: ['#d4a574','#a07a48'], home: ['#588a6b','#2a5a3d'], lifestyle: ['#e6a73c','#c19660'] };
    const [c1, c2] = gradients[category] || gradients.solar;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="200" height="200" fill="url(#g)"/><g transform="translate(76,76) scale(1.9)" opacity="0.85">${icons[category] || icons.solar}</g></svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }
  function validateEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function showToast(message, type='success') {
    try {
      const container = $('#toast-container');
      const toast = document.createElement('div');
      const colors = {
        success: 'bg-forest-800 text-cream-100 border-forest-700',
        error: 'bg-red-600 text-white border-red-700',
        info: 'bg-gold-500 text-forest-900 border-gold-600'
      };
      toast.className = `toast pointer-events-auto px-5 py-3.5 rounded-xl shadow-2xl border ${colors[type] || colors.success} text-sm font-medium flex items-center gap-2.5 max-w-xs`;
      const icon = type === 'error'
        ? '<svg viewBox="0 0 24 24" fill="none" class="w-4 h-4"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" class="w-4 h-4"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      toast.innerHTML = `${icon}<span>${message}</span>`;
      container.appendChild(toast);
      setTimeout(() => { toast.classList.add('out'); setTimeout(() => toast.remove(), 300); }, 3000);
    } catch (e) { console.warn('Toast failed:', e); }
  }

  async function apiGet(endpoint) {
    try {
      const res = await fetch(`${API}${endpoint}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.error('API GET failed:', endpoint, e);
      throw e;
    }
  }
  async function apiPost(endpoint, body) {
    try {
      const res = await fetch(`${API}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || JSON.stringify(data.errors) || `HTTP ${res.status}`);
      return data;
    } catch (e) {
      console.error('API POST failed:', endpoint, e);
      throw e;
    }
  }

  function renderProductCard(p) {
    const ecoClass = 'eco-' + p.ecoScore.replace('+','');
    const badgeHtml = p.badge ? `<div class="absolute top-3 right-3 bg-forest-900/85 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] text-cream-100 font-semibold tracking-wide">${p.badge}</div>` : '';
    return `
      <article class="product-card bg-cream-50 rounded-2xl overflow-hidden border border-forest-100 cursor-pointer" data-product-id="${p.id}">
        <div class="aspect-square overflow-hidden bg-forest-100 relative" data-trigger="${p.id}">
          <img src="${productImg(p.img)}" alt="${p.name}" class="product-img w-full h-full object-cover" loading="lazy" onerror="this.onerror=null;this.src='${productImgFallback(p.category)}'">
          <div class="absolute top-3 left-3 ${ecoClass} eco-badge px-2.5 py-1 rounded-full text-[10px] font-bold text-white tracking-wider">ECO ${p.ecoScore}</div>
          ${badgeHtml}
        </div>
        <div class="p-5" data-trigger="${p.id}">
          <h3 class="font-display text-lg font-semibold text-forest-800 leading-snug mb-1">${p.name}</h3>
          <p class="text-xs text-forest-600/70 mb-4 line-clamp-2">${p.desc}</p>
          <div class="flex items-center justify-between">
            <div class="font-display text-xl font-bold text-gold-700">${formatMoney(p.price)}</div>
            <button class="add-to-cart-btn btn-primary px-3.5 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-1.5" data-product-id="${p.id}" aria-label="Add ${p.name} to cart">
              <svg viewBox="0 0 24 24" fill="none" class="w-3.5 h-3.5"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>Add
            </button>
          </div>
        </div>
      </article>`;
  }

  async function loadFeaturedProducts() {
    try {
      const data = await apiGet('/products/featured');
      const grid = $('#featured-grid');
      if (data.success && data.products.length > 0) {
        grid.innerHTML = data.products.map(renderProductCard).join('');
      } else {
        grid.innerHTML = '<p class="text-forest-600/70 col-span-full text-center">No featured products available.</p>';
      }
    } catch (e) {
      $('#featured-grid').innerHTML = '<p class="text-forest-600/70 col-span-full text-center">Unable to load featured products. Please refresh.</p>';
    }
  }

  async function loadAllProducts() {
    try {
      const data = await apiGet('/products');
      if (data.success) {
        state.products = data.products;
        renderShop();
      }
    } catch (e) {
      $('#shop-grid').innerHTML = '<p class="text-forest-600/70 col-span-full text-center py-10">Unable to load products. Please refresh.</p>';
    }
  }

  function renderShop() {
    try {
      let list = [...state.products];
      if (state.filter !== 'all') list = list.filter(p => p.category === state.filter);
      switch (state.sort) {
        case 'price-low':  list.sort((a,b)=>a.price-b.price); break;
        case 'price-high': list.sort((a,b)=>b.price-a.price); break;
        case 'eco':        list.sort((a,b)=>(a.ecoScore<b.ecoScore?-1:1)); break;
      }
      const grid = $('#shop-grid');
      const empty = $('#no-products');
      if (list.length === 0) {
        grid.innerHTML = '';
        empty.classList.remove('hidden');
      } else {
        empty.classList.add('hidden');
        grid.innerHTML = list.map(renderProductCard).join('');
      }
    } catch (e) {
      console.error('Shop render failed:', e);
    }
  }

  async function openProductModal(productId) {
    try {
      const data = await apiGet(`/products/${productId}`);
      if (!data.success) { showToast('Product not found', 'error'); return; }
      const p = data.product;
      const ecoClass = 'eco-' + p.ecoScore.replace('+','');
      const specsHtml = p.specs.map(s => `<div class="flex justify-between py-2 border-b border-forest-100 last:border-0"><span class="text-sm text-forest-600/70">${s.k}</span><span class="text-sm font-semibold text-forest-800">${s.v}</span></div>`).join('');
      $('#modal-content').innerHTML = `
        <div class="aspect-square bg-forest-100 relative overflow-hidden">
          <img src="${productImg(p.img, 800, 800)}" alt="${p.name}" class="w-full h-full object-cover" onerror="this.onerror=null;this.src='${productImgFallback(p.category)}'">
          <div class="absolute top-4 left-4 ${ecoClass} px-3 py-1 rounded-full text-xs font-bold text-white tracking-wider">ECO ${p.ecoScore}</div>
          ${p.badge ? `<div class="absolute top-4 right-4 bg-forest-900/85 px-3 py-1 rounded-full text-xs text-cream-100 font-semibold">${p.badge}</div>` : ''}
        </div>
        <div class="p-7 lg:p-8 flex flex-col">
          <div class="text-[10px] font-semibold tracking-widest text-gold-700 uppercase mb-2">${p.category}</div>
          <h2 class="font-display text-2xl lg:text-3xl font-semibold text-forest-800 leading-tight mb-3">${p.name}</h2>
          <p class="text-sm text-forest-600/80 leading-relaxed mb-5">${p.desc}</p>
          <div class="mb-6"><div class="text-xs font-semibold text-forest-800 mb-2 tracking-wide">SPECIFICATIONS</div>${specsHtml}</div>
          <div class="mt-auto flex items-center justify-between gap-4 pt-4 border-t border-forest-100">
            <div><div class="text-[10px] text-forest-600/60 uppercase tracking-wider">Price</div><div class="font-display text-3xl font-bold text-gold-700">${formatMoney(p.price)}</div></div>
            <button class="modal-add-cart btn-primary px-6 py-3 rounded-full text-sm font-semibold flex items-center gap-2" data-product-id="${p.id}">
              <svg viewBox="0 0 24 24" fill="none" class="w-4 h-4"><path d="M3 3h2l2.4 12.5a2 2 0 002 1.5h9.7a2 2 0 002-1.6L23 8H6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Add to cart
            </button>
          </div>
        </div>`;
      $('#product-modal').classList.remove('closed');
      document.body.style.overflow = 'hidden';
    } catch (e) {
      showToast('Could not load product details', 'error');
    }
  }
  function closeProductModal() {
    $('#product-modal').classList.add('closed');
    document.body.style.overflow = '';
  }

  function addToCart(productId, qty=1) {
    try {
      const p = state.products.find(x => x.id === productId);
      if (!p) { showToast('Product not found', 'error'); return; }
      const existing = state.cart.find(item => item.id === productId);
      if (existing) existing.qty += qty;
      else state.cart.push({ id: p.id, name: p.name, price: p.price, img: p.img, category: p.category, qty, ecoScore: p.ecoScore });
      updateCartUI();
      showToast(`${p.name} added to cart`);
      const btn = $('#cart-btn');
      btn.style.transform = 'scale(1.15)';
      setTimeout(()=> btn.style.transform = '', 200);
    } catch (e) {
      console.error('Add to cart failed:', e);
      showToast('Could not add to cart', 'error');
    }
  }
  function removeFromCart(productId) {
    state.cart = state.cart.filter(item => item.id !== productId);
    updateCartUI();
  }
  function updateQty(productId, delta) {
    const item = state.cart.find(i => i.id === productId);
    if (!item) return;
    item.qty = Math.max(1, item.qty + delta);
    updateCartUI();
  }
  function calculateCartTotals() {
    const subtotal = state.cart.reduce((s, i) => s + i.price * i.qty, 0);
    const itemCount = state.cart.reduce((s, i) => s + i.qty, 0);
    const co2 = Math.round(subtotal * 0.5);
    return { subtotal, itemCount, co2 };
  }
  function updateCartUI() {
    try {
      const { subtotal, itemCount, co2 } = calculateCartTotals();
      const badge = $('#cart-count');
      if (itemCount > 0) { badge.textContent = itemCount > 99 ? '99+' : itemCount; badge.classList.remove('hidden'); }
      else { badge.classList.add('hidden'); }
      const itemsContainer = $('#cart-items');
      const emptyState = $('#cart-empty');
      const footer = $('#cart-footer');
      if (state.cart.length === 0) {
        itemsContainer.innerHTML = '';
        emptyState.style.display = 'flex';
        footer.classList.add('hidden');
      } else {
        emptyState.style.display = 'none';
        footer.classList.remove('hidden');
        itemsContainer.innerHTML = state.cart.map(item => `
          <div class="flex gap-3 items-center">
            <div class="w-16 h-16 rounded-xl overflow-hidden bg-forest-100 flex-shrink-0">
              <img src="${productImg(item.img, 200, 200)}" alt="${item.name}" class="w-full h-full object-cover" onerror="this.onerror=null;this.src='${productImgFallback(item.category)}'">
            </div>
            <div class="flex-1 min-w-0">
              <div class="font-semibold text-sm text-forest-800 truncate">${item.name}</div>
              <div class="text-xs text-forest-600/70 mt-0.5">ECO ${item.ecoScore} · ${formatMoney(item.price)}</div>
              <div class="flex items-center gap-2 mt-1.5">
                <button class="qty-decrease w-6 h-6 rounded-full bg-forest-100 hover:bg-forest-200 text-forest-800 text-sm font-bold flex items-center justify-center transition" data-id="${item.id}" aria-label="Decrease">−</button>
                <span class="text-sm font-semibold text-forest-800 w-6 text-center">${item.qty}</span>
                <button class="qty-increase w-6 h-6 rounded-full bg-forest-100 hover:bg-forest-200 text-forest-800 text-sm font-bold flex items-center justify-center transition" data-id="${item.id}" aria-label="Increase">+</button>
                <button class="remove-item ml-auto text-xs text-forest-600/60 hover:text-red-600 transition" data-id="${item.id}" aria-label="Remove">Remove</button>
              </div>
            </div>
            <div class="text-right"><div class="font-display font-semibold text-forest-800">${formatMoney(item.price * item.qty)}</div></div>
          </div>`).join('');
      }
      $('#cart-item-count').textContent = `${itemCount} item${itemCount===1?'':'s'}`;
      $('#cart-subtotal').textContent = formatMoneyDecimal(subtotal);
      $('#cart-total').textContent = formatMoneyDecimal(subtotal);
      $('#cart-co2').textContent = co2.toLocaleString() + ' kg';
    } catch (e) { console.error('Cart UI update failed:', e); }
  }
  function openCart() {
    $('#cart-backdrop').classList.remove('closed');
    $('#cart-drawer').classList.remove('closed');
    document.body.style.overflow = 'hidden';
  }
  function closeCart() {
    $('#cart-backdrop').classList.add('closed');
    $('#cart-drawer').classList.add('closed');
    document.body.style.overflow = '';
  }

  function openCheckout() {
    if (state.cart.length === 0) { showToast('Your cart is empty', 'info'); return; }
    try {
      const { subtotal, co2 } = calculateCartTotals();
      $('#checkout-content').innerHTML = `
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-display text-2xl font-semibold text-forest-800">Checkout</h3>
          <button id="checkout-close" type="button" class="p-2 rounded-full hover:bg-forest-100 transition" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" class="w-5 h-5 text-forest-800"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>
        </div>
        <form id="checkout-form" novalidate>
          <div class="space-y-4">
            <div><label class="block text-xs font-semibold text-forest-800 mb-1.5 tracking-wide">FULL NAME</label><input name="name" type="text" required minlength="2" class="input-field w-full px-4 py-3 rounded-xl" placeholder="Jane Doe" /><div class="error-msg hidden text-xs text-red-600 mt-1.5"></div></div>
            <div><label class="block text-xs font-semibold text-forest-800 mb-1.5 tracking-wide">EMAIL</label><input name="email" type="email" required class="input-field w-full px-4 py-3 rounded-xl" placeholder="you@email.com" /><div class="error-msg hidden text-xs text-red-600 mt-1.5"></div></div>
            <div><label class="block text-xs font-semibold text-forest-800 mb-1.5 tracking-wide">SHIPPING ADDRESS</label><input name="address" type="text" required minlength="5" class="input-field w-full px-4 py-3 rounded-xl" placeholder="123 Sunshine Ave, Portland, OR" /><div class="error-msg hidden text-xs text-red-600 mt-1.5"></div></div>
            <div class="grid grid-cols-2 gap-3">
              <div><label class="block text-xs font-semibold text-forest-800 mb-1.5 tracking-wide">CARD NUMBER</label><input name="card" type="text" required inputmode="numeric" maxlength="19" class="input-field w-full px-4 py-3 rounded-xl" placeholder="4242 4242 4242 4242" /><div class="error-msg hidden text-xs text-red-600 mt-1.5"></div></div>
              <div><label class="block text-xs font-semibold text-forest-800 mb-1.5 tracking-wide">EXPIRY / CVV</label><div class="flex gap-2"><input name="expiry" type="text" required maxlength="5" class="input-field w-full px-4 py-3 rounded-xl" placeholder="MM/YY" /><input name="cvv" type="text" required inputmode="numeric" maxlength="4" class="input-field w-full px-4 py-3 rounded-xl" placeholder="123" /></div><div class="error-msg hidden text-xs text-red-600 mt-1.5"></div></div>
            </div>
          </div>
          <div class="mt-6 pt-5 border-t border-forest-100 space-y-2 text-sm">
            <div class="flex justify-between text-forest-700"><span>Subtotal</span><span class="font-semibold">${formatMoneyDecimal(subtotal)}</span></div>
            <div class="flex justify-between text-forest-700"><span>Shipping</span><span class="font-semibold text-forest-600">Free</span></div>
            <div class="flex justify-between text-forest-700"><span>CO2 offset / year</span><span class="font-semibold text-forest-600">${co2.toLocaleString()} kg</span></div>
            <div class="flex justify-between pt-2 border-t border-forest-100"><span class="font-display text-lg font-semibold text-forest-800">Total</span><span class="font-display text-2xl font-bold text-forest-800">${formatMoneyDecimal(subtotal)}</span></div>
          </div>
          <button type="submit" class="btn-primary w-full mt-6 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"><svg viewBox="0 0 24 24" fill="none" class="w-4 h-4"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>Place order</button>
          <p class="text-[11px] text-forest-600/60 text-center mt-3">Demo checkout — no real payment is processed.</p>
        </form>`;
      $('#checkout-modal').classList.remove('closed');
      document.body.style.overflow = 'hidden';
    } catch (e) {
      console.error('Checkout open failed:', e);
      showToast('Could not start checkout', 'error');
    }
  }
  function closeCheckout() {
    $('#checkout-modal').classList.add('closed');
    document.body.style.overflow = '';
  }

  async function submitOrder(formData) {
    try {
      const body = {
        customer: {
          name: formData.get('name'),
          email: formData.get('email'),
          address: formData.get('address')
        },
        items: state.cart.map(i => ({ id: i.id, qty: i.qty }))
      };
      const data = await apiPost('/orders', body);
      if (data.success) {
        showOrderConfirmation(data.order);
        state.cart = [];
        updateCartUI();
      }
    } catch (e) {
      showToast('Order failed. Please try again.', 'error');
    }
  }

  function showOrderConfirmation(order) {
    $('#checkout-content').innerHTML = `
      <div class="text-center py-6">
        <div class="w-20 h-20 rounded-full bg-forest-100 mx-auto flex items-center justify-center mb-5"><svg viewBox="0 0 24 24" fill="none" class="w-10 h-10 text-forest-600"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
        <h3 class="font-display text-3xl font-semibold text-forest-800 mb-2">Thank you!</h3>
        <p class="text-forest-600/80 mb-1">Your order has been placed.</p>
        <div class="inline-block px-4 py-1.5 rounded-full bg-forest-100 text-forest-800 font-semibold text-sm mt-2">${order.orderId}</div>
        <div class="mt-7 grid grid-cols-2 gap-3 text-left">
          <div class="bg-cream-100 rounded-xl p-4"><div class="text-[10px] uppercase tracking-wider text-forest-600/70">Order total</div><div class="font-display text-xl font-bold text-forest-800 mt-1">${formatMoneyDecimal(order.total)}</div></div>
          <div class="bg-cream-100 rounded-xl p-4"><div class="text-[10px] uppercase tracking-wider text-forest-600/70">CO2 offset / yr</div><div class="font-display text-xl font-bold text-forest-600 mt-1">${order.co2Offset.toLocaleString()} kg</div></div>
        </div>
        <button id="confirmation-close" type="button" class="btn-primary w-full mt-7 py-3.5 rounded-xl font-semibold text-sm">Continue shopping</button>
      </div>`;
  }

  function showError(input, message) {
    input.classList.add('error');
    const wrapper = input.closest('div');
    const msg = wrapper.querySelector('.error-msg');
    if (msg) { msg.textContent = message; msg.classList.remove('hidden'); }
  }
  function clearError(input) {
    input.classList.remove('error');
    const wrapper = input.closest('div');
    const msg = wrapper.querySelector('.error-msg');
    if (msg) { msg.textContent = ''; msg.classList.add('hidden'); }
  }

  function validateBillLive() {
    const billInput = $('#bill-input');
    const billErrorEl = $('#bill-error');
    const submitBtn = $('#calc-submit');
    const val = billInput.value.trim();
    if (val === '') { submitBtn.disabled = true; billErrorEl.classList.add('hidden'); billInput.classList.remove('error'); return; }
    const num = parseFloat(val);
    if (isNaN(num)) {
      billErrorEl.querySelector('span').textContent = 'Please enter a valid number.';
      billErrorEl.classList.remove('hidden'); billInput.classList.add('error'); submitBtn.disabled = true;
    } else if (num < 1 || num > 10000) {
      billErrorEl.querySelector('span').textContent = 'Bill must be between $1 and $10,000.';
      billErrorEl.classList.remove('hidden'); billInput.classList.add('error'); submitBtn.disabled = true;
    } else {
      billErrorEl.classList.add('hidden'); billInput.classList.remove('error'); submitBtn.disabled = false;
    }
  }

  async function handleCalculatorSubmit(e) {
    e.preventDefault();
    const submitBtn = $('#calc-submit');
    const originalHtml = submitBtn.innerHTML;
    try {
      const bill = parseFloat($('#bill-input').value);
      const roofRaw = $('#roof-input').value.trim();
      const roofArea = roofRaw === '' ? null : parseFloat(roofRaw);
      const sunHours = parseFloat($('#sun-slider').value);

      if (isNaN(bill) || bill < 1 || bill > 10000) {
        showToast('Please enter a valid monthly bill ($1–$10,000).', 'error');
        return;
      }
      if (roofArea !== null && (isNaN(roofArea) || roofArea < 0 || roofArea > 10000)) {
        showToast('Please enter a valid roof area (0–10,000 sq ft).', 'error');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<div class="spinner" style="width:18px;height:18px;border-width:2px;"></div> Calculating…';

      const data = await apiPost('/calculator/savings', { bill, roofArea, sunHours });

      if (data.success) {
        state.calcResults = data.results;
        updateCalculatorUI(data.results);
        showToast('Savings calculated!', 'success');
      }
    } catch (err) {
      showToast('Calculation failed. Please try again.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalHtml;
    }
  }

  function animateNumber(el, target, options={}) {
    try {
      const { prefix='', suffix='', decimals=0, duration=900 } = options;
      const start = parseFloat(el.dataset.current) || 0;
      const startTime = performance.now();
      function step(now) {
        const t = Math.min(1, (now - startTime) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const val = start + (target - start) * eased;
        let display = decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString();
        el.textContent = prefix + display + suffix;
        if (t < 1) requestAnimationFrame(step);
        else el.dataset.current = target;
      }
      requestAnimationFrame(step);
    } catch (e) { console.warn('Number animation failed:', e); }
  }

  function updateCalculatorUI(r) {
    try {
      animateNumber($('#result-savings'), r.yearlySavings, { prefix:'$' });
      animateNumber($('#result-co2'), r.co2Offset, { suffix:' kg' });
      animateNumber($('#result-size'), r.systemKw, { suffix:' kW', decimals:1 });
      $('#result-panels').textContent = `${r.panelCount} panels`;
      const paybackEl = $('#result-payback');
      if (r.payback > 0 && r.payback < 100) animateNumber(paybackEl, r.payback, { suffix:' yr', decimals:1 });
      else paybackEl.textContent = '— yr';

      $('#recommendation').classList.remove('hidden');
      $('#rec-title').textContent = r.recommendation.title;
      $('#rec-desc').textContent = r.recommendation.description;
      $('#rec-cost').textContent = formatMoney(r.systemCost);
      $('#rec-25yr').textContent = formatMoney(r.savings25yr);
      $('#rec-roof').textContent = `${r.roofNeeded} sq ft`;
      $('#rec-trees').textContent = r.treesEquivalent.toLocaleString();

      updateChart(r.chartData);
    } catch (e) {
      console.error('Calculator UI update failed:', e);
      showToast('Could not display results', 'error');
    }
  }

  function initChart() {
    try {
      const canvas = $('#savings-chart');
      if (!canvas || typeof Chart === 'undefined') {
        throw new Error('Chart.js not available');
      }
      const ctx = canvas.getContext('2d');
      state.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Year 0','Year 1','Year 2','Year 3','Year 4','Year 5'],
          datasets: [
            { label:'Without solar', data:[0,0,0,0,0,0], borderColor:'#2a5a3d', backgroundColor:'rgba(42,90,61,0.08)', borderWidth:2.5, tension:0.35, fill:true, pointBackgroundColor:'#2a5a3d', pointBorderColor:'#fff', pointBorderWidth:2, pointRadius:4, pointHoverRadius:6 },
            { label:'With solar', data:[0,0,0,0,0,0], borderColor:'#e6a73c', backgroundColor:'rgba(230,167,60,0.12)', borderWidth:2.5, tension:0.35, fill:true, pointBackgroundColor:'#e6a73c', pointBorderColor:'#fff', pointBorderWidth:2, pointRadius:4, pointHoverRadius:6 }
          ]
        },
        options: {
          responsive:true, maintainAspectRatio:false,
          interaction:{ mode:'index', intersect:false },
          plugins:{ legend:{ display:false }, tooltip:{ backgroundColor:'#1a3a2e', titleColor:'#faecd1', bodyColor:'#dae8df', borderColor:'#3a6d4d', borderWidth:1, padding:12, cornerRadius:8, callbacks:{ label:(ctx)=>' '+ctx.dataset.label+': '+formatMoney(ctx.parsed.y) } } },
          scales:{
            x:{ grid:{ color:'rgba(26,58,46,0.06)' }, ticks:{ color:'#588a6b', font:{ family:'Inter', size:11, weight:'500' } } },
            y:{ grid:{ color:'rgba(26,58,46,0.06)' }, ticks:{ color:'#588a6b', font:{ family:'Inter', size:11 }, callback:v=>'$'+(v>=1000?(v/1000).toFixed(0)+'k':v) } }
          },
          animation:{ duration:800, easing:'easeOutCubic' }
        }
      });
    } catch (e) {
      console.error('Chart init failed:', e);
      const canvas = $('#savings-chart');
      if (canvas && canvas.parentElement) {
        canvas.parentElement.innerHTML = '<p class="text-forest-600/70 text-sm text-center py-10">Chart unavailable — check your connection and refresh.</p>';
      }
    }
  }
  function updateChart(data) {
    if (!state.chart || !data) return;
    try {
      state.chart.data.datasets[0].data = data.cumulativeWithout;
      state.chart.data.datasets[1].data = data.cumulativeWith;
      state.chart.update();
    } catch (e) { console.error('Chart update failed:', e); }
  }

  async function handleNewsletterSubmit(e) {
    e.preventDefault();
    try {
      const emailInput = $('#newsletter-email');
      const msg = $('#newsletter-msg');
      const email = emailInput.value.trim();
      if (!email) { msg.textContent = 'Please enter your email.'; msg.style.color = '#c0392b'; return; }
      if (!validateEmail(email)) { msg.textContent = 'Please enter a valid email address.'; msg.style.color = '#c0392b'; return; }
      const data = await apiPost('/newsletter/subscribe', { email });
      msg.textContent = data.message;
      msg.style.color = '#3a6d4d';
      emailInput.value = '';
      showToast('Subscribed successfully!');
    } catch (err) {
      $('#newsletter-msg').textContent = 'Subscription failed. Please try again.';
      $('#newsletter-msg').style.color = '#c0392b';
    }
  }

  function animateCounter(el) {
    try {
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const decimals = parseInt(el.dataset.decimals || '0');
      const duration = 1800;
      const startTime = performance.now();
      function step(now) {
        const t = Math.min(1, (now - startTime) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const val = target * eased;
        let display = decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString();
        el.textContent = display + suffix;
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    } catch (e) { console.warn('Counter failed:', e); }
  }

  function setupRevealObserver() {
    if (!('IntersectionObserver' in window)) {
      $$('.reveal').forEach(el => el.classList.add('visible'));
      $$('.counter').forEach(c => { if (!c.dataset.animated) { c.dataset.animated = '1'; animateCounter(c); } });
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          const counters = entry.target.querySelectorAll('.counter');
          counters.forEach(c => { if (!c.dataset.animated) { c.dataset.animated = '1'; animateCounter(c); } });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    $$('.reveal').forEach(el => observer.observe(el));
  }

  function setupThemeToggle() {
    const btn = $('#theme-toggle');
    const sunIcon = $('#theme-icon-sun');
    const moonIcon = $('#theme-icon-moon');
    function reflectState() {
      const isDark = document.documentElement.classList.contains('dark');
      sunIcon.classList.toggle('hidden', isDark);
      moonIcon.classList.toggle('hidden', !isDark);
      btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }
    reflectState();
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      try { localStorage.setItem('solterra-theme', isDark ? 'dark' : 'light'); } catch (e) {}
      reflectState();
    });
  }

  function setupNavbar() {
    const navbar = $('#navbar');
    const progressBar = $('#scroll-progress');
    let wasScrolled = null; // null forces the first paint to apply
    let ticking = false;

    function applyState(scrolled) {
      navbar.classList.toggle('navbar-scrolled', scrolled);
      navbar.classList.toggle('navbar-top', !scrolled);
    }

    function update() {
      ticking = false;
      const scrolled = window.scrollY > 60;
      if (scrolled !== wasScrolled) {
        wasScrolled = scrolled;
        applyState(scrolled);
      }
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      progressBar.style.width = progress + '%';
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
  }

  function setupEventListeners() {
    document.addEventListener('click', (e) => {
      try {
        const addBtn = e.target.closest('.add-to-cart-btn, .modal-add-cart');
        if (addBtn) { e.stopPropagation(); addToCart(addBtn.dataset.productId); if (addBtn.classList.contains('modal-add-cart')) closeProductModal(); return; }
        const trigger = e.target.closest('[data-trigger]');
        if (trigger) { openProductModal(trigger.dataset.trigger); return; }
        const removeBtn = e.target.closest('.remove-item'); if (removeBtn) { removeFromCart(removeBtn.dataset.id); return; }
        const qtyDec = e.target.closest('.qty-decrease'); if (qtyDec) { updateQty(qtyDec.dataset.id, -1); return; }
        const qtyInc = e.target.closest('.qty-increase'); if (qtyInc) { updateQty(qtyInc.dataset.id, 1); return; }
      } catch (err) { console.error('Click handler failed:', err); }
    });

    $('#cart-btn').addEventListener('click', openCart);
    $('#cart-close').addEventListener('click', closeCart);
    $('#cart-backdrop').addEventListener('click', closeCart);
    $('#cart-shop-btn').addEventListener('click', () => { closeCart(); document.getElementById('shop').scrollIntoView({behavior:'smooth'}); });
    $('#checkout-btn').addEventListener('click', openCheckout);
    $('#modal-close').addEventListener('click', closeProductModal);
    $('#product-modal').addEventListener('click', (e) => { if (e.target.id === 'product-modal') closeProductModal(); });

    $('#menu-btn').addEventListener('click', () => $('#mobile-menu').classList.toggle('hidden'));
    $$('.mobile-link').forEach(l => l.addEventListener('click', () => $('#mobile-menu').classList.add('hidden')));

    $('#filter-chips').addEventListener('click', (e) => {
      const chip = e.target.closest('.chip'); if (!chip) return;
      $$('.chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.filter = chip.dataset.filter;
      renderShop();
    });
    $('#clear-filters').addEventListener('click', () => {
      $$('.chip').forEach(c => c.classList.remove('active'));
      $('#filter-chips .chip[data-filter="all"]').classList.add('active');
      state.filter = 'all';
      renderShop();
    });
    $('#sort-select').addEventListener('change', (e) => { state.sort = e.target.value; renderShop(); });

    $('#calc-form').addEventListener('submit', handleCalculatorSubmit);
    $('#bill-input').addEventListener('input', validateBillLive);
    $('#roof-input').addEventListener('input', () => {
      const roofInput = $('#roof-input');
      const roofErrorEl = $('#roof-error');
      const val = roofInput.value.trim();
      if (val === '') { roofErrorEl.classList.add('hidden'); roofInput.classList.remove('error'); return; }
      const num = parseFloat(val);
      if (isNaN(num) || num < 0 || num > 10000) {
        roofErrorEl.querySelector('span').textContent = 'Roof area must be between 0 and 10,000 sq ft.';
        roofErrorEl.classList.remove('hidden'); roofInput.classList.add('error');
      } else { roofErrorEl.classList.add('hidden'); roofInput.classList.remove('error'); }
    });
    $('#sun-slider').addEventListener('input', (e) => { $('#sun-value').textContent = parseFloat(e.target.value).toFixed(1) + ' hrs'; });
    $('#use-avg').addEventListener('click', () => { $('#bill-input').value = 180; validateBillLive(); });
    $('#calc-reset').addEventListener('click', () => {
      $('#calc-form').reset();
      $('#sun-value').textContent = '5.0 hrs';
      validateBillLive();
      $('#result-savings').textContent = '$0';
      $('#result-co2').textContent = '0 kg';
      $('#result-size').textContent = '0 kW';
      $('#result-payback').textContent = '— yr';
      $('#result-panels').textContent = '0 panels';
      $('#recommendation').classList.add('hidden');
      state.calcResults = null;
      if (state.chart) {
        state.chart.data.datasets[0].data = [0,0,0,0,0,0];
        state.chart.data.datasets[1].data = [0,0,0,0,0,0];
        state.chart.update();
      }
    });
    $('#rec-add-cart').addEventListener('click', () => {
      if (!state.calcResults) return;
      const panelCount = state.calcResults.panelCount;
      const capped = Math.min(panelCount, 50);
      const existing = state.cart.find(i => i.id === 'helios-400');
      const helios = state.products.find(p => p.id === 'helios-400');
      if (!helios) { showToast('Recommended product unavailable', 'error'); return; }
      if (existing) existing.qty += capped;
      else state.cart.push({ id: helios.id, name: helios.name, price: helios.price, img: helios.img, qty: capped, ecoScore: helios.ecoScore });
      updateCartUI();
      showToast(`Recommended kit (${panelCount} panels) added!`, 'success');
      openCart();
    });

    document.addEventListener('submit', async (e) => {
      if (e.target.id === 'checkout-form') {
        e.preventDefault();
        try {
          const form = e.target;
          const inputs = form.querySelectorAll('input');
          let isValid = true;
          inputs.forEach(input => {
            clearError(input);
            const value = input.value.trim();
            const name = input.name;
            if (input.required && !value) { showError(input, 'This field is required.'); isValid = false; return; }
            if (name === 'email' && value && !validateEmail(value)) { showError(input, 'Please enter a valid email address.'); isValid = false; }
            if (name === 'card' && value) { const d = value.replace(/\s/g,''); if (!/^\d{13,19}$/.test(d)) { showError(input, 'Please enter a valid card number.'); isValid = false; } }
            if (name === 'expiry' && value && !/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(value)) { showError(input, 'Format: MM/YY'); isValid = false; }
            if (name === 'cvv' && value && !/^\d{3,4}$/.test(value)) { showError(input, '3-4 digits'); isValid = false; }
          });
          if (!isValid) { showToast('Please fix the errors above.', 'error'); return; }
          await submitOrder(new FormData(form));
        } catch (err) { console.error('Checkout submit failed:', err); showToast('Checkout failed. Please try again.', 'error'); }
      }
      if (e.target.id === 'newsletter-form') {
        e.preventDefault();
        await handleNewsletterSubmit(e);
      }
    });

    document.addEventListener('click', (e) => {
      if (e.target.id === 'checkout-close' || e.target.id === 'confirmation-close') closeCheckout();
      if (e.target.id === 'checkout-modal') closeCheckout();
    });

    document.addEventListener('input', (e) => {
      if (e.target.name === 'card') {
        let v = e.target.value.replace(/\s/g,'').replace(/[^0-9]/g,'');
        v = v.match(/.{1,4}/g) ? v.match(/.{1,4}/g).join(' ') : v;
        e.target.value = v.slice(0,19);
      }
      if (e.target.name === 'expiry') {
        let v = e.target.value.replace(/\D/g,'').slice(0,4);
        if (v.length >= 3) v = v.slice(0,2) + '/' + v.slice(2);
        e.target.value = v;
      }
      if (e.target.name === 'cvv') { e.target.value = e.target.value.replace(/\D/g,'').slice(0,4); }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { closeCart(); closeProductModal(); closeCheckout(); }
    });
  }

  async function init() {
    try {
      setupThemeToggle();
      setupNavbar();
      setupRevealObserver();
      setupEventListeners();
      initChart();
      updateCartUI();
      await Promise.all([loadFeaturedProducts(), loadAllProducts()]);
    } catch (e) {
      console.error('Init failed:', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
