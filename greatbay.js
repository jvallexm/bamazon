const mys = require(`mysql`);
const ask = require(`inquirer`);

const connectionConfig = {
    host: `127.0.0.1`,
    port: `3306`,
    user: `root`,
    password: ``,
    database: `greatbay`
}

const conn = mys.createConnection(connectionConfig);

function whatDo(){
    ask.prompt({name:"which",
                message: "BID or POST?",
                type: "list",
                choices: ["BID","POST","QUIT"]
                })
        .then(function(d){
            if(d.which == "BID"){
                bidItem();
            }
            else if(d.which == "POST"){
                postItem();
            }
            else{
                conn.end();
            }
        });

}

function bidItem(){

    getItemTitles((items)=>{
        ask.prompt({
            name: "title",
            message: "What item would you like to bid on?",
            type: "list",
            choices: items
        }).then(function(res){
            ask.prompt({
                name: "bid",
                message: "How much would you like to bid?"
            }).then(function(bid){
                getBid(res.title,bid.bid,(success)=>{
                    if(success)
                        console.log(`Congrats! You won ${res.title}.`);
                    else
                        console.log(`Sorry, your bid was too low!`);
                    whatDo();
                });
            });
        });
    }); 
}

function getBid(title,bid,callback){
    conn.query("SELECT * FROM items WHERE ?",{
        title: title
    },(err,res)=>{
        if(err) throw err;
        if(parseFloat(bid) >= res[0].bid)
            callback(true);
        else
            callback(false);
    });
}

function getItemTitles(callback){
    conn.query("SELECT * FROM items",(err,res)=>{
        if(err)
            throw(err);
        let titles = [];
        res.forEach(i=>titles.push(i.title));
        callback(titles);
    });
}

function postItem(){

    ask.prompt([{
        name: "title",
        message: "What is the name of your item?"   
    },{
        name: "cat",
        message: "What is the category of your item?"
    },{
        name: "bid",
        message: "What is the bid for your item?"
    }]).then(function(d){
       let insertMe = {
           title: d.title,
           category: d.cat,
           bid: parseFloat(d.bid)
       }
       createItem(insertMe);
    })

}

function createItem(obj){
    console.log("adding item...");
    let q = conn.query("INSERT INTO items SET ?",obj,(err,res)=>{
        if(err)
            throw err;
        console.log("item added");
        whatDo();
    })
}

whatDo();