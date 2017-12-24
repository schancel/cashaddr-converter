// QR Codes: https://davidshimjs.github.io/qrcodejs/
function processResponse(result) {
	var template = 
	`<div id="legacy" class="pure-u-1-3 pure-u-md-1">Legacy: {{legacy}}</div>
	<div id="cashaddr" class="pure-u-1-3 pure-u-md-1">{{cashaddr}}</div>
	<div id="copay" class="pure-u-1-3 pure-u-md-1">Copay: {{copay}}</div>`;
	var html = Mustache.to_html(template, result);
	document.getElementById("result").innerHTML = html;

	var qrcode = new QRCode(document.getElementById("cashaddr"), {
		mode: 1,
		text: result.cashaddr,
		width: 164,
		height: 164,
		correctLevel: QRCode.CorrectLevel.L
	});

	var qrcode = new QRCode(document.getElementById("legacy"), {
		text: result.legacy,
		width: 164,
		height: 164,
		correctLevel: QRCode.CorrectLevel.L
	});

	var qrcode = new QRCode(document.getElementById("copay"), {
		text: result.copay,
		width: 164,
		height: 164,
		correctLevel: QRCode.CorrectLevel.L
	});
}

function processError(result) {
	document.getElementById("result").innerHTML = result;
}

function responeHandler(xhr, func, errfunc) {
	return function() {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				func(JSON.parse(xhr.responseText));
			} else {
				errfunc(xhr.responseText);
			}
		}
	}
}

function handleSubmit(event) {
	event.preventDefault();

	var address=encodeURIComponent(document.getElementById("address").value)
	xhr = new XMLHttpRequest();
	xhr.onreadystatechange = responeHandler(xhr, processResponse, processError);
	xhr.open("GET", "/convert?address="+address, true);
	xhr.send();
}

window.addEventListener("load", function(){
	var mainform = document.getElementById("mainform");
	mainform.addEventListener("submit", handleSubmit)
})
