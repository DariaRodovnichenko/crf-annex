export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: 'Beans' | 'Equipment' | 'Accessories' | 'Other';
  date: string;
  originalCurrency: string;
  convertedAmount: number;
  convertedCurrency: string;
}
