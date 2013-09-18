/* 
	Copyright © 2013 Reagan Lopez
	[This program is licensed under the "MIT License"]
	Please see the file LICENSE in the source
	distribution of this software for license terms	
*/    
	
	var listCreated = false;
	var tid = 0;
            
	function showCart(){
		$("#item-content").hide();
		$("#cart-content").show();
		$("#payment-content").hide();
        var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
        db.transaction(fetchTrans, errorCB);	
	}	
	
	function showItem(){
		$("#item-content").show();
		$("#cart-content").hide();
		$("#payment-content").hide();		
	}		
	
	function showPayment(){
		$("#item-content").hide();
		$("#cart-content").hide();
		$("#payment-content").show();
	}	
	
    function createTables(tx) {
        tx.executeSql('DROP TABLE IF EXISTS TRANS');
        tx.executeSql('CREATE TABLE IF NOT EXISTS TRANS (trans_id , upc, unitprice, qty, discount, totalprice, status)');		
    }
		
    function errorCB(err) {
       alert("Error processing SQL: "+err.code);
    }

    function createTablesSuccess() {
        var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    }	
	
    function insertItem(tx) {
		tid = tid + 1;
		var totprice = ($("#unitprice").val() * $("#qty").val()) - ($("#discount").val() * $("#unitprice").val() * $("#qty").val() / 100);
		tx.executeSql('INSERT INTO TRANS (trans_id , upc, unitprice, qty, discount, totalprice, status) VALUES (' + tid + ', ' + $("#upc").val() + ' , ' + $("#unitprice").val() + ' , ' + $("#qty").val() + ' , ' + $("#discount").val() + ' , ' + totprice + ' , "IN-PROCESS")');
    }

    function deleteTrans(tx) {
		tx.executeSql('DELETE FROM TRANS');
    }	

     function insertItemSuccess() {	
	        $("#itemmsg").fadeIn();
			$("#itemmsg").css("color", "blue");
			$("#itemmsg").html("Item added to cart.");
			$("#itemmsg").fadeOut(5000);
			$("#upc").val("");
			$("#unitprice").val("0.00");
			$("#qty").val("1");
			//$("#qty").slider("value", $("#qty").slider("option", "min") );
			$('#qty').slider("refresh");
			$("#discount").val("10");	
			$("#discount").listview("refresh");
    }	

    function fetchTrans(tx) {
        tx.executeSql('SELECT * FROM TRANS', [], displayTrans, errorCB);
    }	

    function displayTrans(tx, results) {
        var len = results.rows.length;
		$("#item-list").empty();
		var tot = 0;
		var line = 0;
        for (var i=0; i<len; i++){
		/*
			line = (results.rows.item(i).total * results.rows.item(i).qty) - (results.rows.item(i).total * results.rows.item(i).qty * results.rows.item(i).discount / 100)
			tot = tot + line;
		*/
			tot = tot + results.rows.item(i).totalprice;
			//$("#item-list").append('<li><a href="#">Item: ' + results.rows.item(i).upc + '    Qty: ' + results.rows.item(i).qty + '    TotalPrice: $' + results.rows.item(i).totalprice + '</a></li>');				
			$("#item-list").append('<li><fieldset class="ui-grid-b"><div class="ui-block-a"><a>Item: ' + results.rows.item(i).upc + '</a></div><div class="ui-block-b"><b>Qty: ' + results.rows.item(i).qty + '</b></div><div class="ui-block-c"><b>Total Price: $' + results.rows.item(i).totalprice + '</b></div></fieldset></li>');				
        }
		$("#item-list").append('<li><a color="blue">Amount Due: $' + tot + '</a></li>');	
		$("#item-list").listview("refresh");
    }	
	
	function blink(selector){
		$(selector).fadeOut('slow', function(){
		$(this).fadeIn('slow', function(){
		blink(this);
		});
		});
	}			