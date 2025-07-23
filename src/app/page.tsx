import { api } from "~/trpc/server";
import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  const hi = await api.helloWorld.hello({ text: "World" });

  return (
    <HydrateClient>
      <h1>{hi.greeting ?? "Loading..."}</h1>
    </HydrateClient>
  );
}
