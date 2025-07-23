"use client";

import { api } from "~/trpc/react";

import MSConvergedSignInPage from "./ms/signin";

export default function Home() {
  const hi = api.helloWorld.hello.useQuery({ text: "World" });

  return <MSConvergedSignInPage />;
}
