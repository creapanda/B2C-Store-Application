import type { PropsWithChildren } from "react";

export function Content({ children }: PropsWithChildren) {
  return <div className="flex-1 p-6 md:p-10">{children}</div>;
}
