import { createBrowserRouter } from 'react-router';
import { HomePage } from './pages/HomePage';
import { AddInvoicePage } from './pages/AddInvoicePage';
import { SearchPage } from './pages/SearchPage';
import { InvoiceDetailsPage } from './pages/InvoiceDetailsPage';
import { Layout } from './components/Layout';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: 'add', Component: AddInvoicePage },
      { path: 'search', Component: SearchPage },
      { path: 'invoice/:id', Component: InvoiceDetailsPage },
    ],
  },
]);
