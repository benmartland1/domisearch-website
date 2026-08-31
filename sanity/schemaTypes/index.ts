import type { SchemaTypeDefinition } from "sanity";
import { blockContent } from "./blockContent";
import { callout } from "./callout";
import { table } from "./table";
import { divider } from "./divider";
import { author } from "./author";
import { category } from "./category";
import { post } from "./post";

export const schemaTypes: SchemaTypeDefinition[] = [
  post,
  author,
  category,
  blockContent,
  callout,
  table,
  divider,
];
