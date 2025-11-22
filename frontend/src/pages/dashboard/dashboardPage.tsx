import { PageHeader } from '@/components/page-header';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Dashboard() {
  const data = [
    { month: 'Jan', sales: 400, purchases: 240 },
    { month: 'Feb', sales: 300, purchases: 139 },
    { month: 'Mar', sales: 200, purchases: 980 },
    { month: 'Apr', sales: 278, purchases: 390 },
  ];

  return (
    <>
      <PageHeader />
      <div className="h-96 w-full p-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke="#4F46E5" />
            <Line type="monotone" dataKey="purchases" stroke="#16A34A" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      </div>
    </>
  );
}

export { Dashboard };
