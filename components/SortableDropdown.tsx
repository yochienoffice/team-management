import React, { useState } from "react";
import IconDropdown from "@/public/assets/img/icon-dropdown.svg";
import Image from "next/image";
import { MenuCategory } from "@/utils/Models";

type Props = {
  itemList?: Array<MenuCategory>
  allowInput: boolean
  onUpdateItems: (itemList: MenuCategory[]) => void
  placeholder?: string | undefined
}

export default function SortableDropdown({itemList, allowInput, placeholder, onUpdateItems}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(
    itemList ? itemList[0].displayName : ""
  );
  const [newItem, setNewItem] = useState("");
  const [items, setItems] = useState(
    itemList ? itemList : []
  );
  const toggling = () => setIsOpen(!isOpen);
  const onOptionClick = value => () => {
    setSelectedItem(value);
    setIsOpen(false);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
    (e.target as HTMLDivElement).style.opacity = '0.5';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    (e.target as HTMLDivElement).style.opacity = '1';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    const newItems = [...items];
    const [draggedItem] = newItems.splice(draggedIndex, 1);
    
    newItems.splice(targetIndex, 0, draggedItem);
    newItems.forEach((item, index) => {
      item.displaySeq = index + 1;
    })
    newItems.sort((item1, item2) => item1?.displaySeq > item2?.displaySeq ? 1 : -1);
    
    onUpdateItems(newItems);
    setItems(newItems)
  };

  function updateItems(e: React.KeyboardEvent<HTMLInputElement>) {
    if(e.key === "Enter" && newItem != "") {
      let itemsNew = [...items];
      const item = {
        displayName: newItem,
        displaySeq: 0
      };
      
      itemsNew.push(item);
      setItems(itemsNew);
      setNewItem("");
      onUpdateItems && onUpdateItems(itemsNew);
    }
  }

  return (
    <div className="mt-2">
      <div className="w-full relative">
        <div className="flex justify-between items-center bg-white cursor-pointer p-2 border border-solid border-[#D0D5DD] rounded-lg text-[#344054] font-medium" onClick={toggling}>
          <div className="mr-2">{selectedItem}</div>
          <Image src={IconDropdown} alt='' />
        </div>
        {isOpen && (
          <div>
            {allowInput ? (
              <div className="w-full no-scrollbar overflow-y-scroll absolute left-0 shadow-md border border-solid rounded-lg border-gray-200">
                {items.map((item, index) => {
                  return (
                    <div 
                      className="w-full cursor-move p-2 bg-white font-medium"
                      key={index}
                      draggable={true}
                      onDragStart={e => handleDragStart(e, index)}
                      onDragOver={e => handleDragOver(e)}
                      onDrop={e => handleDrop(e, index)}
                    >
                      <div draggable={false} onDragEnter={() => null}>{item.displayName}</div>
                    </div>
                  )
                })}
                <div className="w-full cursor-move p-2 bg-white font-medium" draggable={false}>
                  <input
                    type="text"
                    value={newItem}
                    onKeyDown={e => updateItems(e)}
                    placeholder={placeholder != undefined ? placeholder : "Add item"}
                    draggable={false}
                    onDragEnter={() => null}
                    onChange={e => setNewItem(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="p-2 w-full no-scrollbar overflow-y-scroll absolute left-0 shadow-md border border-solid rounded-lg border-gray-200">
                {itemList && itemList.map((item, index) => {
                  return (
                    <div 
                      className="w-full p-2 bg-white cursor-pointer font-medium"
                      key={index}
                      onClick={onOptionClick(item.displayName)}
                    >
                      {item.displayName}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}