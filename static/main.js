/* jshint esversion: 6 */

// QR Codes: https://davidshimjs.github.io/qrcodejs/

<<<<<<< HEAD
;(() => {

document.addEventListener('DOMContentLoaded', () => {
	const container = element('container');
	container.addEventListener('click', proxy('submit', ['submit-address']));
	container.addEventListener('click', proxy('start', ['dismiss-error']));
	container.addEventListener('change', proxy('change-address', ['address']));
	dispatch('start');
});

const element = document.getElementById.bind(document);

const proxy = (action, ids) => (event) => {
	const {id, name, value} = event.target;
	if (ids.indexOf(id) < 0) return;
	event.preventDefault();
	dispatch(action, {name, value});
};

const dispatch = ((state) => (action, payload) => {
	const old = state.scene;
	defer(() => process(action, payload, state));
	state = integrate(state, action, payload);
	if (state.scene !== old) {
		render(state);
	}
})({
	scene: 'loading',
	form: {},
	address: {},
	error: ''
});

const defer = (fn) => setTimeout(fn, 0);

function process(action, payload, state) {
	switch (action) {
	case 'submit':
		fetch(`/convert?address=${encodeURIComponent(state.form.address)}`)
			.then(parse)
			.then(resolve('convert'), reject('convert'));
	}
}

function parse(response) {
	if (response.ok) {
		return response.json();
	} else {
		return response.text().then((message) => { throw message; });
	}
}

const resolve = (action) => (value) => {
	dispatch(`${action}-success`, value);
	return value;
};

const reject = (action) => (message) => {
	dispatch(`${action}-error`, {error: message});
	return message;
};

const merge = (...args) => Object.assign({}, ...args);

function integrate(state, action, payload) {
	const {scene, form, address, error} = state;
	switch (action) {
	case 'start':
		return {
			scene: 'form',
			form, address, error
		};
	case 'change-address':
		return {
			form: merge(state.form, {[payload.name]: payload.value}),
			scene, address, error
		};
	case 'submit':
		return {
			scene: 'loading',
			form, address, error
		};
	case 'convert-success':
		return {
			scene: 'address',
			address: {
				cashaddr: payload.cashaddr.toUpperCase(),
				legacy: payload.legacy,
				copay: payload.copay
			},
			form, error
		};
	case 'convert-error':
		return {
			scene: 'error',
			error: payload.error,
			form, address
		};
	}
	return state;
}

function render(state) {
	const container = element('container');
	container.innerHTML = scenes[state.scene](state[state.scene]);

	if (state.scene !== 'address') return;

	const options = (text) => {
		return {
			text,
			mode: 1,
			width: 256,
			height: 256,
			correctLevel: QRCode.CorrectLevel.L,
		};
	};

	new QRCode(element('cashaddr'), options(state.address.cashaddr));
	new QRCode(element('legacy'), options(state.address.legacy));
	new QRCode(element('copay'), options(state.address.copay));
}

const scenes = {
	loading: () => `
		<div class="loading-indicator">Loading...</div>
	`,

	form: () => `
		<form id="address-form">
			<input type="text"
				id="address"
				name="address"
				autofocus
				autocomplete="off"
				placeholder="qr2z7dusk64qn960h9vspf2ezewl0pla9gcpnk35f0"
				maxlength="64" />
			<input type="submit" id="submit-address" value="Convert">
		</form>
	`,

	address: ({cashaddr, legacy, copay}) => `
		${scenes.form()}
		<div id="qr-codes">
			<div class="qr-card">
				<div class="qr-label">Legacy</div>
				<div class="qr-address">${legacy}</div>
				<div id="legacy" class="qr-code"></div>
			</div>
			<div class="qr-card">
				<div class="qr-label">CashAddress</div>
				<div class="qr-address">${cashaddr}</div>
				<div id="cashaddr" class="qr-code"></div>
			</div>
			<div class="qr-card">
				<div class="qr-label">Copay</div>
				<div class="qr-address">${copay}</div>
				<div id="copay" class="qr-code"></div>
			</div>
		</div>
	`,

	error: (error) => `
		${scenes.form()}
		<div id="error-container">
			<div id="error">
				<div>
					<span class="ion-alert-circled"></span>
					${error}
				</div>
				<div id="dismiss-error" class="ion-close"></div>
			</div>
		</div>
	`
};

})();
=======
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

	var address = encodeURIComponent(document.getElementById("address").value);
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
>>>>>>> JS refactor
