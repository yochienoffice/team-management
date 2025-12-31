import Image from "next/image";
import IconSixDots from "../public/assets/img/icon-six-dots.svg";

interface MoveGroupProps {
  index: number;
  opacity: number;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => void;
  children: React.ReactNode;
  className?: string;
}

const MoveGroup: React.FC<MoveGroupProps> = ({
  index,
  children,
  opacity,
  onDragStart,
  onDragOver,
  onDrop,
  className,
}) => {
  return (
    <div
      className={className + " flex gap-x-1.5"}
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e)}
      onDrop={(e) => onDrop(e, index)}
      style={{ cursor: "move", opacity }}
    >
      <div className="flex flex-col">
        <div className="h-11 cursor-pointer items-center">
          <Image
            className="h-full"
            src={IconSixDots}
            alt=""
            draggable={false}
          />
        </div>
      </div>
      {children}
    </div>
  );
};

export default MoveGroup;
