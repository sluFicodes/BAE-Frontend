import {components} from "./product-catalog";
type ProductOfferingPrice = components["schemas"]["ProductOfferingPrice"];
type CharacteristicValueSpecification = components["schemas"]["CharacteristicValueSpecification"];
type ProductSpecificationCharacteristic = components["schemas"]["ProductSpecificationCharacteristic"];

export interface Category {
  id?: string,
  href?: string,
  description?: string,
  isRoot?: boolean,
  parentId?: string,
  lastUpdate?: string,
  lifecycleStatus?: string,
  name: string,
  version?: string,
  validFor?: object,
  children?: Category[]
}

export interface LoginInfo {
  id: string,
  user: string,
  email: string,
  token: string,
  expire: number
}

export interface productSpecCharacteristicValueCart {
    characteristic: ProductSpecificationCharacteristic,
    value?: CharacteristicValueSpecification
  }

export interface cartProduct {
  id?: string,
  name?: string,
  image?: string,
  href?: string,
  options: {
    characteristics?: productSpecCharacteristicValueCart[],
    pricing?: ProductOfferingPrice
  }
  termsAccepted: boolean
}
