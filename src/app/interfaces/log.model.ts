export interface CoffeeLog {
  id: string;
  date: string;
  source: 'Home' | 'Coffee Shop' | 'Gifted';
  gramsUsed: number;
  cost: number;
  currency: string;
  brewMethod: string;
}
