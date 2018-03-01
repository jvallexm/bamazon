const ask   = require('inquirer');
const mysql = require('mysql');

const conCon = {
    host: `127.0.0.1`,
    port: `3306`,
    user: `root`,
    password: ``,
    database: `bamazon`
};

const con = mysql.createConnection(conCon);

console.log("Loading...");

let dbIds;

function loadEmUp(callback){

    con.query("SELECT * FROM products",(err,res)=>{
        if(err) throw err;
        callback(res);
    });

}

function line(){
    console.log(`------------------------------------------------------------------------------------`);
}
function displayAll(arr){
    dbIds = [];
    console.log("\n******************************** WELCOME TO BAMAZON ********************************");
    console.log(`\n   id | Product Name                                          |    Price | Sales  `);
    arr.forEach(i=>{
        dbIds.push(i.id);
        let idSpace      = whiteSpace(i.id.toString().length,5);
        let productSpace = whiteSpace(i.product_name.length,53);
        let price        = formatPrice(i.price)
        let priceSpace   = whiteSpace(price.length,7);
        let sales        = formatPrice(i.product_sales)
        line();
        console.log(`${idSpace}${i.id} | ${i.product_name}${productSpace} | ${priceSpace}$${price} | $${sales}`);
    });   
    console.log("\nEnter QUIT to exit.");
    whatBuy();
}

function formatPrice(num){
    let str = num.toString();
    if(str.indexOf(".") == -1)
        return str + ".00";
    if(str.split(".")[1].length == 1)
        return str + "0";
    else
        return str;
}

function whatBuy(){
    console.log();
    ask.prompt({
        message: "Enter the ID of the product you would like to buy:",
        name: "id",
        validate: function(input){
            let done = this.async();
            if(input != "QUIT" && dbIds.indexOf(parseInt(input)) == -1)
                done(`Error, invalid ID`);
            done(null,true);
        }

    }).then((r)=>{

        if(r.id == "QUIT")
            con.end();
        else    
            howMany(parseInt(r.id));

    });
}

function howMany(id){
    con.query("SELECT * FROM products WHERE ?",{
        id: id
    },(err,entry)=>{
        if(err) throw err;
        ask.prompt({
            message: `How many ${entry[0].product_name} would you like to purchase?`,
            name: "qty",
            validate: function(input){
                let done = this.async();
                let qty  = parseInt(input);
                if(input == "QUIT")
                    done(null,true);
                else if(qty == "NaN")
                    done(`Error, invalid quantity`);
                else if(entry[0].stock_quantity < qty)
                    done(`Error, insufficient quantity`);
                else    
                    done(null,true);

            }
        }).then((r)=>{
            let qty = parseInt(r.qty);
            let newQty = entry[0].stock_quantity - qty;
            
            con.query("UPDATE products SET ? WHERE ?",[
                {
                    stock_quantity: newQty,
                    product_sales : entry[0].product_sales + (entry[0].price * qty) 

                },{
                    
                    id: id
                }
            ],(err,res)=>{
                
                if(err) throw err;
                console.log("Thanks so much for your purcase of")
                console.log(`${qty} ${entry[0].product_name}`);
                console.log(`Your total is $${entry[0].price * qty}`);
                enterToContinue();
            });
                    
        });
    });
                
}

function enterToContinue(){
    ask.prompt({
        message: "Press ENTER to continue.",
        name: "enter"
    }).then((r)=>{
        loadEmUp(displayAll);
    });
}

function whiteSpace(num,max){
    let str = "";
    if(num > 0)
        while(str.length < max-num){
            str+=" ";
        }
    return str;
}

loadEmUp(displayAll);
