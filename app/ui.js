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

const _connect = ({
  canvas = document.createElement('canvas'),
  host = '127.0.0.1',
  port = 8000,
  path = '',
  secure = false,
  ondisconnect = null,
} = {}) => {
  const rfb = new RFB({
    target: canvas,
    onDisconnected: () => {
      ondisconnect && ondisconnect();
    },
  });
  if (secure) {
    rfb.set_encrypt(true);
  }
  rfb.connect(host, port, undefined, path);

  const keyboard = new Keyboard({
    onKeyEvent: rfb._handleKeyEvent.bind(rfb),
  });

  return {
    handleKeydown: keyboard._eventHandlers.keydown,
    handleKeypress: keyboard._eventHandlers.keypress,
    handleKeyup: keyboard._eventHandlers.keyup,
    disconnect: () => {
      rfb.disconnect();
    },
  };
};

const novnc = {
  connect: _connect,
};
module.exports = novnc;
