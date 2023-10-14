import { memo } from "react";

type Props = {
  x: number;
  y: number;
};

const Cursor = ({ x, y }: Props) => {
  return (
    <svg
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: `translateX(${x}px) translateY(${y}px)`,
      }}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      className="fill-red-500"
    >
      <path d="m13.67 6.03-11-4a.5.5 0 0 0-.64.64l4 11a.5.5 0 0 0 .935.015l1.92-4.8 4.8-1.92a.5.5 0 0 0 0-.935h-.015Z" />
    </svg>
  );
};

export default memo(Cursor);
