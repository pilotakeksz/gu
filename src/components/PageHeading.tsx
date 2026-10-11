import type { FC, ReactNode } from "react";
interface PageHeadingProps {
  title: string;
  description: string;
  children?: ReactNode;
}
const PageHeading: FC<PageHeadingProps> = ({
  title,
  description,
  children,
}) => (
  <header className="page-heading">
    <h1>{title}</h1>
    <div className="heading-bottom">
      <p>{description}</p>
      {children}
    </div>
  </header>
);
export default PageHeading;
