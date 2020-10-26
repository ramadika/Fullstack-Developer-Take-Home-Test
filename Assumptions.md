# Assumption


## Environment

* Event Name that was post from the Client Side in the form of a string data type
* The Schedule is divided into Start Date and End Date in **"YYYY-MM-DD"** format
* The Location selected for the event in the form of an ID
* Location name that was post from the client side in the form of a string data type
* Events selected for at a location only send IDs in the form of a string data type
* Locations that have events that have more than one event are sent with the format shown in the Data Example [here](https://github.com/ramadika/Fullstack-Developer-Take-Home-Test/blob/master/Assumptions.md#Data-Example)
* If there is an additional event in a location, the Client Side can send the Event ID of the event in a format like Data Example [here](https://github.com/ramadika/Fullstack-Developer-Take-Home-Test/blob/master/Assumptions.md#Data-Example)
* Each ticket for an event created has information about the quota and price in the form an Integer data type, an event that has that ticket sent in the form of the ID of the event. The type of ticket is sent as a string data type
* Each type of ticket for an event is sent as many as the number of ticket types desired
* The customer has been registered beforehand so that when making a transaction it is sufficient only to use the ID of the customer containing the customer data
* Customers can make multiple transactions by only selecting 1 event per transaction 
* When making a transaction the customer can buy more than 1 type of ticket and the quantity per ticket type
* Examples of data formats when when making transactions can be seen in Data Example [here](https://github.com/ramadika/Fullstack-Developer-Take-Home-Test/blob/master/Assumptions.md#Data-Example)
* Other Info [here](https://github.com/ramadika/Fullstack-Developer-Take-Home-Test/blob/master/Assumptions.md#Other-Info)
* The number of characters used is sufficient to meet the desired needs
* Only input text or number that has character length validation
* Inputs that have validation include :
    * Event Name
    * Location Name
    * Ticket Quota
    * Ticket Price
    * Ticket Type
    * Ticket ID (Table of Transaction)
    * Ticket Quantity 




## Data-Example

* **Event** (Add)

```javascript
{
    "EventName": "YourEvent",
    "StartDate": "YYYY-MM-DD",
    "EndDate": "YYYY-MM-DD",
    "LocationID": 1 /*ID of Location*/
}
```

* **Event** (Update)

```javascript
{
    "EventID": 1, /*ID of Event*/
    "EventName": "YourEvent",
    "StartDate": "YYYY-MM-DD",
    "EndDate": "YYYY-MM-DD",
    "LocationID": 1 /*ID of Location*/
}
```

* **Location** (Add - 1 Event)

```javascript
{
    "LocationName": "YourLocation",
    "EventID": "1" /*ID of Event*/
}
```

* **Location** (Add - More than 1 event)

```javascript
{
    "LocationName": "YourLocation",
    "EventID": "1-2" /*ID of Event*/
}
```

* **Location** (Update - 1 Event)

```javascript
{
    "LocationID": 1, /*ID of Location*/
    "LocationName": "YourLocation",
    "EventID": "1" /*ID of Event*/
}
```

* **Ticket** (Add)

```javascript
{
    "TicketQuota": 1, /*Number of Ticket*/
    "TicketPrice": 100000, /*Price of Ticket*/
    "EventID": 1, /*ID of Event*/
    "TicketType": "TypeofTicket"
}
```

* **Ticket** (Update)

```javascript
{
    "TicketID": 1, /*ID of Ticket*/
    "TicketQuota": 1, /*Number of Ticket*/
    "TicketPrice": 100000, /*Price of Ticket*/
    "EventID": 1, /*ID of Event*/
    "TicketType": "TypeofTicket"
}
```

* **Customer** (Add)

```javascript
{
    "CustomerName": "YourCustomerName"
}
```

* **Customer** (Update)

```javascript
{
    "CustomerID": 1, /*ID of Customer*/
    "CustomerName": "YourCustomerName"
}
```

* **Transaction** (buy 1 Ticket Type)

```javascript
{
	"CustomerID": 2, /*ID of Customer*/
	"Ticket":{
		"TicketID": 3, /*ID of Ticket*/
		"TicQuantity": 1 /*Number of Tickets Purchased*/
	},
	"EventID": 4 /*ID of Event*/
}
```

* **Transaction** (buy more than 1 Ticket Type)

```javascript
{
	"CustomerID": 2, /*ID of Customer*/
	"Ticket":[{
		"TicketID": 3, /*ID of Ticket*/
		"TicQuantity": 1 /*Number of Tickets Purchased*/
	},
	{
		"TicketID": 2, /*ID of Ticket*/
		"TicQuantity": 3 /*Number of Tickets Purchased*/
	}],
	"EventID": 4 /*ID of Event*/
}
```





## Other-Info

* Add EventName which defined with a string data type, Location using LocationID in the table of Event
* Add LocationName which defined with a string data type, Event using EventID in the table of Location
* More than one event will appear indicated by the presence of a '-' sign in the table of location
* Schedule is divided into StartDate and EventDate in the table of event 
* Add Tickets for each event are on the table of ticket
* Each Ticket uses EventID to indicate the ticket is a ticket for an Event
* Each Ticket also has a ticketID, ticket type, ticket price, and ticket quota
* Ticket Type is defined by the string data type
* Each transaction has its own data stored in the table of Transaction
* Tickets that have a quota of less than 1 cannot make transactions
* Each Transaction has transactionID data in the form of random binary using the UUID() function, CustomerID for customer information, TicketID for the type of ticket purchased, EventID for ticket at what event was purchased, and TicQuantity for the number of tickets purchased
* Each transaction also has an ID as the primary key
* Customer also have their respective data stored in the table of Customer which contains the customerID and customerName
* Customer can purchase more than 1 ticket type, and more than 1 qty per ticket type defined using multiple arrays
* The number of tickets when the transaction is defined with the TicQuantity
* The ticket quota will be reduced according to the number of tickets purchased at the time of transaction
* From the server side there is a warning if the input exceeds the maximum number of characters
* **INSERT** and **UPDATE** value stored in procedure in the Database