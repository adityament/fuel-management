// Types and interfaces for the Petrol Pump Management System

export type UserRole = "super-admin" | "admin" | "staff"

export interface User {
  id: string
  username: string
  email: string
  phone?: string
  role: UserRole
   location?: {
    latitude?: number;
    longitude?: number;
    radius?: number;
  };
}

export interface Admin {
  id: string
  username: string
  email: string
  phone: string
  role: "admin"
  password?: string
  latitude: number
  longitude: number
  radius: number
}

export interface Staff {
  id: string
  username: string
  email: string
  phone: string
  password?: string
}

export interface Sale {
  id: string
  nozzleId: string
  fuelType: "Petrol" | "Diesel" | "Premium"
  openingReading: number
  closingReading: number
  rate: number
  paymentMode: "cash" | "card" | "upi"
  customerId: string
  quantity: number
  amount: number
  shift: "morning" | "evening" | "night"
  date: string
  staffId: string
}

export interface Attendance {
  id: string
  staffId: string
  username: string
  checkInTime: string
  logoutTime?: string
  latitude: number
  longitude: number
  notes?: string
  date: string
}

export interface Stock {
  id: string
  fuelType: "Petrol" | "Diesel" | "Premium"
  tankId: string
  calculatedStock: number
  dipReading: number
  receivedQuantity: number
  totalStock: number
  closingStock: number
}
export interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logo: string;
}

export const DEFAULT_COMPANY: CompanyInfo = {
  name: "FuelPro Management System",
  address: "123 Fuel Station Road, Petroleum City, PC 12345",
  phone: "+91 98765 43210",
  email: "support@fuelpro.com",
  website: "www.fuelpro.com",
  logo: "⛽",
};