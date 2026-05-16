import type { PropsWithChildren } from "react";
import { Content } from "../Content";
import { LeftMenu } from "../Menu/LeftMenu";
import { TopMenu } from "./TopMenu";

export async function AppLayout({
  children,
  query,
  selectedCategory,
  selectedYear,
  selectedMonth,
  selectedTag,
}: PropsWithChildren<{
  query?: string;
  selectedCategory?: string;
  selectedYear?: string;
  selectedMonth?: string;
  selectedTag?: string;
}>) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-primary md:flex">
      <LeftMenu
        selectedCategory={selectedCategory}
        selectedMonth={selectedMonth}
        selectedTag={selectedTag}
        selectedYear={selectedYear}
      />
      <Content>
        <TopMenu query={query} />
        {children}
      </Content>
    </div>
  );
}
