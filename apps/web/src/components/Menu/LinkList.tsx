import type { PropsWithChildren } from "react";

export function LinkList(props: PropsWithChildren<{ title: string }>) {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-secondary">
        {props.title}
      </h2>
      <ul className="space-y-1">{props.children}</ul>
    </div>
  );
}
