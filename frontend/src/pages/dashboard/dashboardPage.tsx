import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
  useMonthlySales,
  usePurchasesSales,
  useTopSales,
  useTotalExpiring,
  useTotalOutOfStock,
  useTotalStocks,
  useTotalValue,
} from '@/hooks';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';

export function Dashboard() {
  const { data: stock, isLoading: loadingTotalStocks } = useTotalStocks();
  const { data: value, isLoading: loadingTotalValue } = useTotalValue();
  const { data: outStock, isLoading: loadingTotalOutOfStock } = useTotalOutOfStock();
  const { data: expired, isLoading: loadingTotalExpired } = useTotalExpiring();
  const { data: monthlySales, isLoading: loadingMonthlySales } = useMonthlySales();
  const { data: purchasesSales, isLoading: loadingPurchasesSales } = usePurchasesSales();
  const { data: topSales, isLoading: loadingTopSales } = useTopSales();

  // ----------------------
  // 3. OPERATIONAL ALERTS
  // ----------------------
  const alerts = [
    'Product: Oil – Out of Stock',
    'Product: Milk – Below minimum threshold',
    'Product: Sugar – Expiring in 18 days',
    'Stock variation anomaly detected for Flour (+50 units)',
  ];

  // ----------------------
  // 4. STOCK TABLE (DETAILED)
  // ----------------------
  const stockTable = [
    {
      product: 'Rice',
      available: 3200,
      lastUpdate: '2025-11-20',
      nextExpiring: '2025-12-10',
      value: '$12,800',
    },
    {
      product: 'Sugar',
      available: 1200,
      lastUpdate: '2025-11-18',
      nextExpiring: '2025-12-02',
      value: '$3,600',
    },
    {
      product: 'Oil',
      available: 0,
      lastUpdate: '2025-11-21',
      nextExpiring: '2025-12-15',
      value: '$0',
    },
    {
      product: 'Flour',
      available: 780,
      lastUpdate: '2025-11-19',
      nextExpiring: '2026-01-14',
      value: '$1,560',
    },
  ];

  // ----------------------
  // 5. RECENT ACTIVITY
  // ----------------------
  const recentActivity = [
    'Sale recorded: 45 units of Sugar (Nov 19)',
    'New purchase: 200 units of Rice (Nov 18)',
    'Stock update: Flour adjusted to 780 units (Nov 18)',
    'Price update: Oil – New unit price applied (Nov 17)',
  ];

  if (
    loadingTotalStocks ||
    loadingTotalValue ||
    loadingTotalOutOfStock ||
    loadingTotalExpired ||
    loadingMonthlySales ||
    loadingPurchasesSales ||
    loadingTopSales
  )
    return (
      <>
        <PageHeader />
        <div className="flex h-screen items-center justify-center">
          <Button disabled>
            <Spinner />
            Chargement...
          </Button>
        </div>
      </>
    );

  return (
    <>
      <PageHeader />
      <div className="space-y-8 p-6">
        {/* ---------------------- */}
        {/* 1. KPI CARDS */}
        {/* ---------------------- */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="flex flex-col rounded-xl border bg-white p-4 shadow">
            <span className="text-sm text-gray-500">Stock Disponible</span>
            <span className="mt-2 text-2xl font-bold">
              {stock?.totalStock ? new Intl.NumberFormat('fr-FR').format(stock?.totalStock) : 0}
            </span>
          </div>{' '}
          <div className="flex flex-col rounded-xl border bg-white p-4 shadow">
            <span className="text-sm text-gray-500">Valeur Totale</span>
            <span className="mt-2 text-2xl font-bold">
              {value?.totalStockValue
                ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(
                    value?.totalStockValue,
                  )
                : 0}
            </span>
          </div>
          <div className="flex flex-col rounded-xl border bg-white p-4 shadow">
            <span className="text-sm text-gray-500">Rupture de stock</span>
            <span className="mt-2 text-2xl font-bold">
              {outStock?.totalOutOfStock
                ? new Intl.NumberFormat('fr-FR').format(outStock?.totalOutOfStock)
                : 0}
            </span>
          </div>
          <div className="flex flex-col rounded-xl border bg-white p-4 shadow">
            <span className="text-sm text-gray-500">Expire bientôt</span>
            <span className="mt-2 text-2xl font-bold">
              {expired?.totalExpiring ? new Intl.NumberFormat('fr-FR').format(expired?.totalExpiring) : 0}
            </span>
          </div>
        </div>

        {/* ---------------------- */}
        {/* 2. CHARTS */}
        {/* ---------------------- */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Monthly Sales Line Chart */}
          <div className="rounded-xl border bg-white p-4 shadow">
            <h2 className="mb-4 text-lg font-semibold">Vente Mensuelle</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Ventes" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Purchases vs Sales */}
          <div className="rounded-xl border bg-white p-4 shadow">
            <h2 className="mb-4 text-lg font-semibold">Approvisionnement vs Ventes</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={purchasesSales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="approvisionnement" fill="#82ca9d" />
                <Bar dataKey="ventes" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TOP PRODUCTS SOLD */}
        <div className="rounded-xl border bg-white p-4 shadow">
          <h2 className="mb-4 text-lg font-semibold">Top des Ventes</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart layout="vertical" data={topSales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
              <Tooltip />
              <Bar dataKey="sold" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ---------------------- */}
        {/* 3. ALERTS */}
        {/* ---------------------- */}
        <div className="rounded-xl border bg-white p-4 shadow">
          <h2 className="mb-4 text-lg font-semibold">Operational Alerts</h2>
          <ul className="space-y-2">
            {alerts.map((a, i) => (
              <li key={i} className="text-sm text-red-600">
                • {a}
              </li>
            ))}
          </ul>
        </div>

        {/* ---------------------- */}
        {/* 4. STOCK TABLE */}
        {/* ---------------------- */}
        <div className="rounded-xl border bg-white p-4 shadow">
          <h2 className="mb-4 text-lg font-semibold">Stock Overview</h2>
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Product</th>
                <th className="p-2 text-left">Available</th>
                <th className="p-2 text-left">Last Update</th>
                <th className="p-2 text-left">Next Expiring Batch</th>
                <th className="p-2 text-left">Value</th>
              </tr>
            </thead>
            <tbody>
              {stockTable.map((row, i) => (
                <tr key={i} className="border-b">
                  <td className="p-2">{row.product}</td>
                  <td className="p-2">{row.available}</td>
                  <td className="p-2">{row.lastUpdate}</td>
                  <td className="p-2">{row.nextExpiring}</td>
                  <td className="p-2">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ---------------------- */}
        {/* 5. RECENT ACTIVITY */}
        {/* ---------------------- */}
        <div className="rounded-xl border bg-white p-4 shadow">
          <h2 className="mb-4 text-lg font-semibold">Recent Activity</h2>
          <ul className="space-y-1 text-sm">
            {recentActivity.map((item, i) => (
              <li key={i}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
