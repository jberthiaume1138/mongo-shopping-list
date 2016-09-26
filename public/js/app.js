'use strict'

var TodoList = function() {
	this.items = [];
	this.data;
};

TodoList.prototype.getItems = function() {
	$.getJSON('/items')
		.fail(function(error) {
			console.log('Error reading data.');
			console.log(error);
		})
		// .done(function(data) {
		// 	console.log(this);
		// 	console.log(data);
		// 	return(data);
		// 	// processData(data).bind(this)
		// });
		.done(this.processData.bind(this));
};

TodoList.prototype.addItem = function(name) {
	var item = {'name': name};

	$.ajax('/items', {
			type:'POST',
			data: JSON.stringify(item),
			dataType: 'json',
			contentType: 'application/json'
		})
		.fail(function(error){
			console.log('Failed to add the item.');
			console.log(error);
		})
		.done(this.getItems.bind(this));
};

TodoList.prototype.updateItem = function() {

};

TodoList.prototype.deleteItem = function() {

};

TodoList.prototype.processData = function(data) {
	this.data = data;
	this.updateItemsView();
};

TodoList.prototype.updateItemsView = function() {
	var source = $('#item-list-template').html();
	var template = Handlebars.compile(source);

	var context = {
        items: this.data
    };

	var html = template(context);

	$('#list-section').html(html);
};


$(document).ready(function() {
	var list = new TodoList();
	list.getItems();

	$('#button-add').on('click',function() {
		var newItem = $('#input-item').val().trim();
		if (newItem.length > 0) {
			list.addItem(newItem);
			$('#no-input').hide();
			$('#input-item').val('');
		}
		else {
			$('#no-input').show();
		}
	});

	// enable use of enter key to add an item
	$('#input-item').keydown(function(event) {
		if (event.keyCode == 13) {
			addItem($('#input-item').val().trim());
			$('#input-item').val(""); //clear out box for next item
		}
	});

	// enables checking items off, or back on
	$('#list').on('click','.check',function() {
		$(this).closest('li').toggleClass('complete');
	});

	// permanently remove an item
	$('#list').on('click','.remove',function() {
		$(this).closest('li').hide();
	});

	//reset the list - display warning
	$('#button-clear').click(function() {
		$('#clear').hide();
		$('#confirm').show();
		$('#button-cancel').show();
	})

	// reset the list
	$('#button-confirm').click(function() {
		$('#list').empty();
		$('#clear').show();
		$('#confirm').hide();
	})

	// cancel clear
	$('#button-cancel').click(function() {
		console.log('cancel clicked');
		$('#clear').show();
		$('#confirm').hide();
		$('#button-cancel').hide();
	});

function addItem (newItem) {
	var newListTag = '<li class="list-item">';
	var gotIt = '<img class="check" src="images/checkbox.gif" height="16" width="16">';
	var remove = '<img class="remove" src="images/remove-x.gif" height="16" width="16">';
	$('#list').prepend(newListTag + gotIt + '<p>' + newItem + '</p>' + remove + '</li>');
};

});
