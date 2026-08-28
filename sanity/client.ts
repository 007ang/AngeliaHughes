import { createClient } from "next-sanity";
import { apiVersion, dataset, hasSanity, projectId } from "./env";

export const client = hasSanity
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: "published",
    })
  : null;
