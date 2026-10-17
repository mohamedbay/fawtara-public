import test from 'node:test';
import assert from 'node:assert/strict';

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

test('invoices persist, reload, update and delete without network access', async () => {
  const storage = new MemoryStorage();
  Object.defineProperty(globalThis, 'localStorage', { value: storage, configurable: true });
  Object.defineProperty(globalThis, 'window', { value: { localStorage: storage }, configurable: true });
  const originalFetch = globalThis.fetch;
  let networkRequests = 0;
  globalThis.fetch = async () => { networkRequests++; throw new Error('Unexpected network request'); };

  try {
    const { useInvoiceStore } = await import('../src/app/store/invoiceStore.ts');
    const data = { clientName: 'عميل تجريبي', notes: 'اختبار محلي', date: '2026-10-17', imageUrl: 'data:image/png;base64,example' };
    useInvoiceStore.getState().addInvoice(data);
    const invoice = useInvoiceStore.getState().invoices[0];
    assert.ok(invoice.id);
    assert.equal(useInvoiceStore.getState().searchInvoices('تجريبي').length, 1);
    assert.equal(useInvoiceStore.getState().searchInvoices('غير موجود').length, 0);

    const arabicData = { ...data, clientName: 'أَحْمَـد', notes: 'إِيصال  رقم   12' };
    useInvoiceStore.getState().addInvoice(arabicData);
    const arabicInvoice = useInvoiceStore.getState().invoices[0];
    assert.equal(useInvoiceStore.getState().searchInvoices('احمد')[0]?.id, arabicInvoice.id);
    assert.equal(useInvoiceStore.getState().searchInvoices('إحمد')[0]?.id, arabicInvoice.id);
    assert.equal(useInvoiceStore.getState().searchInvoices('ايصال رقم 12')[0]?.id, arabicInvoice.id);
    assert.equal(useInvoiceStore.getState().searchInvoices('أَحْمَـد')[0]?.id, arabicInvoice.id);
    assert.equal(useInvoiceStore.getState().searchInvoices('شركة أخرى').length, 0);
    assert.equal(useInvoiceStore.getState().getInvoiceById(arabicInvoice.id)?.clientName, 'أَحْمَـد');
    useInvoiceStore.getState().deleteInvoice(arabicInvoice.id);

    const saved = storage.getItem('fawtara-public-invoices');
    assert.ok(saved);
    assert.deepEqual(Object.keys(JSON.parse(saved).state), ['invoices']);
    useInvoiceStore.setState({ invoices: [] });
    storage.setItem('fawtara-public-invoices', saved);
    await useInvoiceStore.persist.rehydrate();
    assert.equal(useInvoiceStore.getState().invoices[0].id, invoice.id);

    useInvoiceStore.getState().updateInvoice(invoice.id, { notes: 'تم التعديل' });
    assert.equal(useInvoiceStore.getState().getInvoiceById(invoice.id)?.notes, 'تم التعديل');
    useInvoiceStore.getState().deleteInvoice(invoice.id);
    assert.equal(useInvoiceStore.getState().invoices.length, 0);
    assert.equal(JSON.parse(storage.getItem('fawtara-public-invoices')!).state.invoices.length, 0);
    assert.equal(networkRequests, 0);
  } finally {
    globalThis.fetch = originalFetch;
    Reflect.deleteProperty(globalThis, 'localStorage');
    Reflect.deleteProperty(globalThis, 'window');
  }
});
