import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";
import { hasSanity } from "@/sanity/env";

/** One URL for her: /studio. */
export const dynamic = "force-static";
export const metadata = { robots: { index: false, follow: false } };

export default function StudioPage() {
  if (!hasSanity) {
    return (
      <main style={{ padding: 48, fontFamily: "monospace", lineHeight: 1.7 }}>
        <h1>Studio not configured</h1>
        <p>
          Set <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> in <code>.env.local</code>,
          then restart. See the &ldquo;Before launch&rdquo; section of the README.
        </p>
      </main>
    );
  }

  return <NextStudio config={config} />;
}
