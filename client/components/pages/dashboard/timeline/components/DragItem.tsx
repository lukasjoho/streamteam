import React, {
  HTMLAttributes,
  forwardRef,
  memo,
  use,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  HTMLMotionProps,
  MotionAdvancedProps,
  MotionProps,
  PanInfo,
  motion,
  useMotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { useBroadcastEvent, useEventListener } from "@/liveblocks.config";
import toast from "react-hot-toast";
import { roundToNearestMultiple } from "../lib/utils";
import { Item } from "../lib/types";
import { addDays, differenceInDays, subYears } from "date-fns";
import SETTINGS from "../lib/constants";
//extends HTMLMotionProps<"div">
interface DragItemProps {
  item: Item;
  updateItem: (id: string, data: any) => void;
  x: number;
  rangeStart: string;
}

const random255 = () => Math.floor(Math.random() * 255);
const randomRGBA = () => {
  const r = random255();
  const g = random255();
  const b = random255();

  return `rgba(${r}, ${g}, ${b}, 0.3)`;
};

const DragItem = forwardRef<HTMLDivElement, DragItemProps>((props, ref) => {
  const { item, updateItem, rangeStart } = props;
  const { id, name } = item;

  let daysStart = differenceInDays(
    new Date(item.startDate),
    new Date(rangeStart)
  );
  let daysDuration = differenceInDays(
    new Date(item.endDate),
    new Date(item.startDate)
  );
  let init = daysStart * SETTINGS.UNIT_WIDTH;
  const broadcast = useBroadcastEvent();
  const mX = useMotionValue(init);

  const handleDrag = useCallback(
    (event: any, info: any) => {
      let newX = mX.get() + info.delta.x;
      mX.set(newX);
      broadcast({
        type: "drag",
        message: {
          id,
          x: newX,
        },
      });
    },
    [broadcast, id, mX]
  );

  const handleDragEnd = useCallback(() => {
    function getDateFromPosition(position: number) {
      const days = position / SETTINGS.UNIT_WIDTH;
      const date = new Date(rangeStart);
      return addDays(date, days);
    }
    let newX = roundToNearestMultiple(mX.get());
    let date = getDateFromPosition(newX);
    const updatedItem = updateItem(id, {
      startDate: date.toISOString(),
      endDate: addDays(date, daysDuration).toISOString(),
    });
    toast.success(`Moved ${name} to ${date.toDateString()}`);
    console.log("DATE: ", date);
    mX.set(newX);
    broadcast({
      type: "dragEnd",
      message: {
        id,
        x: newX,
      },
    });
  }, [broadcast, id, mX, daysDuration, rangeStart, name, updateItem]);

  useEventListener(({ event }) => {
    if (event.type === "drag") {
      if (event.message.id === id) {
        mX.set(event.message.x);
      }
    }
    if (event.type === "dragEnd") {
      if (event.message.id === id) {
        mX.set(event.message.x);
      }
    }
  });
  const startDate = new Date("2023-01-01");
  const endDate = new Date("2023-10-13");

  const daysDifference = differenceInDays(startDate, new Date(item.startDate));

  return (
    <motion.div
      style={{ left: mX, width: daysDuration * SETTINGS.UNIT_WIDTH }}
      id={id}
      key={id}
      ref={ref}
      className={cn(
        "border-2 border-neutral-500 bg-neutral-500/20 rounded-lg px-4 h-12 absolute flex items-center"
      )}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      drag="x"
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      dragElastic={0}
      dragMomentum={false}
      layoutId={id}
    >
      {name}
    </motion.div>
  );
});

export default memo(DragItem);

DragItem.displayName = "DragItem";
