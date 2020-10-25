## Assumption

1. Add EventName which defined with a string data type, Location using LocationID in the table of Event
2. Add LocationName which defined with a string data type, Event using EventID in the table of Location
3. More than one event will appear indicated by the presence of a '-' sign in the table of location
4. Schedule is divided into StartDate and EventDate in the table of event 
5. Add Tickets for each event are on the table of ticket
6. Each Ticket uses EventID to indicate the ticket is a ticket for an Event
7. Each Ticket also has a ticketID, ticket type, ticket price, and ticket quota
8. Ticket Type is defined by the string data type
9. Each transaction has its own data stored in the table of Transaction
10. Each Transaction has transactionID data in the form of random binary using the UUID() function, CustomerID for customer information, TicketID for the type of ticket purchased, EventID for ticket at what event was purchased, and TicQuantity for the number of tickets purchased
11. Each transaction also has an ID as the primary key
12. Customer also have their respective data stored in the table of Customer which contains the customerID and customerName
13. Customer can purchase more than 1 ticket type, and more than 1 qty per ticket type defined using multiple arrays
14. The number of tickets when the transaction is defined with the TicQuantity
15. The ticket quota will be reduced according to the number of tickets purchased at the time of transaction
16. **INSERT** and **UPDATE** value stored in procedure in the Database


## Data Example

1. **Event** (Add)

```javascript
{
    "EventName": "YourEvent",
    "StartDate": "YYYY-MM-DD",
    "EndDate": "YYYY-MM-DD",
    "LocationID": 1 /*ID of Location*/
}
```

2. **Event** (Update)

```javascript
{
    "EventID": 1, /*ID of Event*/
    "EventName": "YourEvent",
    "StartDate": "YYYY-MM-DD",
    "EndDate": "YYYY-MM-DD",
    "LocationID": 1 /*ID of Location*/
}
```

3. **Location** (Add)

```javascript
{
    "LocationName": "YourLocation",
    "EventID": 1 /*ID of Event*/
}
```

4. **Location** (Update)

```javascript
{
    "LocationID": 1, /*ID of Location*/
    "LocationName": "YourLocation",
    "EventID": 1 /*ID of Event*/
}
```

5. **Ticket** (Add)

```javascript
{
    "TicketQuota": 1, /*Number of Ticket*/
    "TicketPrice": 100000, /*Price of Ticket*/
    "EventID": 1, /*ID of Event*/
    "TicketType": "TypeofTicket"
}
```

6. **Ticket** (Update)

```javascript
{
    "TicketID": 1, /*ID of Ticket*/
    "TicketQuota": 1, /*Number of Ticket*/
    "TicketPrice": 100000, /*Price of Ticket*/
    "EventID": 1, /*ID of Event*/
    "TicketType": "TypeofTicket"
}
```

7. **Customer** (Add)

```javascript
{
    "CustomerName": "YourCustomerName"
}
```

8. **Customer** (Update)

```javascript
{
    "CustomerID": 1, /*ID of Customer*/
    "CustomerName": "YourCustomerName"
}
```

9. **Transaction** (buy 1 Ticket Type)

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

10. **Transaction** (buy more than 1 Ticket Type)

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