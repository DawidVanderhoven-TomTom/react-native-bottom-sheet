function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React, { forwardRef, memo, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Portal, usePortal } from '@gorhom/portal';
import { nanoid } from 'nanoid/non-secure';
import isEqual from 'lodash.isequal';
import BottomSheet from '../bottomSheet';
import { useBottomSheetModalInternal } from '../../hooks';
import { DEFAULT_DISMISS_ON_PAN_DOWN } from './constants';
const BottomSheetModalComponent = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    // modal props
    name,
    dismissOnPanDown = DEFAULT_DISMISS_ON_PAN_DOWN,
    onDismiss: _providedOnDismiss,
    // bottom sheet props
    index: _providedIndex = 0,
    snapPoints: _providedSnapPoints,
    onChange: _providedOnChange,
    // components
    children,
    ...bottomSheetProps
  } = props; //#region state

  const [mount, setMount] = useState(false); //#endregion
  //#region hooks

  const {
    unmount: unmountPortal
  } = usePortal();
  const {
    containerHeight,
    mountSheet,
    unmountSheet,
    willUnmountSheet
  } = useBottomSheetModalInternal(); //#endregion
  //#region refs

  const bottomSheetRef = useRef(null);
  const isMinimized = useRef(false);
  const isForcedDismissed = useRef(false);
  const currentIndexRef = useRef(-1);
  const nextIndexRef = useRef(-1); //#endregion
  //#region variables

  const key = useMemo(() => name || "bottom-sheet-modal-".concat(nanoid()), [name]);
  const index = useMemo(() => dismissOnPanDown ? _providedIndex + 1 : _providedIndex, [_providedIndex, dismissOnPanDown]);
  nextIndexRef.current = index;
  const snapPoints = useMemo(() => dismissOnPanDown ? [0, ..._providedSnapPoints] : _providedSnapPoints, [_providedSnapPoints, dismissOnPanDown]); //#endregion
  //#region callbacks

  const doDismiss = useCallback(() => {
    // reset
    isMinimized.current = false;
    isForcedDismissed.current = false; // unmount the sheet and the portal

    unmountSheet(key);
    unmountPortal(key);
    setMount(false); // fire the call back

    if (_providedOnDismiss) {
      _providedOnDismiss();
    }
  }, [key, _providedOnDismiss, unmountSheet, unmountPortal]);
  const handleOnChange = useCallback(_index => {
    if (isMinimized.current && !isForcedDismissed.current) {
      return;
    }

    const adjustedIndex = dismissOnPanDown ? _index - 1 : _index;
    currentIndexRef.current = _index;
    nextIndexRef.current = _index;

    if (adjustedIndex >= 0) {
      if (_providedOnChange) {
        _providedOnChange(adjustedIndex);
      }
    } else {
      doDismiss();
    }
  }, [dismissOnPanDown, _providedOnChange, doDismiss]); //#endregion
  //#region public methods

  const handlePresent = useCallback(() => {
    requestAnimationFrame(() => {
      setMount(true);
      mountSheet(key, ref);
    });
  }, [key, mountSheet, ref]);
  const handleDismiss = useCallback((force = false) => {
    var _bottomSheetRef$curre;

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

    (_bottomSheetRef$curre = bottomSheetRef.current) === null || _bottomSheetRef$curre === void 0 ? void 0 : _bottomSheetRef$curre.close();
  }, [key, doDismiss, willUnmountSheet]);
  const handleClose = useCallback(() => {
    var _bottomSheetRef$curre2;

    if (isMinimized.current) {
      return;
    }

    nextIndexRef.current = 0;
    (_bottomSheetRef$curre2 = bottomSheetRef.current) === null || _bottomSheetRef$curre2 === void 0 ? void 0 : _bottomSheetRef$curre2.close();
  }, []);
  const handleCollapse = useCallback(() => {
    var _bottomSheetRef$curre3;

    if (isMinimized.current) {
      return;
    }

    nextIndexRef.current = dismissOnPanDown ? 1 : 0;
    (_bottomSheetRef$curre3 = bottomSheetRef.current) === null || _bottomSheetRef$curre3 === void 0 ? void 0 : _bottomSheetRef$curre3.snapTo(dismissOnPanDown ? 1 : 0);
  }, [dismissOnPanDown]);
  const handleExpand = useCallback(() => {
    var _bottomSheetRef$curre4;

    if (isMinimized.current) {
      return;
    }

    nextIndexRef.current = snapPoints.length - 1;
    (_bottomSheetRef$curre4 = bottomSheetRef.current) === null || _bottomSheetRef$curre4 === void 0 ? void 0 : _bottomSheetRef$curre4.expand();
  }, [snapPoints]);
  const handleSnapTo = useCallback(_index => {
    var _bottomSheetRef$curre5;

    if (isMinimized.current) {
      return;
    }

    nextIndexRef.current = _index + (dismissOnPanDown ? 1 : 0);
    (_bottomSheetRef$curre5 = bottomSheetRef.current) === null || _bottomSheetRef$curre5 === void 0 ? void 0 : _bottomSheetRef$curre5.snapTo(_index + (dismissOnPanDown ? 1 : 0));
  }, [dismissOnPanDown]); //#endregion
  //#region private methods

  const handleMinimize = useCallback(() => {
    if (!isMinimized.current) {
      var _bottomSheetRef$curre6;

      isMinimized.current = true;
      (_bottomSheetRef$curre6 = bottomSheetRef.current) === null || _bottomSheetRef$curre6 === void 0 ? void 0 : _bottomSheetRef$curre6.close();
    }
  }, []);
  const handleRestore = useCallback(() => {
    if (isMinimized.current) {
      var _bottomSheetRef$curre7;

      isMinimized.current = false;
      (_bottomSheetRef$curre7 = bottomSheetRef.current) === null || _bottomSheetRef$curre7 === void 0 ? void 0 : _bottomSheetRef$curre7.snapTo(nextIndexRef.current, true);
    }
  }, []);
  const handleOnUnmount = useCallback(() => {
    handleDismiss(true);
  }, [handleDismiss]); //#endregion
  //#region expose public methods

  useImperativeHandle(ref, () => ({
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

  return mount ? /*#__PURE__*/React.createElement(Portal, {
    key: key,
    name: key,
    handleOnUnmount: handleOnUnmount
  }, /*#__PURE__*/React.createElement(BottomSheet, _extends({}, bottomSheetProps, {
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
const BottomSheetModal = /*#__PURE__*/memo(BottomSheetModalComponent, isEqual);
export default BottomSheetModal;
//# sourceMappingURL=BottomSheetModal.js.map