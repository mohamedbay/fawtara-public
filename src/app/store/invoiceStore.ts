import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Invoice, InvoiceFormData } from '../types/invoice';

// Normalize only the search comparison; keep invoice text exactly as entered.
function normalizeSearchText(text: string): string {
  return text
    .normalize('NFKC')
    .replace(/[\u0640\u064B-\u065F\u0670]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

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
        const term = normalizeSearchText(query);
        return get().invoices.filter((invoice) =>
          normalizeSearchText(`${invoice.clientName} ${invoice.notes}`).includes(term),
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
