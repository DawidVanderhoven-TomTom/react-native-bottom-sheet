import React, { memo, useCallback } from 'react';
import { View } from 'react-native';
import isEqual from 'lodash.isequal';
import { styles } from './styles';

const BottomSheetContainerComponent = ({
  shouldMeasureHeight,
  onMeasureHeight,
  children
}) => {
  //#region callbacks
  const handleOnLayout = useCallback(({
    nativeEvent: {
      layout: {
        height
      }
    }
  }) => {
    onMeasureHeight(height);
  }, [onMeasureHeight]); //#endregion
  //#region render
  // console.log('BottomSheetContainer', 'render', shouldMeasureHeight);

  return /*#__PURE__*/React.createElement(View, {
    pointerEvents: "box-none",
    style: styles.container,
    onLayout: shouldMeasureHeight ? handleOnLayout : undefined,
    children: children
  }); //#endregion
};

const BottomSheetContainer = /*#__PURE__*/memo(BottomSheetContainerComponent, isEqual);
export default BottomSheetContainer;
//# sourceMappingURL=BottomSheetContainer.js.map