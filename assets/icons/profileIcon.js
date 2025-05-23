import * as React from "react"
import Svg, { Defs, Path } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: style */
const SvgComponent = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    id="Capa_1"
    data-name="Capa 1"
    viewBox="0 0 500 500"
    {...props}
  >
    <Defs></Defs>
    <Path
      d="M250 274.04c107.55 0 200.77 76.44 221.64 181.75 1.32 6.65-1.64 11.49-3.52 13.78a17.394 17.394 0 0 1-13.49 6.39H45.37c-5.24 0-10.16-2.33-13.49-6.39-1.88-2.29-4.84-7.13-3.52-13.78C49.24 350.48 142.45 274.04 250 274.04m0-24.04C128.66 250 27.51 336.45 4.78 451.12-.24 476.47 19.53 500 45.37 500h409.26c25.84 0 45.62-23.53 40.59-48.88C472.49 336.45 371.34 250 250 250ZM250 24.04c49.69 0 90.12 40.43 90.12 90.12s-40.43 90.12-90.12 90.12-90.12-40.43-90.12-90.12S200.31 24.04 250 24.04M250 0c-63.05 0-114.16 51.11-114.16 114.16S186.95 228.32 250 228.32s114.16-51.11 114.16-114.16S313.05 0 250 0Z"
      className="cls-1"
    />
  </Svg>
)
export default SvgComponent
