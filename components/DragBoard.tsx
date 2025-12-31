"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion"; // Optional for smoother animations

export default function DragBoard({ dataList }: { dataList: User[] }) {
  const [data, setData] = useState<User[]>([]); //data
  const [order, setOrder] = useState<User[]>([]); //dragged items
  const [target, setTarget] = useState<"data" | "order">();

  useEffect(() => {
    setData(dataList);
  }, [dataList]);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const draggedItem = event.dataTransfer.getData("text/plain");

    if (target == "data") {
      const currentIndex = order?.findIndex(
        (item) => item.id === Number(draggedItem)
      );

      const currentOrder = order?.filter(
        (item) => item.id !== Number(draggedItem)
      );

      setOrder(currentOrder);

      setData((prevData) => {
        console.log(`draggedItem: ${draggedItem}`);
        const existingItem = prevData.find(
          (data) => data.id === Number(draggedItem)
        );

        if (existingItem) {
          // Remove the item first, then add it at the end
          const filteredData = prevData.filter(
            (data) => data.id !== Number(draggedItem)
          );
          return [...filteredData, existingItem];
        } else {
          return [...data, order[currentIndex]];
        }
      });
    } else {
      const currentIndex = data?.findIndex(
        (item) => item.id === Number(draggedItem)
      );

      const currentData = data?.filter(
        (item) => item.id !== Number(draggedItem)
      );

      setData(currentData);

      setOrder((prevOrder) => {
        console.log(`draggedItem: ${draggedItem}`);
        const existingItem = prevOrder.find(
          (order) => order.id === Number(draggedItem)
        );

        if (existingItem) {
          // Remove the item first, then add it at the end
          const filteredOrder = prevOrder.filter(
            (order) => order.id !== Number(draggedItem)
          );
          return [...filteredOrder, existingItem];
        } else {
          return [...order, data[currentIndex]];
        }
      });
    }
  };

  const handleDragOver = (
    event: React.DragEvent<HTMLDivElement>,
    currentDiv: "data" | "order",
    targetIndex: number,
  ) => {
    event.preventDefault();
    // setTarget(currentDiv);

    const draggedItem = event.dataTransfer.getData("text/plain");
    const list = target === "data" ? data : order;

    console.log(`target Index: ${targetIndex}`)
    const setList = target === "data" ? setData : setOrder;

    const updatedList = list.filter((item) => item.id !== Number(draggedItem));

    const currentData = list?.find(
      (item) => item.id === Number(draggedItem)
    );

    updatedList.splice(targetIndex, 0); // Insert at the new position

    setList(updatedList);
  };

  const handleDragOverBlock = (
    event: React.DragEvent<HTMLDivElement>,
    currentDiv: "data" | "order",
  ) => {
    event.preventDefault();
    setTarget(currentDiv);
  };

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    type: string,
    data: string
  ) => {
    event.dataTransfer.setData("text/plain", data);
  };

  return (
    <div className="bg-slate-200 w-full flex gap-4 p-4 rounded-md">
      {/* Left Column (data list) */}
      <div
        className="bg-slate-500 w-full flex flex-col gap-4 p-4 rounded-md"
        onDragOver={(e) => handleDragOverBlock(e, "data")}
        onDrop={handleDrop}
      >
        {data.map((d, index) => (
          <motion.div
            key={index}
            className="p-2 rounded-md bg-hs-sidebar-hover w-fit text-white cursor-move"
            draggable
            onDragStart={(e) => handleDragStart(e, "data", String(d.id))}
            onDragOver={(e) => handleDragOver(e, "data", index)}
            style={{ cursor: "move" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {`${d?.id} ${d?.name}`}
          </motion.div>
        ))}
      </div>

      {/* Right Column (order list) */}
      <div
        className="bg-slate-500 w-full flex flex-col gap-4 p-4 rounded-md"
        onDrop={handleDrop}
        onDragOver={(e) => handleDragOverBlock(e, "order")}
      >
        {order.map((player, index) => (
          <motion.div
            key={index}
            className="p-2 rounded-md bg-hs-sidebar-hover w-fit text-white cursor-move"
            style={{ cursor: "move" }}
            draggable
            onDragStart={(e) => handleDragStart(e, "data", String(player.id))}
            onDragOver={(e) => handleDragOver(e, "order", index)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {`${player?.id} ${player?.name}`}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
