'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator as CalcIcon, DollarSign, CloudOff, Battery, Clock, Trees, ShoppingCart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useCartStore } from '@/lib/store';
import { toast } from 'sonner';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface CalcResults {
  yearlySavings: number;
  co2Offset: number;
  systemKw: number;
  panelCount: number;
  payback: number;
  systemCost: number;
  savings25yr: number;
  roofNeeded: number;
  treesEquivalent: number;
  chartData: { years: number[]; cumulativeWithout: number[]; cumulativeWith: number[] };
  recommendation: { title: string; description: string };
}

export default function Calculator() {
  const [bill, setBill] = useState('');
  const [roofArea, setRoofArea] = useState('');
  const [sunHours, setSunHours] = useState([5]);
  const [results, setResults] = useState<CalcResults | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const calculate = async () => {
    setErrors({});
    setLoading(true);
    try {
      const body: Record<string, unknown> = { bill: Number(bill), sunHours: sunHours[0] };
      if (roofArea) body.roofArea = Number(roofArea);
      const res = await fetch('/api/calculator/savings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!data.success && data.errors) {
        setErrors(data.errors);
        return;
      }
      if (data.success) {
        setResults(data.results);
      }
    } catch {
      toast.error('Calculation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const chartData = results
    ? results.chartData.years.map((year, i) => ({
        year: `Year ${year}`,
        'Without Solar': results.chartData.cumulativeWithout[i],
        'With Solar': results.chartData.cumulativeWith[i],
      }))
    : [];

  const formatMoney = (n: number) => '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });

  return (
    <section
      id="calculator"
      className="py-20 sm:py-28 relative overflow-hidden calc-sky"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,180,20,0.06),transparent_60%)] dark:bg-[radial-gradient(circle_at_80%_20%,rgba(255,180,20,0.08),transparent_60%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-700/10 dark:bg-white/10 border border-navy-700/15 dark:border-white/15 text-xs text-navy-700/80 dark:text-white/80 mb-4"
          >
            <CalcIcon className="w-4 h-4 text-amber-400" /> Free Savings Calculator
          </motion.div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            How much can you save?
          </h2>
          <p className="text-muted-foreground mt-2 text-base">
            Enter your details and see your personalized savings estimate
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 bg-white/70 dark:bg-white/10 backdrop-blur-sm border border-border dark:border-white/15 rounded-2xl p-6 sm:p-8 shadow-lg dark:shadow-none"
          >
            <div className="space-y-6">
              <div>
                <Label className="text-foreground text-sm font-medium">Monthly Electric Bill ($)</Label>
                <Input
                  type="number"
                  placeholder="e.g. 150"
                  value={bill}
                  onChange={(e) => setBill(e.target.value)}
                  className="mt-2 rounded-xl"
                  min={1}
                />
                {errors.bill && <p className="text-destructive text-xs mt-1.5">{errors.bill}</p>}
              </div>

              <div>
                <Label className="text-foreground text-sm font-medium">Available Roof Area (sq ft)</Label>
                <Input
                  type="number"
                  placeholder="e.g. 800 (optional)"
                  value={roofArea}
                  onChange={(e) => setRoofArea(e.target.value)}
                  className="mt-2 rounded-xl"
                />
                {errors.roofArea && <p className="text-destructive text-xs mt-1.5">{errors.roofArea}</p>}
              </div>

              <div>
                <Label className="text-foreground text-sm font-medium">
                  Average Peak Sun Hours: <span className="text-amber-500 dark:text-amber-400 font-bold">{sunHours[0]}</span>
                </Label>
                <Slider
                  value={sunHours}
                  onValueChange={setSunHours}
                  min={3}
                  max={7}
                  step={0.5}
                  className="mt-3"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>3h</span><span>5h</span><span>7h</span>
                </div>
                {errors.sunHours && <p className="text-destructive text-xs mt-1">{errors.sunHours}</p>}
              </div>

              <Button
                onClick={calculate}
                disabled={loading || !bill}
                className="btn-amber w-full py-5 rounded-xl text-base"
              >
                {loading ? 'Calculating...' : 'Calculate My Savings'}
                {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3 space-y-6"
          >
            {!results ? (
              <div className="flex items-center justify-center h-full min-h-[300px] rounded-2xl border-2 border-dashed border-navy-700/15 dark:border-white/15">
                <div className="text-center text-muted-foreground">
                  <CalcIcon className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p className="text-lg">Enter your details to see results</p>
                </div>
              </div>
            ) : (
              <>
                {/* Result cards */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { icon: DollarSign, label: 'Yearly Savings', value: formatMoney(results.yearlySavings), color: 'text-amber-500 dark:text-amber-400' },
                    { icon: CloudOff, label: 'CO\u2082 Offset', value: `${results.co2Offset.toLocaleString()} kg`, color: 'text-sgreen-500 dark:text-sgreen-400' },
                    { icon: Battery, label: 'System Size', value: `${results.systemKw} kW`, color: 'text-navy-600 dark:text-navy-300' },
                    { icon: Clock, label: 'Payback Period', value: `${results.payback} years`, color: 'text-navy-700 dark:text-navy-400' },
                  ].map((card) => (
                    <div
                      key={card.label}
                      className="bg-white/70 dark:bg-white/10 backdrop-blur-sm border border-border dark:border-white/15 rounded-2xl p-5 shadow-sm dark:shadow-none"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-400/10 dark:bg-white/10 flex items-center justify-center">
                          <card.icon className={`w-5 h-5 ${card.color}`} />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">{card.label}</p>
                          <p className={`text-2xl font-bold font-display ${card.color}`}>{card.value}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chart */}
                <div className="bg-white/70 dark:bg-white/10 backdrop-blur-sm border border-border dark:border-white/15 rounded-2xl p-5 shadow-sm dark:shadow-none">
                  <h3 className="text-foreground font-semibold text-sm mb-4">5-Year Cost Comparison</h3>
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="year" className="text-muted-foreground" fontSize={12} />
                      <YAxis className="text-muted-foreground" fontSize={12} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                      <Tooltip
                        contentStyle={{
                          background: 'var(--color-card)',
                          border: '1px solid var(--color-border)',
                          borderRadius: '12px',
                          color: 'var(--color-foreground)',
                          fontSize: 13,
                        }}
                        formatter={(value: number) => formatMoney(value)}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: 12 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Without Solar"
                        stroke="#3A5EA0"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: '#3A5EA0', strokeWidth: 2 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="With Solar"
                        stroke="#FFB414"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: '#FFB414', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Recommendation */}
                <div className="bg-amber-400/10 dark:bg-amber-400/15 border border-amber-400/20 dark:border-amber-400/30 rounded-2xl p-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Trees className="w-4 h-4 text-sgreen-500" />
                        <span className="text-xs text-sgreen-500 font-medium">≈ {results.treesEquivalent} trees equivalent/year</span>
                      </div>
                      <h4 className="text-foreground font-semibold">{results.recommendation.title}</h4>
                      <p className="text-muted-foreground text-sm mt-1">{results.recommendation.description}</p>
                      <p className="text-muted-foreground/60 text-xs mt-2">
                        {results.panelCount} panels · {formatMoney(results.systemCost)} system cost · {results.roofNeeded} sq ft needed · {formatMoney(results.savings25yr)} net savings over 25 years
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        addItem({
                          id: 'helios-400',
                          name: 'Helios 400W Residential Panel',
                          price: 349,
                          ecoScore: 'A+',
                          img: 'helios-400',
                        });
                        toast.success('Helios 400W Panel added to cart');
                      }}
                      className="btn-amber rounded-xl shrink-0"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
