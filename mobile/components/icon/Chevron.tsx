import * as React from "react";
import Svg, { Path, type SvgProps } from "react-native-svg";

interface ChevronProps extends SvgProps {
    width?: number;
    height?: number;
}

const Chevron = ({
    width = 24,
    height = 24,
    color = "currentColor",
    ...props
}: ChevronProps) => {
    return (
        <Svg
            viewBox="0 0 20 20"
            fill={color}
            width={width}
            height={height}
            className="size-5"
            {...props}
        >
            <Path
                fillRule="evenodd"
                d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z"
                clipRule="evenodd"
            />
        </Svg>
    )
}

export default Chevron
