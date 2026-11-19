export type CategoryId = 'all' | 'arrendamento' | 'pensao' | 'residencial' | 'praia' | 'boutique';

export interface Category {
  id: CategoryId;
  label: string;
  icon: string;
}

export interface Province {
  id: string;
  name: string;
  bairros: string[];
}

export interface AccommodationSpecs {
  guests: number;
  beds: number;
  baths: number;
  size: string;
  typology?: string;
}

export interface Accommodation {
  id: string;
  title: string;
  category: CategoryId;
  categoryLabel: string;
  isHouseRental: boolean;
  rentalType: 'monthly' | 'daily';
  typology: string;
  furnishing?: string;
  monthlyPrice?: number;
  price: number;
  priceUnit: string;
  depositRequired?: number;
  contractMinMonths?: number;
  province: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  rating: number;
  reviewsCount: number;
  verifiedHost: boolean;
  hostName: string;
  specs: AccommodationSpecs;
  hasGenerator: boolean;
  hasHotWater: boolean;
  amenities: string[];
  image: string;
  gallery: string[];
  description: string;
}

export interface Booking {
  id: string;
  accommodationId: string;
  accommodationTitle: string;
  accommodationImage: string;
  city: string;
  province: string;
  startDate: string;
  endDate: string;
  type: 'diaria' | 'arrendamento' | 'visita';
  totalPriceMZN: number;
  depositMZN?: number;
  status: 'confirmado' | 'pendente' | 'concluido' | 'cancelado';
  paymentMethod: 'mpesa' | 'emola';
  clientCode: string;
  createdAt: string;
}

export interface GuestUser {
  username: string;
  name: string;
  cell: string;
  clientCode: string;
  role: 'guest';
  status: string;
  avatar: string;
}
