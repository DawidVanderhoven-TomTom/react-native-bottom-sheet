"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _portal = require("@gorhom/portal");

var _contexts = require("../../contexts");

var _bottomSheetContainer = _interopRequireDefault(require("../bottomSheetContainer"));

var _constants = require("../../constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const BottomSheetModalProviderWrapper = props => {
  // extract props
  const {
    children
  } = props; //#region layout state

  const [containerHeight, setContainerHeight] = (0, _react.useState)(_constants.WINDOW_HEIGHT); //#endregion
  //#region variables

  const sheetsQueueRef = (0, _react.useRef)([]); //#endregion
  //#region callback

  const handleOnContainerMeasureHeight = (0, _react.useCallback)(height => {
    setContainerHeight(height);
  }, []); //#endregion
  //#region private methods

  const handleMountSheet = (0, _react.useCallback)((key, ref) => {
    /**
     * Here we try to minimize the current sheet if exists,
     * also we make sure that it is not incoming mounted sheet.
     */
    const mountedSheet = sheetsQueueRef.current[sheetsQueueRef.current.length - 1];

    if (mountedSheet && mountedSheet.key !== key && !mountedSheet.willUnmount) {
      sheetsQueueRef.current[sheetsQueueRef.current.length - 1].ref.current.minimize();
    }
    /**
     * We check if the incoming sheet is already mounted.
     */


    const isIncomingSheetMounted = sheetsQueueRef.current.find(item => item.key === key) !== undefined;

    if (isIncomingSheetMounted) {
      /**
       * We move the mounted incoming sheet to the
       * end of the queue.
       */
      const newSheetsQueue = sheetsQueueRef.current.filter(item => item.key !== key);
      newSheetsQueue.push({
        key,
        ref,
        willUnmount: false
      });
      sheetsQueueRef.current = newSheetsQueue;
      ref.current.restore();
    } else {
      /**
       * We add the incoming sheet to the end of the queue.
       */
      sheetsQueueRef.current.push({
        key,
        ref,
        willUnmount: false
      });
    }
  }, []);
  const handleUnmountSheet = (0, _react.useCallback)(key => {
    /**
     * Here we remove the unmounted sheet and update
     * the sheets queue.
     */
    const newSheetsQueue = sheetsQueueRef.current.filter(item => item.key !== key);
    sheetsQueueRef.current = newSheetsQueue;
    /**
     * Here we try to restore previous sheet position,
     * This is needed when user dismiss the modal by panning down.
     */

    const hasMinimizedSheet = sheetsQueueRef.current.length > 0;

    if (hasMinimizedSheet) {
      sheetsQueueRef.current[sheetsQueueRef.current.length - 1].ref.current.restore();
    }
  }, []);
  const handleWillUnmountSheet = (0, _react.useCallback)(key => {
    /**
     * Here we mark the sheet that will unmount,
     * so it won't be restored.
     */
    const sheetToBeUnmount = sheetsQueueRef.current.find(item => item.key === key);

    if (sheetToBeUnmount) {
      sheetToBeUnmount.willUnmount = true;
    }
    /**
     * Here we try to restore previous sheet position,
     * This is needed when user dismiss the modal by fire the dismiss action.
     */


    const hasMinimizedSheet = sheetsQueueRef.current.length > 1;

    if (hasMinimizedSheet) {
      sheetsQueueRef.current[sheetsQueueRef.current.length - 2].ref.current.restore();
    }
  }, []); //#endregion
  //#region public methods

  const handleDismiss = (0, _react.useCallback)(key => {
    const sheetToBeDismissed = sheetsQueueRef.current.find(item => item.key === key);

    if (sheetToBeDismissed) {
      sheetToBeDismissed.ref.current.dismiss(true);
    }
  }, []);
  const handleDismissAll = (0, _react.useCallback)(() => {
    sheetsQueueRef.current.map(item => {
      item.ref.current.dismiss(true);
    });
  }, []); //#endregion
  //#region context variables

  const externalContextVariables = (0, _react.useMemo)(() => ({
    dismiss: handleDismiss,
    dismissAll: handleDismissAll
  }), [handleDismiss, handleDismissAll]);
  const internalContextVariables = (0, _react.useMemo)(() => ({
    containerHeight,
    mountSheet: handleMountSheet,
    unmountSheet: handleUnmountSheet,
    willUnmountSheet: handleWillUnmountSheet
  }), [containerHeight, handleMountSheet, handleUnmountSheet, handleWillUnmountSheet]); //#endregion
  //#region renders

  return /*#__PURE__*/_react.default.createElement(_contexts.BottomSheetModalProvider, {
    value: externalContextVariables
  }, /*#__PURE__*/_react.default.createElement(_contexts.BottomSheetModalInternalProvider, {
    value: internalContextVariables
  }, /*#__PURE__*/_react.default.createElement(_bottomSheetContainer.default, {
    shouldMeasureHeight: true,
    onMeasureHeight: handleOnContainerMeasureHeight,
    children: null
  }), /*#__PURE__*/_react.default.createElement(_portal.PortalHost, null, children))); //#endregion
};

var _default = BottomSheetModalProviderWrapper;
exports.default = _default;
//# sourceMappingURL=BottomSheetModalProvider.js.map