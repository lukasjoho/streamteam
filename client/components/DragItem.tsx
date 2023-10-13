import React, {
  HTMLAttributes,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  HTMLMotionProps,
  MotionAdvancedProps,
  MotionProps,
  motion,
  useMotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { useBroadcastEvent, useEventListener } from "@/liveblocks.config";
import toast from "react-hot-toast";

interface DragItemProps extends HTMLMotionProps<"div"> {
  item: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
  };
  x: number;
}

const random255 = () => Math.floor(Math.random() * 255);
const randomRGBA = () => {
  const r = random255();
  const g = random255();
  const b = random255();

  return `rgba(${r}, ${g}, ${b}, 0.3)`;
};

const DragItem = forwardRef<HTMLDivElement, DragItemProps>((props, ref) => {
  const { item, x } = props;
  const { id, name } = item;
  const { className, ...rest } = props;

  const broadcast = useBroadcastEvent();
  const handleDrag = useCallback((event: any, info: any) => {
    const deltaX = info.delta.x;
    broadcast({
      type: "TOAST",
      message: {
        id: event.target.id,
        x: info.delta.x,
      },
    });
  }, []);

  useEffect(() => {
    console.log("NEW: ", x);
  }, [x]);

  const handleDragEnd = useCallback(
    (event: any, info: any) => {
      // snapPosition(event.target.id, x + info.delta.x);
      broadcast({
        type: "snap",
        message: {
          id: event.target.id,
          x: x + info.delta.x,
        },
      });
    },
    [x]
  );

  useEventListener(({ event }) => {
    if (event.type === "TOAST") {
      // toast(`${event.message.x} for item ${event.message.id}`);
      console.log("I WAS DRAGGED", event.message.id, event.message.x);
    }
  });
  return (
    <motion.div
      style={{ left: x, backgroundColor: randomRGBA() }}
      id={id}
      ref={ref}
      className={cn(
        "border-2 border-neutral-500 bg-neutral-500/50 rounded-lg px-4 py-2 relative",
        className
      )}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      {...rest}
    >
      {x}
    </motion.div>
  );
});

export default memo(DragItem);
