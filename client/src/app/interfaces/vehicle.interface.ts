export interface Vehicle {
  vin: string;
  manufacturer: string;
  model: string;
  type: string;
  ecmrs: string[];
  odoMeterReading: number;
  plateNumber: string;
  registrationCountry?: string;
}
