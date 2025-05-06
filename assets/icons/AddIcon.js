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
      d="M217.62 281.87H.78v-63.79h216.84V0h65.03v218.08h216.84v63.79H282.65V500h-65.03V281.87z"
      style={{
        strokeWidth: 0,
      }}
    />
  </Svg>
)
export default SvgComponent
