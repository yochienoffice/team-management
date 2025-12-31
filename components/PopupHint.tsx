'use client'
import React, { useState } from "react";

type PopupHintProps = {
  children?: React.ReactNode
  className?: string
  header?: string
}

export default function PopupHint({children, className}: PopupHintProps) {
  let timeout;
  const [active, setActive] = useState(false);

  const showHint = () => {
    timeout = setTimeout(() => {
      setActive(true);
    }, 200);
  };

  const hideHint = () => {
    clearInterval(timeout);
    setActive(false);
  };

  return (
    <div
      className="inline-block relative"
      onMouseEnter={showHint}
      onMouseLeave={hideHint}
    >
      <div className={"flex justify-center items-center w-6 h-6 ml-2 text-xs rounded-xl bg-[#F2F4F7] text-[#344054] " + className}>
        {"?"}
      </div>
      {active && (
        <div className="shadow-xl absolute bg-white rounded-xl min-w-[200px] max-w-[500px] min-h-[200px] max-h-[500px] z-50">
          {children}
        </div>
      )}
    </div>
  )
}