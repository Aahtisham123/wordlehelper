import { LengthSolverPage } from "@/components/LengthSolverPage";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/7-letter-wordle-solver/");

export default function Page() {
  return <LengthSolverPage n={7} />;
}
