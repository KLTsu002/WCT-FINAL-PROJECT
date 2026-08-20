import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bill, roofArea, sunHours } = body;
    const errors: Record<string, string> = {};

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
      return NextResponse.json({ success: false, errors }, { status: 400 });
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

    if (roofConstrained) {
      const producedValue = yearlyKwh * ELECTRICITY_RATE;
      yearlySavings = Math.round(Math.min(yearlyBill * OFFSET_PERCENT, producedValue));
      co2Offset = Math.round(yearlyKwh * CO2_PER_KWH);
    }

    const systemCost = panelCount * PANEL_COST + INSTALL_COST;
    const yearlyMaintenance = systemCost * MAINTENANCE_RATE / 100;
    const netYearlySavings = yearlySavings - yearlyMaintenance;
    const payback = systemCost > 0 ? systemCost / Math.max(1, netYearlySavings) : 0;
    const savings25yr = netYearlySavings * SYSTEM_LIFESPAN - systemCost;
    const treesEquivalent = Math.round(co2Offset / 21);

    const years = [0, 1, 2, 3, 4, 5];
    const cumulativeWithout = years.map((y) => Math.round(yearlyBill * y));
    const cumulativeWith = years.map((y) => {
      if (y === 0) return Math.round(systemCost);
      return Math.round(systemCost + (yearlyBill - yearlySavings + yearlyMaintenance) * y);
    });

    return NextResponse.json({
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
          description: `A complete residential solar kit — ${panelCount} Helios 400W panels, inverter, and full installation.` + (roofConstrained ? ' Roof area is the limiting factor; consider bifacial panels to maximize output.' : ''),
        },
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Calculation failed' }, { status: 500 });
  }
}
