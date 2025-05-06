import * as React from "react"
import Svg, { Defs, Path } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: style */
const SvgComponent = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    id="uuid-3e4c4778-932c-431e-a776-5032a65e47a0"
    data-name="Capa 1"
    viewBox="0 0 500 500"
    {...props}
  >
    <Defs></Defs>
    <Path
      d="M0 197.67h104.65v104.65H0zM197.67 197.67h104.65v104.65H197.67zM395.35 197.67H500v104.65H395.35z"
      className="uuid-1ab648a6-275f-470e-8331-3e9e02a51211"
    />
  </Svg>
)
export default SvgComponent
