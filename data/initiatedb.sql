create database frogue;

use frogue;

create table `players` (
  `id` int unsigned not null auto_increment primary key,
  `username` varchar(255) not null,
  `class` varchar(255) not null
)