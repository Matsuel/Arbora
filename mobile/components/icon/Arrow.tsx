import * as React from "react";
import Svg, { Path, type SvgProps } from "react-native-svg";

interface ArrowProps extends SvgProps {
    width?: number;
    height?: number;
}

const Arrow = ({
    width,
    height,
    color = "currentColor",
    ...props
}: ArrowProps) => {
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill={color}
            className="size-6"
            {...props}
        >
            <Path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
                clipRule="evenodd"
            />
        </Svg>
    )
}

export default Arrow
