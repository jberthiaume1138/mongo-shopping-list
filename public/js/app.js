'use strict'

var TodoList = function() {
	this.items = [];
	this.data;
	this.template = Handlebars.compile($('#item-list-template').html());
	this.$list = $('#list');
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
	var context = {
        items: this.data
    };

	var html = $(this.template(context));
	this.$list.html(html);
};


$(document).ready(function() {
	var list = new TodoList();
	list.getItems();

	// add new item
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

	// remove item
	$('#list').on('click','.remove', function() {
		var id = $(this).closest('li').data('id');
		list.deleteItem(id);
	});

	// edit item - start edit
	list.$list.on('dblclick', '.item-name', function() {
		$(this).parent().find('.button-save').toggle();
	});

	$('#list').on('focus', '.item-name', function() {
		$(this).parent().find('.button-save').toggle();
	});

	$('#list').on('blur', '.item-name', function() {
		$(this).parent().find('.button-save').toggle();

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

		list.editItem(id, name, status);
	});

	// edit item - finish edit
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

	// toggle item status
	$('#list').on('click','.check', function() {
		var $listItem = $(this).closest('li');

		$listItem.toggleClass('complete');
		$(this).parent().find('input').toggleClass('complete');

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
});
