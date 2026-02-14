import * as React from "react";

export type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
  strokeWidth?: number;
};

export function createIcon(
  displayName: string,
  paths: React.ReactNode
) {
  const Comp = React.forwardRef<SVGSVGElement, IconProps>(
    ({ size = 24, strokeWidth = 2, color, className, style, ...props }, ref) => (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color || "currentColor"}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        style={style}
        aria-hidden="true"
        focusable="false"
        {...props}
      >
        {paths}
      </svg>
    )
  );

  Comp.displayName = displayName;
  return Comp;
}
