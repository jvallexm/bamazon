
drop database if exists bamazon;

create database bamazon;

use bamazon;

create table products (

    id              integer(15) auto_increment not null,
    product_name    varchar(150) not null,
    department_name varchar(50) not null,
    price           float(10) not null,
    stock_quantity  integer(8) not null,
    PRIMARY KEY (id)

);

insert into products (product_name,department_name,price,stock_quantity)
values ("Hero Business","Toys and Games",49.99,5);
insert into products (product_name,department_name,price,stock_quantity)
value ("A Contest of A Contest of Castles","Books",14.99,10);
insert into products (product_name,department_name,price,stock_quantity)
value ("Chef Multibean's Premium Kitchen Machete","Kitchen",49.95,6);
insert into products (product_name,department_name,price,stock_quantity)
value ("The Circle of Fists Vol 1: Four Fists United","Books",9.99,15);
insert into products (product_name,department_name,price,stock_quantity)
value ("Straczynski's Hammer","Home Improvement",19.99,8);
insert into products (product_name,department_name,price,stock_quantity)
value ("Butterhands McGillicutty: the Legend of Karl Myers","Books",12.99,2);
insert into products (product_name,department_name,price,stock_quantity)
value ("No Man","Movies",19.99,4);
insert into products (product_name,department_name,price,stock_quantity)
value ("Chef Multibean's Authentic Italian Kitchen Recipes","Books",24.99,5);
insert into products (product_name,department_name,price,stock_quantity)
value ("Dungeons, Dragons, Diners, Drive-Ins, and Dives","Toys and Games",39.99,2);
insert into products (product_name,department_name,price,stock_quantity)
value ("Icons: The Life and Times of Rob Liefeld","Movies",9.99,1);
