/* jshint esversion: 6 */

// QR Codes: https://davidshimjs.github.io/qrcodejs/

function processResponse(result) {
	const {cashaddr, legacy, copay} = result;

	const html = `
		<div class="pure-u-1">CashAddress: ${cashaddr}</div>
		<div class="pure-u-1">Legacy: ${legacy}</div>
		<div class="pure-u-1">Copay: ${copay}</div>
		<div class="pure-u-1" style="height:2em"></div>
		<div id="legacy" class="pure-u-1 pure-u-md-1-3 result">
			<div class="result-label">Legacy</div>
		</div>
		<div id="cashaddr" class="pure-u-1 pure-u-md-1-3 result">
			<div class="result-label">CashAddress</div>
		</div>
		<div id="copay" class="pure-u-1 pure-u-md-1-3 result">
			<div class="result-label">Copay</div>
		</div>`;

	document.getElementById("result").innerHTML = html;

	new QRCode(document.getElementById("cashaddr"), {
		mode: 1,
		text: result.cashaddr.toUpperCase(),
		width: 256,
		height: 256,
		correctLevel: QRCode.CorrectLevel.L,
	});

	new QRCode(document.getElementById("legacy"), {
		text: result.legacy,
		width: 256,
		height: 256,
		correctLevel: QRCode.CorrectLevel.L,
	});

	new QRCode(document.getElementById("copay"), {
		text: result.copay,
		width: 256,
		height: 256,
		correctLevel: QRCode.CorrectLevel.L,
	});
}

function processError(error) {
	const html = `<div class="pure-u-1">Error: ${error}</div>`;
	document.getElementById("result").innerHTML = html;
}

function handleSubmit(event) {
	event.preventDefault();

	var address = encodeURIComponent(document.getElementById("address").value.trim());
	const xhr = new XMLHttpRequest();
	xhr.onreadystatechange = () => {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				processResponse(JSON.parse(xhr.responseText));
			} else {
				processError(xhr.responseText);
			}
		}
	};
	xhr.open('GET', `/convert?address=${address}`);
	xhr.send();
}

window.addEventListener("load", function () {
	var mainform = document.getElementById("mainform");
	mainform.addEventListener("submit", handleSubmit);
});
