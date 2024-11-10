/**
 * Since this file is for development purposes only, some of the dependencies are in devDependencies
 * Disabling ESLint rules for these dependencies since we know it is only for development purposes
 */

import React, { useCallback, useEffect, useState, useRef } from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import ReactDOMClient from "react-dom/client";
// eslint-disable-next-line import/no-extraneous-dependencies
import styled, { createGlobalStyle } from "styled-components";
import {
  init,
  FocusDetails,
  FocusableComponentLayout,
  KeyPressDetails,
} from "@hrgui/spatial-navigation-core";
import { FocusContext, useFocusable } from "@hrgui/react-spatial-navigation";

init({
  debug: false,
  visualDebug: false,
  distanceCalculationMethod: "center",
});

const rows = [
  {
    title: "Recommended",
    isOverlapping: true,
  },
  {
    title: "Movies",
  },
  {
    title: "Series",
  },
  {
    title: "TV Channels",
  },
  {
    title: "Sport",
  },
];

const assets = [
  {
    title: "Asset 1",
    color: "#714ADD",
  },
  {
    title: "Asset 2",
    color: "#AB8DFF",
  },
  {
    title: "Asset 3",
    color: "#512EB0",
  },
  {
    title: "Asset 4",
    color: "#714ADD",
  },
  {
    title: "Asset 5",
    color: "#AB8DFF",
  },
  {
    title: "Asset 6",
    color: "#512EB0",
  },
  {
    title: "Asset 7",
    color: "#714ADD",
  },
  {
    title: "Asset 8",
    color: "#AB8DFF",
  },
  {
    title: "Asset 9",
    color: "#512EB0",
  },
];

interface MenuItemBoxProps {
  focused: boolean;
}

const MenuItemBox = styled.div<MenuItemBoxProps>`
  width: 171px;
  height: 51px;
  background-color: #b056ed;
  border-color: white;
  border-style: solid;
  border-width: ${({ focused }) => (focused ? "6px" : 0)};
  box-sizing: border-box;
  border-radius: 7px;
  margin-bottom: 37px;
`;

function MenuItem() {
  const { ref, focused } = useFocusable();

  return <MenuItemBox ref={ref} focused={focused} />;
}

interface MenuWrapperProps {
  hasFocusedChild: boolean;
}

const MenuWrapper = styled.div<MenuWrapperProps>`
  flex: 1;
  max-width: 246px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ hasFocusedChild }) => (hasFocusedChild ? "#4e4181" : "#362C56")};
  padding-top: 37px;
`;

interface MenuProps {
  focusKey: string;
}

function Menu({ focusKey: focusKeyParam }: MenuProps) {
  const {
    ref,
    focusSelf,
    hasFocusedChild,
    focusKey,
    // setFocus, -- to set focus manually to some focusKey
    // navigateByDirection, -- to manually navigate by direction
    // pause, -- to pause all navigation events
    // resume, -- to resume all navigation events
    // updateAllLayouts, -- to force update all layouts when needed
    // getCurrentFocusKey -- to get the current focus key
  } = useFocusable({
    focusable: true,
    saveLastFocusedChild: false,
    trackChildren: true,
    autoRestoreFocus: true,
    isFocusBoundary: false,
    focusKey: focusKeyParam,
    preferredChildFocusKey: null,
    onEnterPress: () => {},
    onEnterRelease: () => {},
    onArrowPress: () => true,
    onFocus: () => {},
    onBlur: () => {},
    extraProps: { foo: "bar" },
  });

  useEffect(() => {
    focusSelf();
  }, [focusSelf]);

  return (
    <FocusContext.Provider value={focusKey}>
      <MenuWrapper ref={ref} hasFocusedChild={hasFocusedChild}>
        <MenuItem />
        <MenuItem />
        <MenuItem />
        <MenuItem />
        <MenuItem />
      </MenuWrapper>
    </FocusContext.Provider>
  );
}

const AssetWrapper = styled.div`
  margin-right: ${({ isOverlapping }) => (isOverlapping ? "-22px" : "22px")};
  display: flex;
  flex-direction: column;
`;

interface AssetBoxProps {
  index: number;
  isShuffleSize: boolean;
  focused: boolean;
  color: string;
}

const AssetBox = styled.div<AssetBoxProps>`
  width: ${({ isShuffleSize, index }) => (isShuffleSize ? `${80 + index * 30}px` : "225px")};
  height: 127px;
  background-color: ${({ color }) => color};
  border-color: white;
  border-style: solid;
  border-width: ${({ focused }) => (focused ? "6px" : 0)};
  box-sizing: border-box;
  border-radius: 7px;
`;

const AssetTitle = styled.div`
  color: white;
  margin-top: 10px;
  font-family: "Segoe UI";
  font-size: 24px;
  font-weight: 400;
`;

interface AssetProps {
  index: number;
  isShuffleSize: boolean;
  title: string;
  color: string;
  onEnterPress: (props: object, details: KeyPressDetails) => void;
  onFocus: (layout: FocusableComponentLayout, props: object, details: FocusDetails) => void;
  isOverlapping?: boolean;
}

function Asset({
  title,
  color,
  onEnterPress,
  onFocus,
  isShuffleSize,
  index,
  isOverlapping,
}: AssetProps) {
  const { ref, focused } = useFocusable({
    onEnterPress,
    onFocus,
    extraProps: {
      title,
      color,
      index,
    },
  });

  return (
    <AssetWrapper isOverlapping={isOverlapping} ref={ref}>
      <AssetBox index={index} color={color} focused={focused} isShuffleSize={isShuffleSize} />
      <AssetTitle>{title}</AssetTitle>
    </AssetWrapper>
  );
}

const ContentRowWrapper = styled.div`
  margin-bottom: 37px;
`;

const ContentRowTitle = styled.div`
  color: white;
  margin-bottom: 22px;
  font-size: 27px;
  font-weight: 700;
  font-family: "Segoe UI";
  padding-left: 60px;
`;

const ContentRowScrollingWrapper = styled.div`
  overflow-x: auto;
  overflow-y: hidden;
  flex-shrink: 1;
  flex-grow: 1;
  padding-left: 60px;
`;

const ContentRowScrollingContent = styled.div`
  display: flex;
  flex-direction: row;
`;

interface ContentRowProps {
  isShuffleSize: boolean;
  title: string;
  isOverlapping: boolean;
  onAssetPress: (props: object, details: KeyPressDetails) => void;
  onFocus: (layout: FocusableComponentLayout, props: object, details: FocusDetails) => void;
}

function ContentRow({
  title: rowTitle,
  isOverlapping = false,
  onAssetPress,
  onFocus,
  isShuffleSize,
}: ContentRowProps) {
  const { ref, focusKey } = useFocusable({
    onFocus,
    onGetChildSibling: ({
      isVerticalDirection,
      isIncrementalDirection,
      proposedSibling,
      currentComponent,
    }) => {
      const currentComponentExtraProps = currentComponent.extraProps;
      const proposedSiblingExtraProps = proposedSibling.extraProps;
      const isHorizontalDirection = !isVerticalDirection;

      if (currentComponentExtraProps && proposedSiblingExtraProps && isHorizontalDirection) {
        const nextIndex = currentComponentExtraProps.index + 1;
        const prevIndex = currentComponentExtraProps.index - 1;

        return isIncrementalDirection
          ? nextIndex === proposedSiblingExtraProps.index
          : prevIndex === proposedSiblingExtraProps.index;
      }

      return false;
    },
  });

  const scrollingRef = useRef(null);

  const onAssetFocus = useCallback(
    ({ x }: { x: number }) => {
      scrollingRef.current.scrollTo({
        left: x,
        behavior: "smooth",
      });
    },
    [scrollingRef]
  );

  return (
    <FocusContext.Provider value={focusKey}>
      <ContentRowWrapper ref={ref}>
        <ContentRowTitle>{rowTitle}</ContentRowTitle>
        <ContentRowScrollingWrapper ref={scrollingRef}>
          <ContentRowScrollingContent>
            {assets.map(({ title, color }, index) => (
              <Asset
                isOverlapping={isOverlapping}
                index={index}
                title={title}
                color={color}
                onEnterPress={onAssetPress}
                onFocus={onAssetFocus}
                isShuffleSize={isShuffleSize}
              />
            ))}
          </ContentRowScrollingContent>
        </ContentRowScrollingWrapper>
      </ContentRowWrapper>
    </FocusContext.Provider>
  );
}

const ContentWrapper = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ContentTitle = styled.div`
  color: white;
  font-size: 48px;
  font-weight: 600;
  font-family: "Segoe UI";
  text-align: center;
  margin-top: 52px;
  margin-bottom: 37px;
`;

const SelectedItemWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SelectedItemBox = styled.div`
  height: 282px;
  width: 1074px;
  background-color: ${({ color }) => color};
  margin-bottom: 37px;
  border-radius: 7px;
`;

const SelectedItemTitle = styled.div`
  position: absolute;
  bottom: 75px;
  left: 100px;
  color: white;
  font-size: 27px;
  font-weight: 400;
  font-family: "Segoe UI";
`;

const ScrollingRows = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  flex-shrink: 1;
  flex-grow: 1;
`;

function Content() {
  const { ref, focusKey } = useFocusable();

  const [selectedAsset, setSelectedAsset] = useState(null);

  const onAssetPress = useCallback((asset: AssetProps) => {
    setSelectedAsset(asset);
  }, []);

  const onRowFocus = useCallback(
    ({ y }: { y: number }) => {
      ref.current.scrollTo({
        top: y,
        behavior: "smooth",
      });
    },
    [ref]
  );

  return (
    <FocusContext.Provider value={focusKey}>
      <ContentWrapper>
        <ContentTitle>Spatial Navigation</ContentTitle>
        <SelectedItemWrapper>
          <SelectedItemBox color={selectedAsset ? selectedAsset.color : "#565b6b"} />
          <SelectedItemTitle>
            {selectedAsset ? selectedAsset.title : 'Press "Enter" to select an asset'}
          </SelectedItemTitle>
        </SelectedItemWrapper>
        <ScrollingRows ref={ref}>
          <div>
            {rows.map(({ title, isOverlapping }) => (
              <ContentRow
                isOverlapping={isOverlapping}
                key={title}
                title={title}
                onAssetPress={onAssetPress}
                onFocus={onRowFocus}
                isShuffleSize={Math.random() < 0.5} // Rows will have children assets of different sizes, randomly setting it to true or false.
              />
            ))}
          </div>
        </ScrollingRows>
      </ContentWrapper>
    </FocusContext.Provider>
  );
}

const AppContainer = styled.div`
  background-color: #221c35;
  width: 1440px;
  height: 810px;
  display: flex;
  flex-direction: row;
`;

const GlobalStyle = createGlobalStyle`
  ::-webkit-scrollbar {
    display: none;
  }
`;

function App() {
  return (
    <React.StrictMode>
      <AppContainer>
        <GlobalStyle />
        <Menu focusKey="MENU" />
        <Content />
      </AppContainer>
    </React.StrictMode>
  );
}

const root = ReactDOMClient.createRoot(document.querySelector("#root"));
root.render(<App />);