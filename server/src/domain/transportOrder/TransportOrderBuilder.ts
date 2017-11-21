import {BuilderUtils} from '../../blockchain/BuilderUtils';
import {Factory} from 'composer-common';
import {TransportOrder} from '../../interfaces/transportOrder.interface';

export class TransportOrderBuilder {
  public static buildTransportOrder(factory: Factory, namespace: string, transportOrder: TransportOrder): TransportOrder {
    let validatedObject              = BuilderUtils.createResource(factory, namespace, 'TransportOrder', transportOrder);
    validatedObject.loading          = BuilderUtils.createConcept(factory, namespace, 'Loading', transportOrder.loading);
    validatedObject.loading.address  = BuilderUtils.createConcept(factory, namespace, 'Address', transportOrder.loading.address);
    validatedObject.delivery         = BuilderUtils.createConcept(factory, namespace, 'Loading', transportOrder.delivery);
    validatedObject.delivery.address = BuilderUtils.createConcept(factory, namespace, 'Address', transportOrder.loading.address);

    validatedObject.owner   = BuilderUtils.createRelationship(factory, namespace, 'LegalOwnerOrg', transportOrder.owner);
    validatedObject.source  = BuilderUtils.createRelationship(factory, namespace, 'CompoundOrg', transportOrder.source);
    validatedObject.carrier = BuilderUtils.createRelationship(factory, namespace, 'CarrierOrg', transportOrder.carrier);

    for (let i = 0; i < transportOrder.ecmrs.length; i++) {
      validatedObject.ecmrs[i] = BuilderUtils.createRelationship(factory, namespace, 'ECMR', transportOrder.ecmrs[i]);
    }

    for (let i = 0; i < transportOrder.goods.length; i++) {
      validatedObject.goods[i]                = BuilderUtils.createConcept(factory, namespace, 'Good', transportOrder.goods[i]);
      validatedObject.goods[i].pickupWindow   = BuilderUtils.createConcept(factory, namespace, 'DateWindow', transportOrder.goods[i].pickupWindow);
      validatedObject.goods[i].deliveryWindow = BuilderUtils.createConcept(factory, namespace, 'DateWindow', transportOrder.goods[i].deliveryWindow);
      validatedObject.goods[i].vehicle        = BuilderUtils.createResource(factory, namespace, 'Vehicle', transportOrder.goods[i].vehicle);
    }
    return <TransportOrder> validatedObject;
  }

  public static async buildTransportOrders(factory: Factory, namespace: string, transportOrders: TransportOrder[]): Promise<any> {
    let validatedObjects: any = [];

    for (const transportOrder of transportOrders) {
      validatedObjects.push(this.buildTransportOrder(factory, namespace, transportOrder));
    }

    return validatedObjects;
  }
}