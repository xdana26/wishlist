CREATE TABLE Wishlists_Products
(
	Wishlist_Id INT UNSIGNED  NOT NULL,
	Product_Id INT UNSIGNED NOT NULL,
	PRIMARY KEY (Wishlist_Id,Product_id)
);