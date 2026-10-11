import { lazy } from "react";
import { createFileRoute } from "@tanstack/react-router";
const Page = lazy(() => import("~features/applications"));
export const Route = createFileRoute("/hspu_app_new.html/")({
  loader: () => ({ crumb: "HSPU Application" }),
  component: () => <Page division="HSPU" />,
});
