import { Category } from './Category';
import { Product } from './Product';
import { User } from './User';

export interface ProductInfo {
  product: Product,
  category: Category,
  user: User | null,
}
