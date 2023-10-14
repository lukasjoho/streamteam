"use client";
import React, { memo, useEffect } from "react";

import { useState } from "react";
import { projects, workstreams } from "@/lib/data";
import DragItem from "./components/DragItem";
import { Item, Swimlane } from "./lib/types";
import TimelineHeader from "./components/TimelineHeader";
import SETTINGS from "./lib/constants";
import { areIntervalsOverlapping, differenceInDays, subYears } from "date-fns";
import { motion } from "framer-motion";
import { useEventListener } from "@/liveblocks.config";
import { useRouter } from "next/navigation";

const Timeline = () => {
  const [items, setItems] = useState<Item[]>([...projects]);

  function updateItem(id: string, data: any) {
    setItems((prevItems) => {
      const index = prevItems.findIndex((item) => item.id === id);
      const newItems = [...prevItems];
      newItems[index] = {
        ...newItems[index],
        ...data,
      };
      return newItems;
    });
  }
  const RANGESTART = "2023-10-01";
  const RANGEEND = "2024-10-01";
  const [swimlanes, setSwimlanges] = useState<Swimlane[]>([...workstreams]);
  const router = useRouter();
  // console.log("PARENT RERENDER");
  useEventListener(({ event }) => {
    if (event.type === "dragEnd") {
      router.refresh();
    }
  });
  return (
    <>
      {/* <pre>{JSON.stringify(items, null, 2)}</pre> */}
      <div className="w-full overflow-scroll border rounded-lg">
        <div className="inline-block">
          <TimelineHeader rangeStart={RANGESTART} rangeEnd={RANGEEND} />
          <div className="divide-y">
            {swimlanes.map((swimlane) => {
              const swimlaneItems = items.filter(
                (item) => item.swimlaneId === swimlane.id
              );
              const rows = generateRows(swimlaneItems);
              return (
                <div className="flex" key={swimlane.id}>
                  <div className="w-[140px] sticky left-0 shrink-0 border-r pt-2 pl-3 font-medium text-muted-foreground backdrop-blur-xl bg-background/90 z-10">
                    {swimlane.name}
                  </div>
                  <div>
                    {rows.map((row: Item[]) => {
                      return (
                        <div
                          key={JSON.stringify(row)}
                          className="h-12 relative flex"
                        >
                          {row.map((item: Item) => {
                            return (
                              <DragItem
                                key={item.id}
                                updateItem={updateItem}
                                item={item}
                                x={0.5 * SETTINGS.UNIT_WIDTH}
                                rangeStart={RANGESTART}
                              />
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

function generateRows(items: Item[]) {
  const rows: Item[][] = [];

  // Sort the items by their start date in ascending order
  items.sort((a, b) => Number(a.id) - Number(b.id));

  items.forEach((item) => {
    let addedToRow = false;

    rows.forEach((row: Item[]) => {
      // Check if the item overlaps with any item in the current row
      const overlap = row.some((rowItem) => {
        const startDate1 = new Date(rowItem.startDate);
        const endDate1 = new Date(rowItem.endDate);
        const startDate2 = new Date(item.startDate);
        const endDate2 = new Date(item.endDate);

        // Check for overlapping conditions on a day level
        const dayOverlap = areIntervalsOverlapping(
          {
            start: startDate1,
            end: endDate1,
          },
          {
            start: startDate2,
            end: endDate2,
          }
        );

        if (dayOverlap) {
          return true;
        }

        return false;
      });

      if (!overlap && !addedToRow) {
        row.push(item);
        addedToRow = true;
      }
    });

    if (!addedToRow) {
      rows.push([item]);
    }
  });

  return rows;
}

export default memo(Timeline);
