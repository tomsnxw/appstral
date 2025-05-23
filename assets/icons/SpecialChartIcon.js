import * as React from "react"
import Svg, { Path } from "react-native-svg"
const SvgComponent = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    data-name="Capa 1"
    viewBox="0 0 500 500"
    {...props}
  >
    <Path
      d="m480.17 206.08-56.22-49.57-106.04-93.49H0v373.97h317.91l106.04-93.49 56.22-49.57c26.44-23.31 26.44-64.53 0-87.84Z"
      style={{
        fill: "#6cbcf0",
        strokeWidth: 0,
      }}
    />
  </Svg>
)
export default SvgComponent
