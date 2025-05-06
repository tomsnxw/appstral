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
      d="M500 250c0 138.07-111.93 250-250 250S0 388.07 0 250 111.93 0 250 0c65.52 0 124.97 25.41 169.55 66.66L251.79 298.59l-76.04-128.98c-10.82-18.36-34.51-24.46-52.84-13.64-18.36 10.82-24.46 34.48-13.64 52.85l105.99 179.77c6.6 11.22 18.44 18.34 31.43 18.95.61.02 1.21.04 1.81.04 12.35 0 24-5.91 31.27-15.98l189.4-261.85C488.79 165.44 500 206.4 500 250Z"
      style={{
        fill: "#00b936",
        strokeWidth: 0,
      }}
    />
  </Svg>
)
export default SvgComponent
