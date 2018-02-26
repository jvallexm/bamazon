const ask   = require('inquirer');
const mysql = require('mysql');

const conCon = {
    host: `127.0.0.1`,
    port: `3306`,
    user: `root`,
    password: ``,
    database: `bamazon`
};

let dbIds;

const con = mysql.createConnection(conCon);

function menuOptions(){
    ask.prompt({
        name: "res",
        message: "Please select an option:",
        type: "list",
        choices: [ "View Products for Sale",
                   "View Low Inventory",
                   "Add to Inventory",
                   "Add New Product",
                   "Exit"]
    }).then((r)=>{

        switch(r.res){
            case "View Products for Sale":
                loadEmUp((arr)=>{
                    displayAll(arr);
                    enterToContinue(menuOptions);
                });
                break;
            case "Exit":
                con.end();
                break;
            case "View Low Inventory":
                loadEmUp((arr)=>{
                    displayAll(arr,5);
                    enterToContinue(menuOptions);
                });
                break;
            case "Add to Inventory":
                loadEmUp((arr)=>{
                    displayAll(arr);
                    increaseInventory();
                });
                break;
            case "Add New Product":
                addProduct();
                break;
            default:{
                console.log("Hot Poppers");
                menuOptions();
            }
        }
    });
}

function loadEmUp(callback){

    con.query("SELECT * FROM products",(err,res)=>{
        if(err) throw err;
        callback(res);
    });

}

function line(){
    console.log(`---------------------------------------------------------------------------------`);
}

function displayAll(arr,limit){
    let qty = limit ? limit : -300;
    dbIds = [];
    console.log("\n********************************* ALL INVENTORY *********************************");
    console.log(`\n   ID | Product Name                                          | Stock | Price  `);
    arr.forEach(i=>{
        let idSpace      = whiteSpace(i.id.toString().length,5);
        let productSpace = whiteSpace(i.product_name.length,53);
        let stockSpace   = whiteSpace(i.stock_quantity.toString().length,5);
        dbIds.push(i.id);
        if(qty === -300 || i.stock_quantity <= qty){
            line();
            console.log(`${idSpace}${i.id} | ${i.product_name}${productSpace} | ${stockSpace}${i.stock_quantity} | $${i.price}`);
        }
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

function increaseInventory(){

    ask.prompt({
        message: "Please enter the ID of the product you'd like to add more of:",
        name: "id"
    }).then((r)=>{

        if(r.id == "QUIT"){
            menuOptions();
        } else {
            let id = parseInt(r.id);

            if(id == "NaN" || dbIds.indexOf(id) == -1){
                console.log("ERROR, INVALID ID");
                increaseInventory();
            } else {

                howMany(id);

            }

        }
    });

}

function howMany(id){
    con.query("SELECT * FROM products WHERE ?",{
        id: id
    },(err,entry)=>{
        ask.prompt({
            message: `How many ${entry[0].product_name} would you like to add?`,
            name: "qty"
        }).then((r)=>{
            let qty = parseInt(r.qty);
            if(qty == "NaN" || qty<=0){
                console.log("ERROR, INVALID QUANTITY");
                howMany(id);
            } else {
                let newQty = entry[0].stock_quantity + qty
                    con.query("UPDATE products SET ? WHERE ?",[
                        {
                            stock_quantity: newQty
                        },{
                            id: id
                        }
                    ],(err,res)=>{
                        if(err) throw err;
                        console.log(`Added ${qty} new ${entry[0].product_name} for sale.`)
                        console.log(`Quantity is now ${newQty}.`)
                        enterToContinue(menuOptions);
                    });
            }
        });
    });
   
}

function addProduct(){
    con.query("SELECT * FROM departments",(err,res)=>{

        let depts = []
        res.forEach(i=>depts.push(i.department_name));
    
        ask.prompt([
            {
                message: "What is the NAME of your product?",
                name: "pname",
                validate: function(input){
                    let done = this.async();
                    if(input.length > 52)
                        done('Product names need to be less than 53 characters');
                    if(input.length < 5)
                        done('Product names must be at lease 5 characters long');
                    done(null,true);
                    
                }
            },{
                message: "What DEPARTMENT is your product in?",
                name: "dept",
                type: "list",
                choices: depts
            },{
                message: "What is the PRICE of your product?",
                name: "price",
                validate: function(input){
                    let done = this.async();
                    if(parseFloat(input) == "NaN")
                        done(`Prices must be numbers`);
                    if(parseFloat(input) < .01)
                        done(`Prices must be at least $.01`);
                    done(null,true);
                }
            },{
                message: "What is the STOCK QUANTITY of your product?",
                name: "qty",
                validate: function(input){
                    let done = this.async();
                    if(parseInt(input) == "NaN")
                        done(`Quantities must be numbers`);
                    if(input.indexOf(".") !== -1)
                        done(`Quantities must be whole numbers`);
                    if(parseInt(input) < 1)
                        done(`Quantities must be greater than 1`);
                    done(null,true);
                }
            }
        ]).then((res)=>{
            let newProduct = {
                product_name:    res.pname,
                department_name: res.dept,
                price:           res.price,
                stock_quantity:  res.qty
            }
            con.query("INSERT INTO products SET ?",newProduct,(err,res)=>{
                if(err) throw err;
                console.log(`Added ${res.pname} to the databse!`)
                enterToContinue(menuOptions);
            })

        });
    });
}

function throwError(str,callback){
    console.log("ERROR, " + str);
    callback();
}

function enterToContinue(callback){
    ask.prompt({
        message: "Press ENTER to continue.",
        name: "enter"
    }).then((r)=>{
        callback();
    });
}

menuOptions();