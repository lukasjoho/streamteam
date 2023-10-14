"use client";
import Timeline from "@/components/pages/dashboard/timeline/Timeline";
import Container from "@/components/shared/Container";
import { RoomProvider, useMyPresence, useOthers } from "@/liveblocks.config";
import { ClientSideSuspense } from "@liveblocks/react";

export default function DashboardPage() {
  return (
    <RoomProvider id={"home"} initialPresence={{ cursor: null }}>
      <Container>
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          {() => <Timeline />}
        </ClientSideSuspense>
      </Container>
    </RoomProvider>
  );
}
