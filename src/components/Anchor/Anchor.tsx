import { UrlObject } from "url";
import type { FC } from "react";
import Link from "next/link";
declare type Url = string | UrlObject;

export type AnchorProps = {
  href: Url;
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
};
const Anchor: FC<AnchorProps> = ({ href, children, style, onClick }) => {
  return (
    <Link onClick={onClick} href={href} style={style}>
      {children}
    </Link>
  );
};

export default Anchor;
