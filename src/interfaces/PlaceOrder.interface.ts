export interface ICartItem {
  qtyOrdered: number;
  vid: string;
  sku: string;
  color: string;
  size: string;
  price: number;
  originalPrice: number;
  modelName: string;
  stock: number;
  images: string[];
  id: string;
  name: string;
  category: string;
  type: string;
  brand: string;
  currency: string;
  description: string;
  rating: number;
  productCategory: string;
  tags: string[];
  gender: string;
}

export interface IPlaceOrderRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  addressLine1: string;

  city: string;
  state: string;
  pincode: string;

  paymentMethod: string;

  cartItems: ICartItem[];
  discount: number;
  shipping: number;
  subtotal: number;
  total: number;
}

export interface IPlaceOrderResponseBody {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  addressLine1: string;

  city: string;
  state: string;
  pincode: string;
  paymentMethod: string;

  orderId: string;
  createdAt: string;
  status: string;
}
