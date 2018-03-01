# bamazon

A node command line app to shop, manage products, and view sales.

## Getting Started

To get bamazon up and running you'll need to set up the database schema in the [bamazon.sql](/bamazon.sql) file on `127.0.0.1` on port `3306` using the user name `root` with no password. You can also edit the config variables in [config.js](/config.js).

## Prerequisites

Bamazon requires having a local mysql server running on your machine locally, as well as the [inquirer]() and [mysql]() npm packages.

## Using Bamazon

There are three main files that interact with the bamazon database:

* [bamazonCustomer](/bamazonCustomer.js) - Allows users to purchase products if they are in stock and shows the total sales for each product
* [bamazonManager](/bamazonManager.js) - Allows users to view products that are low in stock, restock existing products, and add new products.
* [bamazonSupervisor](/bamazonSupervisor.js) - Allows users to create new departments and view net profit of sales from each department. 
