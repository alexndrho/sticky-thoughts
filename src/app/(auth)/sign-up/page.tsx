import { type Metadata } from "next";

import Content from "./Content";

export const metadata: Metadata = {
  title: "Sign Up",
  alternates: {
    canonical: "/sign-up",
  },
};

export default function SignUpPage() {
  return <Content />;
}
