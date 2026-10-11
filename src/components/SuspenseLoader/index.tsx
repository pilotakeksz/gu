import { Suspense } from "react";
import type { FC, ReactNode } from "react";
interface SuspenseLoaderProps {
  children: ReactNode;
}
const SuspenseLoader: FC<SuspenseLoaderProps> = ({ children }) => (
  <Suspense
    fallback={
      <div className="page-skeleton" role="status" aria-live="polite">
        <p>Preparing your reference…</p>
        <div />
        <div />
        <div />
      </div>
    }
  >
    {children}
  </Suspense>
);
export default SuspenseLoader;
