import * as React from "react";

export interface ImageProps extends React.ComponentProps<"img"> {
  /** Kept for API compatibility with previous callers; maps to object-fit. */
  fittingType?: "fill" | "fit";
}

/** Plain <img> wrapper. fittingType "fill" crops (cover), "fit" letterboxes (contain). */
const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ fittingType = "fill", className, style, alt = "", ...props }, ref) => (
    <img
      ref={ref}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
      style={{ objectFit: fittingType === "fit" ? "contain" : "cover", ...style }}
      {...props}
    />
  ),
);
Image.displayName = "Image";

export { Image };