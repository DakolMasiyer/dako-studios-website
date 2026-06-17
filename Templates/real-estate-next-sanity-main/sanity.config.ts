import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";

import { schemaTypes } from "./src/schemas";
import { googleMapsInput } from "@sanity/google-maps-input";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

export default defineConfig({
  basePath: "/studio",

  projectId,
  dataset,

  plugins: [
    deskTool(),
    googleMapsInput({
      apiKey: mapsApiKey,
    }),
  ],

  schema: {
    types: schemaTypes,
  },
});
