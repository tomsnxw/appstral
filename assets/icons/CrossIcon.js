import * as React from "react"
import Svg, { Circle, Path } from "react-native-svg"
const SvgComponent = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    data-name="Capa 1"
    viewBox="0 0 500 500"
    {...props}
  >
    <Circle
      cx={249}
      cy={250}
      r={250}
      style={{
        strokeWidth: 0,
        fill: "#ff0e2c",
      }}
    />
    <Path
      d="m237.51 249.88-38.7-38.7 11.38-11.38 38.7 38.7 38.93-38.93 11.61 11.61-38.93 38.93 38.7 38.7-11.38 11.38-38.7-38.7-38.93 38.93-11.61-11.61 38.93-38.93Z"
      style={{
        fill: "#fff",
        strokeWidth: 0,
      }}
    />
  </Svg>
)
export default SvgComponent
