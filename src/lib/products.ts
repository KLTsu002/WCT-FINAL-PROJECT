export interface ProductSpec {
  k: string;
  v: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'solar' | 'chargers' | 'home' | 'lifestyle';
  price: number;
  ecoScore: 'A+' | 'A' | 'B';
  rating: number;
  reviews: number;
  badge: string | null;
  img: string;
  desc: string;
  specs: ProductSpec[];
}

export const products: Product[] = [
  {
    id: "helios-400",
    name: "Helios 400W Residential Panel",
    category: "solar",
    price: 349,
    ecoScore: "A+",
    rating: 4.9,
    reviews: 384,
    badge: "Best Seller",
    img: "helios-400",
    desc: "High-efficiency monocrystalline panel with 22% conversion rate and 25-year performance warranty. Built to withstand extreme weather.",
    specs: [
      { k: "Power", v: "400W" },
      { k: "Efficiency", v: "22%" },
      { k: "Cell type", v: "Monocrystalline" },
      { k: "Warranty", v: "25 years" },
      { k: "Dimensions", v: '79" x 39" x 1.4"' }
    ]
  },
  {
    id: "sunforge-200",
    name: "SunForge 200W Folding Kit",
    category: "solar",
    price: 249,
    ecoScore: "A",
    rating: 4.7,
    reviews: 192,
    badge: null,
    img: "sunforge-200",
    desc: "Portable folding panel kit for off-grid cabins, RVs, and emergency backup. Plug-and-play setup in under 5 minutes.",
    specs: [
      { k: "Power", v: "200W" },
      { k: "Folded weight", v: "11 lbs" },
      { k: "Ports", v: "USB-C, DC, MC4" },
      { k: "Weatherproof", v: "IP67" }
    ]
  },
  {
    id: "aurora-300",
    name: "Aurora 300W Bifacial Panel",
    category: "solar",
    price: 289,
    ecoScore: "A+",
    rating: 4.8,
    reviews: 156,
    badge: null,
    img: "aurora-300",
    desc: "Bifacial design captures light from both sides, boosting output by up to 30% in reflective environments like snow or light surfaces.",
    specs: [
      { k: "Power", v: "300W" },
      { k: "Bifacial gain", v: "+30%" },
      { k: "Frame", v: "Anodized aluminum" },
      { k: "Warranty", v: "25 years" }
    ]
  },
  {
    id: "solis-100",
    name: "Solis 100W Portable Charger",
    category: "chargers",
    price: 129,
    ecoScore: "A",
    rating: 4.8,
    reviews: 421,
    badge: "New",
    img: "solis-100",
    desc: "Foldable solar charger with USB-C PD output. Charges phones, tablets, and small laptops in direct sun.",
    specs: [
      { k: "Power", v: "100W" },
      { k: "USB-C", v: "60W PD" },
      { k: "Folded size", v: '11" x 6"' },
      { k: "Weight", v: "2.8 lbs" }
    ]
  },
  {
    id: "sunbank-20k",
    name: "SunBank 20K Power Bank",
    category: "chargers",
    price: 59,
    ecoScore: "A",
    rating: 4.6,
    reviews: 689,
    badge: null,
    img: "sunbank-20k",
    desc: "20,000mAh power bank with built-in solar trickle charge. Keep your devices alive anywhere, anytime.",
    specs: [
      { k: "Capacity", v: "20,000mAh" },
      { k: "Output", v: "USB-C 30W, USB-A x2" },
      { k: "Solar input", v: "5W" },
      { k: "Weight", v: "1.1 lbs" }
    ]
  },
  {
    id: "solis-flex-50",
    name: "Solis Flex 50W Mat",
    category: "chargers",
    price: 79,
    ecoScore: "A",
    rating: 4.7,
    reviews: 234,
    badge: null,
    img: "solis-flex-50",
    desc: "Ultra-light flexible solar mat for backpacking. Rolls up to fit in any pack. Perfect for multi-day adventures.",
    specs: [
      { k: "Power", v: "50W" },
      { k: "Weight", v: "1.4 lbs" },
      { k: "Output", v: "USB-C, USB-A" },
      { k: "Material", v: "ETFE flexible" }
    ]
  },
  {
    id: "lumen-led-4",
    name: "Lumen Smart LED Bulb Pack (4)",
    category: "home",
    price: 39,
    ecoScore: "A+",
    rating: 4.9,
    reviews: 512,
    badge: null,
    img: "lumen-led-4",
    desc: "Tunable white smart LED bulbs. 9W per bulb, equivalent to 60W incandescent. App and voice control.",
    specs: [
      { k: "Pack", v: "4 bulbs" },
      { k: "Power", v: "9W each" },
      { k: "Lumens", v: "800 lm" },
      { k: "Lifespan", v: "25,000 hrs" },
      { k: "Smart", v: "Wi-Fi + Alexa" }
    ]
  },
  {
    id: "econest-thermostat",
    name: "EcoNest Smart Thermostat",
    category: "home",
    price: 179,
    ecoScore: "A",
    rating: 4.8,
    reviews: 298,
    badge: "Smart",
    img: "econest-thermostat",
    desc: "Learning thermostat that adapts to your schedule. Saves up to 23% on heating and cooling bills.",
    specs: [
      { k: "Saves", v: "Up to 23%" },
      { k: "Display", v: '3.5" LCD' },
      { k: "Sensors", v: "Multi-room" },
      { k: "Compatible", v: "Google/Alexa" }
    ]
  },
  {
    id: "aquasave-flow",
    name: "AquaSave Flow Regulator",
    category: "home",
    price: 24,
    ecoScore: "A+",
    rating: 4.7,
    reviews: 178,
    badge: null,
    img: "aquasave-flow",
    desc: "Install in minutes. Reduces water flow by 40% without sacrificing pressure. Pack of 3.",
    specs: [
      { k: "Pack", v: "3 regulators" },
      { k: "Savings", v: "40% water" },
      { k: "Fits", v: "Standard taps" },
      { k: "Material", v: "Brass + silicone" }
    ]
  },
  {
    id: "terraloop-set",
    name: "Terraloop Container Set",
    category: "lifestyle",
    price: 49,
    ecoScore: "A+",
    rating: 4.9,
    reviews: 367,
    badge: null,
    img: "terraloop-set",
    desc: "Reusable glass container set with silicone lids. Microwave and dishwasher safe. Replaces 500+ disposables per year.",
    specs: [
      { k: "Set", v: "5 containers" },
      { k: "Material", v: "Borosilicate glass" },
      { k: "Lids", v: "Silicone" },
      { k: "Safe", v: "Microwave/dishwasher" }
    ]
  },
  {
    id: "pureleaf-bundle",
    name: "PureLeaf Eco Cleaning Bundle",
    category: "lifestyle",
    price: 34,
    ecoScore: "A",
    rating: 4.6,
    reviews: 245,
    badge: null,
    img: "pureleaf-bundle",
    desc: "Plant-based cleaning concentrates. Refillable glass bottles. Zero plastic, zero waste.",
    specs: [
      { k: "Includes", v: "3 concentrates + 2 bottles" },
      { k: "Refills", v: "Up to 12 bottles" },
      { k: "Scent", v: "Citrus + cedar" },
      { k: "Biodegradable", v: "Yes" }
    ]
  },
  {
    id: "voltcycle-ebike",
    name: "VoltCycle E-Bike",
    category: "lifestyle",
    price: 1299,
    ecoScore: "B",
    rating: 4.9,
    reviews: 89,
    badge: "Premium",
    img: "voltcycle-ebike",
    desc: "Commuter e-bike with 80mi range, 28mph top speed, and regenerative braking. Carbon frame, solar-ready charging.",
    specs: [
      { k: "Range", v: "80 miles" },
      { k: "Top speed", v: "28 mph" },
      { k: "Motor", v: "350W hub" },
      { k: "Charge time", v: "4 hrs" },
      { k: "Weight", v: "38 lbs" }
    ]
  },
  // --- New products (Task 4-a) ---
  {
    id: "helios-600",
    name: "Helios 600W Commercial Panel",
    category: "solar",
    price: 499,
    ecoScore: "A+",
    rating: 4.8,
    reviews: 210,
    badge: "Popular",
    img: "helios-600",
    desc: "Commercial-grade half-cut monocrystalline panel with 23.4% efficiency. Ideal for large rooftops, solar farms, and commercial installations. Low-light performance optimized for overcast climates.",
    specs: [
      { k: "Power", v: "600W" },
      { k: "Efficiency", v: "23.4%" },
      { k: "Cell type", v: "Half-cut Mono" },
      { k: "Warranty", v: "30 years" },
      { k: "Dimensions", v: '89" x 44" x 1.2"' }
    ]
  },
  {
    id: "solaredge-500",
    name: "SolarEdge 500W Thin-Film Panel",
    category: "solar",
    price: 379,
    ecoScore: "B",
    rating: 4.5,
    reviews: 98,
    badge: null,
    img: "solaredge-500",
    desc: "Lightweight thin-film panel perfect for flat roofs and structures that can't support heavy loads. Flexible mounting options and excellent high-temperature performance.",
    specs: [
      { k: "Power", v: "500W" },
      { k: "Efficiency", v: "18.7%" },
      { k: "Cell type", v: "CIGS Thin-Film" },
      { k: "Warranty", v: "15 years" },
      { k: "Weight", v: "33 lbs" }
    ]
  },
  {
    id: "powercore-1000",
    name: "PowerCore 1000 Portable Station",
    category: "chargers",
    price: 549,
    ecoScore: "A",
    rating: 4.8,
    reviews: 167,
    badge: "Popular",
    img: "powercore-1000",
    desc: "1024Wh LiFePO4 portable power station with 1000W pure sine wave inverter. Powers mini-fridges, laptops, and CPAP machines for up to 30 hours. Solar rechargeable.",
    specs: [
      { k: "Capacity", v: "1024Wh (LiFePO4)" },
      { k: "AC output", v: "1000W pure sine" },
      { k: "Ports", v: "AC x3, USB-C x2, USB-A x3, 12V" },
      { k: "Solar input", v: "200W max" },
      { k: "Weight", v: "26.4 lbs" }
    ]
  },
  {
    id: "solarjuice-30w",
    name: "SolarJuice 30W Car Charger",
    category: "chargers",
    price: 89,
    ecoScore: "B",
    rating: 4.4,
    reviews: 312,
    badge: "Sale",
    img: "solarjuice-30w",
    desc: "Dashboard-mounted solar panel that trickle-charges your car battery. Prevents battery drain during long parking. Compact, weather-resistant design.",
    specs: [
      { k: "Power", v: "30W" },
      { k: "Output", v: "12V/5A DC" },
      { k: "Size", v: '14" x 8"' },
      { k: "Weatherproof", v: "IP65" },
      { k: "Weight", v: "2.2 lbs" }
    ]
  },
  {
    id: "greenhub-monitor",
    name: "GreenHub Home Energy Monitor",
    category: "home",
    price: 129,
    ecoScore: "A",
    rating: 4.7,
    reviews: 189,
    badge: "Eco Pick",
    img: "greenhub-monitor",
    desc: "Whole-home energy monitor with real-time tracking via app. Identifies energy-hungry appliances and suggests optimizations. Works with any electrical panel.",
    specs: [
      { k: "Sensors", v: "16 circuits" },
      { k: "Accuracy", v: "99.5%" },
      { k: "App", v: "iOS + Android" },
      { k: "Integrations", v: "Google Home, Alexa, IFTTT" },
      { k: "Install", v: "DIY, 15 min" }
    ]
  },
  {
    id: "lumenpro-flood-2pk",
    name: "LumenPro Solar Flood Light (2-pack)",
    category: "home",
    price: 69,
    ecoScore: "A+",
    rating: 4.6,
    reviews: 276,
    badge: null,
    img: "lumenpro-flood-2pk",
    desc: "High-lumen solar-powered security flood lights with motion detection. Auto on/off with adjustable sensitivity. No wiring needed.",
    specs: [
      { k: "Pack", v: "2 lights" },
      { k: "Lumens", v: "1200 lm each" },
      { k: "Solar panel", v: "6W integrated" },
      { k: "Detection range", v: "26 ft / 120°" },
      { k: "Battery", v: "4000mAh Li-ion" }
    ]
  },
  {
    id: "terratrek-bottle",
    name: "TerraTrek Bamboo Water Bottle",
    category: "lifestyle",
    price: 29,
    ecoScore: "A+",
    rating: 4.8,
    reviews: 534,
    badge: "Popular",
    img: "terratrek-bottle",
    desc: "Double-wall insulated bottle with bamboo cap. Keeps drinks cold 24hrs or hot 12hrs. Replaces 200+ single-use plastic bottles per year.",
    specs: [
      { k: "Capacity", v: "750ml / 25 oz" },
      { k: "Material", v: "18/8 Stainless Steel" },
      { k: "Insulation", v: "Double-wall vacuum" },
      { k: "BPA free", v: "Yes" },
      { k: "Weight", v: "0.7 lbs" }
    ]
  },
  {
    id: "ecoride-scooter",
    name: "EcoRide Folding E-Scooter",
    category: "lifestyle",
    price: 899,
    ecoScore: "B",
    rating: 4.7,
    reviews: 143,
    badge: "Sale",
    img: "ecoride-scooter",
    desc: "Commuter electric scooter with 25mi range and 18mph top speed. One-click fold mechanism fits under any desk. Pneumatic tires for a smooth ride.",
    specs: [
      { k: "Range", v: "25 miles" },
      { k: "Top speed", v: "18 mph" },
      { k: "Motor", v: "300W rear" },
      { k: "Charge time", v: "3.5 hrs" },
      { k: "Weight", v: "26 lbs" },
      { k: "Folded size", v: '41" x 17" x 16"' }
    ]
  }
];

export function productImg(imgId: string, w = 500, h = 500): string {
  return `/products/${imgId}.png`;
}

export const categoryLabels: Record<string, string> = {
  all: 'All',
  solar: 'Solar Panels',
  chargers: 'Chargers',
  home: 'Eco-Home',
  lifestyle: 'Lifestyle',
};
