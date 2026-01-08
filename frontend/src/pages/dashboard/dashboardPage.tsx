import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
  useActivities,
  useAlerts,
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
  const { data: alerts, isLoading: loadingAlerts } = useAlerts();
  const { data: recentActivity, isLoading: loadingActivities } = useActivities();

  // ----------------------
  // 4. RECENT ACTIVITY
  // ----------------------
  // const recentActivity = [
  //   'Sale recorded: 45 units of Sugar (Nov 19)',
  //   'New purchase: 200 units of Rice (Nov 18)',
  //   'Stock update: Flour adjusted to 780 units (Nov 18)',
  //   'Price update: Oil – New unit price applied (Nov 17)',
  // ];
  if (
    loadingTotalStocks ||
    loadingTotalValue ||
    loadingTotalOutOfStock ||
    loadingTotalExpired ||
    loadingMonthlySales ||
    loadingPurchasesSales ||
    loadingTopSales ||
    loadingAlerts ||
    loadingActivities
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
                <Line type="monotone" dataKey="sales" stroke="#8884d8" />
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
                <Bar dataKey="purchases" fill="#82ca9d" />
                <Bar dataKey="sales" fill="#8884d8" />
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
            {alerts?.map((a, i) => (
              <li key={i} className="text-sm text-red-600">
                • {a}
              </li>
            ))}
          </ul>
        </div>

        {/* ---------------------- */}
        {/* 4. RECENT ACTIVITY */}
        {/* ---------------------- */}
        <div className="rounded-xl border bg-white p-4 shadow">
          <h2 className="mb-4 text-lg font-semibold">Recent Activity</h2>
          <ul className="space-y-1 text-sm">
            {recentActivity?.map((item, i) => (
              <li key={i}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
