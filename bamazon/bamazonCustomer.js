var inquirer = require("inquirer")
var mysql = require("mysql")

var itemList = []

var connection = mysql.createConnection({
    host: "192.168.99.100",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon"
});

read()

function read() {
    var query = connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        res.forEach(element => {
            itemList.push(res)
            console.log(element.item_id + ": " + element.product_name + ", $" + element.price)
        });
        choseItem()
    })
}

function choseItem() {
    inquirer.prompt([
        {
            name: "item",
            message: "Input the ID for the product  you wish to purchase:  ",
            type: "input",
            validate: function (value) {

                if (isNaN(value) === false && value <= itemList.length && value > 0) {
                    return true
                }
                return false
            }
        },
        {
            name: "quantity",
            type: "input",
            message: "How many?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ]).then(function (answers) {
        if (answers) {
           

            var query = connection.query("SELECT * FROM products WHERE item_id=?", [answers.item], function (err, res) {
                if (err) throw err;
                
                if (parseInt(answers.quantity) < parseInt(res[0].stock_quantity)) {
                    //gets the updated amount to pass back to SQL
                    var updatedQuantity = parseInt(res[0].stock_quantity) - parseInt(answers.quantity)
                    //gets the price from the query
                    var priceOfItem = res[0].price
                    //gets the total price of the sale
                    var totalOrderAmount = parseFloat(priceOfItem) * parseFloat(answers.quantity)
                    //gets the products total sales 
                    var currentSales = res[0].product_sales
                    //updates the total sales 
                    var newSalesTotal = parseFloat(totalOrderAmount) + parseFloat(currentSales)

                    var query = connection.query("UPDATE products SET stock_quantity=?, product_sales=? WHERE item_id=?", [updatedQuantity, newSalesTotal, answers.item], function (err, res) {
                        if (err) throw err;
                        
                        console.log("Your order has been placed! Your order will cost $" + totalOrderAmount)
                    })
                }
                else {
                    console.log("There is not enough in stock to fulfill your order, sorry!")
                }
            })
        }
    })
}
