CREATE TABLE Products
(
	P_Id int NOT NULL AUTO_INCREMENT,
	Host_id varchar(30),
	Host_URL varchar(255) NOT NULL,
	Name varchar(255) NOT NULL,
	Price int,
	Stock varchar(50),
	Shipping varchar(50),
	Image_URL varchar(255),
	UNIQUE (Host_id),
	PRIMARY KEY (P_Id)
);