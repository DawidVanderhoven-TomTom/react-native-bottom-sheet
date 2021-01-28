"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _portal = require("@gorhom/portal");

var _nonSecure = require("nanoid/non-secure");

var _lodash = _interopRequireDefault(require("lodash.isequal"));

var _bottomSheet = _interopRequireDefault(require("../bottomSheet"));

var _hooks = require("../../hooks");

var _constants = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const BottomSheetModalComponent = /*#__PURE__*/(0, _react.forwardRef)((props, ref) => {
  const {
    // modal props
    name,
    dismissOnPanDown = _constants.DEFAULT_DISMISS_ON_PAN_DOWN,
    onDismiss: _providedOnDismiss,
    // bottom sheet props
    index: _providedIndex = 0,
    snapPoints: _providedSnapPoints,
    onChange: _providedOnChange,
    // components
    children,
    ...bottomSheetProps
  } = props; //#region state

  const [mount, setMount] = (0, _react.useState)(false); //#endregion

  const {
    containerHeight,
    mountSheet,
    unmountSheet,
    willUnmountSheet
  } = (0, _hooks.useBottomSheetModalInternal)(); //#region refs

  const bottomSheetRef = (0, _react.useRef)(null);
  const isMinimized = (0, _react.useRef)(false);
  const isForcedDismissed = (0, _react.useRef)(false);
  const currentIndexRef = (0, _react.useRef)(-1); //#endregion
  //#region variables

  const key = (0, _react.useMemo)(() => name || "bottom-sheet-modal-".concat((0, _nonSecure.nanoid)()), [name]);
  const index = (0, _react.useMemo)(() => dismissOnPanDown ? _providedIndex + 1 : _providedIndex, [_providedIndex, dismissOnPanDown]);
  const snapPoints = (0, _react.useMemo)(() => dismissOnPanDown ? [0, ..._providedSnapPoints] : _providedSnapPoints, [_providedSnapPoints, dismissOnPanDown]); //#endregion
  //#region callbacks

  const doDismiss = (0, _react.useCallback)(() => {
    if (_providedOnDismiss) {
      _providedOnDismiss();
    }

    setMount(false);
    unmountSheet(key); // reset

    isMinimized.current = false;
    isForcedDismissed.current = false;
  }, [key, _providedOnDismiss, unmountSheet]);
  const handleOnChange = (0, _react.useCallback)(_index => {
    if (isMinimized.current && !isForcedDismissed.current) {
      return;
    }

    const adjustedIndex = dismissOnPanDown ? _index - 1 : _index;
    currentIndexRef.current = _index;

    if (adjustedIndex >= 0) {
      if (_providedOnChange) {
        _providedOnChange(adjustedIndex);
      }
    } else {
      doDismiss();
    }
  }, [dismissOnPanDown, _providedOnChange, doDismiss]); //#endregion
  //#region private methods

  const handleMinimize = (0, _react.useCallback)(() => {
    if (!isMinimized.current) {
      var _bottomSheetRef$curre;

      isMinimized.current = true;
      (_bottomSheetRef$curre = bottomSheetRef.current) === null || _bottomSheetRef$curre === void 0 ? void 0 : _bottomSheetRef$curre.close();
    }
  }, []);
  const handleRestore = (0, _react.useCallback)(() => {
    if (isMinimized.current) {
      var _bottomSheetRef$curre2;

      isMinimized.current = false;
      (_bottomSheetRef$curre2 = bottomSheetRef.current) === null || _bottomSheetRef$curre2 === void 0 ? void 0 : _bottomSheetRef$curre2.snapTo(currentIndexRef.current);
    }
  }, []); //#endregion
  //#region public methods

  const handlePresent = (0, _react.useCallback)(() => {
    requestAnimationFrame(() => {
      setMount(true);
      mountSheet(key, ref);
    });
  }, [key, mountSheet, ref]);
  const handleDismiss = (0, _react.useCallback)((force = false) => {
    var _bottomSheetRef$curre3;

    if (force) {
      if (isMinimized.current) {
        doDismiss();
        return;
      }

      isForcedDismissed.current = true;
      isMinimized.current = false;
    } else {
      willUnmountSheet(key);
    }

    (_bottomSheetRef$curre3 = bottomSheetRef.current) === null || _bottomSheetRef$curre3 === void 0 ? void 0 : _bottomSheetRef$curre3.close();
  }, [key, doDismiss, willUnmountSheet]);
  const handleClose = (0, _react.useCallback)(() => {
    var _bottomSheetRef$curre4;

    if (isMinimized.current) {
      return;
    }

    (_bottomSheetRef$curre4 = bottomSheetRef.current) === null || _bottomSheetRef$curre4 === void 0 ? void 0 : _bottomSheetRef$curre4.close();
  }, []);
  const handleCollapse = (0, _react.useCallback)(() => {
    if (isMinimized.current) {
      return;
    }

    if (dismissOnPanDown) {
      var _bottomSheetRef$curre5;

      (_bottomSheetRef$curre5 = bottomSheetRef.current) === null || _bottomSheetRef$curre5 === void 0 ? void 0 : _bottomSheetRef$curre5.snapTo(1);
    } else {
      var _bottomSheetRef$curre6;

      (_bottomSheetRef$curre6 = bottomSheetRef.current) === null || _bottomSheetRef$curre6 === void 0 ? void 0 : _bottomSheetRef$curre6.collapse();
    }
  }, [dismissOnPanDown]);
  const handleExpand = (0, _react.useCallback)(() => {
    var _bottomSheetRef$curre7;

    if (isMinimized.current) {
      return;
    }

    (_bottomSheetRef$curre7 = bottomSheetRef.current) === null || _bottomSheetRef$curre7 === void 0 ? void 0 : _bottomSheetRef$curre7.expand();
  }, []);
  const handleSnapTo = (0, _react.useCallback)(_index => {
    var _bottomSheetRef$curre8;

    if (isMinimized.current) {
      return;
    }

    (_bottomSheetRef$curre8 = bottomSheetRef.current) === null || _bottomSheetRef$curre8 === void 0 ? void 0 : _bottomSheetRef$curre8.snapTo(_index + (dismissOnPanDown ? 1 : 0));
  }, [dismissOnPanDown]); //#endregion
  //#region expose public methods

  (0, _react.useImperativeHandle)(ref, () => ({
    present: handlePresent,
    dismiss: handleDismiss,
    close: handleClose,
    snapTo: handleSnapTo,
    expand: handleExpand,
    collapse: handleCollapse,
    // private
    minimize: handleMinimize,
    restore: handleRestore
  })); //#endregion
  // render

  return mount ? /*#__PURE__*/_react.default.createElement(_portal.Portal, {
    key: key,
    name: key
  }, /*#__PURE__*/_react.default.createElement(_bottomSheet.default, _extends({}, bottomSheetProps, {
    ref: bottomSheetRef,
    key: key,
    index: index,
    snapPoints: snapPoints,
    animateOnMount: true,
    containerHeight: containerHeight,
    onChange: handleOnChange,
    children: children
  }))) : null;
});
const BottomSheetModal = /*#__PURE__*/(0, _react.memo)(BottomSheetModalComponent, _lodash.default);
var _default = BottomSheetModal;
exports.default = _default;
//# sourceMappingURL=BottomSheetModal.js.map