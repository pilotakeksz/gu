import { createRootRoute } from "@tanstack/react-router";
import Layout from "~components/Layout";
export const Route = createRootRoute({
  component: Layout,
  notFoundComponent: () => (
    <div className="not-found">
      <h1>Off the route.</h1>
      <p>This page is not part of the Ghost Unit reference desk.</p>
      <a href="/index.html" className="button">
        Return home
      </a>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="not-found">
      <h1>Unable to load this reference.</h1>
      <p>{error instanceof Error ? error.message : "Please try again."}</p>
      <button className="button" onClick={reset}>
        Try again
      </button>
    </div>
  ),
});
