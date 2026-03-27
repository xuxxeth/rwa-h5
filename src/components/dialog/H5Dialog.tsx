
"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,

  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

export interface IH5DialogProps {
  trigger?: string | React.ReactNode,
  title?: string | React.ReactNode,
  children?: React.ReactNode
}


export function H5Dialog({
  trigger,
  title,
  children
}: IH5DialogProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div className=" cursor-pointer">{trigger}</div>
      </DrawerTrigger>
      <DrawerContent>
        <div className="">
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerClose asChild>
              <img src="/images/v2/icons/close_light.png" className="w-3 h-3 cursor-pointer" alt="" />
            </DrawerClose>
          </DrawerHeader>
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
