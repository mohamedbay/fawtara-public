import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Invoice, InvoiceFormData } from '../types/invoice';

interface InvoiceStore {
  invoices: Invoice[];
  addInvoice: (invoiceData: InvoiceFormData) => void;
  updateInvoice: (id: string, updates: Partial<InvoiceFormData>) => void;
  deleteInvoice: (id: string) => void;
  getInvoiceById: (id: string) => Invoice | undefined;
  searchInvoices: (query: string) => Invoice[];
}

export const useInvoiceStore = create<InvoiceStore>()(
  persist(
    (set, get) => ({
      invoices: [],
      addInvoice: (invoiceData) => {
        const invoice: Invoice = {
          ...invoiceData,
          id: crypto.randomUUID(),
          createdAt: Date.now(),
        };
        set((state) => ({ invoices: [invoice, ...state.invoices] }));
      },
      updateInvoice: (id, updates) => {
        set((state) => ({
          invoices: state.invoices.map((invoice) =>
            invoice.id === id ? { ...invoice, ...updates } : invoice,
          ),
        }));
      },
      deleteInvoice: (id) => {
        set((state) => ({ invoices: state.invoices.filter((invoice) => invoice.id !== id) }));
      },
      getInvoiceById: (id) => get().invoices.find((invoice) => invoice.id === id),
      searchInvoices: (query) => {
        const term = query.trim().toLocaleLowerCase();
        return get().invoices.filter((invoice) =>
          `${invoice.clientName} ${invoice.notes}`.toLocaleLowerCase().includes(term),
        );
      },
    }),
    {
      name: 'fawtara-public-invoices',
      version: 1,
      partialize: (state) => ({ invoices: state.invoices }),
    },
  ),
);
