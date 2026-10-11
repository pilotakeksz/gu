import { lazy } from "react";
import { createFileRoute } from "@tanstack/react-router";
const Page = lazy(() => import("~features/applications"));
export const Route = createFileRoute("/srt_app_new.html/")({
  loader: () => ({ crumb: "SRT Application" }),
  component: () => <Page division="SRT" />,
});
