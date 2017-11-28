export enum Transaction {
  CreateEcmrs                          = 'CreateECMRs',
  CreateEcmr                           = 'CreateECMR',
  UpdateEcmr                           = 'UpdateECMR',
  UpdateEcmrDeliveryEta                = 'UpdateEcmrDeliveryEta',
  UpdateEcmrPickupEta                  = 'UpdateEcmrPickupEta',
  CreateTransportOrders                = 'CreateTransportOrders',
  CreateTransportOrder                 = 'CreateTransportOrder',
  UpdateTransportOrder                 = 'UpdateTransportOrder',
  UpdateTransportOrderPickupWindow     = 'UpdateTransportOrderPickupWindow',
  UpdateTransportOrderDeliveryWindow   = 'UpdateTransportOrderDeliveryWindow',
  UpdateTransportOrderStatusToCanceled = 'UpdateTransportOrderStatusToCanceled',
  CreateVehicles                       = 'CreateVehicles',
  CreateVehicle                        = 'CreateVehicle',
  CreateCarrierOrg                     = 'CreateCarrierOrg',
  CreateCompoundOrg                    = 'CreateCompoundOrg',
  CreateLegalOwnerOrg                  = 'CreateLegalOwnerOrg',
  CreateRecipientOrg                   = 'CreateRecipientOrg'
}