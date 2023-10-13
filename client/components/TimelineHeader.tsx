import React, { memo } from "react";
import {
  format,
  addMonths,
  eachDayOfInterval,
  subYears,
  addYears,
} from "date-fns";
import SETTINGS from "./timeline/lib/constants";

interface TimelineHeaderProps {
  startDate: string;
  endDate: string;
}

const TimelineHeader = () => {
  // Create an array of months within the specified date range
  const startDate = subYears(new Date(), 1);
  const endDate = addYears(new Date(), 1);
  const months = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    months.push(new Date(currentDate));
    currentDate = addMonths(currentDate, 1);
  }

  // Create an array of all days within the specified date range
  const days = eachDayOfInterval({
    start: new Date(startDate),
    end: new Date(endDate),
  });

  return (
    <div className="flex">
      {months.map((month) => (
        <div key={format(month, "yyyy-MM")} className="border-r">
          <div className="text-sm text-muted-foreground border-b pl-2 py-1">
            {format(month, "MMMM yyyy")}
          </div>
          <div className="flex border-b text-muted-foreground">
            {days
              .filter(
                (day) => format(day, "yyyy-MM") === format(month, "yyyy-MM")
              )
              .map((day) => (
                <div
                  key={format(day, "yyyy-MM-dd")}
                  className="text-sm grid place-items-center"
                  style={{
                    width: SETTINGS.UNIT_WIDTH,
                    height: SETTINGS.UNIT_WIDTH,
                  }}
                >
                  {format(day, "dd")}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default memo(TimelineHeader);
