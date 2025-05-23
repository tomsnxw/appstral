import * as React from "react"
import Svg, { Defs, Path } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: style */
const SvgComponent = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    id="uuid-fc10e0ff-482b-4635-a0f1-d8d40000749a"
    data-name="Capa 1"
    viewBox="0 0 500 500"
    {...props}
  >
    <Defs></Defs>
    <Path
      d="M233.21 358.53c1.5 1.5 3.31 2.7 5.31 3.52.08.03.17.05.25.08 1.83.72 3.82 1.15 5.91 1.15h.02c2.09 0 4.07-.43 5.91-1.15.08-.03.17-.04.25-.08 2-.82 3.8-2.02 5.3-3.52l114.66-114.72c6.33-6.33 6.33-16.6 0-22.94-6.34-6.33-16.61-6.33-22.94 0L260.9 307.9l-.08-283c0-8.96-7.27-16.22-16.22-16.21-4.48 0-8.53 1.82-11.47 4.75a16.199 16.199 0 0 0-4.75 11.47l.08 283-87.03-86.98c-6.34-6.33-16.61-6.33-22.94 0-6.33 6.33-6.33 16.6 0 22.94l114.72 114.66ZM482.55 456.3l-465.12.13C7.81 456.43 0 464.24 0 473.87c0 9.63 7.82 17.44 17.45 17.44l465.12-.13c9.63 0 17.44-7.81 17.44-17.45 0-9.63-7.82-17.44-17.45-17.44Z"
      className="uuid-e3836d5f-d222-4d7b-bd9b-ede5e9dda394"
    />
  </Svg>
)
export default SvgComponent
