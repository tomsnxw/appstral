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
      d="M149.57 250 377.52 22.04c5.04-5.04 5.04-13.22 0-18.26C375 1.26 371.69 0 368.39 0s-6.61 1.26-9.13 3.78l-236.79 236.8c-2.58 2.58-3.84 6.01-3.77 9.42-.08 3.41 1.18 6.84 3.77 9.42l236.79 236.8c2.52 2.52 5.83 3.78 9.13 3.78s6.61-1.26 9.13-3.78c5.04-5.04 5.04-13.22 0-18.26L149.57 250Z"
      style={{
        strokeWidth: 0,
      }}
    />
  </Svg>
)
export default SvgComponent
