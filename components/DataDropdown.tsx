'use client'
import React, { useState, useRef } from 'react'
import Image from 'next/image'
import IconChevronUp from '../public/assets/img/icon-chevron-up.svg'
import IconChevronDown from '../public/assets/img/icon-chevron-down.svg'

type DataDropdownProps = {
  children: React.ReactNode | null
  title: string | null
}

export default function DataDropdown({children, title}: DataDropdownProps) {
  const [isHide, setIsHide] = useState(false);
  const contentRef = useRef(null);

  return (
    <div className='p-5 border-b-[1px] border-solid border-[#EAECF0] transition-height' ref={contentRef}>
      {title && 
        <div className='flex flex-row items-center'>
          <span className='flex-[10] font-semibold'>{title}</span>
          {isHide 
            ? <Image src={IconChevronUp} alt='' className='flex-[0.5] cursor-pointer' />
            : <Image src={IconChevronDown} alt='' className='flex-[0.5] cursor-pointer' /> 
          }
        </div>
      }
      {children && children}
    </div>
  )
}