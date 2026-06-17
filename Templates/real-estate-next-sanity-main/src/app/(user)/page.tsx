import { draftMode } from "next/headers";
import PreviewSuspense from "@/components/PreviewSuspense";
import { DocumentsCount, query } from "@/components/DocumentsCount";
import PreviewDocumentsCount from "@/components/PreviewDocumentsCount";
import { client } from "@/lib/sanity.client";
import { cache } from "react";

// Enable NextJS to cache and dedupe queries
const clientFetch = cache(client.fetch.bind(client));

export default async function IndexPage() {
  const { isEnabled } = draftMode();
  if (isEnabled) {
    return (
      <PreviewSuspense fallback="Loading...">
        <PreviewDocumentsCount />
      </PreviewSuspense>
    );
  }

  const data = await clientFetch(query);
  return <DocumentsCount data={data} />;
}
