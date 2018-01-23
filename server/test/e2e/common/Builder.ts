import {Address} from '../../../src/interfaces/address.interface';
import {Ecmr, EcmrStatus} from '../../../src/interfaces/ecmr.interface';
import {Signature} from '../../../src/interfaces/signature.interface';
import {Remark} from '../../../src/interfaces/remark.interface';
import {TransportOrder} from '../../../src/interfaces/transportOrder.interface';

export class Builder {
  public static buildAddress = (): Address => {
    return <Address> {
      name:        'name',
      street:      'street',
      houseNumber: 'housenumber',
      city:        'city',
      zipCode:     'zipcode',
      country:     'country',
      longitude:   0,
      latitude:    0
    };
  }

  public static buildECMR = (ecmrID: string): Ecmr => {
    return <Ecmr>{
      ecmrID:                 ecmrID,
      status:                 EcmrStatus.Created,
      issueDate:              1502402400000,
      agreementTerms:         'agreement terms here',
      agreementTermsSec:      'agreement terms sec',
      legalOwnerRef:          'ASD213123S',
      carrierRef:             'H2238723VASD',
      recipientRef:           'SDADHGA21312312',
      orderID:                'AAAA123456',
      creation:               {
        address: Builder.buildAddress(),
        date:    1502402400000
      },
      loading:                {
        address:    Builder.buildAddress(),
        actualDate: 1502402400000
      },
      delivery:               {
        address:    Builder.buildAddress(),
        actualDate: 1502488800000
      },
      owner:                  'leaseplan',
      source:                 'amsterdamcompound',
      transporter:            'harry@koopman.org',
      carrier:                'koopman',
      recipient:              'cardealer',
      recipientMember:        'rob@cardealer.org',
      issuedBy:               'koopman',
      carrierComments:        'No comments',
      documents:              [],
      goods:                  [],
      legalOwnerInstructions: 'string',
      paymentInstructions:    'string',
      payOnDelivery:          'string'
    };
  }

  public static buildSignature = (userID: string): Signature => {
    return <Signature> {
      timestamp:     new Date().getTime(),
      ip:            '127.0.0.1',
      latitude:      Math.random() < 0.5 ? ((1 - Math.random()) * (90 - (-90)) + -90) : (Math.random() * (90 - (-90)) + (-90)),
      longitude:     Math.random() < 0.5 ? ((1 - Math.random()) * (180 - (-180)) + -180) : (Math.random() * (180 - (-180)) + (-180)),
      generalRemark: <Remark> {
        comments: 'remark'
      },
      certificate:   userID
    };
  }

  public static buildTransportOrder = (): TransportOrder => {
    return <TransportOrder> {
      orderID:   String(new Date().getTime()),
      carrier:   'koopman',
      goods:     [],
      status:    'OPEN',
      issueDate: 1502834400000,
      ecmrs:     [],
      orderRef:  'ref',
      owner:     'leaseplan'
    };
  }
}