import React from "react";
import PropTypes from "prop-types";
import { COLOR_FILL } from "./constants";

export const ReduceCapacity = ({ className, height = "24", width = "24", style = {}, fill = COLOR_FILL, onClick = null }) => {
  return (
    <svg width={width} height={height} className={className} onClick={onClick} style={style} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_176_870)">
        <path
          d="M16 4C16 2.9 16.9 2 18 2C19.1 2 20 2.9 20 4C20 5.1 19.1 6 18 6C16.9 6 16 5.1 16 4ZM20.78 7.58C19.93 7.21 18.99 7 18 7C17.33 7 16.69 7.1 16.08 7.28C16.66 7.83 17 8.6 17 9.43V10H22V9.43C22 8.62 21.52 7.9 20.78 7.58ZM6 6C7.1 6 8 5.1 8 4C8 2.9 7.1 2 6 2C4.9 2 4 2.9 4 4C4 5.1 4.9 6 6 6ZM7.92 7.28C7.31 7.1 6.67 7 6 7C5.01 7 4.07 7.21 3.22 7.58C2.48 7.9 2 8.62 2 9.43V10H7V9.43C7 8.6 7.34 7.83 7.92 7.28ZM10 4C10 2.9 10.9 2 12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4ZM16 10H8V9.43C8 8.62 8.48 7.9 9.22 7.58C10.07 7.21 11.01 7 12 7C12.99 7 13.93 7.21 14.78 7.58C15.52 7.9 16 8.62 16 9.43V10ZM15 16C15 14.9 15.9 14 17 14C18.1 14 19 14.9 19 16C19 17.1 18.1 18 17 18C15.9 18 15 17.1 15 16ZM21 22H13V21.43C13 20.62 13.48 19.9 14.22 19.58C15.07 19.21 16.01 19 17 19C17.99 19 18.93 19.21 19.78 19.58C20.52 19.9 21 20.62 21 21.43V22ZM5 16C5 14.9 5.9 14 7 14C8.1 14 9 14.9 9 16C9 17.1 8.1 18 7 18C5.9 18 5 17.1 5 16ZM11 22H3V21.43C3 20.62 3.48 19.9 4.22 19.58C5.07 19.21 6.01 19 7 19C7.99 19 8.93 19.21 9.78 19.58C10.52 19.9 11 20.62 11 21.43V22ZM12.75 13V11H11.25V13H9L12 16L15 13H12.75Z"
          fill={fill}
        />
      </g>
      <defs>
        <clipPath id="clip0_176_870">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};



ReduceCapacity.propTypes = {
  /** custom width of the svg icon */
  width: PropTypes.string,
  /** custom height of the svg icon */
  height: PropTypes.string,
  /** custom colour of the svg icon */
  fill: PropTypes.string,
  /** custom class of the svg icon */
  className: PropTypes.string,
  /** custom style of the svg icon */
  style: PropTypes.object,
  /** Click Event handler when icon is clicked */
  onClick: PropTypes.func,
};
