import { lazy } from "react";
import { createFileRoute } from "@tanstack/react-router";
const Page = lazy(() => import("~features/home"));
export const Route = createFileRoute("/index.html/")({
  loader: () => ({ crumb: "Home" }),
  component: () => <Page />,
});
