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

TodoList.prototype.editItem = function(id, name, status) {
	var item = {'id': id, 'name': name, 'status': status};
	console.log(JSON.stringify(item));
	var ajax = $.ajax('/items/' + id, {
		type: 'PUT',
		data: JSON.stringify(item),
		dataType: 'json',
		contentType: 'application/json'
	});
	ajax.done(this.getItems.bind(this));
};

TodoList.prototype.deleteItem = function(id) {
	var ajax = $.ajax('/items/' + id, {
        type: 'DELETE',
        dataType: 'json'
    });
    ajax.done(this.getItems.bind(this));
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

	$('#list').html(html);
};


$(document).ready(function() {
	var list = new TodoList();
	list.getItems();

	// add
	$('#button-add').on('click', function() {
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

	// enter key enable - repeated code
	$('#input-item').keydown(function(event) {
		if (event.keyCode == 13) {
			var newItem = $('#input-item').val().trim();
			if (newItem.length > 0) {
				list.addItem(newItem);
				$('#no-input').hide();
				$('#input-item').val('');
			}
			else {
				$('#no-input').show();
			}
		}
	});

	// remove
	$('#list').on('click','.remove', function() {
		var id = $(this).closest('li').data('id');
		list.deleteItem(id);
	});

	// edit
	$('#list').on('dblclick','.item-name', function() {
		$(this).parent().find('.button-save').toggle();
	});

	$('#list').on('click', '.button-save', function() {
		var $listItem = $(this).closest('li');

		var id = $(this).closest('li').data('id');
		var name = $(this).parent().find('.item-name').val();

		var status = Boolean;
		if ($listItem.hasClass('complete')) {
			status = true;
		}
		else {
			status = false;
		}

		$(this).parent().find('.button-save').toggle();

		list.editItem(id, name, status);
	});


	// enables checking item status
	$('#list').on('click','.check', function() {
		var $listItem = $(this).closest('li');

		$listItem.toggleClass('complete');

		var id = $(this).closest('li').data('id');
		var name = $(this).parent().find('.item-name').val();

		var status = Boolean;
		if ($listItem.hasClass('complete')) {
			status = true;
		}
		else {
			status = false;
		}

		list.editItem(id, name, status);
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
}

});
