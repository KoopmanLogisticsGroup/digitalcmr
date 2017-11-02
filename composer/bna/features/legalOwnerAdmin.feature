##
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

#Feature: LegalOwnerAdmin feature test
#
#  Background:
#    Given I have deployed the business network definition ..
#    And I have added the following participants of type org.digitalcmr.LegalOwnerAdmin
#      """
#      {"$class":"org.digitalcmr.LegalOwnerAdmin","userID":"lapo@leaseplan.org","userName": "lapo", "firstName":"lapo","lastName":"kelkann","address":{"$class":"org.digitalcmr.Address","name":"lapo kelkann","street":"leesenstraat","houseNumber":"20","city":"Utrecht","zipCode":"9867RF","country":"Netherlands", "latitude":"31231231.1231", "longitude":"31231231.1231", "id":"id"},"org":"leaseplan"}
#      """
#    And I have issued the participant org.digitalcmr.LegalOwnerAdmin#lapo@leaseplan.org with the identity Lapo
#    And I have added the following assets of type org.digitalcmr.TransportOrder
#      """
#      [
#      {"$class":"org.digitalcmr.TransportOrder", "orderID":"OA123456789", "status": "OPEN", "loading": {"$class": "org.digitalcmr.Loading", "address": {"$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "compenstraat", "houseNumber": "21", "city": "Amsterdam", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555}, "actualDate": 1502402400000}, "delivery": {"$class": "org.digitalcmr.Delivery", "address": {"$class": "org.digitalcmr.Address", "name": "Rob Carman", "street": "autostraat", "houseNumber": "12", "city": "Rotterdam", "zipCode": "9442KO", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623}, "actualDate": 1502488800000}, "owner": "leaseplan", "source": "amsterdamcompound", "carrier": "koopman", "issueDate":0, "orderRef": "ABC213321BCA", "goods":[{"$class":"org.digitalcmr.Good", "vehicle": {"$class": "org.digitalcmr.Vehicle", "vin": "736182CHD28172", "manufacturer": "Mercedes", "model": "SLK", "type": "Station", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "I827YE", "loadingStartDate": 2132141, "loadingEndDate": 2213313, "deliveryStartDate": 123123, "deliveryEndDate": 121312}, "description": "vehicle", "weight": 1800, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000}], "ecmrs": []},
#      {"$class":"org.digitalcmr.TransportOrder", "orderID":"OB123456789", "status": "OPEN", "loading": {"$class": "org.digitalcmr.Loading", "address": {"$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "compenstraat", "houseNumber": "21", "city": "Amsterdam", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555}, "actualDate": 1502402400000}, "delivery": {"$class": "org.digitalcmr.Delivery", "address": {"$class": "org.digitalcmr.Address", "name": "Rob Carman", "street": "autostraat", "houseNumber": "12", "city": "Rotterdam", "zipCode": "9442KO", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623}, "actualDate": 1502488800000}, "owner": "notleaseplan", "source": "notamsterdamcompound", "carrier": "notkoopman", "issueDate":0, "orderRef": "ABC213321BCA", "goods":[{"$class":"org.digitalcmr.Good", "vehicle": {"$class": "org.digitalcmr.Vehicle", "vin": "736182CHD28172", "manufacturer": "Mercedes", "model": "SLK", "type": "Station", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "I827YE", "loadingStartDate": 2132141, "loadingEndDate": 2213313, "deliveryStartDate": 123123, "deliveryEndDate": 121312}, "description": "vehicle", "weight": 1800, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000}], "ecmrs": []}
#      ]
#      """
#    And I have added the following assets of type org.digitalcmr.ECMR
#      """
#      [
#      {"$class": "org.digitalcmr.ECMR", "ecmrID": "A1234567890", "status": "CREATED", "agreementTerms": "agreement terms here", "agreementTermsSec": "agreement terms sec", "legalOwnerRef": "ASD213123S", "carrierRef": "H2238723VASD", "recipientRef": "SDADHGA21312312", "orderID": "AAAA123456", "creation": { "$class": "org.digitalcmr.Creation", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555 }, "date": 1502402400000 }, "loading": { "$class": "org.digitalcmr.Loading", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 43.1927, "longitude": 23.3249 }, "actualDate": 1502488800000 }, "delivery": { "$class": "org.digitalcmr.Delivery", "address": { "$class": "org.digitalcmr.Address", "name": "Rob el Caro", "street": "De straat", "houseNumber": "302", "city": "Almere", "zipCode": "6736AE", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623 }, "actualDate": 1502834400000 }, "owner": "leaseplan", "source": "amsterdamcompound", "transporter": "harry@koopman.org", "carrier": "koopman", "recipientOrg": "cardealer", "recipient": "rob@cardealer.org", "issueDate": 0, "issuedBy": "koopman", "carrierComments": "", "documents": [ "doc1" ], "goods": [ { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "2131231414CN", "manufacturer": "BMW", "model": "X5", "type": "sportsback", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "O291RX" }, "description": "vehicle", "weight": 1900, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000 } ], "legalOwnerInstructions": "string", "paymentInstructions": "string", "payOnDelivery": "string" },
#      {"$class": "org.digitalcmr.ECMR", "ecmrID": "B1234567890", "status": "CREATED", "agreementTerms": "agreement terms here", "agreementTermsSec": "agreement terms sec", "legalOwnerRef": "ASD213123S", "carrierRef": "H2238723VASD", "recipientRef": "SDADHGA21312312", "orderID": "BB123456", "creation": { "$class": "org.digitalcmr.Creation", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555 }, "date": 1502402400000 }, "loading": { "$class": "org.digitalcmr.Loading", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 43.1927, "longitude": 23.3249 }, "actualDate": 1502488800000 }, "delivery": { "$class": "org.digitalcmr.Delivery", "address": { "$class": "org.digitalcmr.Address", "name": "Rob el Caro", "street": "De straat", "houseNumber": "302", "city": "Almere", "zipCode": "6736AE", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623 }, "actualDate": 1502834400000 }, "owner": "notleaseplan", "source": "notamsterdamcompound", "transporter": "harry@koopman.org", "carrier": "notkoopman", "recipientOrg": "notcardealer", "recipient": "rob@cardealer.org", "issueDate": 0, "issuedBy": "koopman", "carrierComments": "", "documents": [ "doc1" ], "goods": [ { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "2131231414CN", "manufacturer": "BMW", "model": "X5", "type": "sportsback", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "O291RX" }, "description": "vehicle", "weight": 1900, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000 } ], "legalOwnerInstructions": "string", "paymentInstructions": "string", "payOnDelivery": "string" }
#      ]
#      """
#
#  Scenario: Lapo can read all of his ECMRs where he is the owner
#    When I use the identity Lapo
#    Then I should have the following asset of type org.digitalcmr.ECMR
#      """
#      {"$class": "org.digitalcmr.ECMR", "ecmrID": "A1234567890", "status": "CREATED", "agreementTerms": "agreement terms here", "agreementTermsSec": "agreement terms sec", "legalOwnerRef": "ASD213123S", "carrierRef": "H2238723VASD", "recipientRef": "SDADHGA21312312", "orderID": "AAAA123456", "creation": { "$class": "org.digitalcmr.Creation", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555 }, "date": 1502402400000 }, "loading": { "$class": "org.digitalcmr.Loading", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 43.1927, "longitude": 23.3249 }, "actualDate": 1502488800000 }, "delivery": { "$class": "org.digitalcmr.Delivery", "address": { "$class": "org.digitalcmr.Address", "name": "Rob el Caro", "street": "De straat", "houseNumber": "302", "city": "Almere", "zipCode": "6736AE", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623 }, "actualDate": 1502834400000 }, "owner": "leaseplan", "source": "amsterdamcompound", "transporter": "harry@koopman.org", "carrier": "koopman", "recipientOrg": "cardealer", "recipient": "rob@cardealer.org", "issueDate": 0, "issuedBy": "koopman", "carrierComments": "", "documents": [ "doc1" ], "goods": [ { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "2131231414CN", "manufacturer": "BMW", "model": "X5", "type": "sportsback", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "O291RX" }, "description": "vehicle", "weight": 1900, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000 } ], "legalOwnerInstructions": "string", "paymentInstructions": "string", "payOnDelivery": "string" }
#      """
#
#  Scenario: Lapo cannot read ECMRs where he is not the owner
#    When I use the identity Lapo
#    Then I should not have the following asset of type org.digitalcmr.ECMR
#      """
#      {"$class": "org.digitalcmr.ECMR", "ecmrID": "B1234567890", "status": "CREATED", "agreementTerms": "agreement terms here", "agreementTermsSec": "agreement terms sec", "legalOwnerRef": "ASD213123S", "carrierRef": "H2238723VASD", "recipientRef": "SDADHGA21312312", "orderID": "BB123456", "creation": { "$class": "org.digitalcmr.Creation", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555 }, "date": 1502402400000 }, "loading": { "$class": "org.digitalcmr.Loading", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 43.1927, "longitude": 23.3249 }, "actualDate": 1502488800000 }, "delivery": { "$class": "org.digitalcmr.Delivery", "address": { "$class": "org.digitalcmr.Address", "name": "Rob el Caro", "street": "De straat", "houseNumber": "302", "city": "Almere", "zipCode": "6736AE", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623 }, "actualDate": 1502834400000 }, "owner": "notleaseplan", "source": "notamsterdamcompound", "transporter": "harry@koopman.org", "carrier": "notkoopman", "recipientOrg": "notcardealer", "recipient": "rob@cardealer.org", "issueDate": 0, "issuedBy": "koopman", "carrierComments": "", "documents": [ "doc1" ], "goods": [ { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "2131231414CN", "manufacturer": "BMW", "model": "X5", "type": "sportsback", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "O291RX" }, "description": "vehicle", "weight": 1900, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000 } ], "legalOwnerInstructions": "string", "paymentInstructions": "string", "payOnDelivery": "string" }
#      """
#
#  Scenario: Lapo can create an ECMR using the CreateECMR transaction
#    When I use the identity Lapo
#    And I submit the following transaction of type org.digitalcmr.CreateECMR
#      """
#      {"$class": "org.digitalcmr.CreateECMR", "ecmr": {"ecmrID": "C1234567890", "status": "CREATED", "agreementTerms": "agreement terms here", "agreementTermsSec": "agreement terms sec", "legalOwnerRef": "ASD213123S", "carrierRef": "H2238723VASD", "recipientRef": "SDADHGA21312312", "orderID": "AAAA123456", "creation": { "$class": "org.digitalcmr.Creation", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555 }, "date": 1502402400000 }, "loading": { "$class": "org.digitalcmr.Loading", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 43.1927, "longitude": 23.3249 }, "actualDate": 1502488800000 }, "delivery": { "$class": "org.digitalcmr.Delivery", "address": { "$class": "org.digitalcmr.Address", "name": "Rob el Caro", "street": "De straat", "houseNumber": "302", "city": "Almere", "zipCode": "6736AE", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623 }, "actualDate": 1502834400000 }, "owner": "leaseplan", "source": "amsterdamcompound", "transporter": "harry@koopman.org", "carrier": "koopman", "recipientOrg": "cardealer", "recipient": "rob@cardealer.org", "issueDate": 0, "issuedBy": "koopman", "carrierComments": "", "documents": [ "doc1" ], "goods": [ { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "2131231414CN", "manufacturer": "BMW", "model": "X5", "type": "sportsback", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "O291RX" }, "description": "vehicle", "weight": 1900, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000 } ], "legalOwnerInstructions": "string", "paymentInstructions": "string", "payOnDelivery": "string" }}
#      """
#    Then I should have the following asset of type org.digitalcmr.ECMR
#      """
#      {"$class": "org.digitalcmr.ECMR", "ecmrID": "C1234567890", "status": "CREATED", "agreementTerms": "agreement terms here", "agreementTermsSec": "agreement terms sec", "legalOwnerRef": "ASD213123S", "carrierRef": "H2238723VASD", "recipientRef": "SDADHGA21312312", "orderID": "AAAA123456", "creation": { "$class": "org.digitalcmr.Creation", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555 }, "date": 1502402400000 }, "loading": { "$class": "org.digitalcmr.Loading", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 43.1927, "longitude": 23.3249 }, "actualDate": 1502488800000 }, "delivery": { "$class": "org.digitalcmr.Delivery", "address": { "$class": "org.digitalcmr.Address", "name": "Rob el Caro", "street": "De straat", "houseNumber": "302", "city": "Almere", "zipCode": "6736AE", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623 }, "actualDate": 1502834400000 }, "owner": "leaseplan", "source": "amsterdamcompound", "transporter": "harry@koopman.org", "carrier": "koopman", "recipientOrg": "cardealer", "recipient": "rob@cardealer.org", "issueDate": 0, "issuedBy": "koopman", "carrierComments": "", "documents": [ "doc1" ], "goods": [ { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "2131231414CN", "manufacturer": "BMW", "model": "X5", "type": "sportsback", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "O291RX" }, "description": "vehicle", "weight": 1900, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000 } ], "legalOwnerInstructions": "string", "paymentInstructions": "string", "payOnDelivery": "string" }
#      """
#
#  Scenario: Lapo cannot create an ECMR in which he is not the owner
#    When I use the identity Lapo
#    And I add the following asset of type org.digitalcmr.ECMR
#      """
#       {"$class": "org.digitalcmr.ECMR", "ecmrID": "B1234567890", "status": "CREATED", "agreementTerms": "agreement terms here", "agreementTermsSec": "agreement terms sec", "legalOwnerRef": "ASD213123S", "carrierRef": "H2238723VASD", "recipientRef": "SDADHGA21312312", "orderID": "BB123456", "creation": { "$class": "org.digitalcmr.Creation", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555 }, "date": 1502402400000 }, "loading": { "$class": "org.digitalcmr.Loading", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 43.1927, "longitude": 23.3249 }, "actualDate": 1502488800000 }, "delivery": { "$class": "org.digitalcmr.Delivery", "address": { "$class": "org.digitalcmr.Address", "name": "Rob el Caro", "street": "De straat", "houseNumber": "302", "city": "Almere", "zipCode": "6736AE", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623 }, "actualDate": 1502834400000 }, "owner": "notleaseplan", "source": "notamsterdamcompound", "transporter": "harry@koopman.org", "carrier": "notkoopman", "recipientOrg": "notcardealer", "recipient": "rob@cardealer.org", "issueDate": 0, "issuedBy": "koopman", "carrierComments": "", "documents": [ "doc1" ], "goods": [ { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "2131231414CN", "manufacturer": "BMW", "model": "X5", "type": "sportsback", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "O291RX" }, "description": "vehicle", "weight": 1900, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000 } ], "legalOwnerInstructions": "string", "paymentInstructions": "string", "payOnDelivery": "string" }
#      """
#    Then I should get an error matching /does not have .* access to resource/
#
#  Scenario: Lapo should not be able to update an ECMR
#    When I use the identity Lapo
#    Given I should have the following asset of type org.digitalcmr.ECMR
#      """
#        {"$class": "org.digitalcmr.ECMR", "ecmrID": "A1234567890", "status": "CREATED", "agreementTerms": "agreement terms here", "agreementTermsSec": "agreement terms sec", "legalOwnerRef": "ASD213123S", "carrierRef": "H2238723VASD", "recipientRef": "SDADHGA21312312", "orderID": "AAAA123456", "creation": { "$class": "org.digitalcmr.Creation", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555 }, "date": 1502402400000 }, "loading": { "$class": "org.digitalcmr.Loading", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 43.1927, "longitude": 23.3249 }, "actualDate": 1502488800000 }, "delivery": { "$class": "org.digitalcmr.Delivery", "address": { "$class": "org.digitalcmr.Address", "name": "Rob el Caro", "street": "De straat", "houseNumber": "302", "city": "Almere", "zipCode": "6736AE", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623 }, "actualDate": 1502834400000 }, "owner": "leaseplan", "source": "amsterdamcompound", "transporter": "harry@koopman.org", "carrier": "koopman", "recipientOrg": "cardealer", "recipient": "rob@cardealer.org", "issueDate": 0, "issuedBy": "koopman", "carrierComments": "", "documents": [ "doc1" ], "goods": [ { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "2131231414CN", "manufacturer": "BMW", "model": "X5", "type": "sportsback", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "O291RX" }, "description": "vehicle", "weight": 1900, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000 } ], "legalOwnerInstructions": "string", "paymentInstructions": "string", "payOnDelivery": "string" }
#      """
#    When I update the following asset
#      """
#        {"$class": "org.digitalcmr.ECMR", "ecmrID": "A1234567890", "status": "LOADED", "agreementTerms": "agreement terms here", "agreementTermsSec": "agreement terms sec", "legalOwnerRef": "ASD213123S", "carrierRef": "H2238723VASD", "recipientRef": "SDADHGA21312312", "orderID": "AAAA123456", "creation": { "$class": "org.digitalcmr.Creation", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555 }, "date": 1502402400000 }, "loading": { "$class": "org.digitalcmr.Loading", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 43.1927, "longitude": 23.3249 }, "actualDate": 1502488800000 }, "delivery": { "$class": "org.digitalcmr.Delivery", "address": { "$class": "org.digitalcmr.Address", "name": "Rob el Caro", "street": "De straat", "houseNumber": "302", "city": "Almere", "zipCode": "6736AE", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623 }, "actualDate": 1502834400000 }, "owner": "leaseplan", "source": "amsterdamcompound", "transporter": "harry@koopman.org", "carrier": "koopman", "recipientOrg": "cardealer", "recipient": "rob@cardealer.org", "issueDate": 0, "issuedBy": "koopman", "carrierComments": "", "documents": [ "doc1" ], "goods": [ { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "2131231414CN", "manufacturer": "BMW", "model": "X5", "type": "sportsback", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "O291RX" }, "description": "vehicle", "weight": 1900, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000 } ], "legalOwnerInstructions": "string", "paymentInstructions": "string", "payOnDelivery": "string" }
#      """
#    Then I should get an error matching /does not have .* access to resource/
#
#  Scenario: Lapo can read all TransportOrders where he is the owner
#    When I use the identity Lapo
#    Then I should have the following asset of type org.digitalcmr.TransportOrder
#      """
#      {"$class":"org.digitalcmr.TransportOrder", "orderID":"OA123456789", "status": "OPEN", "loading": {"$class": "org.digitalcmr.Loading", "address": {"$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "compenstraat", "houseNumber": "21", "city": "Amsterdam", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555}, "actualDate": 1502402400000}, "delivery": {"$class": "org.digitalcmr.Delivery", "address": {"$class": "org.digitalcmr.Address", "name": "Rob Carman", "street": "autostraat", "houseNumber": "12", "city": "Rotterdam", "zipCode": "9442KO", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623}, "actualDate": 1502488800000}, "owner": "leaseplan", "source": "amsterdamcompound", "carrier": "koopman", "issueDate":0, "orderRef": "ABC213321BCA", "goods":[{"$class":"org.digitalcmr.Good", "vehicle": {"$class": "org.digitalcmr.Vehicle", "vin": "736182CHD28172", "manufacturer": "Mercedes", "model": "SLK", "type": "Station", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "I827YE", "loadingStartDate": 2132141, "loadingEndDate": 2213313, "deliveryStartDate": 123123, "deliveryEndDate": 121312}, "description": "vehicle", "weight": 1800, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000}], "ecmrs": []}
#      """
#
#  Scenario: Lapo cannot read TransportOrders where he is not the owner
#    When I use the identity Lapo
#    Then I should not have the following asset of type org.digitalcmr.TransportOrder
#      """
#        {"$class":"org.digitalcmr.TransportOrder", "orderID":"OB123456789", "status": "OPEN", "agreementTerms": "terms", "agreementTermsSec": "sec terms", "legalOwnerRef": "A123", "carrierRef": "B123", "recipientRef": "C123", "orderID": "A123456789", "loading": {"$class": "org.digitalcmr.Loading", "address": {"$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "compenstraat", "houseNumber": "21", "city": "Amsterdam", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555}, "actualDate": 1502402400000}, "delivery": {"$class": "org.digitalcmr.Delivery", "address": {"$class": "org.digitalcmr.Address", "name": "Rob Carman", "street": "autostraat", "houseNumber": "12", "city": "Rotterdam", "zipCode": "9442KO", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623}, "actualDate": 1502488800000}, "owner": "notleaseplan", "source": "amsterdamcompound", "carrier": "koopman", "issueDate":0, "orderRef": "ABC213321BCA", "goods":[{"$class":"org.digitalcmr.Good", "vehicle": {"$class": "org.digitalcmr.Vehicle", "vin": "736182CHD28172", "manufacturer": "Mercedes", "model": "SLK", "type": "Station", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "I827YE"}, "description": "vehicle", "weight": 1800, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000}], "ecmrs": []}
#      """

#  Scenario: Lapo can submit an asset of type TransportOrder
#    When I use the identity Lapo
#    Given I have added the following asset of type org.digitalcmr.TransportOrder
#        """
#          {"$class":"org.digitalcmr.TransportOrder", "orderID":"C123456789", "status": "OPEN", "loading": {"$class": "org.digitalcmr.Loading", "address": {"$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "compenstraat", "houseNumber": "21", "city": "Amsterdam", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555}, "actualDate": 1502402400000}, "delivery": {"$class": "org.digitalcmr.Delivery", "address": {"$class": "org.digitalcmr.Address", "name": "Rob Carman", "street": "autostraat", "houseNumber": "12", "city": "Rotterdam", "zipCode": "9442KO", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623}, "actualDate": 1502488800000}, "owner": "leaseplan", "source": "amsterdamcompound", "carrier": "koopman", "issueDate":0, "orderRef": "ABC213321BCA", "goods":[{"$class":"org.digitalcmr.Good", "vehicle": {"$class": "org.digitalcmr.Vehicle", "vin": "736182CHD28172", "manufacturer": "Mercedes", "model": "SLK", "type": "Station", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "I827YE"}, "description": "vehicle", "weight": 1800, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000}], "ecmrs": []}
#        """
#    Then I should have the following asset of type org.digitalcmr.TransportOrder
#        """
#        [
#          {"$class":"org.digitalcmr.TransportOrder", "orderID":"C123456789", "status": "OPEN", "loading": {"$class": "org.digitalcmr.Loading", "address": {"$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "compenstraat", "houseNumber": "21", "city": "Amsterdam", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555}, "actualDate": 1502402400000}, "delivery": {"$class": "org.digitalcmr.Delivery", "address": {"$class": "org.digitalcmr.Address", "name": "Rob Carman", "street": "autostraat", "houseNumber": "12", "city": "Rotterdam", "zipCode": "9442KO", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623}, "actualDate": 1502488800000}, "owner": "leaseplan", "source": "amsterdamcompound", "carrier": "koopman", "issueDate":0, "orderRef": "ABC213321BCA", "goods":[{"$class":"org.digitalcmr.Good", "vehicle": {"$class": "org.digitalcmr.Vehicle", "vin": "736182CHD28172", "manufacturer": "Mercedes", "model": "SLK", "type": "Station", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "I827YE"}, "description": "vehicle", "weight": 1800, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000}], "ecmrs": []}
#        ]
#        """
#
#  Scenario: Lapo can not submit an asset of type TransportOrder when he is not the owner
#    When I use the identity Lapo
#    Given I have added the following asset of type org.digitalcmr.TransportOrder
#        """
#          {"$class":"org.digitalcmr.TransportOrder", "orderID":"D123456789", "status": "OPEN", "loading": {"$class": "org.digitalcmr.Loading", "address": {"$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "compenstraat", "houseNumber": "21", "city": "Amsterdam", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555}, "actualDate": 1502402400000}, "delivery": {"$class": "org.digitalcmr.Delivery", "address": {"$class": "org.digitalcmr.Address", "name": "Rob Carman", "street": "autostraat", "houseNumber": "12", "city": "Rotterdam", "zipCode": "9442KO", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623}, "actualDate": 1502488800000}, "owner": "notleaseplan", "source": "amsterdamcompound", "carrier": "koopman", "issueDate":0, "orderRef": "ABC213321BCA", "goods":[{"$class":"org.digitalcmr.Good", "vehicle": {"$class": "org.digitalcmr.Vehicle", "vin": "736182CHD28172", "manufacturer": "Mercedes", "model": "SLK", "type": "Station", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "I827YE"}, "description": "vehicle", "weight": 1800, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000}], "ecmrs": []}
#        """
#    Then I should get an error matching /does not have .* access to resource/
#
#  Scenario: Lapo should get an error when I try to add a duplicate asset of type TransportOrder
#    When I use the identity Lapo
#    Given I have added the following asset of type org.digitalcmr.TransportOrder
#      """
#      {"$class":"org.digitalcmr.TransportOrder", "orderID":"C123456789", "status": "OPEN", "loading": {"$class": "org.digitalcmr.Loading", "address": {"$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "compenstraat", "houseNumber": "21", "city": "Amsterdam", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555}, "actualDate": 1502402400000}, "delivery": {"$class": "org.digitalcmr.Delivery", "address": {"$class": "org.digitalcmr.Address", "name": "Rob Carman", "street": "autostraat", "houseNumber": "12", "city": "Rotterdam", "zipCode": "9442KO", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623}, "actualDate": 1502488800000}, "owner": "leaseplan", "source": "amsterdamcompound", "carrier": "koopman", "issueDate":0, "orderRef": "ABC213321BCA", "goods":[{"$class":"org.digitalcmr.Good", "vehicle": {"$class": "org.digitalcmr.Vehicle", "vin": "736182CHD28172", "manufacturer": "Mercedes", "model": "SLK", "type": "Station", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "I827YE"}, "description": "vehicle", "weight": 1800, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000}], "ecmrs": []}
#      """
#    And I add the following asset of type org.digitalcmr.TransportOrder
#      """
#      {"$class":"org.digitalcmr.TransportOrder", "orderID":"C123456789", "status": "OPEN", "loading": {"$class": "org.digitalcmr.Loading", "address": {"$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "compenstraat", "houseNumber": "21", "city": "Amsterdam", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555}, "actualDate": 1502402400000}, "delivery": {"$class": "org.digitalcmr.Delivery", "address": {"$class": "org.digitalcmr.Address", "name": "Rob Carman", "street": "autostraat", "houseNumber": "12", "city": "Rotterdam", "zipCode": "9442KO", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623}, "actualDate": 1502488800000}, "owner": "leaseplan", "source": "amsterdamcompound", "carrier": "koopman", "issueDate":0, "orderRef": "ABC213321BCA", "goods":[{"$class":"org.digitalcmr.Good", "vehicle": {"$class": "org.digitalcmr.Vehicle", "vin": "736182CHD28172", "manufacturer": "Mercedes", "model": "SLK", "type": "Station", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "I827YE"}, "description": "vehicle", "weight": 1800, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000}], "ecmrs": []}
#      """
#    Then I should get an error
#
#  Scenario: Lapo should get an error when I try to update a non-existent asset of type TransportOrder
#    When I use the identity Lapo
#    And I update the following asset of type org.digitalcmr.TransportOrder
#      """
#      {"$class":"org.digitalcmr.TransportOrder", "orderID":"B123456789", "status": "COMPLETED", "loading": {"$class": "org.digitalcmr.Loading", "address": {"$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "compenstraat", "houseNumber": "21", "city": "Amsterdam", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555}, "actualDate": 1502402400000}, "delivery": {"$class": "org.digitalcmr.Delivery", "address": {"$class": "org.digitalcmr.Address", "name": "Rob Carman", "street": "autostraat", "houseNumber": "12", "city": "Rotterdam", "zipCode": "9442KO", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623}, "actualDate": 1502488800000}, "owner": "leaseplan", "source": "amsterdamcompound", "carrier": "koopman", "issueDate":0, "orderRef": "ABC213321BCA", "goods":[{"$class":"org.digitalcmr.Good", "vehicle": {"$class": "org.digitalcmr.Vehicle", "vin": "736182CHD28172", "manufacturer": "Mercedes", "model": "SLK", "type": "Station", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "I827YE"}, "description": "vehicle", "weight": 1800, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000}], "ecmrs": []}
#      """
#    Then I should get an error
