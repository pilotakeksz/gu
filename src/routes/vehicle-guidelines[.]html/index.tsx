import { lazy } from "react";
import { createFileRoute } from "@tanstack/react-router";
const Page = lazy(() => import("~features/vehicles"));
export const Route = createFileRoute("/vehicle-guidelines.html/")({
  loader: () => ({ crumb: "Vehicle Guidelines" }),
  component: () => <Page />,
});
