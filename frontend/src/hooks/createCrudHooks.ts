import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

type CRUDOptions<T, CreateInput = Partial<T>, UpdateInput = Partial<T>> = {
  key: string;
  fetchAll: () => Promise<T[]>;
  fetchOne: (id: string) => Promise<T>;
  create: (data: CreateInput) => Promise<T>;
  update: (id: string, data: UpdateInput) => Promise<T>;
  remove: (id: string) => Promise<void>;
};

function createCrudHooks<T, CreateInput = Partial<T>, UpdateInput = Partial<T>>(
  options: CRUDOptions<T, CreateInput, UpdateInput>
) {
  const { key, fetchAll, fetchOne, create, update, remove } = options;

  // Hook: fetch all
  function useList() {
    return useQuery<T[], Error>({
      queryKey: [key],
      queryFn: fetchAll,
    });
  }

  // Hook: fetch one
  function useItem(id: string) {
    return useQuery<T, Error>({
      queryKey: [key, id],
      queryFn: () => fetchOne(id),
      enabled: !!id,
    });
  }

  // Hook: create
  function useCreate() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: create,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: [key] }),
    });
  }

  // Hook: update
  function useUpdate() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: UpdateInput }) => update(id, data),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: [key] }),
    });
  }

  // Hook: delete
  function useDelete() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: remove,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: [key] }),
    });
  }

  return {
    useList,
    useItem,
    useCreate,
    useUpdate,
    useDelete,
  };
}


export{createCrudHooks}
