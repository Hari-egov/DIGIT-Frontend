import React, { useState, Fragment, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { SVG } from "./SVG";
import StringManipulator from "./StringManipulator";

const PopUp = (props) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const childrenWrapRef = useRef(null);

  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 480);

  const checkOverflow = () => {
    if (childrenWrapRef.current) {
      const isOverflow =
        childrenWrapRef.current.scrollHeight >
        childrenWrapRef.current.clientHeight;
      setIsOverflowing(isOverflow);
    }
  };

  const onResize = () => {
    if (window.innerWidth <= 480) {
      if (!isMobileView) {
        setIsMobileView(true);
      }
    } else {
      if (isMobileView) {
        setIsMobileView(false);
      }
    }
    checkOverflow();
  };

  useEffect(() => {
    const handleScroll = () => checkOverflow();
    const childrenWrap = childrenWrapRef.current;

    if (childrenWrap) {
      childrenWrap.addEventListener("scroll", handleScroll);
      checkOverflow();
    }

    return () => {
      if (childrenWrap) {
        childrenWrap.removeEventListener("scroll", handleScroll);
      }
    };
  }, [props.children]);

  useEffect(() => {
    window.addEventListener("resize", onResize);

    checkOverflow();

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const IconRender = (type, iconReq, iconFill) => {
    const fill = iconFill || "#D4351C";
    const width = type === "alert" ? "48px" : "32px";
    const height = type === "alert" ? "48px" : "32px";

    try {
      const components = require("@digit-ui/digit-ui-svg-components");
      const DynamicIcon = components?.[iconReq];
      if (DynamicIcon) {
        const svgElement = DynamicIcon({
          width: width,
          height: height,
          fill: fill,
          className: `digit-popup-customIcon ${type ? type : ""}`,
        });
        return svgElement;
      } else {
        console.error("Icon not found");
        return null;
      }
    } catch (error) {
      console.error("Icon not found");
      return null;
    }
  };

  const iconGenerated = IconRender(
    props?.type,
    props?.customIcon,
    props?.iconFill
  );

  const hasFooterChildren = props?.footerChildren?.length > 0;

  const allowedFooter = hasFooterChildren
    ? props?.footerChildren?.slice(0, props?.maxFooterButtonsAllowed || 5)
    : [];

  const sortedFooterButtons = [...allowedFooter]?.sort((a, b) => {
    const typeOrder = { primary: 3, secondary: 2, tertiary: 1 };
    const getTypeOrder = (button) =>
      typeOrder[(button.props.variation || "").toLowerCase()];
    return getTypeOrder(a) - getTypeOrder(b);
  });

  const finalFooterArray = props?.sortFooterButtons
    ? isMobileView
      ? sortedFooterButtons.reverse()
      : sortedFooterButtons
    : allowedFooter;

  return (
    <div className={`popup-overlay ${props?.overlayClassName || ""}`} onClick={() => props?.onOverlayClick()}>
      <div
        className={`digit-popup-wrap ${
          props?.className ? props?.className : ""
        } ${props?.type ? props?.type : ""}`}
        style={props?.style}
      >
        {props?.type === "alert" ? (
          <div
            className={`digit-popup-alert-content ${
              isOverflowing ? "with-shadow" : ""
            }`}
          >
            {!props?.customIcon && (
              <SVG.Warning
                fill={props?.iconFill ? props?.iconFill : "#D4351C"}
                width={"48px"}
                height={"48px"}
                className="popup-alert-icon"
              />
            )}
            {props?.customIcon && iconGenerated}
            <div className="digit-popup-alert-heading">
              {props?.alertHeading || "Alert!"}
            </div>
            <div className="digit-popup-alert-message">
              {props?.alertMessage || "AlertMessage"}
            </div>
          </div>
        ) : (
          <>
            <div
              className={`digit-popup-header ${
                props?.headerclassName ? props?.headerclassName : ""
              }  ${isOverflowing ? "with-shadow" : ""}`}
              style={{ display: "flex" }}
            >
              <div
                className="header-close-container"
                style={{ display: "flex" }}
              >
                <div
                  className="digit-popup-icon-header-container"
                  style={{ display: "flex" }}
                >
                  {props?.showIcon && !props?.customIcon && (
                    <SVG.ErrorOutline
                      fill={props?.iconFill ? props?.iconFill : "#D4351C"}
                      width={"32px"}
                      height={"32px"}
                      className="popup-error-icon"
                    />
                  )}
                  {props?.showIcon && props?.customIcon && iconGenerated}
                  <div
                    className="digit-popup-heading-subheading-wrap"
                    style={{ display: "flex" }}
                  >
                    {props?.heading && (
                      <div className="digit-popup-heading">
                        {StringManipulator(
                          "TOSENTENCECASE",
                          StringManipulator("TRUNCATESTRING", props?.heading, {
                            maxLength: props?.headerMaxLength || 256,
                          })
                        )}
                      </div>
                    )}
                    {props?.subheading && (
                      <div className="digit-popup-subheading">
                        {StringManipulator(
                          "TOSENTENCECASE",
                          StringManipulator(
                            "TRUNCATESTRING",
                            props?.subheading,
                            {
                              maxLength: props?.subHeaderMaxLength || 256,
                            }
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <span
                  className="digit-popup-close"
                  style={{ display: "flex" }}
                  onClick={() => props?.onClose()}
                >
                  <SVG.Close
                    fill={"#363636"}
                    width={"24px"}
                    height={"24px"}
                    className="popup-close-svg"
                  />
                </span>
              </div>
            </div>
          </>
        )}
        <div
          ref={childrenWrapRef}
          className={`digit-popup-children-wrap ${
            props?.showChildrenInline ? "inline" : ""
          } ${isOverflowing ? "with-shadow" : ""} ${
            !hasFooterChildren ? "without-footer" : ""
          }`}
        >
          {props?.description && (
            <div className="digit-popup-description">{props?.description}</div>
          )}
          {props?.children}
        </div>
        {hasFooterChildren && (
          <div
            className={`digit-popup-footer ${
              props?.footerclassName ? props?.footerclassName : ""
            } ${isOverflowing ? "with-shadow" : ""}`}
          >
            <div
              className="digit-popup-footer-buttons"
              style={{ ...props?.footerStyles }}
            >
              {finalFooterArray}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

PopUp.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
  headerclassName: PropTypes.string,
  footerclassName: PropTypes.string,
  headerChildren: PropTypes.node,
  footerChildren: PropTypes.node,
  onClose: PropTypes.func,
  type: PropTypes.string,
  onOverlayClick:PropTypes.func
};

export default PopUp;