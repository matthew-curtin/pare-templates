type Props = {
  /**
   * `prose` is the reading measure — about 68 characters, which is
   * where long-form text stops being comfortable.
   * `default` is the standard page width.
   * `wide` is for full-bleed-ish grids.
   */
  width?: "prose" | "default" | "wide";
  className?: string;
  children: React.ReactNode;
};

const WIDTHS = {
  prose: "max-w-[38rem]",
  default: "max-w-5xl",
  wide: "max-w-6xl",
};

export function Container({
  width = "default",
  className = "",
  children,
}: Props) {
  return (
    <div className={`mx-auto w-full px-5 sm:px-8 ${WIDTHS[width]} ${className}`}>
      {children}
    </div>
  );
}
