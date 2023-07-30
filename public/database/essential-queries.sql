create database signupform;
use signupform;


create table users1(email varchar(50) primary key, pwd varchar(20), type varchar(10), dos date, status int);
select * from users1;
delete from users1;


create table donors(email varchar(100) primary key, name varchar(30), mobile varchar(12), address varchar(100),city varchar(20), proof varchar(20), pic varchar(200), ahours varchar(20));
select * from donors;
delete from donors;


create table needy(email varchar(100) primary key, name varchar(30), mobile varchar(12), dob date, gender varchar(10), city varchar(20), address varchar(100), pic varchar(200));
select * from needy;
delete from needy;


create table medsavailable(id int AUTO_INCREMENT primary key, email varchar(50), med varchar(50), expdate date, packing varchar(20), qty int);
select * from medsavailable;
delete from medsavailable;