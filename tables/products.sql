CREATE TABLE Products
(
	P_Id int NOT NULL AUTO_INCREMENT,
	Host_id varchar(30),
	Host_URL varchar(255) NOT NULL,
	Name varchar(255) NOT NULL,
	Price decimal(12,2) NOT NULL,
	Stock varchar(25),
	Shipping varchar(25),
	Image_URL varchar(255),
	UNIQUE (Amazon_id),
	PRIMARY KEY (P_Id)
);