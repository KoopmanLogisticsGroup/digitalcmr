export enum Transaction {
  CreateEcmrs                           = 'CreateECMRs',
  CreateEcmr                            = 'CreateECMR',
  UpdateEcmr                            = 'UpdateECMR',
  CreateTransportOrders                 = 'CreateTransportOrders',
  CreateTransportOrder                  = 'CreateTransportOrder',
  UpdateTransportOrder                  = 'UpdateTransportOrder',
  UpdateTransportOrderStatusToCompleted = 'UpdateTransportOrderStatusToCompleted',
  CreateVehicles                        = 'CreateVehicles',
  CreateVehicle                         = 'CreateVehicle',
  CreateCarrierOrg                      = 'CreateCarrierOrg',
  CreateCompoundOrg                     = 'CreateCompoundOrg',
  CreateLegalOwnerOrg                   = 'CreateLegalOwnerOrg',
  CreateRecipientOrg                    = 'CreateRecipientOrg'
}