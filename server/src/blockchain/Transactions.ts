export enum Transaction {
  CreateEcmrs                           = 'CreateECMRs',
  CreateEcmr                            = 'CreateECMR',
  UpdateEcmr                            = 'UpdateECMR',
  CreateTransportOrders                 = 'CreateTransportOrders',
  CreateTransportOrder                  = 'CreateTransportOrder',
  UpdateTransportOrderStatusToCancelled = 'UpdateTransportOrderStatusToCancelled',
  CreateVehicles                        = 'CreateVehicles',
  CreateVehicle                         = 'CreateVehicle',
  CreateCarrierOrg                      = 'CreateCarrierOrg',
  CreateCompoundOrg                     = 'CreateCompoundOrg',
  CreateLegalOwnerOrg                   = 'CreateLegalOwnerOrg',
  CreateRecipientOrg                    = 'CreateRecipientOrg'
}