import * as Log from '../core/util/logging.js';
import _, { l10n } from '../core/util/localization.js';
import { isTouchDevice, browserSupportsCursorURIs as cursorURIsSupported } from '../core/util/browsers.js';
import { setCapture, getPointerEvent } from '../core/util/events.js';
import KeyTable from "../core/input/keysym.js";
import keysyms from "../core/input/keysymdef.js";
import RFB from "../core/rfb.js";
import Display from "../core/display.js";
import * as WebUtil from "./webutil.js";

import {Keyboard} from "../core/input/devices.js";

const _connect = ({canvas, host, port, path, ondisconnect}) => {
  const rfb = new RFB({
    target: canvas,
    // 'onNotification': UI.notification,
    /* 'onUpdateState': (rfb, state, oldstate) => {
      console.log('update state', JSON.stringify(state));
    }, */
    onDisconnected: () => {
      ondisconnect && ondisconnect();
    },
    // 'onPasswordRequired': UI.passwordRequired,
    // 'onXvpInit': UI.updateXvpButton,
    /* 'onClipboard': (rfb, text) => {
      console.log('clipboard receive', JSON.stringify(text));
    }, */
    // 'onBell': UI.bell,
    // 'onFBUComplete': UI.initialResize,
    // 'onFBResize': UI.updateViewDrag,
    /* 'onDesktopName': (rfb, name) => {
      console.log('desktop name', JSON.stringify(name));
    }, */
  });

  /* const _sendClipboard = text => {
    rfb.clipboardPasteFrom(text);
  }; */

  /* rfb.set_encrypt(UI.getSetting('encrypt'));
  rfb.set_true_color(UI.getSetting('true_color'));
  rfb.set_local_cursor(UI.getSetting('cursor'));
  rfb.set_shared(UI.getSetting('shared'));
  rfb.set_view_only(UI.getSetting('view_only'));
  rfb.set_repeaterID(UI.getSetting('repeaterID')); */

  // rfb.set_encrypt(false);
  // rfb.set_true_color(true);
  // rfb.set_local_cursor(true);
  // rfb.set_shared(true);
  // rfb.set_view_only(false);
  // rfb.set_repeaterID(true);

  // rfb.connect('localhost', 8000, 'password', '/');
  rfb.connect(host, port, undefined, path);

  const keyboard = new Keyboard({
    onKeyEvent: rfb._handleKeyEvent.bind(rfb),
  });

  return {
    handleKeydown: keyboard._eventHandlers.keydown,
    handleKeypress: keyboard._eventHandlers.keypress,
    handleKeyup: keyboard._eventHandlers.keyup,
  };
};

window.connect = _connect;
