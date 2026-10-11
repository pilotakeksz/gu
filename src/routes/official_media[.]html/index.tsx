import { lazy } from "react";
import { createFileRoute } from "@tanstack/react-router";
const Page = lazy(() => import("~features/media"));
export const Route = createFileRoute("/official_media.html/")({
  loader: () => ({ crumb: "Official Media" }),
  component: () => <Page />,
});
