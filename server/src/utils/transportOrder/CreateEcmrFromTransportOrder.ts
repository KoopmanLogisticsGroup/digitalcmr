import {TransportOrder} from '../../../resources/interfaces/transportOrder.interface';

export class CreateEcmrFromTransportOrder {
  public ecmrFromTransportOrder(transportOrder: TransportOrder): any {
    return {
      'ecmrID':            String(new Date().getTime()),
      'status':            'CREATED',
      'agreementTerms':    'agreement terms here',
      'agreementTermsSec': 'agreement terms sec',
      'legalOwnerRef':     'ref',
      'carrierRef':        'H2238723VASD',
      'recipientRef':      'SDADHGA21312312',
      'orderID':           transportOrder.orderID,
      'creation':          {
        '$class':  'org.digitalcmr.Creation',
        'address': {
          '$class':      'org.digitalcmr.Address',
          'name':        'Amsterdam Compound',
          'street':      'compenstraat',
          'houseNumber': '21',
          'city':        'Groningen',
          'zipCode':     '9712AA',
          'country':     'Netherlands',
          'latitude':    52.377698,
          'longitude':   43.896555
        },
        'date':    1502229600000
      },
      'loading':                transportOrder.loading,
      'delivery':               transportOrder.delivery,
      'owner':                  transportOrder.owner,
      'source':                 transportOrder.source,
      'transporter':            'harry@koopman.org',
      'carrier':                transportOrder.carrier,
      'recipientOrg':           'cardealer',
      'recipient':              'rob@cardealer.org',
      'issueDate':              transportOrder.issueDate,
      'issuedBy':               'koopman',
      'carrierComments':        'No comments',
      'documents':              [
        'doc1'
      ],
      'goods':                  transportOrder.goods,
      'legalOwnerInstructions': 'string',
      'paymentInstructions':    'string',
      'payOnDelivery':          'string',
    };
  }
}