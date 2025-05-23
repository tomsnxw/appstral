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
      cx={250}
      cy={250}
      r={250}
      style={{
        strokeWidth: 0,
        fill: "#ffab00",
      }}
    />
    <Path
      d="M228.08 143.28h43.84l-3.2 147.84h-37.76l-2.88-147.84Zm0 170.56h43.52v42.88h-43.52v-42.88Z"
      style={{
        fill: "#fff",
        strokeWidth: 0,
      }}
    />
  </Svg>
)
export default SvgComponent
