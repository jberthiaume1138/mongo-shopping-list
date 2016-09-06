'use strict'
$(document).ready(function() {
	$('#button-add').on("click",function() {
		var newItem = $('#input-item').val().trim(); // basic input validation
		if (newItem.length > 0) {
			addItem(newItem);	// input is valid, proceed
			$('#no-input').hide();
			$('#input-item').val(""); //clear out box for next item
		}	
		else 		
			$('#no-input').show();
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