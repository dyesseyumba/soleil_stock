'use client';

import { Button } from '@/components/ui/button';
import type { ReportRow } from '@/store';
import type { ColumnDef } from '@tanstack/react-table';

const reportColumn = (): ColumnDef<ReportRow>[] => [
  {
    id: 'product',
    header: 'Nom du Produit',
    cell: ({ row }) => {
      const p = row.original;

      return (
        <Button variant="link">
          {p?.id ? <a href={`products/${p?.id}`}>{p?.product}</a> : <span>{p?.product}</span>}
        </Button>
      );
    },
  },
  {
    accessorKey: 'sold',
    header: 'Unités vendues',
    cell: ({ getValue }) => {
      const sold = getValue<number>();
      return sold ? new Intl.NumberFormat('fr-FR').format(sold) : 0;
    },
  },
  {
    accessorKey: 'revenue',
    header: 'Recette Total',
    cell: ({ getValue }) => {
      const revenue = getValue<number>();
      return revenue
        ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(revenue)
        : 0;
    },
  },
  {
    accessorKey: 'cost',
    header: "Total Prix d'achat",
    cell: ({ getValue }) => {
      const cost = getValue<number>();
      return cost ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(cost) : 0;
    },
  },
  {
    accessorKey: 'profit',
    header: 'Bénéfice',
    cell: ({ getValue }) => {
      const profit = getValue<number>();
      return profit
        ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(profit)
        : 0;
    },
  },
];

export { reportColumn };
