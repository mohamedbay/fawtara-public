export interface Invoice {
  id: string;
  imageUrl: string;
  clientName: string;
  notes: string;
  date: string;
  createdAt: number;
}

export interface InvoiceFormData {
  imageUrl: string;
  clientName: string;
  notes: string;
  date: string;
}
