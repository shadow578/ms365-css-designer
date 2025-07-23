"use client";

import { api } from "~/trpc/react";

export default function Home() {
  const hi = api.helloWorld.hello.useQuery({ text: "World" });

  return <h1>{hi.data?.greeting ?? "Loading..."}</h1>;
}
