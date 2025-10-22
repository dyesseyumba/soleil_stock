import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchSuppliers, fetchSupplier, createSupplier, updateSupplier, deleteSupplier } from '@/api';
import type { Supplier } from '@/store';

// GET all suppliers
function useSuppliers() {
  return useQuery<Supplier[], Error>({
    queryKey: ['suppliers'],
    queryFn: fetchSuppliers,
  });
}

// GET single supplier
function useSupplier(id: string) {
  return useQuery<Supplier, Error>({
    queryKey: ['suppliers', id],
    queryFn: () => fetchSupplier(id),
    enabled: !!id,
  });
}

// CREATE supplier
function useCreateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
  });
}

// UPDATE supplier
function useUpdateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, supplier }: { id: string; supplier: Partial<Supplier> }) => updateSupplier(id, supplier),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
  });
}

// DELETE supplier
function useDeleteSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
  });
}

export { useSuppliers, useSupplier, useCreateSupplier, useUpdateSupplier, useDeleteSupplier };
