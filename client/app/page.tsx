"use client";
import Timeline from "@/components/Timeline";
import Scheduler from "@/components/Timeline";
import Container from "@/components/shared/Container";
import { RoomProvider } from "@/liveblocks.config";
import { ClientSideSuspense } from "@liveblocks/react";

export default function Home() {
  return (
    <RoomProvider id={"home"} initialPresence={{ cursor: null }}>
      <main className="flex min-h-screen flex-col">
        <Container>
          <ClientSideSuspense fallback={<div>Loading…</div>}>
            {() => <Timeline />}
          </ClientSideSuspense>
        </Container>
      </main>
    </RoomProvider>
  );
}
