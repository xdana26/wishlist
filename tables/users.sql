CREATE TABLE Users
(
	User_Id int NOT NULL AUTO_INCREMENT,
	Email_addr varchar(25) NOT NULL,
	Password varchar(20) NOT NULL,
	Lastname varchar(255),
	Firstname varchar(255) NOT NULL,
	UNIQUE (Email_addr),
	PRIMARY KEY (User_Id)
);