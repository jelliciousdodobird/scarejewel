"use client";

import {
  createElement,
  ElementType,
  forwardRef,
  Fragment,
  useEffect,
  useRef,
} from "react";
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

type PortalProps = PortalWithId | PortalWithTag;

export const Portal = forwardRef<HTMLDivElement, PortalProps>(
  (
    {
      children,
      portalToId,
      portalToTag,
      disableScroll = false,
      backdrop = false,
      close,
    },
    ref
  ) => {
    const mounted = useHasMounted();

    const pageElement = useRef<Element>(null!);

    // @to-do: Create an element to wrap children to provide a backdrop:
    const renderElement = backdrop ? children : children;

    const portalElement = mounted ? (
      createPortal(renderElement, pageElement.current)
    ) : (
      <></>
    );

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

      // using tailwind css to hide scrollbars:
      if (disableScroll) scrollElement.classList.add("!overflow-hidden");
      return () => {
        if (disableScroll) scrollElement.classList.remove("!overflow-hidden");
      };
    }, []);

    useEffect(() => {
      console.log("PORTAL");
    });

    // if (ref) return <div ref={ref}>{mounted && portalElement}</div>;
    return portalElement;
  }
);
