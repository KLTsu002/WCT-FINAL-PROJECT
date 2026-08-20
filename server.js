const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

let PRODUCTS = [];
try {
  const raw = fs.readFileSync(path.join(__dirname, 'data', 'products.json'), 'utf-8');
  PRODUCTS = JSON.parse(raw);
} catch (err) {
  console.error('Error loading products.json:', err.message);
}

const ORDERS = new Map();
const NEWSLETTER = new Set();

// GET /api/products
app.get('/api/products', (req, res) => {
  try {
    const { category, sort, search } = req.query;
    let list = [...PRODUCTS];

    if (category && category !== 'all') {
      list = list.filter(p => p.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
    }
    switch (sort) {
      case 'price-low':  list.sort((a, b) => a.price - b.price); break;
      case 'price-high': list.sort((a, b) => b.price - a.price); break;
      case 'eco':        list.sort((a, b) => (a.ecoScore < b.ecoScore ? -1 : 1)); break;
      case 'rating':     list.sort((a, b) => b.rating - a.rating); break;
    }
    res.json({ success: true, count: list.length, products: list });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
});

// GET /api/products/featured
app.get('/api/products/featured', (req, res) => {
  try {
    const featured = PRODUCTS.filter(p => p.badge).slice(0, 6);
    res.json({ success: true, count: featured.length, products: featured });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch featured products' });
  }
});

// GET /api/products/:id
app.get('/api/products/:id', (req, res) => {
  try {
    const product = PRODUCTS.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch product' });
  }
});

// POST /api/calculator/savings
app.post('/api/calculator/savings', (req, res) => {
  try {
    const { bill, roofArea, sunHours } = req.body;
    const errors = {};

    if (bill === undefined || bill === null || bill === '') {
      errors.bill = 'Monthly bill is required.';
    } else if (typeof bill !== 'number' || isNaN(bill)) {
      errors.bill = 'Bill must be a number.';
    } else if (bill < 1) {
      errors.bill = 'Bill must be at least $1.';
    } else if (bill > 10000) {
      errors.bill = 'Bill cannot exceed $10,000.';
    }

    if (roofArea !== undefined && roofArea !== null && roofArea !== '') {
      if (typeof roofArea !== 'number' || isNaN(roofArea)) {
        errors.roofArea = 'Roof area must be a number.';
      } else if (roofArea < 0) {
        errors.roofArea = 'Roof area cannot be negative.';
      } else if (roofArea > 10000) {
        errors.roofArea = 'Roof area cannot exceed 10,000 sq ft.';
      }
    }

    if (sunHours !== undefined) {
      if (typeof sunHours !== 'number' || isNaN(sunHours)) {
        errors.sunHours = 'Sun hours must be a number.';
      } else if (sunHours < 3 || sunHours > 7) {
        errors.sunHours = 'Sun hours must be between 3 and 7.';
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const ELECTRICITY_RATE = 0.15;
    const PANEL_WATTAGE = 400;
    const PANEL_COST = 349;
    const INSTALL_COST = 2000;
    const CO2_PER_KWH = 0.42;
    const PANEL_AREA = 17.5;
    const OFFSET_PERCENT = 0.85;
    const SYSTEM_LIFESPAN = 25;
    const MAINTENANCE_RATE = 0.5;

    const safeBill = Number(bill);
    const safeRoof = roofArea ? Number(roofArea) : null;
    const safeSun = sunHours ? Number(sunHours) : 5;

    const monthlyKwh = safeBill / ELECTRICITY_RATE;
    const dailyKwh = monthlyKwh / 30;
    let systemKw = dailyKwh / safeSun;
    systemKw = Math.max(1, Math.round(systemKw * 10) / 10);
    let panelCount = Math.ceil((systemKw * 1000) / PANEL_WATTAGE);

    let roofConstrained = false;
    if (safeRoof && safeRoof > 0) {
      const maxPanels = Math.max(1, Math.floor(safeRoof / PANEL_AREA));
      if (panelCount > maxPanels) {
        panelCount = maxPanels;
        roofConstrained = true;
      }
    }

    const actualSystemKw = (panelCount * PANEL_WATTAGE) / 1000;
    const yearlyKwh = actualSystemKw * safeSun * 365;
    const yearlyBill = safeBill * 12;
    let yearlySavings = Math.round(yearlyBill * OFFSET_PERCENT);
    let co2Offset = Math.round(yearlyKwh * OFFSET_PERCENT * CO2_PER_KWH);

    // If roof-constrained, savings/offset are capped by what the smaller system can actually generate
    if (roofConstrained) {
      const producedKwh = yearlyKwh; // already based on constrained panelCount
      const producedValue = producedKwh * ELECTRICITY_RATE;
      yearlySavings = Math.round(Math.min(yearlyBill * OFFSET_PERCENT, producedValue));
      co2Offset = Math.round(producedKwh * CO2_PER_KWH);
    }

    const systemCost = panelCount * PANEL_COST + INSTALL_COST;
    const yearlyMaintenance = systemCost * MAINTENANCE_RATE / 100;
    const netYearlySavings = yearlySavings - yearlyMaintenance;
    const payback = systemCost > 0 ? systemCost / Math.max(1, netYearlySavings) : 0;
    const savings25yr = netYearlySavings * SYSTEM_LIFESPAN - systemCost;
    const treesEquivalent = Math.round(co2Offset / 21);

    const years = [0, 1, 2, 3, 4, 5];
    const cumulativeWithout = years.map(y => Math.round(yearlyBill * y));
    const cumulativeWith = years.map(y => {
      if (y === 0) return Math.round(systemCost);
      return Math.round(systemCost + (yearlyBill - yearlySavings + yearlyMaintenance) * y);
    });

    res.json({
      success: true,
      results: {
        yearlySavings,
        co2Offset,
        systemKw: Math.round(actualSystemKw * 10) / 10,
        panelCount,
        roofConstrained,
        payback: Math.round(payback * 10) / 10,
        systemCost,
        savings25yr: Math.round(savings25yr),
        roofNeeded: Math.round(panelCount * PANEL_AREA),
        treesEquivalent,
        chartData: { years, cumulativeWithout, cumulativeWith },
        recommendation: {
          title: 'Helios Residential System',
          description: `A complete residential solar kit — ${panelCount} Helios 400W panels, inverter, and full installation.` + (roofConstrained ? ' Roof area is the limiting factor; consider bifacial panels to maximize output.' : '')
        }
      }
    });
  } catch (err) {
    console.error('Calculator error:', err);
    res.status(500).json({ success: false, error: 'Calculation failed' });
  }
});

// GET /api/impact/stats
app.get('/api/impact/stats', (req, res) => {
  res.json({
    success: true,
    stats: {
      homesPowered: 12400,
      co2OffsetTons: 87000,
      kwhGenerated: '2.3M+',
      avgPaybackYears: 8
    }
  });
});

// POST /api/orders
app.post('/api/orders', (req, res) => {
  try {
    const { customer, items } = req.body;

    if (!customer || !customer.name || !customer.email) {
      return res.status(400).json({ success: false, error: 'Customer name and email are required.' });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Cart cannot be empty.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer.email)) {
      return res.status(400).json({ success: false, error: 'Invalid email address.' });
    }

    const orderId = 'SG-' + crypto.randomBytes(4).toString('hex').toUpperCase();
    const lineItems = items.map(item => {
      const product = PRODUCTS.find(p => p.id === item.id);
      if (!product) return null;
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        qty: Math.max(1, parseInt(item.qty) || 1),
        ecoScore: product.ecoScore
      };
    }).filter(Boolean);

    if (lineItems.length === 0) {
      return res.status(400).json({ success: false, error: 'No valid products in cart.' });
    }

    const subtotal = lineItems.reduce((s, i) => s + i.price * i.qty, 0);
    const co2Offset = Math.round(subtotal * 0.5);

    const order = {
      orderId,
      customer: { name: customer.name, email: customer.email, address: customer.address || '' },
      items: lineItems,
      subtotal: Math.round(subtotal * 100) / 100,
      shipping: 0,
      total: Math.round(subtotal * 100) / 100,
      co2Offset,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    ORDERS.set(orderId, order);
    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to create order' });
  }
});

// GET /api/orders/:id
app.get('/api/orders/:id', (req, res) => {
  try {
    const order = ORDERS.get(req.params.id);
    if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch order' });
  }
});

// POST /api/newsletter/subscribe
app.post('/api/newsletter/subscribe', (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, error: 'Email is required.' });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
    }

    if (NEWSLETTER.has(email.toLowerCase())) {
      return res.json({ success: true, message: 'You are already subscribed!' });
    }

    NEWSLETTER.add(email.toLowerCase());
    res.status(201).json({ success: true, message: 'Subscribed successfully! Welcome to SolterraGreen.' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Subscription failed' });
  }
});

// SPA Fallback
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ success: false, error: 'API endpoint not found' });
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
