const mysql = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');
var app = express();

app.use(bodyparser.json());

var mysqlconnection = mysql.createConnection({
    host:'127.0.0.1',
    user:'root',
    password:'',
    database:'ReservationDB',
    multipleStatements :true
});

mysqlconnection.connect((err)=>{
    if(!err)
        console.log('DB Connection Succeded');
    else   
        console.log('DB Connection failed \n Error : ' + JSON.stringify(err,undefined,2));
});

app.listen(3000,()=>console.log('Express Server is running at port: 3000'));

// Create New Event 
app.post('/event/create',(req,res)=>{
    let evn = req.body;
    var sql = "SET @EventID = ?;SET @EventName = ?;SET @StartDate = ?;SET @EndDate = ?;SET @LocationID = ?; \
    CALL EventAdd(@EventID, @EventName, @StartDate, @EndDate, @LocationID);" ;
    mysqlconnection.query(sql,[evn.EventID, evn.EventName, evn.StartDate, evn.EndDate, evn.LocationID],(err,rows,field)=>{
        if(!err)
            rows.forEach(element => {
                if(element.constructor == Array)
                    res.send('Created Event ID : ' + element[0].EventID);
            });
        else
            console.log(err);
    })
})

// Create New Location
app.post('/location/create',(req,res)=>{
    let loc = req.body;
    var sql = "SET @LocationID = ?;SET @LocationName = ?;SET @EventID = ?; \
    CALL LocationAdd(@LocationID, @LocationName, @EventID);" ;
    mysqlconnection.query(sql,[loc.LocationID, loc.LocationName, loc.EventID],(err,rows,field)=>{
        if(!err)
            rows.forEach(element => {
                if(element.constructor == Array)
                    res.send('Created Location ID : ' + element[0].LocationID);
            });
        else
            console.log(err);
    })
})

// Create New Ticket Type on Specific Event 
app.post('/event/ticket/create',(req,res)=>{
    let tic = req.body;
    var sql = "SET @TicketID = ?;SET @TicketQuota = ?;SET @TicketPrice = ?;SET @EventID = ?;SET @TicketType = ?; \
    CALL TicketAdd(@TicketID, @TicketQuota, @TicketPrice, @EventID, @TicketType);" ;
    mysqlconnection.query(sql,[tic.TicketID, tic.TicketQuota, tic.TicketPrice, tic.EventID, tic.TicketType],(err,rows,field)=>{
        if(!err) 
            rows.forEach(element => {
                if(element.constructor == Array)
                    res.send('Created Ticket ID : ' + element[0].TicketID + ' on Event ID : ' + element[0].EventID);
            });
        else
            console.log(err);
    })
})


// Get Event Information
app.get('/event/get_info',(req,res)=>{
    mysqlconnection.query('SELECT a.EventName, a.StartDate, a.EndDate, b.LocationName, c.TicketType, c.TicketQuota, c.TicketPrice \
    FROM event a  \
    LEFT JOIN location b ON a.LocationID = b.LocationID \
    LEFT JOIN ticket c ON a.EventID = c.EventID',(err,rows,field)=>{
        if(!err)
            res.send(rows)
        else
            console.log(err);
    })
})

// Create Customer Transaction Data 
app.post('/transaction/purchase',(req,res)=>{
    let trn = req.body; 
    var sql = "SET @TransactionID = ?;SET @CustomerID = ?;SET @TicketID = ?;SET @TicQuantity = ?;SET @EventID = ?; \
    CALL TransactionAdd(@TransactionID, @CustomerID, @TicketID, @TicQuantity, @EventID);" ;
    if(trn.Ticket.length > 0){
        for (var i=0;i < trn.Ticket.length;i++){
            mysqlconnection.query(sql,[trn.TransactionID, trn.CustomerID, trn.Ticket[i].TicketID, trn.Ticket[i].TicQuantity, trn.EventID],(err,rows,field)=>{
                if(!err)
                    res.send('Transaction Successfully');
                else
                    console.log(err);
            })
        }
    }else{
        mysqlconnection.query(sql,[trn.TransactionID, trn.CustomerID, trn.Ticket.TicketID, trn.Ticket.TicQuantity, trn.EventID],(err,rows,field)=>{
            if(!err)
                rows.forEach(element => {
                    if(element.constructor == Array)
                        res.send('Created Transaction ID : ' + element[0].TransactionID);
                });
            else
                console.log(err);
        })
    }
})

// Get Transaction Information
app.get('/transaction/get_info',(req,res)=>{
    mysqlconnection.query('SELECT a.TransactionID, a.TicQuantity, b.CustomerName, c.TicketType \
    FROM transaction a \
    LEFT JOIN customers b on a.CustomerID = b.CustomerID \
    LEFT JOIN ticket c on a.TicketID = c.TicketID',(err,rows,field)=>{
        if(!err)
            res.send(rows)
        else
            console.log(err);
    })
})

