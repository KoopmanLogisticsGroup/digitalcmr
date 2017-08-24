'use strict';

export class Address {
  private _$class: string;
  private _name: string;
  private _street: string;
  private _houseNumber: string;
  private _city: string;
  private _zipCode: string;
  private _country: string;
  private _latitude: string;
  private _longitude: string;
  private _id: string;

  public constructor(address: any) {
    this._$class      = address.$class;
    this._name        = address.name;
    this._street      = address.street;
    this._houseNumber = address.houseNumber;
    this._city        = address.city;
    this._zipCode     = address.zipCode;
    this._country     = address.country;
    this._latitude    = address.latitude;
    this._longitude   = address.longitude;
    this._id          = address.id;
  }

  public get $class(): string {
    return this._$class;
  }

  public set $class(value: string) {
    this._$class = value;
  }

  public get name(): string {
    return this._name;
  }

  public set name(value: string) {
    this._name = value;
  }

  public get street(): string {
    return this._street;
  }

  public set street(value: string) {
    this._street = value;
  }

  public get houseNumber(): string {
    return this._houseNumber;
  }

  public set houseNumber(value: string) {
    this._houseNumber = value;
  }

  public get city(): string {
    return this._city;
  }

  public set city(value: string) {
    this._city = value;
  }

  public get zipCode(): string {
    return this._zipCode;
  }

  public set zipCode(value: string) {
    this._zipCode = value;
  }

  public get country(): string {
    return this._country;
  }

  public set country(value: string) {
    this._country = value;
  }

  public get latitude(): string {
    return this._latitude;
  }

  public set latitude(value: string) {
    this._latitude = value;
  }

  public get longitude(): string {
    return this._longitude;
  }

  public set longitude(value: string) {
    this._longitude = value;
  }

  public get id(): string {
    return this._id;
  }

  public set id(value: string) {
    this._id = value;
  }

  public toJSON(): any {
    return {
      '$class':      this._$class,
      'name':        this._name,
      'street':      this._street,
      'houseNumber': this._houseNumber,
      'city':        this._city,
      'zipCode':     this._zipCode,
      'country':     this._country,
      'latitude':    this._latitude,
      'longitude':   this._longitude,
      'id':          this._id
    };
  }
}