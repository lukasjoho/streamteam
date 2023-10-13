"use client";
import React, { memo, useCallback, useEffect, useRef } from "react";
import { Reorder, motion, useMotionValue } from "framer-motion";
import {
  useBroadcastEvent,
  useEventListener,
  useMyPresence,
  useOthers,
} from "../liveblocks.config";

import { useState } from "react";
import { projects } from "@/lib/data";
import Cursor from "./Cursor";
import DragItem from "./DragItem";
import toast from "react-hot-toast";
import { Item } from "./types";
import TimelineHeader from "./TimelineHeader";
import SETTINGS from "./timeline/lib/constants";
import { roundToNearestMultiple } from "./timeline/lib/utils";

const Timeline = () => {
  const [items, setItems] = useState<Item[]>([...projects]);

  const [positions, setPositions] = useState([
    ...items.map((item) => ({ id: item.id, left: 0.5 * SETTINGS.UNIT_WIDTH })),
  ]);
  const refs = items.reduce((acc: any, item) => {
    acc[item.id] = useRef<any>(null);
    return acc;
  }, {});

  const others = useOthers();
  const [myPresence, updateMyPresence] = useMyPresence();
  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const cursor = { x: Math.floor(e.clientX), y: Math.floor(e.clientY) };
    updateMyPresence({ cursor });
  }
  function handlePointerLeave(e: React.PointerEvent<HTMLDivElement>) {
    updateMyPresence({ cursor: null });
  }

  useEventListener(({ event }) => {
    if (event.type === "TOAST") {
      // toast(`${event.message.x} for item ${event.message.id}`);
      setPositions(
        positions.map((position) => {
          if (position.id === event.message.id) {
            let newLeft = position.left + event.message.x;
            return { ...position, left: newLeft };
          }
          return position;
        })
      );
    }
    // if (event.type === "snap") {
    //   snapPosition(event.message.id, event.message.x);
    // }
  });

  return (
    <div
      className="border rounded-lg"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <pre>{JSON.stringify(positions, null, 2)}</pre>
      <TimelineHeader />
      <div className="space-y-2">
        {items.map((item: Item) => {
          return (
            <DragItem
              item={item}
              ref={refs[item.id]}
              drag="x"
              dragMomentum={false}
              x={positions.find((position) => position.id === item.id)!.left}
            />
          );
        })}
      </div>

      {others
        .filter((other) => other.presence.cursor !== null)
        .map(({ connectionId, presence }) => (
          <Cursor
            key={connectionId}
            x={presence.cursor!.x}
            y={presence.cursor!.y}
          />
        ))}
    </div>
  );
};

export default memo(Timeline);
