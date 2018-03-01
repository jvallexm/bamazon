const ask    = require('inquirer');
const mysql  = require('mysql');

const conCon = require('./config.js').config;

const con = mysql.createConnection(conCon);

function viewSales(){
    console.log("VIEW SALES");
    con.query("SELECT departProd.department_id, departProd.department_name, departProd.over_head_costs, SUM(departProd.product_sales) as product_sales, (SUM(departProd.product_sales) - departProd.over_head_costs) as total_profit FROM (SELECT departments.department_id, departments.department_name, departments.over_head_costs, IFNULL(products.product_sales, 0) as product_sales FROM products RIGHT JOIN departments ON products.department_name = departments.department_name) as departProd GROUP BY department_id",(err,res)=>{
        if(err) throw err;
        console.log("  ID | Department                 | Overhead   | Total Profit  ")
        res.forEach(i => {
            let idSpace  = whiteSpace(i.department_id.toString().length,4);
            let deSpace  = whiteSpace(i.department_name.length,26)
            let overhead = formatPrice(parseFloat(i.over_head_costs));
            let profit   = formatPrice(parseFloat(i.total_profit));
            let ohSpace  = whiteSpace(overhead.length,9);
            let prSpace  = whiteSpace(profit.length,11);
            console.log("------------------------------------------------------------")
            console.log(`${idSpace}${i.department_id} | ${i.department_name}${deSpace} | ${ohSpace}$${overhead} | ${prSpace}$${profit}`);

        });
        enterToContinue(menuOptions);
    }); 
}

function enterToContinue(callback){
    ask.prompt({
        message: "Press ENTER to continue.",
        name: "enter"
    }).then((r)=>{
        callback();
    });
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

function whiteSpace(num,max){
    let str = "";
    if(num > 0)
        while(str.length < max-num){
            str+=" ";
        }
    return str;
}

function addDepartment(){

    ask.prompt([{
        message: "What is the name of your department?",
        name: "n"
    },{
        message: "What is the overhead for your department?",
        name: "o"
    }]).then((r)=>{

        con.query("INSERT INTO departments SET ?",{
            department_name: r.n,
            over_head_costs: r.o
        },(err,res)=>{
            console.log(`Added ${r.n} to the departments!`)
            enterToContinue(menuOptions);
        });

    });

}

function menuOptions(){
    ask.prompt({
        message: "What would you like to do?",
        type: "list",
        choices: ["View Product Sales by Department","Create New Department","Quit"],
        name: "ans"
    }).then((res)=>{
        if(res.ans == "View Product Sales by Department")
            viewSales();
        else if(res.ans == "Quit"){
            con.end(()=>process.exit());
        }
        else
            addDepartment();
    });
}

menuOptions();