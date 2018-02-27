
drop database if exists bamazon;

create database bamazon;

use bamazon;

create table products (

    id              integer(15) auto_increment not null,
    product_name    varchar(150) not null,
    department_name varchar(50) not null,
    price           float(10) not null,
    stock_quantity  integer(8) not null,
    product_sales     float(20) not null default 0,
    PRIMARY KEY (id)

);

create table departments (

    department_id integer(15) auto_increment not null,
    department_name varchar(50) not null,
    over_head_costs float(20) not null,
    primary key (department_id)
    
);

insert into departments(department_name,over_head_costs)
values ("Toys and Games",1000),
       ("Books",500), 
       ("Kitchen",1500),
       ("Home Improvement",1000),
       ("Movies",500);

insert into products (product_name,department_name,price,stock_quantity, product_sales)
values ("Hero Business","Toys and Games",49.99,5,0),
       ("A Contest of A Contest of Castles","Books",14.99,10,0),
       ("Chef Multibean's Premium Kitchen Machete","Kitchen",49.95,6,0),
       ("The Circle of Fists Vol 1: Four Fists United","Books",9.99,15,0),
       ("Straczynski's Hammer","Home Improvement",19.99,8,0),
       ("Butterhands McGillicutty: the Legend of Karl Myers","Books",12.99,2,0),
       ("No Man","Movies",19.99,4,0),
       ("Chef Multibean's Authentic Italian Kitchen Recipes","Books",24.99,5,0),
       ("Dungeons, Dragons, Diners, Drive-Ins, and Dives","Toys and Games",39.99,2,0),
       ("Icons: The Life and Times of Rob Liefeld","Movies",9.99,1,0);