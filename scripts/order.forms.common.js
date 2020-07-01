// to make sure rows doesn't go over 5
var row = 1;
// to index next element
var index = 1;

function validateCheckboxes(name) {
	toggleOther($("#f-format-type-other").is(":checked"),
			"f-format-type-other-input");
	toggleOther($("#f-pub-print-other").is(":checked"),
			"f-pub-print-other-input");
	toggleOther($("#f-pub-electronic-other").is(":checked"),
			"f-pub-electronic-other-input");

	if ((countSelected(name) == 0) || otherDescriptionIsInvalid(name)) {
		$("[data-abide-with='" + name + "']").attr('data-invalid', '').closest(
				'.filter-list').addClass('error');
		valid = false;
	} else {
		$("[data-abide-with='" + name + "']").removeAttr('data-invalid')
				.closest('.filter-list').removeClass('error');
		valid = true;
	}
	return valid;
}

function otherDescriptionIsInvalid(name){
	var isInvalid = false;
	$("." + name).each(function(index, value) {
		var attr = $(this).attr('data-invalid');
		if (typeof attr !== typeof undefined && attr !== false) {
			isInvalid = true;
		    return;
		}
	});
	console.log("is invalid " + isInvalid);
	return isInvalid;
}

function countSelected(name) {
	var checkedCount = 0;
	$("[data-abide-with='" + name + "']").each(function(index, value) {
		if ($(this).is(':checked')) {
			++checkedCount;
		}
	});
	return checkedCount;
}

function isValid() {
	var isValid = true;
	$(":required").each(function(index, item) {
		var type = $(item).prop('type');
		if (type === "checkbox") {
			isValid = $(item).is(":checked");
		} else {
			isValid = $(item).val().length > 0;
		}
		if (!isValid) {
			return false;
		}
	});
	return isValid;
}

function emailSubject(text) {
	var emailSubjectText = text + " | " + $("#f-last-name").val()
	return $("<input>").attr("type", "hidden").attr("name", "exporter.subject")
			.val(emailSubjectText);
}

function emailExporter() {
	var emails = [];
	emails.push($("#f-email").val());
	emails.push("rights@getty.edu");
	return $("<input>").attr("type", "hidden").attr("name", "exporter").val(
			emails);
}

function publicationType() {
	var selected = [];
	$('input[data-abide-with="productionType"]:checked').each(
			function(index, value) {
				var attrs = value.attributes;
				var pLabel = attrs["label"].nodeValue;
				var item = null;
				if (pLabel == 'Other') {
					var pType = attrs["publication-type"].nodeValue;
					var pDescription = $("#f-pub-" + pType + "-other-input")
							.val();
					item = "Other " + titleCase(pType) + ": " + pDescription;
				} else {
					item = pLabel;
				}
				if (selected.length == 0) {
					selected.push(item);
				} else {
					selected.push(" " + item);
				}
			});
	return $("<input>").attr("type", "hidden").attr("name",
			"intendedUse.source.USE1PUBLICATIONTYPE").val(selected);
}

function titleCase(text) {
	return text.charAt(0).toUpperCase() + text.slice(1);
}

function initImageRequestRow() {
	var uoiid = getUrlParameter("uoiid");

	$("#f-request-0-artist").val(getUrlParameter("a"));
	$("#f-request-0-title").val(getUrlParameter("t"));
	$("#f-request-0-id").val(getUrlParameter("o"));
	$("#f-request-0-uoid").val(uoiid);

	if (uoiid != null) {
		changeRequestAttributes(0, "readonly", true);
	}
}

function toggleOther(visible, name) {
	if (visible) {
		$("#" + name).css("display", "inline");
		$("#" + name +"-asterix").css("display", "inline");
	} else {
		$("#" + name).css("display", "none");
		$("#" + name +"-asterix").css("display", "none");
	}
	$("#" + name).prop("required", visible);
}

function anotherReq(e) {
	if (row < 30) {
		++index;
		var afterEl = $('#f-request-container .f-request').last();
		$('#f-request-var').clone().attr('id', index).data('requestNumber',
				index).toggleClass('hide').insertAfter(afterEl);
		$('#' + index).html($('#' + index).html().replace(/var/g, index));

		// Make elements required:
		$('#f-request-' + index + '-artist').prop("required", true);
		$('#f-request-' + index + '-title').prop("required", true);
		$('#f-request-' + index + '-id').prop("required", true);

		// remove disabled
		$('#f-request-' + index + '-artist').prop("disabled", false);
		$('#f-request-' + index + '-title').prop("disabled", false);
		$('#f-request-' + index + '-id').prop("disabled", false);
		$('#f-request-' + index + '-uoid').prop("disabled", false);

		$('.removeRequest').css("display", "inline-block");
		++row;
	}

	if (row == 30) {
		$("#addRequest-1").prop("disabled", true);
	}
}

function changeRequestAttributes(index, attrName, attrValue) {
	$('#f-request-' + index + '-artist').attr(attrName, attrValue);
	$('#f-request-' + index + '-title').attr(attrName, attrValue);
	$('#f-request-' + index + '-id').attr(attrName, attrValue);
}

function remReq(el) {
	el.remove();
	--row;
	if (row == 1) {
		$('.removeRequest').css("display", "none");
	} else if (row == 29) {
		$("#addRequest-1").prop("disabled", false);
	}
}

var getUrlParameter = function(sParam) {
	var sPageURL = decodeURIComponent(window.location.search.substring(1))
			.replace(/&amp;/g, '&');
	var sURLVariables = sPageURL.split('&');

	for (var i = 0; i < sURLVariables.length; i++) {
		var sParameterName = sURLVariables[i].split('=');

		if (sParameterName[0] === sParam) {
			return sParameterName[1] === undefined ? true : sParameterName[1]
					.replace(/\+/g, ' ');
		}
	}
};
