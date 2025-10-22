import { create } from 'zustand';

type ModalMode = 'add' | 'edit';

interface ModalState<T> {
  isOpen: boolean;
  mode: ModalMode;
  editingItem?: T | null;
  openAdd: () => void;
  openEdit: (item: T) => void;
  close: () => void;
}

function modalStore<T>() {
  return create<ModalState<T>>((set) => ({
    isOpen: false,
    mode: 'add',
    editingItem: null,
    openAdd: () => set({ isOpen: true, mode: 'add', editingItem: null }),
    openEdit: (item) => set({ isOpen: true, mode: 'edit', editingItem: item }),
    close: () => set({ isOpen: false, editingItem: null }),
  }));
}

export { modalStore };
export type { ModalMode, ModalState };
