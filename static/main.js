/* jshint esversion: 6 */

// QR Codes: https://davidshimjs.github.io/qrcodejs/

;(() => {

// blacklist test vectors from spec (known fake addresses)
const BLACKLIST = [
  'prefix:x64nx6hz',
  'p:gpf8m4h7',
  'bitcoincash:qpzry9x8gf2tvdw0s3jn54khce6mua7lcw20ayyn',
  'bchtest:testnetaddress4d6njnut',
  'bchreg:555555555555555555555555555555555555555555555udxmlmrz',
  '1BpEi6DfDAUFd7GtittLSdBeYJvcoaVggu',
  'bitcoincash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a',
  '1KXrWXciRDZUpQwQmuM1DbwsKDLYAYsVLR',
  'bitcoincash:qr95sy3j9xwd2ap32xkykttr4cvcu7as4y0qverfuy',
  '16w1D5WRVKJuZUsSRzdLp9w3YGcgoxDXb',
  'bitcoincash:qqq3728yw0y47sqn6l2na30mcw6zm78dzqre909m2r',
  '3CWFddi6m4ndiGyKqzYvsFYagqDLPVMTzC',
  'bitcoincash:ppm2qsznhks23z7629mms6s4cwef74vcwvn0h829pq',
  '3LDsS579y7sruadqu11beEJoTjdFiFCdX4',
  'bitcoincash:pr95sy3j9xwd2ap32xkykttr4cvcu7as4yc93ky28e',
  '31nwvkZwyPdgzjBJZXfDmSWsC4ZLKpYyUw',
  'bitcoincash:pqq3728yw0y47sqn6l2na30mcw6zm78dzq5ucqzc37',
  'bitcoincash:qr6m7j9njldwwzlg9v7v53unlr4jkmx6eylep8ekg2',
  'bchtest:pr6m7j9njldwwzlg9v7v53unlr4jkmx6eyvwc0uz5t',
  'pref:pr6m7j9njldwwzlg9v7v53unlr4jkmx6ey65nvtks5',
  'prefix:0r6m7j9njldwwzlg9v7v53unlr4jkmx6ey3qnjwsrf',
  'bitcoincash:q9adhakpwzztepkpwp5z0dq62m6u5v5xtyj7j3h2ws4mr9g0',
  'bchtest:p9adhakpwzztepkpwp5z0dq62m6u5v5xtyj7j3h2u94tsynr',
  'pref:p9adhakpwzztepkpwp5z0dq62m6u5v5xtyj7j3h2khlwwk5v',
  'prefix:09adhakpwzztepkpwp5z0dq62m6u5v5xtyj7j3h2p29kc2lp',
  'bitcoincash:qgagf7w02x4wnz3mkwnchut2vxphjzccwxgjvvjmlsxqwkcw59jxxuz',
  'bchtest:pgagf7w02x4wnz3mkwnchut2vxphjzccwxgjvvjmlsxqwkcvs7md7wt',
  'pref:pgagf7w02x4wnz3mkwnchut2vxphjzccwxgjvvjmlsxqwkcrsr6gzkn',
  'prefix:0gagf7w02x4wnz3mkwnchut2vxphjzccwxgjvvjmlsxqwkc5djw8s9g',
  'bitcoincash:qvch8mmxy0rtfrlarg7ucrxxfzds5pamg73h7370aa87d80gyhqxq5nlegake',
  'bchtest:pvch8mmxy0rtfrlarg7ucrxxfzds5pamg73h7370aa87d80gyhqxq7fqng6m6',
  'pref:pvch8mmxy0rtfrlarg7ucrxxfzds5pamg73h7370aa87d80gyhqxq4k9m7qf9',
  'prefix:0vch8mmxy0rtfrlarg7ucrxxfzds5pamg73h7370aa87d80gyhqxqsh6jgp6w',
  'bitcoincash:qnq8zwpj8cq05n7pytfmskuk9r4gzzel8qtsvwz79zdskftrzxtar994cgutavfklv39gr3uvz',
  'bchtest:pnq8zwpj8cq05n7pytfmskuk9r4gzzel8qtsvwz79zdskftrzxtar994cgutavfklvmgm6ynej',
  'pref:pnq8zwpj8cq05n7pytfmskuk9r4gzzel8qtsvwz79zdskftrzxtar994cgutavfklv0vx5z0w3',
  'prefix:0nq8zwpj8cq05n7pytfmskuk9r4gzzel8qtsvwz79zdskftrzxtar994cgutavfklvwsvctzqy',
  'bitcoincash:qh3krj5607v3qlqh5c3wq3lrw3wnuxw0sp8dv0zugrrt5a3kj6ucysfz8kxwv2k53krr7n933jfsunqex2w82sl',
  'bchtest:ph3krj5607v3qlqh5c3wq3lrw3wnuxw0sp8dv0zugrrt5a3kj6ucysfz8kxwv2k53krr7n933jfsunqnzf7mt6x',
  'pref:ph3krj5607v3qlqh5c3wq3lrw3wnuxw0sp8dv0zugrrt5a3kj6ucysfz8kxwv2k53krr7n933jfsunqjntdfcwg',
  'prefix:0h3krj5607v3qlqh5c3wq3lrw3wnuxw0sp8dv0zugrrt5a3kj6ucysfz8kxwv2k53krr7n933jfsunqakcssnmn',
  'bitcoincash:qmvl5lzvdm6km38lgga64ek5jhdl7e3aqd9895wu04fvhlnare5937w4ywkq57juxsrhvw8ym5d8qx7sz7zz0zvcypqscw8jd03f',
  'bchtest:pmvl5lzvdm6km38lgga64ek5jhdl7e3aqd9895wu04fvhlnare5937w4ywkq57juxsrhvw8ym5d8qx7sz7zz0zvcypqs6kgdsg2g',
  'pref:pmvl5lzvdm6km38lgga64ek5jhdl7e3aqd9895wu04fvhlnare5937w4ywkq57juxsrhvw8ym5d8qx7sz7zz0zvcypqsammyqffl',
  'prefix:0mvl5lzvdm6km38lgga64ek5jhdl7e3aqd9895wu04fvhlnare5937w4ywkq57juxsrhvw8ym5d8qx7sz7zz0zvcypqsgjrqpnw8',
  'bitcoincash:qlg0x333p4238k0qrc5ej7rzfw5g8e4a4r6vvzyrcy8j3s5k0en7calvclhw46hudk5flttj6ydvjc0pv3nchp52amk97tqa5zygg96mtky5sv5w',
  'bchtest:plg0x333p4238k0qrc5ej7rzfw5g8e4a4r6vvzyrcy8j3s5k0en7calvclhw46hudk5flttj6ydvjc0pv3nchp52amk97tqa5zygg96mc773cwez',
  'pref:plg0x333p4238k0qrc5ej7rzfw5g8e4a4r6vvzyrcy8j3s5k0en7calvclhw46hudk5flttj6ydvjc0pv3nchp52amk97tqa5zygg96mg7pj3lh8',
  'prefix:0lg0x333p4238k0qrc5ej7rzfw5g8e4a4r6vvzyrcy8j3s5k0en7calvclhw46hudk5flttj6ydvjc0pv3nchp52amk97tqa5zygg96ms92w6845'
];

document.addEventListener('DOMContentLoaded', () => {
  const dispatch = ui.initialize({
    container: ui.element('container'),

    state: {
      scene: 'loading',
      form: {
        address: ''
      },
      address: {},
      tab: 'cashaddr',
      error: ''
    },

    events: {
      'submit': {
        'click': ['submit-address']
      },
      'start': {
        'click': ['dismiss-error']
      },
      'click-tab': {
        'click': ['cashaddr-tab', 'copay-tab', 'legacy-tab']
      },
      'copy': {
        'click': ['copy-cashaddr', 'copy-copay', 'copy-legacy']
      },
      'change-address': {
        'input': ['address']
      }
    },

    scenes, integrate, react
  });

  dispatch('start');
});

function integrate(state, action, payload) {
  const {scene, form, address, tab, error, valid} = state;

  switch (action) {
  case 'start':
    return {
      scene: 'form',
      error: '',
      valid: true,
      form, address, tab
    };

  case 'change-address':
    return {
      scene: 'form',
      error: '',
      form: ui.merge(state.form, {[payload.name]: payload.value}),
      address, tab, valid
    };

  case 'submit':
    let message = '';
    let isValid = true;

    if (state.form.address.length < 1) {
      message = 'Please enter a Bitcoin Cash address to convert.';
      isValid = false;
    }

    if (BLACKLIST.indexOf(state.form.address) > -1) {
      message = 'The address you have entered is a test address. Please enter a real address.';
      isValid = false;
    }

    if (isValid) {
      return {
        scene: 'loading',
        valid: isValid,
        form, address, tab, error
      };
    } else {
      return {
        scene: 'form',
        error: message,
        valid: isValid,
        form, address, tab
      };
    }

  case 'convert-success':
    return {
      scene: 'address',
      address: payload,
      error: '',
      form, tab, valid
    };

  case 'convert-error':
    return {
      scene: 'form',
      error: payload.error,
      form, tab, address, valid
    };

  case 'click-tab':
    return {
      tab: payload.name,
      scene, form, address, error, valid
    };
  }

  return state;
}

const react = (old, action, payload) => (state, render, dispatch) => {
  if (old.scene !== state.scene) render();

  switch (action) {
  case 'start':
    render();
    break;

  case 'submit':
    if (state.valid === false) {
      render();
      break;
    }

    fetch(`/convert?address=${encodeURIComponent(state.form.address)}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return response.text().then((message) => { throw message; });
        }
      })
      .then(
        (addresses) => dispatch('convert-success', addresses),
        (message) => dispatch('convert-error', {error: message})
      );
    break;

  case 'copy':
    switch (payload.name) {
    case 'copy-cashaddr':
      ui.element('cashaddr-address').select();
      break;
    case 'copy-copay':
      ui.element('copay-address').select();
      break;
    case 'copy-legacy':
      ui.element('legacy-address').select();
    }
    if (document.execCommand('copy')) {
      dispatch('copy-success');
    } else {
      dispatch('copy-error');
    }
    break;

  case 'click-tab':
  case 'convert-success':
    render();
    new QRCode(ui.element(state.tab), {
      text: state.address[state.tab],
      mode: 1,
      width: 256,
      height: 256,
      correctLevel: QRCode.CorrectLevel.L,
    });
  }
};

const scenes = {
  loading: (scenes, state) => `
    ${scenes.form(scenes, state)}
    <div class="sk-folding-cube">
      <div class="sk-cube1 sk-cube"></div>
      <div class="sk-cube2 sk-cube"></div>
      <div class="sk-cube4 sk-cube"></div>
      <div class="sk-cube3 sk-cube"></div>
    </div>
  `,

  form: (scenes, state) => `
    ${scenes.error(scenes, state)}
    <form id="address-form">
      <input type="text"
        id="address"
        name="address"
        autofocus
        autocomplete="off"
        placeholder="qr2z7dusk64qn960h9vspf2ezewl0pla9gcpnk35f0"
        value="${state.form.address}"
        maxlength="64" />

      <input type="submit" id="submit-address" value="Convert">
    </form>
  `,

  address: (scenes, state) => `
    ${scenes.form(scenes, state)}
    <div id="qr-codes">
      <div id="tabs">
        <button class="tab${state.tab === 'cashaddr' ? ' selected-tab' : ''}"
          id="cashaddr-tab" name="cashaddr">
          CashAddr
        </button>
        <button class="tab${state.tab === 'legacy' ? ' selected-tab' : ''}"
          id="legacy-tab" name="legacy">
          Legacy
        </button>
      </div>
      <div class="qr-card${state.tab === 'cashaddr' ? ' selected-tab' : ''}">
        <div class="qr-address">
          <input readonly type="text"
            id="cashaddr-address"
            name="cashaddr"
            value="${state.address.cashaddr}" />
          <button id="copy-cashaddr"
            title="copy cashaddr to clipboard"
            name="copy-cashaddr">
            <span class="ion-clipboard"></span>
          </button>
        </div>
        <div id="cashaddr" class="qr-code"></div>
      </div>
      <div class="qr-card${state.tab === 'legacy' ? ' selected-tab' : ''}">
        <div class="qr-address">
          <input readonly type="text"
            id="legacy-address"
            name="legacy"
            value="${state.address.legacy}" />
          <button id="copy-legacy"
            title="copy legacy address to clipboard"
            name="copy-legacy">
            <span class="ion-clipboard"></span>
          </button>
        </div>
        <div id="legacy" class="qr-code"></div>
      </div>
    </div>
  `,

  error: (scenes, state) => {
    if (state.error.length < 1) {
      return `
        <div id="message-container">
          <div id="message">
            <p>
              Enter a Bitcoin Cash address below to convert it into either the new
              CashAddr format or Legacy format.
            </p>
            <p>
              See
              <a href="https://www.bitcoinabc.org/cashaddr">https://www.bitcoinabc.org/cashaddr</a>
              for more information.
            </p>
          </div>
        </div>
      `;
    } else {
      return `
        <div id="message-container">
          <div id="error">
            <span class="ion-alert-circled"></span>
            <div id="error-message">
              Error: ${state.error}
            </div>
            <div id="dismiss-error" class="ion-close"></div>
          </div>
        </div>
      `
    }
  }
};

})();

;(() => {

const defer = (fn) => setTimeout(fn, 0);
const delay = (duration) => (value) => new Promise((resolve) => setTimeout(() => resolve(value), duration));
const merge = (...args) => Object.assign({}, ...args);
const dedupe = (array) => keys(array.reduce((out, string) => (out[string] = true) && out, {}));
const keys = Object.keys;
const flatten = (array) => array.reduce((out, ary) => out.concat(ary), []);
const values = (object) => keys(object).map(key => object[key]);
const unzip = (object) => keys(object).map(key => [key, object[key]]);
const first = (array) => array[0];
const once = (fn, value, done = false) => (...args) => {
  if (done) return value;
  done = true;
  return (value = fn(...args));
};

const element = document.getElementById.bind(document);

const initialize = ({container, state, events, scenes, integrate, react}) => {
  const dispatch = (action, payload) => {
    if (window.DEBUG) console.log(`[${action}]`, payload);
    const postintegrate = react(state, action, payload);
    state = integrate(state, action, payload);
    const render = once(() => {
      container.innerHTML = scenes[state.scene](scenes, state);
    });
    postintegrate(state, render, (...args) => defer(() => dispatch(...args)));
  };

  dedupe(flatten(values(events).map(unzip)).map(first)).forEach(event => {
    const ids = {};
    unzip(events).forEach(([action, def]) => {
      if (!def[event]) return;
      def[event].forEach(id => {
        ids[id] = ids[id] || [];
        ids[id].push(action);
      });
    });

    container.addEventListener(event, (e) => {
      const {id, name, value} = e.target;
      if (!ids[id]) return;
      e.preventDefault();
      ids[id].forEach(action => dispatch(action, {name, value}));
    });
  });

  return dispatch;
};

window.ui = {
  defer, delay, once,
  keys, values, merge, unzip,
  dedupe, first, flatten,
  element, initialize,
};

})();
