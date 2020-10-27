// Import Mysql Package
const mysql = require('mysql');

// Import Express Package
const express = require('express');

// Import Body-Parser Package
const bodyparser = require('body-parser');


// Start the Express Server
var app = express(); 

// Access JSON Data
app.use(bodyparser.json());

// Create a Mysql Connection
var mysqlconnection = mysql.createConnection({
    host:'127.0.0.1',
    user:'root',
    password:'',
    database:'ReservationDB',
    multipleStatements :true
});

// Connect to Database
mysqlconnection.connect((err)=>{
    if(!err)
        console.log('DB Connection Succeded');
    else   
        console.log('DB Connection failed \n Error : ' + JSON.stringify(err,undefined,2));
});

// Start the server
app.listen(3000,()=>console.log('Express Server is running at port: 3000'));



// Create New Event   
app.post('/event/create',(req,res)=>{
    let evn = req.body;
    var sql = "SET @EventID = ?;SET @EventName = ?;SET @StartDate = ?;SET @EndDate = ?;SET @LocationID = ?; \
    CALL EventAdd(@EventID, @EventName, @StartDate, @EndDate, @LocationID);" ;
    for (var i=0;i < evn.Event.length;i++){
        var lghEvnName = evn.Event[i].EventName;
        if (lghEvnName.length > 45){
            console.log('Maximum Length');
        }else{
            console.log('Length Clear');
            mysqlconnection.query(sql,[evn.Event[i].EventID, evn.Event[i].EventName, evn.Event[i].StartDate, evn.Event[i].EndDate, evn.Event[i].LocationID],(err,rows,field)=>{
                if(!err)
                    res.send('Event Created');
                else
                    res.send('Something Wrong');
                    console.log(err);
            })
        }
    }
})

// Create New Location
app.post('/location/create',(req,res)=>{ 
    let loc = req.body;
    var sql = "SET @LocationID = ?;SET @LocationName = ?;SET @EventID = ?; \
    CALL LocationAdd(@LocationID, @LocationName, @EventID);" ;
    for(var i=0;i < loc.Location.length;i++){
        var lghLocName = loc.Location[i].LocationName;
        if (lghLocName.length > 45){
            console.log('Maximum Length');
        }else{
            console.log('Length Clear');
            mysqlconnection.query(sql,[loc.Location[i].LocationID, loc.Location[i].LocationName, loc.Location[i].EventID],(err,rows,field)=>{
                if(!err)
                    res.send('Location Created');
                else
                    res.send('Something Wrong');
                    console.log(err);
            })
        }
    }
})

// Create New Ticket Type on Specific Event
app.post('/event/ticket/create',(req,res)=>{
    let tic = req.body;
    var sql = "SET @TicketID = ?;SET @TicketQuota = ?;SET @TicketPrice = ?;SET @EventID = ?;SET @TicketType = ?; \
    CALL TicketAdd(@TicketID, @TicketQuota, @TicketPrice, @EventID, @TicketType);" ;
    for(var i=0;i < tic.Ticket.length;i++){
        var lghTicQuota = tic.Ticket[i].TicketQuota;
        var lghTicPrice = tic.Ticket[i].TicketPrice;
        var lghTicType = tic.Ticket[i].TicketType;
        if(lghTicType.length > 45 || lghTicQuota.toString().length > 10 || lghTicPrice.toString().length > 10){
            console.log('Maximum Length');
        }else{
            console.log('Length Clear');
            mysqlconnection.query(sql,[tic.Ticket[i].TicketID, tic.Ticket[i].TicketQuota, tic.Ticket[i].TicketPrice, tic.Ticket[i].EventID, tic.Ticket[i].TicketType],(err,rows,field)=>{
                if(!err) 
                    res.send('Ticket Created');
                else
                    res.send('Something Wrong');
                    console.log(err);
            })
        }
    }
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
    for(var j=0;j < trn.Transaction.length;j++){
        if(trn.Transaction[j].Ticket.length > 0){
            for (var i=0;i < trn.Transaction[j].Ticket.length;i++){
                var lghTrnID = trn.Transaction[j].Ticket[i].TicketID;
                var lghTrnQuantity = trn.Transaction[j].Ticket[i].TicQuantity;
                if(lghTrnID.toString().length > 10 || lghTrnQuantity.toString().length > 10){
                    console.log('Maximum Length');
                }else{
                    console.log('Length Clear');
                    mysqlconnection.query(sql,[trn.Transaction[j].TransactionID, trn.Transaction[j].CustomerID, trn.Transaction[j].Ticket[i].TicketID, trn.Transaction[j].Ticket[i].TicQuantity, trn.Transaction[j].EventID],(err,rows,field)=>{
                        if(!err)
                            res.send('Transaction Successfully');
                        else
                            res.send('Something Wrong');
                            console.log(err);
                    })
                }
            }
        }else{
            var lghTrnID = trn.Transaction[j].Ticket.TicketID;
            var lghTrnQuantity = trn.Transaction[j].Ticket.TicQuantity;
            if(lghTrnID.toString().length > 10 || lghTrnQuantity.toString().length > 10){
                console.log('Maximum Length');
            }else{
                console.log('Length Clear');
                mysqlconnection.query(sql,[trn.Transaction[j].TransactionID, trn.Transaction[j].CustomerID, trn.Transaction[j].Ticket.TicketID, trn.Transaction[j].Ticket.TicQuantity, trn.Transaction[j].EventID],(err,rows,field)=>{
                    if(!err)
                        res.send('Transaction Successfully');
                    else
                        res.send('Something Wrong');
                        console.log(err);
                })
            }
        }
    }
})

// Get Transaction Information
app.get('/transaction/get_info',(req,res)=>{
    mysqlconnection.query('SELECT a.TransactionID, a.ID, a.TicQuantity, b.CustomerName, c.TicketType \
    FROM transaction a \
    LEFT JOIN customers b on a.CustomerID = b.CustomerID \
    LEFT JOIN ticket c on a.TicketID = c.TicketID',(err,rows,field)=>{
        if(!err)
            res.send(rows)
        else
            console.log(err);
    })
})

