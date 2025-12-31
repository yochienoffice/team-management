import { cn } from "@/lib/utils";
import { timeStringToDate } from "@/utils/TimeUtil";
import React, {
  useEffect,
  useImperativeHandle,
  useState,
  forwardRef,
  useRef,
} from "react";

type HsTimePickerProps = {
  value?: string;
  name: "startTime" | "beginTime" | "endTime" | "normal";
  timeRange: TimeRange;
  onChange?: (time: string, name: any) => void;
  className?: string;
  disabled?: boolean;
};

const HsTimePicker = forwardRef<HsTimePickerRef, HsTimePickerProps>(
  ({ value, name, onChange, timeRange, className, disabled }, ref) => {
    const hours = Array.from({ length: 24 }, (_, i) =>
      i.toString().padStart(2, "0")
    );
    const minutes = Array.from({ length: 60 }, (_, i) =>
      i.toString().padStart(2, "0")
    );

    const hourInputRef = useRef<HTMLInputElement>(null);
    const minuteInputRef = useRef<HTMLInputElement>(null);
    const [dropdownOrientation, setDropdownOrientation] = useState(0); // 0: Bottom of the input, 1: Top of the input

    const [minuteOnFocus, setMinuteOnFocus] = useState(false);
    const [hourOnFocus, setHourOnFocus] = useState(false);
    const [selectedMinute, setSelectedMinute] = useState<string>(
      value?.split(":")[1] || ""
    );
    const [selectedHour, setSelectedHour] = useState<string>(
      value?.split(":")[0] || ""
    );

    const handleHourInputChange = (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      e.preventDefault();
      const hour =
        (e.target as HTMLInputElement | HTMLButtonElement).value || "";
      setSelectedHour(hour);
      onChange != undefined && onChange(hour + ":" + selectedMinute, name);
    };

    const handleMinuteInputChange = (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      e.preventDefault();
      const minute =
        (e.target as HTMLInputElement | HTMLButtonElement).value || "";
      setSelectedMinute(minute);
      onChange != undefined && onChange(selectedHour + ":" + minute, name);
    };

    useEffect(() => {
      if (minuteOnFocus || hourOnFocus) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "unset";
      }

      return () => {
        document.body.style.overflow = "unset";
      };
    }, [minuteOnFocus, hourOnFocus]);

    useEffect(() => {
      setMinuteOnFocus(false);
      setHourOnFocus(false);
    }, [value]);

    const resetTime = (value: string) => {
      setSelectedMinute(value?.split(":")[1] || "");
      setSelectedHour(value?.split(":")[0] || "");
      onChange && onChange(value, name);
    };

    useImperativeHandle(ref, () => ({
      resetTime,
    }));

    function disabledTimeSelection(time: string) {
      if (name === "startTime" || name === "beginTime") {
        return timeStringToDate(time) >= timeStringToDate(timeRange.max);
      } else if (name === "endTime") {
        return timeStringToDate(time) <= timeStringToDate(timeRange.min);
      }
    }

    const handleHourInputClick = (
      e: React.MouseEvent<HTMLInputElement, MouseEvent>
    ) => {
      if (hourInputRef.current) {
        const { top } = hourInputRef.current.getBoundingClientRect();
        setHourOnFocus(true);
        setMinuteOnFocus(false);
        setDropdownOrientation(top > window.innerHeight / 2 ? 1 : 0);
      }
    };

    const handleMinuteInputClick = (
      e: React.MouseEvent<HTMLInputElement, MouseEvent>
    ) => {
      if (minuteInputRef.current) {
        const { top } = minuteInputRef.current.getBoundingClientRect();
        setDropdownOrientation(top > window.innerHeight / 2 ? 1 : 0);
        setHourOnFocus(false);
        setMinuteOnFocus(true);
      }
    };

    return (
      <div
        className={`relative inline-block ${name === "normal" && ` min-w-44`}`}
      >
        <div className={cn("h-full p-1", className)}>
          <span className=" flex justify-center items-center border-none h-full">
            <input
              ref={hourInputRef}
              type="number"
              min={0}
              max={23}
              onClick={handleHourInputClick}
              onBlur={() => {
                setTimeout(() => {
                  setHourOnFocus(false);
                }, 200);
              }}
              className="p-1 h-full text-base inline-flex text-center justify-center w-full border-none border-gray-300 px-0 sm:px-4 py-2 bg-white font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
              aria-haspopup="true"
              aria-expanded="true"
              onChange={(e) => handleHourInputChange(e)}
              value={selectedHour || ""}
              disabled={disabled}
            />
            <span className="text-base py-1.5 h-full border-gray-300 flex justify-center items-center">
              &#58;
            </span>
            <input
              ref={minuteInputRef}
              type="number"
              min={0}
              max={59}
              onClick={handleMinuteInputClick}
              onBlur={() => {
                setTimeout(() => {
                  setMinuteOnFocus(false);
                }, 200);
              }}
              className="p-1 h-full text-base inline-flex text-center justify-center w-full border-none border-gray-300 px-0 sm:px-4 py-2 bg-white font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
              aria-haspopup="true"
              aria-expanded="true"
              onChange={(e) => handleMinuteInputChange(e)}
              value={selectedMinute || ""}
              disabled={disabled}
            />
          </span>
        </div>

        {(minuteOnFocus || hourOnFocus) && (
          <div
            className={`flex z-50 origin-top-right absolute ${name === "endTime" ? `right-0 ` : `left-0 `} ${dropdownOrientation === 1 ? `bottom-12` : ``} w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none`}
            role="menu"
            aria-orientation="vertical"
          >
            <div
              className="flex-1 py-1 overflow-y-scroll h-80 no-scrollbar cursor-default"
              role="none"
            >
              {hours.map((option) => (
                <button
                  key={option}
                  className={
                    "block w-full font-bold text-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    // (timeRange
                    //   ? " text-gray-400"
                    //   : " text-gray-700") +
                  }
                  onClick={(e) => handleHourInputChange(e)}
                  role="menuitem"
                  value={option}
                  // disabled={
                  //   timeRange ? disabledTimeSelection(option + ":00") : false
                  // }
                >
                  {option}
                </button>
              ))}
            </div>
            <div
              className="flex-1 py-1 overflow-y-scroll h-80 no-scrollbar cursor-default"
              role="none"
            >
              {minutes.map((option) => (
                <button
                  key={option}
                  className={
                    "block w-full text-center font-bold px-4 py-2 text-sm" +
                    " text-gray-700" +
                    " hover:bg-gray-100 hover:text-gray-900"
                  }
                  onClick={(e) => handleMinuteInputChange(e)}
                  role="menuitem"
                  value={option}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default HsTimePicker;
