CREATE TABLE Wishlists
(
	W_Id INT UNSIGNED NOT NULL AUTO_INCREMENT,
	Name VARCHAR(255) NOT NULL,
	Owner_user_Id INT UNSIGNED NOT NULL,
	PRIMARY KEY (W_Id)
);