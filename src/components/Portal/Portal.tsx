"use client";

import { ElementType, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useHasMounted } from "../../hooks/useHasMounted";

interface BasePortalProps {
  children: React.ReactNode;
  disableScroll?: boolean;
  backdrop?: boolean;
  close?: () => void;
}

interface PortalWithId extends BasePortalProps {
  portalToId: string;
  portalToTag?: never;
}

interface PortalWithTag extends BasePortalProps {
  portalToTag: ElementType;
  portalToId?: never;
}

export const Portal = ({
  children,
  portalToId,
  portalToTag,
  disableScroll = false,
  backdrop = false,
  close,
}: PortalWithId | PortalWithTag) => {
  const mounted = useHasMounted();
  const pageElement = useRef<Element>(null!);

  // @to-do: Create an element to wrap children to provide a backdrop:
  const renderElement = backdrop ? children : children;

  useEffect(() => {
    // *NOTE it just happens that both the scrollElement / safeElement is the body element.
    // They can easily be other elements. But for this project it makes the most sense.
    const scrollElement = document.body; // the main scrolling containing
    const safeElement = document.body; // the safe element is the body element

    let element = safeElement;

    if (portalToTag)
      element = document.querySelector(portalToTag.toString()) ?? safeElement;
    else if (portalToId)
      element = document.getElementById(portalToId) ?? safeElement;

    pageElement.current = element;

    // @to-do:
    // This can potentially cause style issues because it does not take into account
    // the previous overflow style that was applied to the scrollElement.
    //
    // Fixable in two ways:
    //    Method 1 (less invasive):
    //        1. Make a css class with !important on the overflow styles (cus specificity issues).
    //        2. Add/remove that css class on mount/dismount, so that we don't override previous styles.
    //    Method 2 (more invasive):
    //        1. Use computed styles to save the previous overflow styles.
    //        2. Apply that previous overflow style on dismount.
    if (disableScroll) scrollElement.style.overflow = "hidden";
    return () => {
      if (disableScroll) scrollElement.style.overflow = "auto";
    };
  }, []);

  return mounted ? createPortal(renderElement, pageElement.current) : null;
};
