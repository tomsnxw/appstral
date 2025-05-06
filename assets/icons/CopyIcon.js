import * as React from "react"
import Svg, { Defs, Path } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: style */
const SvgComponent = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    id="Capa_1"
    data-name="Capa 1"
    viewBox="0 0 1532.55 1530.71"
    {...props}
  >
    <Defs></Defs>
    <Path
      d="M877.19 1340.02c0 42.12-34.14 76.28-76.28 76.28H190.69c-42.12 0-76.28-34.15-76.28-76.28V539.11c0-42.12 34.15-76.28 76.28-76.28h235.85V348.41H190.69C85.54 348.41 0 433.96 0 539.11v800.91c0 105.15 85.54 190.69 190.69 190.69h610.22c105.15 0 190.69-85.54 190.69-190.69v-43.3H877.18v43.3Z"
      className="cls-1"
    />
    <Path
      d="M1341.86 0H731.64C626.49 0 540.95 85.55 540.95 190.69V991.6c0 105.16 85.54 190.69 190.69 190.69h610.22c105.15 0 190.69-85.53 190.69-190.69V190.69C1532.55 85.55 1447.01 0 1341.86 0Zm76.28 991.6c0 42.12-34.14 76.28-76.28 76.28H731.64c-42.12 0-76.28-34.15-76.28-76.28V190.69c0-42.12 34.15-76.28 76.28-76.28h610.22c42.13 0 76.28 34.15 76.28 76.28V991.6Z"
      className="cls-1"
    />
  </Svg>
)
export default SvgComponent
