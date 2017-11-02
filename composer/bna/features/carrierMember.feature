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

Feature: digital-cmr-network

  Background:
    Given I have deployed the business network definition ..
    And I have added the following participants of type org.digitalcmr.CarrierMember
        """
        {"$class":"org.digitalcmr.CarrierMember", "userID": "harry@koopman.org", "userName": "willem", "firstName": "willem", "lastName": "compy", "address": {"$class": "org.digitalcmr.Address", "name": "willem compy", "street": "compenstraat", "houseNumber": "18", "city": "Amsterdam", "zipCode": "9867UG", "country": "Netherlands", "latitude": 52.2443, "longitude": 65.2323, "id":"id"},"org":"koopman"}
        """
    And I have issued the participant org.digitalcmr.CarrierMember#harry@koopman.org with the identity Harry
    And I have added the following assets of type org.digitalcmr.ECMR
      """
      [
      {"$class": "org.digitalcmr.ECMR", "ecmrID": "A1234567890", "status": "LOADED", "agreementTerms": "agreement terms here", "agreementTermsSec": "agreement terms sec", "legalOwnerRef": "ASD213123S", "carrierRef": "H2238723VASD", "recipientRef": "SDADHGA21312312", "orderID": "AAAA123456", "creation": { "$class": "org.digitalcmr.Creation", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555 }, "date": 1502402400000 }, "loading": { "$class": "org.digitalcmr.Loading", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 43.1927, "longitude": 23.3249 }, "actualDate": 1502488800000 }, "delivery": { "$class": "org.digitalcmr.Delivery", "address": { "$class": "org.digitalcmr.Address", "name": "Rob el Caro", "street": "De straat", "houseNumber": "302", "city": "Almere", "zipCode": "6736AE", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623 }, "actualDate": 1502834400000 }, "owner": "leaseplan", "source": "amsterdamcompound", "transporter": "harry@koopman.org", "carrier": "koopman", "recipientOrg": "cardealer", "recipient": "rob@cardealer.org", "issueDate": 0, "issuedBy": "koopman", "carrierComments": "", "documents": [ "doc1" ], "goods": [ { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "2131231414CN", "manufacturer": "BMW", "model": "X5", "type": "sportsback", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "O291RX" }, "description": "vehicle", "weight": 1900, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000 } ], "legalOwnerInstructions": "string", "paymentInstructions": "string", "payOnDelivery": "string" },
      {"$class": "org.digitalcmr.ECMR", "ecmrID": "B1234567890", "status": "LOADED", "agreementTerms": "agreement terms here", "agreementTermsSec": "agreement terms sec", "legalOwnerRef": "ASD213123S", "carrierRef": "H2238723VASD", "recipientRef": "SDADHGA21312312", "orderID": "BB123456", "creation": { "$class": "org.digitalcmr.Creation", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555 }, "date": 1502402400000 }, "loading": { "$class": "org.digitalcmr.Loading", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 43.1927, "longitude": 23.3249 }, "actualDate": 1502488800000 }, "delivery": { "$class": "org.digitalcmr.Delivery", "address": { "$class": "org.digitalcmr.Address", "name": "Rob el Caro", "street": "De straat", "houseNumber": "302", "city": "Almere", "zipCode": "6736AE", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623 }, "actualDate": 1502834400000 }, "owner": "notleaseplan", "source": "notamsterdamcompound", "transporter": "harry@koopman.org", "carrier": "notkoopman", "recipientOrg": "notcardealer", "recipient": "rob@cardealer.org", "issueDate": 0, "issuedBy": "koopman", "carrierComments": "", "documents": [ "doc1" ], "goods": [ { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "2131231414CN", "manufacturer": "BMW", "model": "X5", "type": "sportsback", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "O291RX" }, "description": "vehicle", "weight": 1900, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000 } ], "legalOwnerInstructions": "string", "paymentInstructions": "string", "payOnDelivery": "string" },
      {"$class": "org.digitalcmr.ECMR", "ecmrID": "C1234567890", "status": "CREATED", "agreementTerms": "agreement terms here", "agreementTermsSec": "agreement terms sec", "legalOwnerRef": "ASD213123S", "carrierRef": "H2238723VASD", "recipientRef": "SDADHGA21312312", "orderID": "CCAA123456", "creation": { "$class": "org.digitalcmr.Creation", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555 }, "date": 1502402400000 }, "loading": { "$class": "org.digitalcmr.Loading", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 43.1927, "longitude": 23.3249 }, "actualDate": 1502488800000 }, "delivery": { "$class": "org.digitalcmr.Delivery", "address": { "$class": "org.digitalcmr.Address", "name": "Rob el Caro", "street": "De straat", "houseNumber": "302", "city": "Almere", "zipCode": "6736AE", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623 }, "actualDate": 1502834400000 }, "owner": "leaseplan", "source": "amsterdamcompound", "transporter": "harry@koopman.org", "carrier": "koopman", "recipientOrg": "cardealer", "recipient": "rob@cardealer.org", "issueDate": 0, "issuedBy": "koopman", "carrierComments": "", "documents": [ "doc1" ], "goods": [ { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "2131231414CN", "manufacturer": "BMW", "model": "X5", "type": "sportsback", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "O291RX" }, "description": "vehicle", "weight": 1900, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000 } ], "legalOwnerInstructions": "string", "paymentInstructions": "string", "payOnDelivery": "string" }
      ]
      """

  Scenario: Harry can read all of his ECMRs
    When I use the identity Harry
    Then I should have the following assets of type org.digitalcmr.ECMR
      """
      {"$class": "org.digitalcmr.ECMR", "ecmrID": "A1234567890", "status": "LOADED", "agreementTerms": "agreement terms here", "agreementTermsSec": "agreement terms sec", "legalOwnerRef": "ASD213123S", "carrierRef": "H2238723VASD", "recipientRef": "SDADHGA21312312", "orderID": "AAAA123456", "creation": { "$class": "org.digitalcmr.Creation", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555 }, "date": 1502402400000 }, "loading": { "$class": "org.digitalcmr.Loading", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 43.1927, "longitude": 23.3249 }, "actualDate": 1502488800000 }, "delivery": { "$class": "org.digitalcmr.Delivery", "address": { "$class": "org.digitalcmr.Address", "name": "Rob el Caro", "street": "De straat", "houseNumber": "302", "city": "Almere", "zipCode": "6736AE", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623 }, "actualDate": 1502834400000 }, "owner": "leaseplan", "source": "amsterdamcompound", "transporter": "harry@koopman.org", "carrier": "koopman", "recipientOrg": "cardealer", "recipient": "rob@cardealer.org", "issueDate": 0, "issuedBy": "koopman", "carrierComments": "", "documents": [ "doc1" ], "goods": [ { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "2131231414CN", "manufacturer": "BMW", "model": "X5", "type": "sportsback", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "O291RX" }, "description": "vehicle", "weight": 1900, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000 } ], "legalOwnerInstructions": "string", "paymentInstructions": "string", "payOnDelivery": "string" }
      """

  Scenario: Harry cannot read ecmrs that have status created
    When I use the identity Harry
    Then I should not have the following assets of type org.digitalcmr.ECMR
      """
      {"$class": "org.digitalcmr.ECMR", "ecmrID": "C1234567890", "status": "CREATED", "agreementTerms": "agreement terms here", "agreementTermsSec": "agreement terms sec", "legalOwnerRef": "ASD213123S", "carrierRef": "H2238723VASD", "recipientRef": "SDADHGA21312312", "orderID": "CCAA123456", "creation": { "$class": "org.digitalcmr.Creation", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555 }, "date": 1502402400000 }, "loading": { "$class": "org.digitalcmr.Loading", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 43.1927, "longitude": 23.3249 }, "actualDate": 1502488800000 }, "delivery": { "$class": "org.digitalcmr.Delivery", "address": { "$class": "org.digitalcmr.Address", "name": "Rob el Caro", "street": "De straat", "houseNumber": "302", "city": "Almere", "zipCode": "6736AE", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623 }, "actualDate": 1502834400000 }, "owner": "leaseplan", "source": "amsterdamcompound", "transporter": "harry@koopman.org", "carrier": "koopman", "recipientOrg": "cardealer", "recipient": "rob@cardealer.org", "issueDate": 0, "issuedBy": "koopman", "carrierComments": "", "documents": [ "doc1" ], "goods": [ { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "2131231414CN", "manufacturer": "BMW", "model": "X5", "type": "sportsback", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "O291RX" }, "description": "vehicle", "weight": 1900, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000 } ], "legalOwnerInstructions": "string", "paymentInstructions": "string", "payOnDelivery": "string" }
      """

  Scenario: Harry cannot read ecmrs where he isn't the owner
    When I use the identity Harry
    Then I should not have the following assets of type org.digitalcmr.ECMR
      """
      {"$class": "org.digitalcmr.ECMR", "ecmrID": "B1234567890", "status": "LOADED", "agreementTerms": "agreement terms here", "agreementTermsSec": "agreement terms sec", "legalOwnerRef": "ASD213123S", "carrierRef": "H2238723VASD", "recipientRef": "SDADHGA21312312", "orderID": "BB123456", "creation": { "$class": "org.digitalcmr.Creation", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555 }, "date": 1502402400000 }, "loading": { "$class": "org.digitalcmr.Loading", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 43.1927, "longitude": 23.3249 }, "actualDate": 1502488800000 }, "delivery": { "$class": "org.digitalcmr.Delivery", "address": { "$class": "org.digitalcmr.Address", "name": "Rob el Caro", "street": "De straat", "houseNumber": "302", "city": "Almere", "zipCode": "6736AE", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623 }, "actualDate": 1502834400000 }, "owner": "notleaseplan", "source": "notamsterdamcompound", "transporter": "harry@koopman.org", "carrier": "notkoopman", "recipientOrg": "notcardealer", "recipient": "rob@cardealer.org", "issueDate": 0, "issuedBy": "koopman", "carrierComments": "", "documents": [ "doc1" ], "goods": [ { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "2131231414CN", "manufacturer": "BMW", "model": "X5", "type": "sportsback", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "O291RX" }, "description": "vehicle", "weight": 1900, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000 } ], "legalOwnerInstructions": "string", "paymentInstructions": "string", "payOnDelivery": "string" }
      """

  Scenario: Harry should not be able to add an ECMR
    When I use the identity Harry
    And I add the following asset of type org.digitalcmr.ECMR
      """
       {"$class": "org.digitalcmr.ECMR", "ecmrID": "D1234567890", "status": "LOADED", "agreementTerms": "agreement terms here", "agreementTermsSec": "agreement terms sec", "legalOwnerRef": "ASD213123S", "carrierRef": "H2238723VASD", "recipientRef": "SDADHGA21312312", "orderID": "AAAA123456", "creation": { "$class": "org.digitalcmr.Creation", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555 }, "date": 1502402400000 }, "loading": { "$class": "org.digitalcmr.Loading", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 43.1927, "longitude": 23.3249 }, "actualDate": 1502488800000 }, "delivery": { "$class": "org.digitalcmr.Delivery", "address": { "$class": "org.digitalcmr.Address", "name": "Rob el Caro", "street": "De straat", "houseNumber": "302", "city": "Almere", "zipCode": "6736AE", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623 }, "actualDate": 1502834400000 }, "owner": "leaseplan", "source": "amsterdamcompound", "transporter": "harry@koopman.org", "carrier": "koopman", "recipientOrg": "cardealer", "recipient": "rob@cardealer.org", "issueDate": 0, "issuedBy": "koopman", "carrierComments": "", "documents": [ "doc1" ], "goods": [ { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "2131231414CN", "manufacturer": "BMW", "model": "X5", "type": "sportsback", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "O291RX" }, "description": "vehicle", "weight": 1900, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000 } ], "legalOwnerInstructions": "string", "paymentInstructions": "string", "payOnDelivery": "string" }
      """
    Then I should get an error matching /does not have .* access to resource/

  Scenario: Harry should be able to update an ECMR
    When I use the identity Harry
    Given I should have the following assets of type org.digitalcmr.ECMR
        """
          {"$class": "org.digitalcmr.ECMR", "ecmrID": "A1234567890", "status": "LOADED", "agreementTerms": "agreement terms here", "agreementTermsSec": "agreement terms sec", "legalOwnerRef": "ASD213123S", "carrierRef": "H2238723VASD", "recipientRef": "SDADHGA21312312", "orderID": "AAAA123456", "creation": { "$class": "org.digitalcmr.Creation", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555 }, "date": 1502402400000 }, "loading": { "$class": "org.digitalcmr.Loading", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 43.1927, "longitude": 23.3249 }, "actualDate": 1502488800000 }, "delivery": { "$class": "org.digitalcmr.Delivery", "address": { "$class": "org.digitalcmr.Address", "name": "Rob el Caro", "street": "De straat", "houseNumber": "302", "city": "Almere", "zipCode": "6736AE", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623 }, "actualDate": 1502834400000 }, "owner": "leaseplan", "source": "amsterdamcompound", "transporter": "harry@koopman.org", "carrier": "koopman", "recipientOrg": "cardealer", "recipient": "rob@cardealer.org", "issueDate": 0, "issuedBy": "koopman", "carrierComments": "", "documents": [ "doc1" ], "goods": [ { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "2131231414CN", "manufacturer": "BMW", "model": "X5", "type": "sportsback", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "O291RX" }, "description": "vehicle", "weight": 1900, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000 } ], "legalOwnerInstructions": "string", "paymentInstructions": "string", "payOnDelivery": "string" }
        """
    When I update the following asset
        """
          {"$class": "org.digitalcmr.ECMR", "ecmrID": "A1234567890", "status": "IN_TRANSIT", "agreementTerms": "agreement terms here", "agreementTermsSec": "agreement terms sec", "legalOwnerRef": "ASD213123S", "carrierRef": "H2238723VASD", "recipientRef": "SDADHGA21312312", "orderID": "AAAA123456", "creation": { "$class": "org.digitalcmr.Creation", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555 }, "date": 1502402400000 }, "loading": { "$class": "org.digitalcmr.Loading", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 43.1927, "longitude": 23.3249 }, "actualDate": 1502488800000 }, "delivery": { "$class": "org.digitalcmr.Delivery", "address": { "$class": "org.digitalcmr.Address", "name": "Rob el Caro", "street": "De straat", "houseNumber": "302", "city": "Almere", "zipCode": "6736AE", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623 }, "actualDate": 1502834400000 }, "owner": "leaseplan", "source": "amsterdamcompound", "transporter": "harry@koopman.org", "carrier": "koopman", "recipientOrg": "cardealer", "recipient": "rob@cardealer.org", "issueDate": 0, "issuedBy": "koopman", "carrierComments": "", "documents": [ "doc1" ], "goods": [ { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "2131231414CN", "manufacturer": "BMW", "model": "X5", "type": "sportsback", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "O291RX" }, "description": "vehicle", "weight": 1900, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000 } ], "legalOwnerInstructions": "string", "paymentInstructions": "string", "payOnDelivery": "string" }
        """
    Then I should have the following asset
        """
         {"$class": "org.digitalcmr.ECMR", "ecmrID": "A1234567890", "status": "IN_TRANSIT", "agreementTerms": "agreement terms here", "agreementTermsSec": "agreement terms sec", "legalOwnerRef": "ASD213123S", "carrierRef": "H2238723VASD", "recipientRef": "SDADHGA21312312", "orderID": "AAAA123456", "creation": { "$class": "org.digitalcmr.Creation", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555 }, "date": 1502402400000 }, "loading": { "$class": "org.digitalcmr.Loading", "address": { "$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "Compoundstraat", "houseNumber": "21", "city": "Assen", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 43.1927, "longitude": 23.3249 }, "actualDate": 1502488800000 }, "delivery": { "$class": "org.digitalcmr.Delivery", "address": { "$class": "org.digitalcmr.Address", "name": "Rob el Caro", "street": "De straat", "houseNumber": "302", "city": "Almere", "zipCode": "6736AE", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623 }, "actualDate": 1502834400000 }, "owner": "leaseplan", "source": "amsterdamcompound", "transporter": "harry@koopman.org", "carrier": "koopman", "recipientOrg": "cardealer", "recipient": "rob@cardealer.org", "issueDate": 0, "issuedBy": "koopman", "carrierComments": "", "documents": [ "doc1" ], "goods": [ { "$class": "org.digitalcmr.Good", "vehicle": { "$class": "org.digitalcmr.Vehicle", "vin": "2131231414CN", "manufacturer": "BMW", "model": "X5", "type": "sportsback", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "O291RX" }, "description": "vehicle", "weight": 1900, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000 } ], "legalOwnerInstructions": "string", "paymentInstructions": "string", "payOnDelivery": "string" }
        """
