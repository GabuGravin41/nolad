import type { MDXComponents } from "mdx/types";
import { Deep } from "./Deep";
import { Callout } from "./Callout";
import { Pipeline } from "./Pipeline";
import { Figure, Facts, Source } from "./Figure";
import { Plot } from "./Plot";
import { Bars } from "./Bars";
import { Foundation } from "./Foundation";
import { Diagram } from "@/components/figures";

export const mdxComponents: MDXComponents = {
  Deep,
  Callout,
  Pipeline,
  Figure,
  Facts,
  Source,
  Plot,
  Bars,
  Foundation,
  Diagram,
  table: (props) => (
    <div className="table-wrap">
      <table {...props} />
    </div>
  ),
  a: ({ href = "", ...props }) =>
    href.startsWith("http") ? (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props} />
    ) : (
      <a href={href} {...props} />
    ),
};
