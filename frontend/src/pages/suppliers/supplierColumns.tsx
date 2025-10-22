'use client';

import { Button } from '@/components/ui/button';
import type { Supplier } from '@/store';
import type { ColumnDef } from '@tanstack/react-table';
import { Pencil } from 'lucide-react';

const supplierColumns = (onEdit: (supplier: Supplier) => void): ColumnDef<Supplier>[] => [
  {
    accessorKey: 'name',
    header: 'Nom',
  },
  {
    accessorKey: 'contactInfo',
    header: 'Contact',
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const supplier = row.original;

      return (
        <Button variant="link" size="sm" className="cursor-pointer" onClick={() => onEdit(supplier)}>
          <Pencil className="h-4 w-4" />
        </Button>
      );
    },
  },
];

export type { Supplier };
export { supplierColumns };
