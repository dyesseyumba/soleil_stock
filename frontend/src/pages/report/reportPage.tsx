import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function ReportPage() {
  const [product, setProduct] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Temporary dummy data — backend will replace this
  const reportData = [
    { product: 'Sugar', sold: 45, revenue: 900 },
    { product: 'Rice', sold: 60, revenue: 1200 },
  ];

  const handleGeneratePdf = () => {
    // TODO: Implement later
    console.log('Generate PDF clicked');
  };

  return (
    <div className="space-y-6 p-6">
      <Card className="rounded-xl border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Reports</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <Label>Product</Label>
              <Select onValueChange={setProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sugar">Sugar</SelectItem>
                  <SelectItem value="Rice">Rice</SelectItem>
                  <SelectItem value="Flour">Flour</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>From</Label>
              <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </div>

            <div className="space-y-1">
              <Label>To</Label>
              <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </div>
          </div>

          {/* Table */}
          <div className="mt-4 overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Product</th>
                  <th className="p-3 text-left">Units Sold</th>
                  <th className="p-3 text-left">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((row, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-3">{row.product}</td>
                    <td className="p-3">{row.sold}</td>
                    <td className="p-3">{row.revenue} USD</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PDF button */}
          <Button className="mt-4" onClick={handleGeneratePdf}>
            Generate PDF
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export { ReportPage };
