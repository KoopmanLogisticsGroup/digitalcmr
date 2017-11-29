export enum Transaction {
  CreateEcmrs                          = 'CreateECMRs',
  CreateEcmr                           = 'CreateECMR',
  UpdateEcmr                           = 'UpdateECMR',
  UpdateExpectedDeliveryWindow         = 'UpdateExpectedDeliveryWindow',
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