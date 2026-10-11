import { lazy } from "react";
import { createFileRoute } from "@tanstack/react-router";
const Page = lazy(() => import("~features/roster"));
export const Route = createFileRoute("/troopers.html/")({
  loader: () => ({ crumb: "Troopers" }),
  component: () => <Page />,
});
