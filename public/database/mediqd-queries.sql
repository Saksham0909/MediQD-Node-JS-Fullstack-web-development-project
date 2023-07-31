# ---------------------------------------------------- Run these query to create database and use them ----------------------------------------------------
create database signupform;
use signupform;


# ---------------------------------------------------- Creating table to store users login data ----------------------------------------------------
create table users1(email varchar(50) primary key, pwd varchar(20), type varchar(10), dos date, status int);
select * from users1;
delete from users1;


# ---------------------------------------------------- Admin account for managing website through admin panel ----------------------------------------------------
insert into users1 values("admin0000@gmail.com", "adminlogin", "admin", current_date(), 1);


# ---------------------------------------------------- Creating table to store donor profile data ----------------------------------------------------
create table donors(email varchar(100) primary key, name varchar(30), mobile varchar(12), address varchar(100),city varchar(20), proof varchar(20), pic varchar(200), ahours varchar(20));
select * from donors;
delete from donors;


# ---------------------------------------------------- Creating table to store needy profile data ----------------------------------------------------
create table needy(email varchar(100) primary key, name varchar(30), mobile varchar(12), dob date, gender varchar(10), city varchar(20), address varchar(100), pic varchar(200));
select * from needy;
delete from needy;


# ---------------------------------------------------- Creating table to store available medicines data ----------------------------------------------------
create table medsavailable(id int AUTO_INCREMENT primary key, email varchar(50), med varchar(50), expdate date, packing varchar(20), qty int);
select * from medsavailable;
delete from medsavailable;


# ---------------------------------------------------- Run these queries if you want to delete the database or a table ----------------------------------------------------
# DROP DATABASE signupform;
# DROP TABLE {table_name};