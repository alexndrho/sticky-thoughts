import { type Metadata } from "next";

import Content from "./Content";

export const metadata: Metadata = {
  title: "Threads",
};

export default function ThreadsPage() {
  return <Content />;
}
