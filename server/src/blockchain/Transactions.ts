export enum Transaction {
  CreateEcmrs                        = 'CreateECMRs',
  CreateEcmr                         = 'CreateECMR',
  UpdateEcmr                         = 'UpdateECMR',
  CreateTransportOrders              = 'CreateTransportOrders',
  CreateTransportOrder               = 'CreateTransportOrder',
  UpdateTransportOrder               = 'UpdateTransportOrder',
  UpdateTransportOrderPickupWindow   = 'UpdateTransportOrderPickupWindow',
  UpdateTransportOrderDeliveryWindow = 'UpdateTransportOrderDeliveryWindow',
  CreateVehicles                     = 'CreateVehicles',
  CreateVehicle                      = 'CreateVehicle',
  CreateCarrierOrg                   = 'CreateCarrierOrg',
  CreateCompoundOrg                  = 'CreateCompoundOrg',
  CreateLegalOwnerOrg                = 'CreateLegalOwnerOrg',
  CreateRecipientOrg                 = 'CreateRecipientOrg'
}