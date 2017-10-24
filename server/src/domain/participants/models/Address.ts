export class Address {
  public $class: string;
  public name: string;
  public street: string;
  public houseNumber: string;
  public city: string;
  public zipCode: string;
  public country: string;
  public latitude: string;
  public longitude: string;
  public id: string;

  public constructor(address: any) {
    this.$class      = address.$class;
    this.name        = address.name;
    this.street      = address.street;
    this.houseNumber = address.houseNumber;
    this.city        = address.city;
    this.zipCode     = address.zipCode;
    this.country     = address.country;
    this.latitude    = address.latitude;
    this.longitude   = address.longitude;
    this.id          = address.id;
  }
}