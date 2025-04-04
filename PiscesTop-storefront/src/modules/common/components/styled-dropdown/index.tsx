"use client"

import React, { useState, useRef, useEffect } from "react"
import { ChevronDown } from "@medusajs/icons"

type DropdownOption = {
  value: string
  label: string
}

type StyledDropdownProps = {
  title: string
  items: DropdownOption[]
  value: string
  handleChange: (value: string) => void
  "data-testid"?: string
}

const StyledDropdown = ({
  title,
  items,
  value,
  handleChange,
  "data-testid": dataTestId,
}: StyledDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  // Get current selected label
  const selectedLabel = items.find(item => item.value === value)?.label || items[0]?.label
  
  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div 
      className="relative" 
      ref={dropdownRef} 
      data-testid={dataTestId}
    >
      <div className="flex flex-col gap-y-1">
        <span className="text-ui-fg-muted text-small-regular">{title}</span>
        <button
          className="flex items-center gap-x-2 px-3 py-2 rounded-md border border-pisces-light hover:border-pisces-accent transition-colors duration-200 bg-white/80 backdrop-blur-sm group"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span className="text-ui-fg-base text-small-regular group-hover:text-pisces-accent transition-colors duration-200">
            {selectedLabel}
          </span>
          <ChevronDown 
            className={`text-ui-fg-muted group-hover:text-pisces-accent transition-all duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>
      </div>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white/80 backdrop-blur-md rounded-md shadow-lg border border-pisces-light overflow-hidden">
          <ul 
            className="py-1 max-h-60 overflow-auto"
            role="listbox"
            aria-activedescendant={value}
          >
            {items.map((item) => (
              <li 
                key={item.value}
                id={item.value}
                role="option"
                aria-selected={item.value === value}
                className={`
                  px-3 py-2 text-small-regular cursor-pointer transition-colors duration-150
                  ${item.value === value 
                    ? 'bg-gradient-to-r from-pink-50 to-pink-100 text-pisces-primary font-medium' 
                    : 'text-ui-fg-base hover:bg-pink-50/50 hover:text-pisces-accent'}
                  ${item.value === value ? 'relative' : ''}
                `}
                onClick={() => {
                  handleChange(item.value)
                  setIsOpen(false)
                }}
              >
                <span className="flex items-center">
                  {item.value === value && (
                    <span className="absolute left-1 w-1 h-6 bg-pisces-primary rounded-full"></span>
                  )}
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default StyledDropdown 