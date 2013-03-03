var apa = require('apa-client')
  , url_helper = require('url')
  ,	displayO = require('displayObjectsNicely');

var itemSearchAmazon = function (amazon_asin, callback){
	// Create a client
	var client = apa.createClient({
	    "awsAccessKeyId" : "AKIAJM6FFVRGQGXYFNBQ", // your aws access key id here
	    "awsSecretKey" : "L6jorSNvMNRMU65YmCPJWR6rXjGov8EMcVxWKNKs", // your secret key here
	    "associateTag" : "wishlist0d8-20" // your associate tag here
	});
	client.execute('ItemLookup',{
	    ItemId : amazon_asin,
	    IdType : 'ASIN',
	    ResponseGroup : 'Offers,Images,ItemAttributes',
	    Availability : 'Available'
	},function(err,data){
	    if(err)  return callback(err, null);
	    displayO.p(data);
	    return callback(err,data);
	});
};

var get_AmazonASIN_fromPath = function(pathname, callback){
	if(pathname)
		var slashDivided = pathname.split('/');
	else
		return callback( new Error("Pathname is null"), null);

	if(!slashDivided[3]){
		return callback( new Error("The path is not in correct format"), null);
	}
	return callback(null, slashDivided[3]);
};

var getProduct = function(host_id, callback){
	var database = require('./database').connect();
	var query = "SELECT * FROM products WHERE Host_id="+database.escape(host_id);
	console.log(query);
	database.query(query, function(err, rows, fields){
		//rows object contains all the information
		if(err){
			//handle the response to the default_error controller
			return callback(err, null)
		}	
		console.log(rows);
		if(rows.length === 0){
			console.log("No entry for "+host_id+" found");
			return callback(null, null);	
		}
		else{
			return callback(null,rows[0]);
		}
	})
	database.end();
	
}

var addNewProduct = function(newProduct, callback){
	var database = require('./database').connect();
	var query = "INSERT INTO products (Host_id, Host_URL, Name, Price, Stock, Shipping, Image_URL) VALUES ("
		+database.escape(newProduct.host_id)+","
		+database.escape(newProduct.url)+","
		+database.escape(newProduct.name)+","
		+database.escape(newProduct.price)+","
		+database.escape(newProduct.stock)+","
		+database.escape(newProduct.shipping)+","
		+database.escape(newProduct.image_url) +");";

	database.query(query, function(err, rows, fields){
		//rows object contains all the information
		if(err){
			return callback(err);	
		}	
		//if everything works out well
	})		
	database.end();
	return callback(null);
} 

var map_wlist_prod = function(wishlist_id, product_id, callback){
	var database = require('./database').connect();
	var query = "INSERT INTO wishlist_product (Wishlist_Id, Products_Id) VALUES ("
		+database.escape(wishlist_id)+","
		+database.escape(product_id) +");";

	database.query(query, function(err, rows, fields){
		//rows object contains all the information
		if(err){
			return callback(err);
		}	
		//if everything works out well
	})		
	database.end();
	callback(null);
}

var getDefaultWishlist = function(user_id){

}

exports.registerProduct = function(req, res){
	var url_bookmarked = req.query.q;
	var parsed_url = url_helper.parse(url_bookmarked);
	displayO.p(parsed_url);
	if(parsed_url.hostname == "www.amazon.com"){
		get_AmazonASIN_fromPath(parsed_url.pathname, function(err, amazon_asin){
			if(err){
				console.log('There was an error getting the ASIN: '+err);
				res.send('Failed');
				return;
			}
			console.log('The ASIN is '+amazon_asin);

			getProduct(amazon_asin,function(err, dbEntry){
				if(err){
					console.log(err);
					res.send('Failed');
					return;
				}
				if(dbEntry){
					res.send(JSON.stringify(dbEntry));
				}
				else{

					itemSearchAmazon(amazon_asin, function(err, data){
						if(err){
							console.log('There was an error accessing AWS: '+err);
							res.send('Failed');
							return;
						}
						var newProduct = {
							host_id : amazon_asin, 
							url : url_bookmarked,
							name : data.Items.Item.ItemAttributes.Title,
							
						};

						if('ListPrice' in data.Items.Item.ItemAttributes){
							newProduct.price = data.Items.Item.ItemAttributes.ListPrice.Amount;
						}
						else{
							newProduct.price = null;
						} 

						if('LargeImage' in data.Items.Item && 'URL' in data.Items.Item.LargeImage)
							newProduct.image_url = data.Items.Item.LargeImage.URL;
						else if('MediumImage' in data.Items.Item && 'URL' in data.Items.Item.MediumImage)
							newProduct.image_url = data.Items.Item.MediumImage.URL;
						else if('SmallImage' in data.Items.Item && 'URL' in data.Items.Item.SmallImage)
							newProduct.image_url = data.Items.Item.SmallImage.URL;
						else
							newProduct.image_url = null;

						if(data.Items.Item.Offers.TotalOffers == 0)	{
							newProduct.stock = 'Not Available'
						}else{
							if('PackageQuantity' in data.Items.Item.ItemAttributes){
								newProduct.stock = 'Only '+data.Items.Item.ItemAttributes.PackageQuantity+' left in stock';
							}
							else{
								newProduct.stock = 'In Stock';
							}

							if('Price' in data.Items.Item.Offers.Offer.OfferListing){
								newProduct.price = data.Items.Item.Offers.Offer.OfferListing.Price.Amount;
							}
						}

						

						if('Offer' in data.Items.Item.Offers && 'OfferListing' in data.Items.Item.Offers.Offer 
							&& 'IsEligibleForSuperSaverShipping' in data.Items.Item.Offers.Offer.OfferListing){
							if(data.Items.Item.Offers.Offer.OfferListing.IsEligibleForSuperSaverShipping == '1')
								newProduct.shipping = "Eligible For Super Saver Shipping";
							else
								newProduct.shipping = "Regular Shipping";
						}
						else
							newProduct.shipping = null;
						
						addNewProduct(newProduct, function(err){
							if(err){
								console.log("Error add a new product to database");
								console.log(err);
								res.send('Failed');
								return;
							}
							else{
								res.send(JSON.stringify(newProduct));
							}
						})

					});
				}
			} );

		}); 
	}
	else{
		console.log("Unsupported Website")
		res.send('failed');
	}
};

