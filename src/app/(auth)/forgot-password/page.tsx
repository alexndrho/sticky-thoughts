import { type Metadata } from "next";

import Content from "./Content";

export const metadata: Metadata = {
  title: "Forgot Password",
  alternates: {
    canonical: "/forgot-password",
  },
};

export default function ForgotPasswordPage() {
  return <Content />;
}
