import {BuilderUtils} from '../../blockchain/BuilderUtils';
import {Factory} from 'composer-common';
import {TransportOrder} from '../../interfaces/transportOrder.interface';
import {EcmrBuilder} from '../ecmrs/EcmrBuilder';

export class TransportOrderBuilder {
  public static buildTransportOrder(factory: Factory, namespace: string, transportOrder: TransportOrder): TransportOrder {
    const validatedObject = BuilderUtils.createResource(factory, namespace, 'TransportOrder', transportOrder);

    validatedObject.owner   = BuilderUtils.createRelationship(factory, namespace, 'LegalOwnerOrg', transportOrder.owner);
    validatedObject.carrier = BuilderUtils.createRelationship(factory, namespace, 'CarrierOrg', transportOrder.carrier);

    for (let i = 0; i < transportOrder.ecmrs.length; i++) {
      validatedObject.ecmrs[i] = BuilderUtils.createRelationship(factory, namespace, 'ECMR', transportOrder.ecmrs[i]);
    }

    for (let i = 0; i < transportOrder.goods.length; i++) {
      validatedObject.goods[i] = EcmrBuilder.buildGood(factory, namespace, transportOrder.goods[i]);
    }

    return <TransportOrder> validatedObject;
  }

  public static async buildTransportOrders(factory: Factory, namespace: string, transportOrders: TransportOrder[]): Promise<any> {
    const validatedObjects: any = [];

    for (const transportOrder of transportOrders) {
      validatedObjects.push(this.buildTransportOrder(factory, namespace, transportOrder));
    }

    return validatedObjects;
  }
}
