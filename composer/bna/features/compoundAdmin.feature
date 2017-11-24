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

Feature: Compound Admin feature test

  Background:
    Given I have deployed the business network definition ..
    And I have added the following participants of type org.digitalcmr.CompoundAdmin
      """
      {"$class":"org.digitalcmr.CompoundAdmin", "userID": "willem@amsterdamcompound.org", "userName": "willem", "firstName": "willem", "lastName": "compy", "address": {"$class": "org.digitalcmr.Address", "name": "willem compy", "street": "compenstraat", "houseNumber": "18", "city": "Amsterdam", "zipCode": "9867UG", "country": "Netherlands", "latitude": 52.2443, "longitude": 65.2323, "id":"id"},"org":"amsterdamcompound"}
      """
    And I have issued the participant org.digitalcmr.CompoundAdmin#willem@amsterdamcompound.org with the identity Willem
    And I have added the following assets of type org.digitalcmr.ECMR
      """
      [
      { "$class": "org.digitalcmr.ECMR", "ecmrID": "A1234567890", "status": "CREATED", "agreementTerms": "agreement terms here", "agreementTermsSec": "agreement terms sec", "legalOwnerRef": "ASD213123S", "carrierRef": "H2238723VASD", "recipientRef": "SDADHGA21312312", "orderID": "AAAA123456", "creation": { "$class": "org.digitalcmr.Creation", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555 }, "date": 1502402400000 }, "loading": { "$class": "org.digitalcmr.Loading", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 43.1927, "longitude": 23.3249 }, "actualDate": 1502488800000 }, "delivery": { "$class": "org.digitalcmr.Delivery", "address": { "$class": "org.digitalcmr.Address", "name": "Rob el Caro", "street": "De straat", "houseNumber": "302", "city": "Almere", "zipCode": "6736AE", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623 }, "actualDate": 1502834400000 }, "owner": "leaseplan", "source": "amsterdamcompound", "transporter": "harry@koopman.org", "carrier": "koopman", "recipientOrg": "cardealer", "recipient": "rob@cardealer.org", "issueDate": 0, "issuedBy": "koopman", "carrierComments": "", "documents": [ "doc1" ], "goods": [ { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "2131231414CN", "manufacturer": "BMW", "model": "X5", "type": "sportsback", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "O291RX" }, "description": "vehicle", "weight": 1900, "loadingAddress": { "$class": "org.digitalcmr.Address", "name": "loading address", "street": "een straat", "houseNumber": "41", "city": "Groningen", "zipCode": "7811 HC", "country": "netherlands", "longitude": 124, "latitude": 123 }, "deliveryAddress": { "$class": "org.digitalcmr.Address", "name": "delivery adress", "street": "een straat", "houseNumber": "41", "city": "Groningen", "zipCode": "7811 HC", "country": "netherlands", "longitude": 124, "latitude": 123 }, "pickupWindow": { "$class": "org.digitalcmr.DateWindow", "startDate": "1502834400000", "endDate": "1502834400000" }, "deliveryWindow": { "startDate": "1502834400000", "endDate": "1502834400000" } } ], "legalOwnerInstructions": "string", "paymentInstructions": "string", "payOnDelivery": "string" },
      { "$class": "org.digitalcmr.ECMR", "ecmrID": "B1234567890", "status": "CREATED", "agreementTerms": "agreement terms here", "agreementTermsSec": "agreement terms sec", "legalOwnerRef": "ASD213123S", "carrierRef": "H2238723VASD", "recipientRef": "SDADHGA21312312", "orderID": "BB123456", "creation": { "$class": "org.digitalcmr.Creation", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555 }, "date": 1502402400000 }, "loading": { "$class": "org.digitalcmr.Loading", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 43.1927, "longitude": 23.3249 }, "actualDate": 1502488800000 }, "delivery": { "$class": "org.digitalcmr.Delivery", "address": { "$class": "org.digitalcmr.Address", "name": "Rob el Caro", "street": "De straat", "houseNumber": "302", "city": "Almere", "zipCode": "6736AE", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623 }, "actualDate": 1502834400000 }, "owner": "notleaseplan", "source": "notamsterdamcompound", "transporter": "harry@koopman.org", "carrier": "notkoopman", "recipientOrg": "notcardealer", "recipient": "rob@cardealer.org", "issueDate": 0, "issuedBy": "koopman", "carrierComments": "", "documents": [ "doc1" ], "goods": [ { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "2131231414CN", "manufacturer": "BMW", "model": "X5", "type": "sportsback", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "O291RX" }, "description": "vehicle", "weight": 1900, "loadingAddress": { "$class": "org.digitalcmr.Address", "name": "loading address", "street": "een straat", "houseNumber": "41", "city": "Groningen", "zipCode": "7811 HC", "country": "netherlands", "longitude": 124, "latitude": 123 }, "deliveryAddress": { "$class": "org.digitalcmr.Address", "name": "delivery adress", "street": "een straat", "houseNumber": "41", "city": "Groningen", "zipCode": "7811 HC", "country": "netherlands", "longitude": 124, "latitude": 123 }, "pickupWindow": { "$class": "org.digitalcmr.DateWindow", "startDate": "1502834400000", "endDate": "1502834400000" }, "deliveryWindow": { "startDate": "1502834400000", "endDate": "1502834400000" } } ], "legalOwnerInstructions": "string", "paymentInstructions": "string", "payOnDelivery": "string" },
      { "$class": "org.digitalcmr.ECMR", "ecmrID": "C1234567890", "status": "LOADED", "agreementTerms": "agreement terms here", "agreementTermsSec": "agreement terms sec", "legalOwnerRef": "ASD213123S", "carrierRef": "H2238723VASD", "recipientRef": "SDADHGA21312312", "orderID": "BB123456", "creation": { "$class": "org.digitalcmr.Creation", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555 }, "date": 1502402400000 }, "loading": { "$class": "org.digitalcmr.Loading", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 43.1927, "longitude": 23.3249 }, "actualDate": 1502488800000 }, "delivery": { "$class": "org.digitalcmr.Delivery", "address": { "$class": "org.digitalcmr.Address", "name": "Rob el Caro", "street": "De straat", "houseNumber": "302", "city": "Almere", "zipCode": "6736AE", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623 }, "actualDate": 1502834400000 }, "owner": "leaseplan", "source": "amsterdamcompound", "transporter": "harry@koopman.org", "carrier": "koopman", "recipientOrg": "cardealer", "recipient": "rob@cardealer.org", "issueDate": 0, "issuedBy": "koopman", "carrierComments": "", "documents": [ "doc1" ], "goods": [ { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "2131231414CN", "manufacturer": "BMW", "model": "X5", "type": "sportsback", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "O291RX" }, "description": "vehicle", "weight": 1900, "loadingAddress": { "$class": "org.digitalcmr.Address", "name": "loading address", "street": "een straat", "houseNumber": "41", "city": "Groningen", "zipCode": "7811 HC", "country": "netherlands", "longitude": 124, "latitude": 123 }, "deliveryAddress": { "$class": "org.digitalcmr.Address", "name": "delivery adress", "street": "een straat", "houseNumber": "41", "city": "Groningen", "zipCode": "7811 HC", "country": "netherlands", "longitude": 124, "latitude": 123 }, "pickupWindow": { "$class": "org.digitalcmr.DateWindow", "startDate": "1502834400000", "endDate": "1502834400000" }, "deliveryWindow": { "startDate": "1502834400000", "endDate": "1502834400000" } } ], "legalOwnerInstructions": "string", "paymentInstructions": "string", "payOnDelivery": "string", "compoundSignature": { "certificate": "willem@amsterdamcompound.org", "timestamp": 0 } }
      ]
      """

  Scenario: Willem can read all of his ECMRs where he is the source
    When I use the identity Willem
    Then I should have the following assets of type org.digitalcmr.ECMR
      """
      { "$class": "org.digitalcmr.ECMR", "ecmrID": "A1234567890", "status": "CREATED", "agreementTerms": "agreement terms here", "agreementTermsSec": "agreement terms sec", "legalOwnerRef": "ASD213123S", "carrierRef": "H2238723VASD", "recipientRef": "SDADHGA21312312", "orderID": "AAAA123456", "creation": { "$class": "org.digitalcmr.Creation", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555 }, "date": 1502402400000 }, "loading": { "$class": "org.digitalcmr.Loading", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 43.1927, "longitude": 23.3249 }, "actualDate": 1502488800000 }, "delivery": { "$class": "org.digitalcmr.Delivery", "address": { "$class": "org.digitalcmr.Address", "name": "Rob el Caro", "street": "De straat", "houseNumber": "302", "city": "Almere", "zipCode": "6736AE", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623 }, "actualDate": 1502834400000 }, "owner": "leaseplan", "source": "amsterdamcompound", "transporter": "harry@koopman.org", "carrier": "koopman", "recipientOrg": "cardealer", "recipient": "rob@cardealer.org", "issueDate": 0, "issuedBy": "koopman", "carrierComments": "", "documents": [ "doc1" ], "goods": [ { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "2131231414CN", "manufacturer": "BMW", "model": "X5", "type": "sportsback", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "O291RX" }, "description": "vehicle", "weight": 1900, "loadingAddress": { "$class": "org.digitalcmr.Address", "name": "loading address", "street": "een straat", "houseNumber": "41", "city": "Groningen", "zipCode": "7811 HC", "country": "netherlands", "longitude": 124, "latitude": 123 }, "deliveryAddress": { "$class": "org.digitalcmr.Address", "name": "delivery adress", "street": "een straat", "houseNumber": "41", "city": "Groningen", "zipCode": "7811 HC", "country": "netherlands", "longitude": 124, "latitude": 123 }, "pickupWindow": { "$class": "org.digitalcmr.DateWindow", "startDate": "1502834400000", "endDate": "1502834400000" }, "deliveryWindow": { "startDate": "1502834400000", "endDate": "1502834400000" } } ], "legalOwnerInstructions": "string", "paymentInstructions": "string", "payOnDelivery": "string" }
      """

  Scenario: Willem cannot read ECMRs where he is not the source
    When I use the identity Willem
    Then I should not have the following assets of type org.digitalcmr.ECMR
      """
      { "$class": "org.digitalcmr.ECMR", "ecmrID": "B1234567890", "status": "CREATED", "agreementTerms": "agreement terms here", "agreementTermsSec": "agreement terms sec", "legalOwnerRef": "ASD213123S", "carrierRef": "H2238723VASD", "recipientRef": "SDADHGA21312312", "orderID": "BB123456", "creation": { "$class": "org.digitalcmr.Creation", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555 }, "date": 1502402400000 }, "loading": { "$class": "org.digitalcmr.Loading", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 43.1927, "longitude": 23.3249 }, "actualDate": 1502488800000 }, "delivery": { "$class": "org.digitalcmr.Delivery", "address": { "$class": "org.digitalcmr.Address", "name": "Rob el Caro", "street": "De straat", "houseNumber": "302", "city": "Almere", "zipCode": "6736AE", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623 }, "actualDate": 1502834400000 }, "owner": "notleaseplan", "source": "notamsterdamcompound", "transporter": "harry@koopman.org", "carrier": "notkoopman", "recipientOrg": "notcardealer", "recipient": "rob@cardealer.org", "issueDate": 0, "issuedBy": "koopman", "carrierComments": "", "documents": [ "doc1" ], "goods": [ { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "2131231414CN", "manufacturer": "BMW", "model": "X5", "type": "sportsback", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "O291RX" }, "description": "vehicle", "weight": 1900, "loadingAddress": { "$class": "org.digitalcmr.Address", "name": "loading address", "street": "een straat", "houseNumber": "41", "city": "Groningen", "zipCode": "7811 HC", "country": "netherlands", "longitude": 124, "latitude": 123 }, "deliveryAddress": { "$class": "org.digitalcmr.Address", "name": "delivery adress", "street": "een straat", "houseNumber": "41", "city": "Groningen", "zipCode": "7811 HC", "country": "netherlands", "longitude": 124, "latitude": 123 }, "pickupWindow": { "$class": "org.digitalcmr.DateWindow", "startDate": "1502834400000", "endDate": "1502834400000" }, "deliveryWindow": { "startDate": "1502834400000", "endDate": "1502834400000" } } ], "legalOwnerInstructions": "string", "paymentInstructions": "string", "payOnDelivery": "string" }
      """

  Scenario: Willem should not be able to create an ECMR by using the CreateECMR transaction
    When I use the identity Willem
    And I submit the following transaction of type org.digitalcmr.CreateECMR
      """
       {"$class": "org.digitalcmr.CreateECMR", "ecmr": { "ecmrID": "D1234567890", "status": "CREATED", "agreementTerms": "agreement terms here", "agreementTermsSec": "agreement terms sec", "legalOwnerRef": "ASD213123S", "carrierRef": "H2238723VASD", "recipientRef": "SDADHGA21312312", "orderID": "AAAA123456", "creation": { "$class": "org.digitalcmr.Creation", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555 }, "date": 1502402400000 }, "loading": { "$class": "org.digitalcmr.Loading", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 43.1927, "longitude": 23.3249 }, "actualDate": 1502488800000 }, "delivery": { "$class": "org.digitalcmr.Delivery", "address": { "$class": "org.digitalcmr.Address", "name": "Rob el Caro", "street": "De straat", "houseNumber": "302", "city": "Almere", "zipCode": "6736AE", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623 }, "actualDate": 1502834400000 }, "owner": "leaseplan", "source": "amsterdamcompound", "transporter": "harry@koopman.org", "carrier": "koopman", "recipientOrg": "cardealer", "recipient": "rob@cardealer.org", "issueDate": 0, "issuedBy": "koopman", "carrierComments": "", "documents": [ "doc1" ], "goods": [ { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "2131231414CN", "manufacturer": "BMW", "model": "X5", "type": "sportsback", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "O291RX" }, "description": "vehicle", "weight": 1900, "loadingAddress": { "$class": "org.digitalcmr.Address", "name": "loading address", "street": "een straat", "houseNumber": "41", "city": "Groningen", "zipCode": "7811 HC", "country": "netherlands", "longitude": 124, "latitude": 123 }, "deliveryAddress": { "$class": "org.digitalcmr.Address", "name": "delivery adress", "street": "een straat", "houseNumber": "41", "city": "Groningen", "zipCode": "7811 HC", "country": "netherlands", "longitude": 124, "latitude": 123 }, "pickupWindow": { "$class": "org.digitalcmr.DateWindow", "startDate": "1502834400000", "endDate": "1502834400000" }, "deliveryWindow": { "startDate": "1502834400000", "endDate": "1502834400000" } } ], "legalOwnerInstructions": "string", "paymentInstructions": "string", "payOnDelivery": "string" }}
      """
    Then I should get an error matching /does not have 'CREATE' access to resource/

  Scenario: Willem should be able to update an ECMR by using the UpdateECMR transaction when the status is CREATED
    When I use the identity Willem
    Given I should have the following assets of type org.digitalcmr.ECMR
      """
        { "$class": "org.digitalcmr.ECMR", "ecmrID": "A1234567890", "status": "CREATED", "agreementTerms": "agreement terms here", "agreementTermsSec": "agreement terms sec", "legalOwnerRef": "ASD213123S", "carrierRef": "H2238723VASD", "recipientRef": "SDADHGA21312312", "orderID": "AAAA123456", "creation": { "$class": "org.digitalcmr.Creation", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555 }, "date": 1502402400000 }, "loading": { "$class": "org.digitalcmr.Loading", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 43.1927, "longitude": 23.3249 }, "actualDate": 1502488800000 }, "delivery": { "$class": "org.digitalcmr.Delivery", "address": { "$class": "org.digitalcmr.Address", "name": "Rob el Caro", "street": "De straat", "houseNumber": "302", "city": "Almere", "zipCode": "6736AE", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623 }, "actualDate": 1502834400000 }, "owner": "leaseplan", "source": "amsterdamcompound", "transporter": "harry@koopman.org", "carrier": "koopman", "recipientOrg": "cardealer", "recipient": "rob@cardealer.org", "issueDate": 0, "issuedBy": "koopman", "carrierComments": "", "documents": [ "doc1" ], "goods": [ { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "2131231414CN", "manufacturer": "BMW", "model": "X5", "type": "sportsback", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "O291RX" }, "description": "vehicle", "weight": 1900, "loadingAddress": { "$class": "org.digitalcmr.Address", "name": "loading address", "street": "een straat", "houseNumber": "41", "city": "Groningen", "zipCode": "7811 HC", "country": "netherlands", "longitude": 124, "latitude": 123 }, "deliveryAddress": { "$class": "org.digitalcmr.Address", "name": "delivery adress", "street": "een straat", "houseNumber": "41", "city": "Groningen", "zipCode": "7811 HC", "country": "netherlands", "longitude": 124, "latitude": 123 }, "pickupWindow": { "$class": "org.digitalcmr.DateWindow", "startDate": "1502834400000", "endDate": "1502834400000" }, "deliveryWindow": { "startDate": "1502834400000", "endDate": "1502834400000" } } ], "legalOwnerInstructions": "string", "paymentInstructions": "string", "payOnDelivery": "string" }
      """
    When I submit the following transaction of type org.digitalcmr.UpdateECMR
      """
        {"$class": "org.digitalcmr.UpdateECMR", "ecmr": { "ecmrID": "A1234567890", "status": "LOADED", "agreementTerms": "agreement terms here", "agreementTermsSec": "agreement terms sec", "legalOwnerRef": "ASD213123S", "carrierRef": "H2238723VASD", "recipientRef": "SDADHGA21312312", "orderID": "AAAA123456", "creation": { "$class": "org.digitalcmr.Creation", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555 }, "date": 1502402400000 }, "loading": { "$class": "org.digitalcmr.Loading", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 43.1927, "longitude": 23.3249 }, "actualDate": 1502488800000 }, "delivery": { "$class": "org.digitalcmr.Delivery", "address": { "$class": "org.digitalcmr.Address", "name": "Rob el Caro", "street": "De straat", "houseNumber": "302", "city": "Almere", "zipCode": "6736AE", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623 }, "actualDate": 1502834400000 }, "owner": "leaseplan", "source": "amsterdamcompound", "transporter": "harry@koopman.org", "carrier": "koopman", "recipientOrg": "cardealer", "recipient": "rob@cardealer.org", "issueDate": 0, "issuedBy": "koopman", "carrierComments": "", "documents": [ "doc1" ], "goods": [ { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "2131231414CN", "manufacturer": "BMW", "model": "X5", "type": "sportsback", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "O291RX" }, "description": "vehicle", "weight": 1900, "loadingAddress": { "$class": "org.digitalcmr.Address", "name": "loading address", "street": "een straat", "houseNumber": "41", "city": "Groningen", "zipCode": "7811 HC", "country": "netherlands", "longitude": 124, "latitude": 123 }, "deliveryAddress": { "$class": "org.digitalcmr.Address", "name": "delivery adress", "street": "een straat", "houseNumber": "41", "city": "Groningen", "zipCode": "7811 HC", "country": "netherlands", "longitude": 124, "latitude": 123 }, "pickupWindow": { "$class": "org.digitalcmr.DateWindow", "startDate": "1502834400000", "endDate": "1502834400000" }, "deliveryWindow": { "startDate": "1502834400000", "endDate": "1502834400000" } } ], "legalOwnerInstructions": "string", "paymentInstructions": "string", "payOnDelivery": "string", "compoundSignature": { "certificate": "willem@amsterdamcompound.org", "timestamp": 0 } }}
      """
    Then I should have the following asset of type org.digitalcmr.ECMR
      """
        {"$class": "org.digitalcmr.ECMR", "ecmrID": "A1234567890", "status": "LOADED", "agreementTerms": "agreement terms here", "agreementTermsSec": "agreement terms sec", "legalOwnerRef": "ASD213123S", "carrierRef": "H2238723VASD", "recipientRef": "SDADHGA21312312", "orderID": "AAAA123456", "creation": { "$class": "org.digitalcmr.Creation", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555 }, "date": 1502402400000 }, "loading": { "$class": "org.digitalcmr.Loading", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 43.1927, "longitude": 23.3249 }, "actualDate": 1502488800000 }, "delivery": { "$class": "org.digitalcmr.Delivery", "address": { "$class": "org.digitalcmr.Address", "name": "Rob el Caro", "street": "De straat", "houseNumber": "302", "city": "Almere", "zipCode": "6736AE", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623 }, "actualDate": 1502834400000 }, "owner": "leaseplan", "source": "amsterdamcompound", "transporter": "harry@koopman.org", "carrier": "koopman", "recipientOrg": "cardealer", "recipient": "rob@cardealer.org", "issueDate": 0, "issuedBy": "koopman", "carrierComments": "", "documents": [ "doc1" ], "goods": [ { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "2131231414CN", "manufacturer": "BMW", "model": "X5", "type": "sportsback", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "O291RX" }, "description": "vehicle", "weight": 1900, "loadingAddress": { "$class": "org.digitalcmr.Address", "name": "loading address", "street": "een straat", "houseNumber": "41", "city": "Groningen", "zipCode": "7811 HC", "country": "netherlands", "longitude": 124, "latitude": 123 }, "deliveryAddress": { "$class": "org.digitalcmr.Address", "name": "delivery adress", "street": "een straat", "houseNumber": "41", "city": "Groningen", "zipCode": "7811 HC", "country": "netherlands", "longitude": 124, "latitude": 123 }, "pickupWindow": { "$class": "org.digitalcmr.DateWindow", "startDate": "1502834400000", "endDate": "1502834400000" }, "deliveryWindow": { "startDate": "1502834400000", "endDate": "1502834400000" } } ], "legalOwnerInstructions": "string", "paymentInstructions": "string", "payOnDelivery": "string", "compoundSignature": { "certificate": "willem@amsterdamcompound.org", "timestamp": 0 } }
      """

  Scenario: Willem should not be able to update an ECMR by using the UpdateECMR transaction when the status is not CREATED
    When I use the identity Willem
    And I submit the following transaction of type org.digitalcmr.UpdateECMR
      """
        {"$class": "org.digitalcmr.UpdateECMR", "ecmr": { "ecmrID": "C1234567890", "status": "IN_TRANSIT", "agreementTerms": "agreement terms here", "agreementTermsSec": "agreement terms sec", "legalOwnerRef": "ASD213123S", "carrierRef": "H2238723VASD", "recipientRef": "SDADHGA21312312", "orderID": "BB123456", "creation": { "$class": "org.digitalcmr.Creation", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555 }, "date": 1502402400000 }, "loading": { "$class": "org.digitalcmr.Loading", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 43.1927, "longitude": 23.3249 }, "actualDate": 1502488800000 }, "delivery": { "$class": "org.digitalcmr.Delivery", "address": { "$class": "org.digitalcmr.Address", "name": "Rob el Caro", "street": "De straat", "houseNumber": "302", "city": "Almere", "zipCode": "6736AE", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623 }, "actualDate": 1502834400000 }, "owner": "leaseplan", "source": "amsterdamcompound", "transporter": "harry@koopman.org", "carrier": "koopman", "recipientOrg": "cardealer", "recipient": "rob@cardealer.org", "issueDate": 0, "issuedBy": "koopman", "carrierComments": "", "documents": [ "doc1" ], "goods": [ { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "2131231414CN", "manufacturer": "BMW", "model": "X5", "type": "sportsback", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "O291RX" }, "description": "vehicle", "weight": 1900, "loadingAddress": { "$class": "org.digitalcmr.Address", "name": "loading address", "street": "een straat", "houseNumber": "41", "city": "Groningen", "zipCode": "7811 HC", "country": "netherlands", "longitude": 124, "latitude": 123 }, "deliveryAddress": { "$class": "org.digitalcmr.Address", "name": "delivery adress", "street": "een straat", "houseNumber": "41", "city": "Groningen", "zipCode": "7811 HC", "country": "netherlands", "longitude": 124, "latitude": 123 }, "pickupWindow": { "$class": "org.digitalcmr.DateWindow", "startDate": "1502834400000", "endDate": "1502834400000" }, "deliveryWindow": { "startDate": "1502834400000", "endDate": "1502834400000" } } ], "legalOwnerInstructions": "string", "paymentInstructions": "string", "payOnDelivery": "string", "compoundSignature": { "certificate": "willem@amsterdamcompound.org", "timestamp": 0 }, "carrierLoadingSignature": { "certificate": "harry@koopman.org", "timestamp": 0 }, "carrierDeliverySignature": { "certificate": "harry@koopman.org", "timestamp": 0 } }}
      """
    Then I should get an error matching /does not have 'UPDATE' access to resource/

  Scenario: Willem should not be able to directly update an ECMR when the status is CREATED
    When I use the identity Willem
    Given I should have the following assets of type org.digitalcmr.ECMR
      """
        { "$class": "org.digitalcmr.ECMR", "ecmrID": "A1234567890", "status": "CREATED", "agreementTerms": "agreement terms here", "agreementTermsSec": "agreement terms sec", "legalOwnerRef": "ASD213123S", "carrierRef": "H2238723VASD", "recipientRef": "SDADHGA21312312", "orderID": "AAAA123456", "creation": { "$class": "org.digitalcmr.Creation", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555 }, "date": 1502402400000 }, "loading": { "$class": "org.digitalcmr.Loading", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 43.1927, "longitude": 23.3249 }, "actualDate": 1502488800000 }, "delivery": { "$class": "org.digitalcmr.Delivery", "address": { "$class": "org.digitalcmr.Address", "name": "Rob el Caro", "street": "De straat", "houseNumber": "302", "city": "Almere", "zipCode": "6736AE", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623 }, "actualDate": 1502834400000 }, "owner": "leaseplan", "source": "amsterdamcompound", "transporter": "harry@koopman.org", "carrier": "koopman", "recipientOrg": "cardealer", "recipient": "rob@cardealer.org", "issueDate": 0, "issuedBy": "koopman", "carrierComments": "", "documents": [ "doc1" ], "goods": [ { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "2131231414CN", "manufacturer": "BMW", "model": "X5", "type": "sportsback", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "O291RX" }, "description": "vehicle", "weight": 1900, "loadingAddress": { "$class": "org.digitalcmr.Address", "name": "loading address", "street": "een straat", "houseNumber": "41", "city": "Groningen", "zipCode": "7811 HC", "country": "netherlands", "longitude": 124, "latitude": 123 }, "deliveryAddress": { "$class": "org.digitalcmr.Address", "name": "delivery adress", "street": "een straat", "houseNumber": "41", "city": "Groningen", "zipCode": "7811 HC", "country": "netherlands", "longitude": 124, "latitude": 123 }, "pickupWindow": { "$class": "org.digitalcmr.DateWindow", "startDate": "1502834400000", "endDate": "1502834400000" }, "deliveryWindow": { "startDate": "1502834400000", "endDate": "1502834400000" } } ], "legalOwnerInstructions": "string", "paymentInstructions": "string", "payOnDelivery": "string" }
      """
    When I update the following asset of type org.digitalcmr.ECMR
      """
        { "$class": "org.digitalcmr.ECMR", "ecmrID": "A1234567890", "status": "LOADED", "agreementTerms": "agreement terms here", "agreementTermsSec": "agreement terms sec", "legalOwnerRef": "ASD213123S", "carrierRef": "H2238723VASD", "recipientRef": "SDADHGA21312312", "orderID": "AAAA123456", "creation": { "$class": "org.digitalcmr.Creation", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555 }, "date": 1502402400000 }, "loading": { "$class": "org.digitalcmr.Loading", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 43.1927, "longitude": 23.3249 }, "actualDate": 1502488800000 }, "delivery": { "$class": "org.digitalcmr.Delivery", "address": { "$class": "org.digitalcmr.Address", "name": "Rob el Caro", "street": "De straat", "houseNumber": "302", "city": "Almere", "zipCode": "6736AE", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623 }, "actualDate": 1502834400000 }, "owner": "leaseplan", "source": "amsterdamcompound", "transporter": "harry@koopman.org", "carrier": "koopman", "recipientOrg": "cardealer", "recipient": "rob@cardealer.org", "issueDate": 0, "issuedBy": "koopman", "carrierComments": "", "documents": [ "doc1" ], "goods": [ { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "2131231414CN", "manufacturer": "BMW", "model": "X5", "type": "sportsback", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "O291RX" }, "description": "vehicle", "weight": 1900, "loadingAddress": { "$class": "org.digitalcmr.Address", "name": "loading address", "street": "een straat", "houseNumber": "41", "city": "Groningen", "zipCode": "7811 HC", "country": "netherlands", "longitude": 124, "latitude": 123 }, "deliveryAddress": { "$class": "org.digitalcmr.Address", "name": "delivery adress", "street": "een straat", "houseNumber": "41", "city": "Groningen", "zipCode": "7811 HC", "country": "netherlands", "longitude": 124, "latitude": 123 }, "pickupWindow": { "$class": "org.digitalcmr.DateWindow", "startDate": "1502834400000", "endDate": "1502834400000" }, "deliveryWindow": { "startDate": "1502834400000", "endDate": "1502834400000" } } ], "legalOwnerInstructions": "string", "paymentInstructions": "string", "payOnDelivery": "string", "compoundSignature": { "certificate": "willem@amsterdamcompound.org", "timestamp": 0 } }
      """
    Then I should get an error matching /does not have 'UPDATE' access to resource/

  Scenario: Willem can not create a Transport Order by using the CreateTransportOrder Transaction
    When I use the identity Willem
    Given I submit the following transaction of type org.digitalcmr.CreateTransportOrder
      """
        { "$class": "org.digitalcmr.CreateTransportOrder", "transportOrder": { "orderID": "C123456789", "status": "OPEN", "actualDate": 1502488800000, "owner": "leaseplan", "source": "amsterdamcompound", "carrier": "koopman", "issueDate": 0, "orderRef": "ABC213321BCA", "goods": [ { "$class": "org.digitalcmr.Good", "loadingAddress": { "$class": "org.digitalcmr.Address", "name": "loading address", "street": "een straat", "houseNumber": "41", "city": "Groningen", "zipCode": "7811 HC", "country": "netherlands", "longitude": 124, "latitude": 123 }, "deliveryAddress": { "$class": "org.digitalcmr.Address", "name": "delivery adress", "street": "een straat", "houseNumber": "41", "city": "Groningen", "zipCode": "7811 HC", "country": "netherlands", "longitude": 124, "latitude": 123 }, "pickupWindow": { "$class": "org.digitalcmr.DateWindow", "startDate": "1502834400000", "endDate": "1502834400000" }, "deliveryWindow": { "startDate": "1502834400000", "endDate": "1502834400000" }, "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "736182CHD28172", "manufacturer": "Mercedes", "model": "SLK", "type": "Station", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "I827YE" }, "description": "vehicle", "weight": 1800 } ], "ecmrs": [] }}
      """
    Then I should get an error matching /does not have 'CREATE' access to resource/
