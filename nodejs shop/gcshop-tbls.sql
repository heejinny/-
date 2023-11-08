-- 2020350107 권희진
use webdb2023;

create table person (
loginid varchar(10) not null,
password varchar(10) not null,
name varchar(20) not null,
address varchar(50) null,
tel varchar(13) not null, 
birth varchar(8) not null, 
class varchar(2) not null,
point int, 
PRIMARY KEY(loginid)
);

insert into person
values('rnjsgmlwls','rnjsgmlwls','권희진','성남','010-3190-6336','20010702','01',0);

insert into person
values('bhwang99','bhwang99','왕보현','서울','010-8340-3779','00000000','01',0);



create table code_tbl (
main_id varchar(4) not null,
sub_id varchar(4) not null,
main_name varchar(100) not null,
sub_name varchar(100) not null,
start varchar(8) not null,
end varchar(8) not null,
PRIMARY KEY(main_id,sub_id,start,end)
);
insert into code_tbl
values('0000','0001','상품','의류','20231001','20301231'); 

insert into code_tbl
values('0001','0002','상품','식품','20231001','20301231'); 



create table merchandise (
mer_id int NOT NULL auto_increment,
category varchar(4) not null,
name varchar(100) not null,
price int not null,
stock int not null, 
brand varchar(100) not null, 
supplier varchar(100) not null, 
image varchar(50), 
sale_yn varchar(1),
sale_price int,
PRIMARY KEY(mer_id)
);

insert into merchandise (category, name, price, stock,brand, supplier, image,sale_yn, sale_price)
value('0001','티셔츠',2000,1,'마이더스비','마이더스비','/images/womenCloth1.png','Y',1000);

insert into merchandise (category, name, price, stock,brand, supplier, image,sale_yn, sale_price)
value('0002','오리',2000,1,'베베','베베','/images/womenCloth1.png','Y',1000);
