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

Feature: CarrierAdmin feature test

  Background:
    Given I have deployed the business network definition ..
    And I have added the following participants of type org.digitalcmr.CarrierAdmin
      """
      {"$class":"org.digitalcmr.CarrierAdmin", "userID": "pete@koopman.org", "userName": "pete", "firstName": "Pete", "lastName": "compy", "address": {"$class": "org.digitalcmr.Address", "name": "pete compy", "street": "compenstraat", "houseNumber": "18", "city": "Amsterdam", "zipCode": "9867UG", "country": "Netherlands", "latitude": 52.2443, "longitude": 65.2323, "id":"id"},"org":"koopman"}
      """
    And I have issued the participant org.digitalcmr.CarrierAdmin#pete@koopman.org with the identity Pete
    And I have added the following assets of type org.digitalcmr.TransportOrder
      """
      [
      { "$class": "org.digitalcmr.TransportOrder", "orderID": "A12345567890", "loading": { "actualDate": 1502834400000, "expectedDate": 1502835400000, "address": { "$class": "org.digitalcmr.Address", "name": "loading address", "street": "een straat", "houseNumber": "41", "city": "Groningen", "zipCode": "7811 HC", "country": "netherlands", "longitude": 124, "latitude": 123 } }, "delivery": { "$class": "org.digitalcmr.Delivery", "actualDate": 1502834400000, "expectedDate": 1502835400000, "address": { "$class": "org.digitalcmr.Address", "name": "delivery adress", "street": "een straat", "houseNumber": "41", "city": "Groningen", "zipCode": "7811 HC", "country": "netherlands", "longitude": 124, "latitude": 123 } }, "owner": "leaseplan", "source": "amsterdamcompound", "carrier": "koopman", "goods": [ { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "183726339N", "manufacturer": "Audi", "model": "A1", "type": "sportback", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "AV198RX" }, "description": "vehicle", "weight": 1500, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000 }, { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "736182CHD28172", "manufacturer": "Mercedes", "model": "SLK", "type": "Station", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "I827YE" }, "description": "vehicle", "weight": 1800, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000 } ], "status": "OPEN", "issueDate": 1502834400000, "ecmrs": [], "orderRef": "ref" },
      { "$class": "org.digitalcmr.TransportOrder", "orderID": "B12345567890", "loading": { "actualDate": 1502834400000, "expectedDate": 1502835400000, "address": { "$class": "org.digitalcmr.Address", "name": "loading address", "street": "een straat", "houseNumber": "41", "city": "Groningen", "zipCode": "7811 HC", "country": "netherlands", "longitude": 124, "latitude": 123 } }, "delivery": { "$class": "org.digitalcmr.Delivery", "actualDate": 1502834400000, "expectedDate": 1502835400000, "address": { "$class": "org.digitalcmr.Address", "name": "delivery adress", "street": "een straat", "houseNumber": "41", "city": "Groningen", "zipCode": "7811 HC", "country": "netherlands", "longitude": 124, "latitude": 123 } }, "owner": "leaseplan", "source": "amsterdamcompound", "carrier": "notKoopman", "goods": [ { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "183726339N", "manufacturer": "Audi", "model": "A1", "type": "sportback", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "AV198RX" }, "description": "vehicle", "weight": 1500, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000 }, { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "736182CHD28172", "manufacturer": "Mercedes", "model": "SLK", "type": "Station", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "I827YE" }, "description": "vehicle", "weight": 1800, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000 } ], "status": "OPEN", "issueDate": 1502834400000, "ecmrs": [], "orderRef": "ref" },
      { "$class": "org.digitalcmr.TransportOrder", "orderID": "G12345567890", "loading": { "actualDate": 1502834400000, "expectedDate": 1502835400000, "address": { "$class": "org.digitalcmr.Address", "name": "loading address", "street": "een straat", "houseNumber": "41", "city": "Groningen", "zipCode": "7811 HC", "country": "netherlands", "longitude": 124, "latitude": 123 } }, "delivery": { "$class": "org.digitalcmr.Delivery", "actualDate": 1502834400000, "expectedDate": 1502835400000, "address": { "$class": "org.digitalcmr.Address", "name": "delivery adress", "street": "een straat", "houseNumber": "41", "city": "Groningen", "zipCode": "7811 HC", "country": "netherlands", "longitude": 124, "latitude": 123 } }, "owner": "leaseplan", "source": "amsterdamcompound", "carrier": "koopman", "goods": [ { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "183726339N", "manufacturer": "Audi", "model": "A1", "type": "sportback", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "AV198RX" }, "description": "vehicle", "weight": 1500, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000 }, { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "736182CHD28172", "manufacturer": "Mercedes", "model": "SLK", "type": "Station", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "I827YE" }, "description": "vehicle", "weight": 1800, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000 } ], "status": "IN_PROGRESS", "issueDate": 1502834400000, "ecmrs": [], "orderRef": "ref" }
      ]
      """
    And I have added the following assets of type org.digitalcmr.ECMR
      """
      [
      {"$class": "org.digitalcmr.ECMR", "ecmrID": "A1234567890", "status": "CREATED", "agreementTerms": "agreement terms here", "agreementTermsSec": "agreement terms sec", "legalOwnerRef": "ASD213123S", "carrierRef": "H2238723VASD", "recipientRef": "SDADHGA21312312", "orderID": "AAAA123456", "creation": { "$class": "org.digitalcmr.Creation", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555 }, "date": 1502402400000 }, "loading": { "$class": "org.digitalcmr.Loading", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 43.1927, "longitude": 23.3249 }, "actualDate": 1502488800000 }, "delivery": { "$class": "org.digitalcmr.Delivery", "address": { "$class": "org.digitalcmr.Address", "name": "Rob el Caro", "street": "De straat", "houseNumber": "302", "city": "Almere", "zipCode": "6736AE", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623 }, "actualDate": 1502834400000 }, "owner": "leaseplan", "source": "amsterdamcompound", "transporter": "harry@koopman.org", "carrier": "koopman", "recipientOrg": "cardealer", "recipient": "rob@cardealer.org", "issueDate": 0, "issuedBy": "koopman", "carrierComments": "", "documents": [ "doc1" ], "goods": [ { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "2131231414CN", "manufacturer": "BMW", "model": "X5", "type": "sportsback", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "O291RX" }, "description": "vehicle", "weight": 1900, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000 } ], "legalOwnerInstructions": "string", "paymentInstructions": "string", "payOnDelivery": "string" },
      {"$class": "org.digitalcmr.ECMR", "ecmrID": "B1234567890", "status": "CREATED", "agreementTerms": "agreement terms here", "agreementTermsSec": "agreement terms sec", "legalOwnerRef": "ASD213123S", "carrierRef": "H2238723VASD", "recipientRef": "SDADHGA21312312", "orderID": "BB123456", "creation": { "$class": "org.digitalcmr.Creation", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555 }, "date": 1502402400000 }, "loading": { "$class": "org.digitalcmr.Loading", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 43.1927, "longitude": 23.3249 }, "actualDate": 1502488800000 }, "delivery": { "$class": "org.digitalcmr.Delivery", "address": { "$class": "org.digitalcmr.Address", "name": "Rob el Caro", "street": "De straat", "houseNumber": "302", "city": "Almere", "zipCode": "6736AE", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623 }, "actualDate": 1502834400000 }, "owner": "notleaseplan", "source": "notamsterdamcompound", "transporter": "harry@koopman.org", "carrier": "notkoopman", "recipientOrg": "notcardealer", "recipient": "rob@cardealer.org", "issueDate": 0, "issuedBy": "koopman", "carrierComments": "", "documents": [ "doc1" ], "goods": [ { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "2131231414CN", "manufacturer": "BMW", "model": "X5", "type": "sportsback", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "O291RX" }, "description": "vehicle", "weight": 1900, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000 } ], "legalOwnerInstructions": "string", "paymentInstructions": "string", "payOnDelivery": "string" }
      ]
      """

  Scenario: Pete can read all of his ECMRs where he is carrier
    When I use the identity Pete
    Then I should have the following assets of type org.digitalcmr.ECMR
      """
        {"$class": "org.digitalcmr.ECMR", "ecmrID": "A1234567890", "status": "CREATED", "agreementTerms": "agreement terms here", "agreementTermsSec": "agreement terms sec", "legalOwnerRef": "ASD213123S", "carrierRef": "H2238723VASD", "recipientRef": "SDADHGA21312312", "orderID": "AAAA123456", "creation": { "$class": "org.digitalcmr.Creation", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555 }, "date": 1502402400000 }, "loading": { "$class": "org.digitalcmr.Loading", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 43.1927, "longitude": 23.3249 }, "actualDate": 1502488800000 }, "delivery": { "$class": "org.digitalcmr.Delivery", "address": { "$class": "org.digitalcmr.Address", "name": "Rob el Caro", "street": "De straat", "houseNumber": "302", "city": "Almere", "zipCode": "6736AE", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623 }, "actualDate": 1502834400000 }, "owner": "leaseplan", "source": "amsterdamcompound", "transporter": "harry@koopman.org", "carrier": "koopman", "recipientOrg": "cardealer", "recipient": "rob@cardealer.org", "issueDate": 0, "issuedBy": "koopman", "carrierComments": "", "documents": [ "doc1" ], "goods": [ { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "2131231414CN", "manufacturer": "BMW", "model": "X5", "type": "sportsback", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "O291RX" }, "description": "vehicle", "weight": 1900, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000 } ], "legalOwnerInstructions": "string", "paymentInstructions": "string", "payOnDelivery": "string" }
      """

  Scenario: Pete can not read ECMRs where he is not the carrier
    When I use the identity Pete
    Then I should not have the following assets of type org.digitalcmr.ECMR
      """
        {"$class": "org.digitalcmr.ECMR", "ecmrID": "B1234567890", "status": "CREATED", "agreementTerms": "agreement terms here", "agreementTermsSec": "agreement terms sec", "legalOwnerRef": "ASD213123S", "carrierRef": "H2238723VASD", "recipientRef": "SDADHGA21312312", "orderID": "BB123456", "creation": { "$class": "org.digitalcmr.Creation", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555 }, "date": 1502402400000 }, "loading": { "$class": "org.digitalcmr.Loading", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 43.1927, "longitude": 23.3249 }, "actualDate": 1502488800000 }, "delivery": { "$class": "org.digitalcmr.Delivery", "address": { "$class": "org.digitalcmr.Address", "name": "Rob el Caro", "street": "De straat", "houseNumber": "302", "city": "Almere", "zipCode": "6736AE", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623 }, "actualDate": 1502834400000 }, "owner": "notleaseplan", "source": "notamsterdamcompound", "transporter": "harry@koopman.org", "carrier": "notkoopman", "recipientOrg": "notcardealer", "recipient": "rob@cardealer.org", "issueDate": 0, "issuedBy": "koopman", "carrierComments": "", "documents": [ "doc1" ], "goods": [ { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "2131231414CN", "manufacturer": "BMW", "model": "X5", "type": "sportsback", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "O291RX" }, "description": "vehicle", "weight": 1900, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000 } ], "legalOwnerInstructions": "string", "paymentInstructions": "string", "payOnDelivery": "string" }
      """

  Scenario: Pete can read all the TransportOrders where he is carrier
    When I use the identity Pete
    Then I should have the following assets of type org.digitalcmr.TransportOrder
      """
      { "$class": "org.digitalcmr.TransportOrder", "orderID": "A12345567890", "loading": { "actualDate": 1502834400000, "expectedDate": 1502835400000, "address": { "$class": "org.digitalcmr.Address", "name": "loading address", "street": "een straat", "houseNumber": "41", "city": "Groningen", "zipCode": "7811 HC", "country": "netherlands", "longitude": 124, "latitude": 123 } }, "delivery": { "$class": "org.digitalcmr.Delivery", "actualDate": 1502834400000, "expectedDate": 1502835400000, "address": { "$class": "org.digitalcmr.Address", "name": "delivery adress", "street": "een straat", "houseNumber": "41", "city": "Groningen", "zipCode": "7811 HC", "country": "netherlands", "longitude": 124, "latitude": 123 } }, "owner": "leaseplan", "source": "amsterdamcompound", "carrier": "koopman", "goods": [ { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "183726339N", "manufacturer": "Audi", "model": "A1", "type": "sportback", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "AV198RX" }, "description": "vehicle", "weight": 1500, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000 }, { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "736182CHD28172", "manufacturer": "Mercedes", "model": "SLK", "type": "Station", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "I827YE" }, "description": "vehicle", "weight": 1800, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000 } ], "status": "OPEN", "issueDate": 1502834400000, "ecmrs": [], "orderRef": "ref" }
      """

  Scenario: Pete cannot read Transport Orders where is is not carrier
    When I use the identity Pete
    Then I should not have the following assets of type org.digitalcmr.TransportOrder
      """
      { "$class": "org.digitalcmr.TransportOrder", "orderID": "B12345567890", "loading": { "actualDate": 1502834400000, "expectedDate": 1502835400000, "address": { "$class": "org.digitalcmr.Address", "name": "loading address", "street": "een straat", "houseNumber": "41", "city": "Groningen", "zipCode": "7811 HC", "country": "netherlands", "longitude": 124, "latitude": 123 } }, "delivery": { "$class": "org.digitalcmr.Delivery", "actualDate": 1502834400000, "expectedDate": 1502835400000, "address": { "$class": "org.digitalcmr.Address", "name": "delivery adress", "street": "een straat", "houseNumber": "41", "city": "Groningen", "zipCode": "7811 HC", "country": "netherlands", "longitude": 124, "latitude": 123 } }, "owner": "leaseplan", "source": "amsterdamcompound", "carrier": "notKoopman", "goods": [ { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "183726339N", "manufacturer": "Audi", "model": "A1", "type": "sportback", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "AV198RX" }, "description": "vehicle", "weight": 1500, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000 }, { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "736182CHD28172", "manufacturer": "Mercedes", "model": "SLK", "type": "Station", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "I827YE" }, "description": "vehicle", "weight": 1800, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000 } ], "status": "OPEN", "issueDate": 1502834400000, "ecmrs": [], "orderRef": "ref" }
      """

  Scenario: Pete can create an ECMR using the CreateECMR transaction
    When I use the identity Pete
    And I submit the following transaction of type org.digitalcmr.CreateECMR
      """
      {"$class": "org.digitalcmr.CreateECMR", "ecmr": {"ecmrID": "C1234567890", "status": "CREATED", "agreementTerms": "agreement terms here", "agreementTermsSec": "agreement terms sec", "legalOwnerRef": "ASD213123S", "carrierRef": "H2238723VASD", "recipientRef": "SDADHGA21312312", "orderID": "AAAA123456", "creation": { "$class": "org.digitalcmr.Creation", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555 }, "date": 1502402400000 }, "loading": { "$class": "org.digitalcmr.Loading", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 43.1927, "longitude": 23.3249 }, "actualDate": 1502488800000 }, "delivery": { "$class": "org.digitalcmr.Delivery", "address": { "$class": "org.digitalcmr.Address", "name": "Rob el Caro", "street": "De straat", "houseNumber": "302", "city": "Almere", "zipCode": "6736AE", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623 }, "actualDate": 1502834400000 }, "owner": "leaseplan", "source": "amsterdamcompound", "transporter": "harry@koopman.org", "carrier": "koopman", "recipientOrg": "cardealer", "recipient": "rob@cardealer.org", "issueDate": 0, "issuedBy": "koopman", "carrierComments": "", "documents": [ "doc1" ], "goods": [ { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "2131231414CN", "manufacturer": "BMW", "model": "X5", "type": "sportsback", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "O291RX" }, "description": "vehicle", "weight": 1900, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000 } ], "legalOwnerInstructions": "string", "paymentInstructions": "string", "payOnDelivery": "string" }}
      """
    Then I should have the following asset of type org.digitalcmr.ECMR
      """
      {"$class": "org.digitalcmr.ECMR", "ecmrID": "C1234567890", "status": "CREATED", "agreementTerms": "agreement terms here", "agreementTermsSec": "agreement terms sec", "legalOwnerRef": "ASD213123S", "carrierRef": "H2238723VASD", "recipientRef": "SDADHGA21312312", "orderID": "AAAA123456", "creation": { "$class": "org.digitalcmr.Creation", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555 }, "date": 1502402400000 }, "loading": { "$class": "org.digitalcmr.Loading", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 43.1927, "longitude": 23.3249 }, "actualDate": 1502488800000 }, "delivery": { "$class": "org.digitalcmr.Delivery", "address": { "$class": "org.digitalcmr.Address", "name": "Rob el Caro", "street": "De straat", "houseNumber": "302", "city": "Almere", "zipCode": "6736AE", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623 }, "actualDate": 1502834400000 }, "owner": "leaseplan", "source": "amsterdamcompound", "transporter": "harry@koopman.org", "carrier": "koopman", "recipientOrg": "cardealer", "recipient": "rob@cardealer.org", "issueDate": 0, "issuedBy": "koopman", "carrierComments": "", "documents": [ "doc1" ], "goods": [ { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "2131231414CN", "manufacturer": "BMW", "model": "X5", "type": "sportsback", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "O291RX" }, "description": "vehicle", "weight": 1900, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000 } ], "legalOwnerInstructions": "string", "paymentInstructions": "string", "payOnDelivery": "string" }
      """

  Scenario: Pete can not create an ECMR using the CreateECMR transaction where he is not the carrier
    When I use the identity Pete
    And I submit the following transaction of type org.digitalcmr.CreateECMR
      """
      {"$class": "org.digitalcmr.CreateECMR", "ecmr": {"ecmrID": "C1234567890", "status": "CREATED", "agreementTerms": "agreement terms here", "agreementTermsSec": "agreement terms sec", "legalOwnerRef": "ASD213123S", "carrierRef": "H2238723VASD", "recipientRef": "SDADHGA21312312", "orderID": "AAAA123456", "creation": { "$class": "org.digitalcmr.Creation", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555 }, "date": 1502402400000 }, "loading": { "$class": "org.digitalcmr.Loading", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 43.1927, "longitude": 23.3249 }, "actualDate": 1502488800000 }, "delivery": { "$class": "org.digitalcmr.Delivery", "address": { "$class": "org.digitalcmr.Address", "name": "Rob el Caro", "street": "De straat", "houseNumber": "302", "city": "Almere", "zipCode": "6736AE", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623 }, "actualDate": 1502834400000 }, "owner": "leaseplan", "source": "amsterdamcompound", "transporter": "harry@koopman.org", "carrier": "notKoopman", "recipientOrg": "cardealer", "recipient": "rob@cardealer.org", "issueDate": 0, "issuedBy": "koopman", "carrierComments": "", "documents": [ "doc1" ], "goods": [ { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "2131231414CN", "manufacturer": "BMW", "model": "X5", "type": "sportsback", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "O291RX" }, "description": "vehicle", "weight": 1900, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000 } ], "legalOwnerInstructions": "string", "paymentInstructions": "string", "payOnDelivery": "string" }}
      """
    Then I should get an error matching /does not have 'CREATE' access to resource/

  Scenario: Pete should be able to update a Transport Order by using the UpdateTransportOrder transaction when the status is OPEN
    When I use the identity Pete
    When I submit the following transaction of type org.digitalcmr.UpdateTransportOrder
      """
        { "$class": "org.digitalcmr.UpdateTransportOrder", "transportOrder": { "orderID": "A12345567890", "loading": { "actualDate": 1502834400000, "expectedDate": 1502835400000, "address": { "$class": "org.digitalcmr.Address", "name": "loading address", "street": "een straat", "houseNumber": "41", "city": "Groningen", "zipCode": "7811 HC", "country": "netherlands", "longitude": 124, "latitude": 123 } }, "delivery": { "$class": "org.digitalcmr.Delivery", "actualDate": 1502834400000, "expectedDate": 1502835400000, "address": { "$class": "org.digitalcmr.Address", "name": "delivery adress", "street": "een straat", "houseNumber": "41", "city": "Groningen", "zipCode": "7811 HC", "country": "netherlands", "longitude": 124, "latitude": 123 } }, "owner": "leaseplan", "source": "amsterdamcompound", "carrier": "koopman", "goods": [ { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "183726339N", "manufacturer": "Audi", "model": "A1", "type": "sportback", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "AV198RX" }, "description": "vehicle", "weight": 1500, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000 }, { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "736182CHD28172", "manufacturer": "Mercedes", "model": "SLK", "type": "Station", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "I827YE" }, "description": "vehicle", "weight": 1800, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000 } ], "status": "IN_PROGRESS", "issueDate": 1502834400000, "ecmrs": [], "orderRef": "ref" }}
      """
    Then I should have the following asset of type org.digitalcmr.TransportOrder
      """
        { "$class": "org.digitalcmr.TransportOrder", "orderID": "A12345567890", "loading": { "actualDate": 1502834400000, "expectedDate": 1502835400000, "address": { "$class": "org.digitalcmr.Address", "name": "loading address", "street": "een straat", "houseNumber": "41", "city": "Groningen", "zipCode": "7811 HC", "country": "netherlands", "longitude": 124, "latitude": 123 } }, "delivery": { "$class": "org.digitalcmr.Delivery", "actualDate": 1502834400000, "expectedDate": 1502835400000, "address": { "$class": "org.digitalcmr.Address", "name": "delivery adress", "street": "een straat", "houseNumber": "41", "city": "Groningen", "zipCode": "7811 HC", "country": "netherlands", "longitude": 124, "latitude": 123 } }, "owner": "leaseplan", "source": "amsterdamcompound", "carrier": "koopman", "goods": [ { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "183726339N", "manufacturer": "Audi", "model": "A1", "type": "sportback", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "AV198RX" }, "description": "vehicle", "weight": 1500, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000 }, { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "736182CHD28172", "manufacturer": "Mercedes", "model": "SLK", "type": "Station", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "I827YE" }, "description": "vehicle", "weight": 1800, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000 } ], "status": "IN_PROGRESS", "issueDate": 1502834400000, "ecmrs": [], "orderRef": "ref" }
      """

  Scenario: Pete should not be able to update a Transport Order by using the UpdateTransportOrder transaction when the status is IN_PROGRESS
    When I use the identity Pete
    Given I should have the following assets of type org.digitalcmr.TransportOrder
      """
        { "$class": "org.digitalcmr.TransportOrder", "orderID": "G12345567890", "loading": { "actualDate": 1502834400000, "expectedDate": 1502835400000, "address": { "$class": "org.digitalcmr.Address", "name": "loading address", "street": "een straat", "houseNumber": "41", "city": "Groningen", "zipCode": "7811 HC", "country": "netherlands", "longitude": 124, "latitude": 123 } }, "delivery": { "$class": "org.digitalcmr.Delivery", "actualDate": 1502834400000, "expectedDate": 1502835400000, "address": { "$class": "org.digitalcmr.Address", "name": "delivery adress", "street": "een straat", "houseNumber": "41", "city": "Groningen", "zipCode": "7811 HC", "country": "netherlands", "longitude": 124, "latitude": 123 } }, "owner": "leaseplan", "source": "amsterdamcompound", "carrier": "koopman", "goods": [ { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "183726339N", "manufacturer": "Audi", "model": "A1", "type": "sportback", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "AV198RX" }, "description": "vehicle", "weight": 1500, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000 }, { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "736182CHD28172", "manufacturer": "Mercedes", "model": "SLK", "type": "Station", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "I827YE" }, "description": "vehicle", "weight": 1800, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000 } ], "status": "IN_PROGRESS", "issueDate": 1502834400000, "ecmrs": [], "orderRef": "ref" }
      """
    When I submit the following transaction of type org.digitalcmr.UpdateTransportOrder
      """
        { "$class": "org.digitalcmr.UpdateTransportOrder", "transportOrder": {"orderID": "G12345567890", "loading": { "actualDate": 1502834400000, "expectedDate": 1502835400000, "address": { "$class": "org.digitalcmr.Address", "name": "loading address", "street": "een straat", "houseNumber": "41", "city": "Groningen", "zipCode": "7811 HC", "country": "netherlands", "longitude": 124, "latitude": 123 } }, "delivery": { "$class": "org.digitalcmr.Delivery", "actualDate": 1502834400000, "expectedDate": 1502835400000, "address": { "$class": "org.digitalcmr.Address", "name": "delivery adress", "street": "een straat", "houseNumber": "41", "city": "Groningen", "zipCode": "7811 HC", "country": "netherlands", "longitude": 124, "latitude": 123 } }, "owner": "leaseplan", "source": "amsterdamcompound", "carrier": "koopman", "goods": [ { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "183726339N", "manufacturer": "Audi", "model": "A1", "type": "sportback", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "AV198RX" }, "description": "vehicle", "weight": 1500, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000 }, { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "736182CHD28172", "manufacturer": "Mercedes", "model": "SLK", "type": "Station", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "I827YE" }, "description": "vehicle", "weight": 1800, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000 } ], "status": "COMPLETED", "issueDate": 1502834400000, "ecmrs": [], "orderRef": "ref" }}
      """
    Then I should get an error matching /does not have 'UPDATE' access to resource/