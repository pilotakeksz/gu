import { lazy } from "react";
import { createFileRoute } from "@tanstack/react-router";
const Page = lazy(() => import("~features/handbook"));
export const Route = createFileRoute("/handbook.html/")({
  loader: () => ({ crumb: "Handbook" }),
  component: () => <Page />,
});
