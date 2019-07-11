var db;
var shortName = 'ChezReneDB';
var version = '1.0';
var displayName = 'ChezReneDB';
var maxSize = 10535;
var item_price;
var authToken;

$(document).ready(function () {
	document.addEventListener("deviceready", onDeviceReady, true); 

	$("#signup").bind ("click", function (event){
		console.log("You clicked me sir");
		$.mobile.changePage($("#signuppage"), { transition : "none"});
	});
	
	
	$("#login_now").bind ("click", function (event){
		console.log("You clicked me sir");
		$.mobile.changePage($("#index"), { transition : "none"});
	});
	
	$("#register_member").bind ("click", function (event){
		
		var error = 0;
		var $contactform = $(this).closest('.contact-form');
		var $contactpage = $(this).closest('.ui-page');
		
		$('.required', $contactform).each(function(i) {
			if($(this).val() === '') {
				error++;
			}
		});
		// each
		if(error > 0) {
			alert('Please fill in all the mandatory fields. Mandatory fields are marked with an asterisk *.');
		} 
		else {
			var firstname = $contactform.find('input[name="firstname"]').val();
			var surname = $contactform.find('input[name="lastname"]').val();
			var country = $contactform.find('input[name="country"]').val();
			var mobilephone = $contactform.find('input[name="phonenumber"]').val();
			var email = $contactform.find('input[name="email"]').val();
			var username = $contactform.find('input[name="username"]').val();
			var password = $contactform.find('input[name="password"]').val();
			
			var query = "INSERT INTO customers(username, name,phone, email,location) VALUES('"+username+"','"+firstname+"','"+mobilephone+"','"+email+"','"+country+"')";
			$.ajax({
				url: "https://www.etgafrica.com/jsoncapture/nq?v=[{%22Auth%22:%22"+authToken+"%22,%22Text%22:%22"+query+" %22}]",
				jsonp: "callback",
				dataType: "json",
				data: {},
				success: function( response ) {
					console.log(response);
					console.log("bbbbb "+JSON.stringify(response));
					
					$contactpage.find('.contact-thankyou').show();
					$contactpage.find('.contact-form').hide();
				},
		        error: function(xhr) {	 
		        	console.log("Error "+xhr);
		        	console.log("xhr "+xhr.message);
		        	
		        }
			});
			
		}
	});
	
	$("#login").bind ("click", function (event){
		$.mobile.changePage($("#make_order"), { transition : "none"});
		
		db.transaction(function(transaction) {
			transaction.executeSql('SELECT * FROM items;', [],
			function(transaction, result) {
				if (result != null && result.rows != null) {
					for (var i = 0; i < result.rows.length; i++) {
						var row= result.rows.item(i);
						my_item_id = row["item_id"];
					    var div = document.createElement("div");
					    div.id = row["item_id"];
					    div.innerHTML = '<div class="items_list"><div class = "item_image"><img class="menu_item" style="" width="100%" src="images/'+my_item_id+'.png"/></div><div class = "item_quantity"><span id="qty'+my_item_id+'"> </span></div><div class = "item_name">'+row["item_name"]+'<br><br>Ksh: '+row["total_price"]+'</div><div class = "add_item"><a href="javascript:;" id="rene_burger_minus" onclick = "RemoveValueToDB('+my_item_id+')" ><img class="menu_item" style="height: 20px; width: 20px;" src="images/minus.jpg"/></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="javascript:;" id="rene_burger" onclick = "AddValueToDB('+my_item_id+')" ><img class="menu_item" style="height: 20px; width: 20px;" src="images/images.jpg"/></a></div></div> ';
					    document.getElementById('centerdiv').appendChild(div); 
					    
					    
					    //document.getElementById('item_quantity').style.display = "hidden"; // hide body div tag
					    //document.getElementById('body1').style.display = "block"; // show body1 div tag
					   // document.getElementById('item_quantity').innerHTML = ""

					}
				}
			},errorHandler);
		},errorHandler,nullHandler);
		

	});	
});
function onDeviceReady() {
	
	$.ajax({
		url: "https://www.etgafrica.com/jsoncapture/li?v={%22User%22:%22yammy%22,%22Password%22:%22ciccetta11%22}",
		jsonp: "callback",
		dataType: "json",
		data: {},
		success: function(response) {
			console.log( response ); // server response
			authToken = response;
		},
        error: function(xhr) {	 
        	console.log("Error "+xhr);
        	console.log("xhr "+xhr.message);
        	
        }
	});

	db = openDatabase(shortName, version, displayName,maxSize);
	db.transaction(function(tx){
		tx.executeSql( 'CREATE TABLE IF NOT EXISTS order_details(Id INTEGER NOT NULL PRIMARY KEY, order_no TEXT NOT NULL, item_id TEXT NOT NULL, item_name TEXT NOT NULL, quantity_ordered INTEGER NOT NULL, user_id TEXT NOT NULL,vat TEXT NOT NULL,price TEXT NOT NULL, total_price TEXT NOT NULL)',
				[],nullHandler,errorHandler);
	},errorHandler,successCallBack);

	db.transaction(function(tx){
		tx.executeSql( 'CREATE TABLE IF NOT EXISTS orders_main(Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, order_no TEXT NOT NULL,  user_id TEXT NOT NULL,vat TEXT NOT NULL,price TEXT NOT NULL, total_price TEXT NOT NULL)',
				[],nullHandler,errorHandler);
	},errorHandler,successCallBack);
	
	db.transaction(function(tx){
		tx.executeSql( 'CREATE TABLE IF NOT EXISTS orders_main(Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, order_no TEXT NOT NULL,  user_id TEXT NOT NULL,vat TEXT NOT NULL,price TEXT NOT NULL, total_price TEXT NOT NULL)',
				[],nullHandler,errorHandler);
	},errorHandler,successCallBack);   
}
function errorHandler(transaction, error) {
	alert('Error: '+error);
}
function errorCB(transaction, error){
	console.log("Error "+ error);
}
function successCallBack() {

	//console.log("connection to db successful");
	db.transaction(function(transaction) {
		transaction.executeSql('SELECT count(Id) as order_no FROM orders_main;', [],
				function(transaction, result) {
			if (result != null && result.rows != null) {
				for (var i = 0; i < result.rows.length; i++) {
					var row= result.rows.item(i);
					order_number = row["order_no"] + 1;
					//console.log("Order number is is is is is "+order_number);
				}
			}
		},errorHandler);
	},errorHandler,nullHandler);
}
function nullHandler(){}



function RemoveValueToDB(idval){
	if (!window.openDatabase) {
		alert('Databases are not supported in this browser.');
		return;
	}
	db.transaction(function (tx){
		tx.executeSql("UPDATE order_details SET quantity_ordered = quantity_ordered-?, total_price = (quantity_ordered-?)*? WHERE item_id=? AND order_no = ? ",[1,1,item_price,idval,order_number],
				nullHandler, errorHandler); });
	ShowOrderedItems();
}


function AddValueToDB(idval) {
	
	if (!window.openDatabase) {
		alert('Databases are not supported in this browser.');
		return;
	}
	
	//"Getting item price n kadhalika";
	console.log("The idval is "+idval);
	var item_name;
	db.transaction(function(transaction) {
		transaction.executeSql('SELECT * FROM items WHERE id = ?;', [idval],
		function(transaction, result) {
			if (result != null && result.rows != null) {
				for (var i = 0; i < result.rows.length; i++) {
					var row= result.rows.item(i);
					item_price = row["total_price"];  
					console.log("hhhhhhhhhhhhhhh "+item_price);
				}
			}
		},errorHandler);
	},errorHandler,nullHandler);
	
	//check if item is already ordered


	db.transaction(function(transaction) {
		transaction.executeSql('SELECT count(Id) as ordered_already FROM order_details WHERE item_id = ? AND order_no = ?;', [idval, order_number],
				function(transaction, result) {
			if (result != null && result.rows != null) {
				for (var i = 0; i < result.rows.length; i++) {
					var row= result.rows.item(i);
					item_already_ordered = row["ordered_already"];
					//console.log("********************"+item_already_ordered);
					if (item_already_ordered > 0){
						//Item already ordered change quantity

						db.transaction(function (tx){
							tx.executeSql("UPDATE order_details SET quantity_ordered = quantity_ordered+?, total_price = (quantity_ordered+?)*? WHERE item_id=? AND order_no = ? ",[1,1,item_price,idval,order_number],
									nullHandler, errorHandler); });
						ShowOrderedItems();
					}
					else{
						//adding item since its not ordered
						console.log("Item price is "+item_price);
						db.transaction(function(tx) {
							tx.executeSql('INSERT INTO order_details(order_no,item_id,item_name, quantity_ordered,user_id,vat, price, total_price) VALUES (?,?,?,?,?,?,?,?)',[order_number,idval, item_name, 1, 1, 24, 126, item_price],
									nullHandler,errorHandler);
						});
						ShowOrderedItems();
					}
				}
			}
		},errorHandler);
	},errorHandler,nullHandler);

	return false;
}
function ShowOrderedItems(){

	if (!window.openDatabase) {
		alert('Databases are not supported in this browser.');
		return;
	}

	/*$('#qty').html('');*/
	//console.log("Order number is is is is is "+order_number);
	db.transaction(function(transaction) {
		transaction.executeSql('SELECT * FROM order_details WHERE order_no = ?;', [order_number],
				function(transaction, result) {
			if (result != null && result.rows != null) {
				for (var i = 0; i < result.rows.length; i++) {
					var row= result.rows.item(i);
					//console.log("Item id is "+row["item_id"]);
					$("#qty"+row["item_id"]).show();				
					document.getElementById('qty'+row["item_id"]).innerHTML=row["quantity_ordered"];
					
					
				}
			}
		},errorHandler);
	},errorHandler,nullHandler);
	
	db.transaction(function(transaction) {
		transaction.executeSql('SELECT SUM(total_price) as total_amount FROM order_details WHERE order_no = ?;', [order_number],
				function(transaction, result) {
			if (result != null && result.rows != null) {
				for (var i = 0; i < result.rows.length; i++) {
					var row= result.rows.item(i);
					order_total = row["total_amount"];						
					document.getElementById('order_total').innerHTML=order_total;
					console.log("Order total os "+order_total);
				}
			}
		},errorHandler);
	},errorHandler,nullHandler);

	return;
}
