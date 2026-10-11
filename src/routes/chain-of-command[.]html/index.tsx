import { lazy } from "react";
import { createFileRoute } from "@tanstack/react-router";
const Page = lazy(() => import("~features/command"));
export const Route = createFileRoute("/chain-of-command.html/")({
  loader: () => ({ crumb: "Chain of Command" }),
  component: () => <Page />,
});
