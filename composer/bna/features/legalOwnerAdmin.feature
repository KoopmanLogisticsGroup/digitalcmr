#
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
    And I have added the following participants of type org.digitalcmr.LegalOwnerAdmin
        """
        {"$class":"org.digitalcmr.LegalOwnerAdmin","userID":"lapo@leaseplan.org","userName": "lapo", "firstName":"lapo","lastName":"kelkann","address":{"$class":"org.digitalcmr.Address","name":"lapo kelkann","street":"leesenstraat","houseNumber":"20","city":"Utrecht","zipCode":"9867RF","country":"Netherlands", "latitude":"31231231.1231", "longitude":"31231231.1231", "id":"id"},"org":"LegalOwnerOrg"}
        """
    And I have issued the participant org.digitalcmr.LegalOwnerAdmin#lapo@leaseplan.org with the identity Lapo
    And I have added the following assets of type org.digitalcmr.TransportOrder
      """
      [
      {"$class":"org.digitalcmr.TransportOrder", "orderID":"AAA123143", "status": "OPEN", "loading": {"$class": "org.digitalcmr.Loading", "address": {"$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "compenstraat", "houseNumber": "21", "city": "Amsterdam", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555}, "actualDate": 1502402400000}, "delivery": {"$class": "org.digitalcmr.Delivery", "address": {"$class": "org.digitalcmr.Address", "name": "Rob Carman", "street": "autostraat", "houseNumber": "12", "city": "Rotterdam", "zipCode": "9442KO", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623}, "actualDate": 1502488800000}, "owner": "LegalOwnerOrg", "source": "amsterdamcompound", "carrier": "koopman", "issueDate":0, "orderRef": "ABC213321BCA", "goods":[{"$class":"org.digitalcmr.Good", "vehicle": {"$class": "org.digitalcmr.Vehicle", "vin": "736182CHD28172", "manufacturer": "Mercedes", "model": "SLK", "type": "Station", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "I827YE"}, "description": "vehicle", "weight": 1800, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000}], "ecmrs": []},
      {"$class":"org.digitalcmr.TransportOrder", "orderID":"ABCDEF231", "status": "OPEN", "loading": {"$class": "org.digitalcmr.Loading", "address": {"$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "compenstraat", "houseNumber": "21", "city": "Amsterdam", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555}, "actualDate": 1502402400000}, "delivery": {"$class": "org.digitalcmr.Delivery", "address": {"$class": "org.digitalcmr.Address", "name": "Rob Carman", "street": "autostraat", "houseNumber": "12", "city": "Rotterdam", "zipCode": "9442KO", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623}, "actualDate": 1502488800000}, "owner": "notLegalOwnerOrg", "source": "amsterdamcompound", "carrier": "koopman", "issueDate":0, "orderRef": "ABC213321BCA", "goods":[{"$class":"org.digitalcmr.Good", "vehicle": {"$class": "org.digitalcmr.Vehicle", "vin": "736182CHD28172", "manufacturer": "Mercedes", "model": "SLK", "type": "Station", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "I827YE"}, "description": "vehicle", "weight": 1800, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000}], "ecmrs": []}
      ]
      """

  Scenario: Lapo can read all his TransportOrders
    When I use the identity Lapo
    Then I should have the following asset of type org.digitalcmr.TransportOrder
        """
          {"$class":"org.digitalcmr.TransportOrder", "orderID":"AAA123143", "status": "OPEN", "loading": {"$class": "org.digitalcmr.Loading", "address": {"$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "compenstraat", "houseNumber": "21", "city": "Amsterdam", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555}, "actualDate": 1502402400000}, "delivery": {"$class": "org.digitalcmr.Delivery", "address": {"$class": "org.digitalcmr.Address", "name": "Rob Carman", "street": "autostraat", "houseNumber": "12", "city": "Rotterdam", "zipCode": "9442KO", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623}, "actualDate": 1502488800000}, "owner": "LegalOwnerOrg", "source": "amsterdamcompound", "carrier": "koopman", "issueDate":0, "orderRef": "ABC213321BCA", "goods":[{"$class":"org.digitalcmr.Good", "vehicle": {"$class": "org.digitalcmr.Vehicle", "vin": "736182CHD28172", "manufacturer": "Mercedes", "model": "SLK", "type": "Station", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "I827YE"}, "description": "vehicle", "weight": 1800, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000}], "ecmrs": []}
        """

  Scenario: Lapo cannot read other TransportOrders
    When I use the identity Lapo
    Then I should not have the following asset of type org.digitalcmr.TransportOrder
        """
          {"$class":"org.digitalcmr.TransportOrder", "orderID":"ABCDEF231", "status": "OPEN", "loading": {"$class": "org.digitalcmr.Loading", "address": {"$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "compenstraat", "houseNumber": "21", "city": "Amsterdam", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555}, "actualDate": 1502402400000}, "delivery": {"$class": "org.digitalcmr.Delivery", "address": {"$class": "org.digitalcmr.Address", "name": "Rob Carman", "street": "autostraat", "houseNumber": "12", "city": "Rotterdam", "zipCode": "9442KO", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623}, "actualDate": 1502488800000}, "owner": "james@legalowner.org", "source": "amsterdamcompound", "carrier": "koopman", "issueDate":0, "orderRef": "ABC213321BCA", "goods":[{"$class":"org.digitalcmr.Good", "vehicle": {"$class": "org.digitalcmr.Vehicle", "vin": "736182CHD28172", "manufacturer": "Mercedes", "model": "SLK", "type": "Station", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "I827YE"}, "description": "vehicle", "weight": 1800, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000}], "ecmrs": []}
        """

  Scenario: given I have added the following asset of type TransportOrder
    Given I have added the following asset of type org.digitalcmr.TransportOrder
        """
          {"$class":"org.digitalcmr.TransportOrder", "orderID":"ABCD2131221313", "status": "OPEN", "loading": {"$class": "org.digitalcmr.Loading", "address": {"$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "compenstraat", "houseNumber": "21", "city": "Amsterdam", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555}, "actualDate": 1502402400000}, "delivery": {"$class": "org.digitalcmr.Delivery", "address": {"$class": "org.digitalcmr.Address", "name": "Rob Carman", "street": "autostraat", "houseNumber": "12", "city": "Rotterdam", "zipCode": "9442KO", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623}, "actualDate": 1502488800000}, "owner": "LegalOwnerOrg", "source": "amsterdamcompound", "carrier": "koopman", "issueDate":0, "orderRef": "ABC213321BCA", "goods":[{"$class":"org.digitalcmr.Good", "vehicle": {"$class": "org.digitalcmr.Vehicle", "vin": "736182CHD28172", "manufacturer": "Mercedes", "model": "SLK", "type": "Station", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "I827YE"}, "description": "vehicle", "weight": 1800, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000}], "ecmrs": []}
        """
    Then I should have the following asset of type org.digitalcmr.TransportOrder
        """
        [
          {"$class":"org.digitalcmr.TransportOrder", "orderID":"ABCD2131221313", "status": "OPEN", "loading": {"$class": "org.digitalcmr.Loading", "address": {"$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "compenstraat", "houseNumber": "21", "city": "Amsterdam", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555}, "actualDate": 1502402400000}, "delivery": {"$class": "org.digitalcmr.Delivery", "address": {"$class": "org.digitalcmr.Address", "name": "Rob Carman", "street": "autostraat", "houseNumber": "12", "city": "Rotterdam", "zipCode": "9442KO", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623}, "actualDate": 1502488800000}, "owner": "LegalOwnerOrg", "source": "amsterdamcompound", "carrier": "koopman", "issueDate":0, "orderRef": "ABC213321BCA", "goods":[{"$class":"org.digitalcmr.Good", "vehicle": {"$class": "org.digitalcmr.Vehicle", "vin": "736182CHD28172", "manufacturer": "Mercedes", "model": "SLK", "type": "Station", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "I827YE"}, "description": "vehicle", "weight": 1800, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000}], "ecmrs": []}
        ]
        """

  Scenario: when I update the following asset of type TransportOrder to completed
    Given I have added the following asset of type org.digitalcmr.TransportOrder
      """
      {"$class":"org.digitalcmr.TransportOrder", "orderID":"ABCD2131221313", "status": "OPEN", "loading": {"$class": "org.digitalcmr.Loading", "address": {"$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "compenstraat", "houseNumber": "21", "city": "Amsterdam", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555}, "actualDate": 1502402400000}, "delivery": {"$class": "org.digitalcmr.Delivery", "address": {"$class": "org.digitalcmr.Address", "name": "Rob Carman", "street": "autostraat", "houseNumber": "12", "city": "Rotterdam", "zipCode": "9442KO", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623}, "actualDate": 1502488800000}, "owner": "LegalOwnerOrg", "source": "amsterdamcompound", "carrier": "koopman", "issueDate":0, "orderRef": "ABC213321BCA", "goods":[{"$class":"org.digitalcmr.Good", "vehicle": {"$class": "org.digitalcmr.Vehicle", "vin": "736182CHD28172", "manufacturer": "Mercedes", "model": "SLK", "type": "Station", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "I827YE"}, "description": "vehicle", "weight": 1800, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000}], "ecmrs": []}
      """
    When I update the following asset of type org.digitalcmr.TransportOrder
      """
      {"$class":"org.digitalcmr.TransportOrder", "orderID":"ABCD2131221313", "status": "COMPLETED", "loading": {"$class": "org.digitalcmr.Loading", "address": {"$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "compenstraat", "houseNumber": "21", "city": "Amsterdam", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555}, "actualDate": 1502402400000}, "delivery": {"$class": "org.digitalcmr.Delivery", "address": {"$class": "org.digitalcmr.Address", "name": "Rob Carman", "street": "autostraat", "houseNumber": "12", "city": "Rotterdam", "zipCode": "9442KO", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623}, "actualDate": 1502488800000}, "owner": "LegalOwnerOrg", "source": "amsterdamcompound", "carrier": "koopman", "issueDate":0, "orderRef": "ABC213321BCA", "goods":[{"$class":"org.digitalcmr.Good", "vehicle": {"$class": "org.digitalcmr.Vehicle", "vin": "736182CHD28172", "manufacturer": "Mercedes", "model": "SLK", "type": "Station", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "I827YE"}, "description": "vehicle", "weight": 1800, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000}], "ecmrs": []}
      """
    Then I should have the following asset of type org.digitalcmr.TransportOrder
      """
      {"$class":"org.digitalcmr.TransportOrder", "orderID":"ABCD2131221313", "status": "COMPLETED", "loading": {"$class": "org.digitalcmr.Loading", "address": {"$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "compenstraat", "houseNumber": "21", "city": "Amsterdam", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555}, "actualDate": 1502402400000}, "delivery": {"$class": "org.digitalcmr.Delivery", "address": {"$class": "org.digitalcmr.Address", "name": "Rob Carman", "street": "autostraat", "houseNumber": "12", "city": "Rotterdam", "zipCode": "9442KO", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623}, "actualDate": 1502488800000}, "owner": "LegalOwnerOrg", "source": "amsterdamcompound", "carrier": "koopman", "issueDate":0, "orderRef": "ABC213321BCA", "goods":[{"$class":"org.digitalcmr.Good", "vehicle": {"$class": "org.digitalcmr.Vehicle", "vin": "736182CHD28172", "manufacturer": "Mercedes", "model": "SLK", "type": "Station", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "I827YE"}, "description": "vehicle", "weight": 1800, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000}], "ecmrs": []}
      """
    
  Scenario: I should get an error when I try to add a duplicate asset of type TransportOrder
    Given I have added the following asset of type org.digitalcmr.TransportOrder
      """
      {"$class":"org.digitalcmr.TransportOrder", "orderID":"ABCD2131221313", "status": "OPEN", "loading": {"$class": "org.digitalcmr.Loading", "address": {"$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "compenstraat", "houseNumber": "21", "city": "Amsterdam", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555}, "actualDate": 1502402400000}, "delivery": {"$class": "org.digitalcmr.Delivery", "address": {"$class": "org.digitalcmr.Address", "name": "Rob Carman", "street": "autostraat", "houseNumber": "12", "city": "Rotterdam", "zipCode": "9442KO", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623}, "actualDate": 1502488800000}, "owner": "LegalOwnerOrg", "source": "amsterdamcompound", "carrier": "koopman", "issueDate":0, "orderRef": "ABC213321BCA", "goods":[{"$class":"org.digitalcmr.Good", "vehicle": {"$class": "org.digitalcmr.Vehicle", "vin": "736182CHD28172", "manufacturer": "Mercedes", "model": "SLK", "type": "Station", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "I827YE"}, "description": "vehicle", "weight": 1800, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000}], "ecmrs": []}
      """
    When I add the following asset of type org.digitalcmr.TransportOrder
      """
      {"$class":"org.digitalcmr.TransportOrder", "orderID":"ABCD2131221313", "status": "OPEN", "loading": {"$class": "org.digitalcmr.Loading", "address": {"$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "compenstraat", "houseNumber": "21", "city": "Amsterdam", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555}, "actualDate": 1502402400000}, "delivery": {"$class": "org.digitalcmr.Delivery", "address": {"$class": "org.digitalcmr.Address", "name": "Rob Carman", "street": "autostraat", "houseNumber": "12", "city": "Rotterdam", "zipCode": "9442KO", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623}, "actualDate": 1502488800000}, "owner": "LegalOwnerOrg", "source": "amsterdamcompound", "carrier": "koopman", "issueDate":0, "orderRef": "ABC213321BCA", "goods":[{"$class":"org.digitalcmr.Good", "vehicle": {"$class": "org.digitalcmr.Vehicle", "vin": "736182CHD28172", "manufacturer": "Mercedes", "model": "SLK", "type": "Station", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "I827YE"}, "description": "vehicle", "weight": 1800, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000}], "ecmrs": []}
      """
    Then I should get an error

  Scenario: I should get an error when I try to update a non-existent asset of type TransportOrder
    When I update the following asset of type org.digitalcmr.TransportOrder
      """
      {"$class":"org.digitalcmr.TransportOrder", "orderID":"ABCD2131221313", "status": "COMPLETED", "loading": {"$class": "org.digitalcmr.Loading", "address": {"$class": "org.digitalcmr.Address", "name": "Amsterdam Compound", "street": "compenstraat", "houseNumber": "21", "city": "Amsterdam", "zipCode": "9976ZH", "country": "Netherlands", "latitude": 52.377698, "longitude": 4.896555}, "actualDate": 1502402400000}, "delivery": {"$class": "org.digitalcmr.Delivery", "address": {"$class": "org.digitalcmr.Address", "name": "Rob Carman", "street": "autostraat", "houseNumber": "12", "city": "Rotterdam", "zipCode": "9442KO", "country": "Netherlands", "latitude": 51.917153, "longitude": 4.474623}, "actualDate": 1502488800000}, "owner": "LegalOwnerOrg", "source": "amsterdamcompound", "carrier": "koopman", "issueDate":0, "orderRef": "ABC213321BCA", "goods":[{"$class":"org.digitalcmr.Good", "vehicle": {"$class": "org.digitalcmr.Vehicle", "vin": "736182CHD28172", "manufacturer": "Mercedes", "model": "SLK", "type": "Station", "ecmrs": [], "odoMeterReading": 0, "plateNumber": "I827YE"}, "description": "vehicle", "weight": 1800, "loadingStartDate": 1502834400000, "loadingEndDate": 1502834400000, "deliveryStartDate": 1502834400000, "deliveryEndDate": 1502834400000}], "ecmrs": []}
      """
    Then I should get an error
