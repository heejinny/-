drop table topic;

create table topic (
id int NOT NULL auto_increment,
title varchar(30) not null,
descrpt text,
created datetime not null,
author_id int DEFAULT null,
PRIMARY KEY(id)
);

CREATE TABLE `author` (
id int(11) NOT NULL AUTO_INCREMENT,
name varchar(20) NOT NULL,
profile varchar(200) DEFAULT NULL,
PRIMARY KEY (`id`)
);

insert author
values(1, 'Gu Han-Seok', 'editor');

insert author
values(2, 'Ha Bong-Soo', 'programmer');

insert author
values(3, 'Sin You-Jeong', 'artist');

insert author
values(4, 'Jung Ha-Yoon', 'president');

insert author
values(5, 'Lee Kyung-Chang', 'professor');

insert author
values(6, 'Park Ki-Soo', 'manager');
