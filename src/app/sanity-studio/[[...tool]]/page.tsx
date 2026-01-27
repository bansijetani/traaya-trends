"use client";

import { NextStudio } from "next-sanity/studio";

// Import from the file we just created in src/sanity
import config from "@/sanity/sanity.config";

export default function StudioPage() {
  return <NextStudio config={config} />;
}