import { related } from "../lib/layout.mjs";
import { pick } from "../lib/tools.mjs";

export default function notFound() {
  return {
    path: "/404/",
    noindex: true,
    title: "Page not found",
    description: "This page could not be found.",
    body: `
<h1>Page not found</h1>
<p class="lead">That page doesn't exist — maybe it was moved, or the link has a typo.</p>
<p><a class="btn" href="/">Go to the Wordle Helper</a></p>
${related(pick("hint", "answers", "finder", "list"))}
`,
  };
}
