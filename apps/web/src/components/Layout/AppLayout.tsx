import type { PropsWithChildren } from "react";
import { Content } from "../Content";
import { LeftMenu } from "../Menu/LeftMenu";
import { TopMenu } from "./TopMenu";

export async function AppLayout({
  children,
  query,
  selectedCategory,
}: PropsWithChildren<{
  query?: string;
  selectedCategory?: string;
}>) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-primary md:flex">
      <LeftMenu selectedCategory={selectedCategory} />
      <Content>
        <TopMenu query={query} />
        {children}
      </Content>
    </div>
  );
}
