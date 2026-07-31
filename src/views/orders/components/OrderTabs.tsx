import { useState } from "react";
import { cn } from "@/lib/utils";

const tabs = [
  {
    label: "当前委托",
    value: "current",
  },
  {
    label: "历史委托",
    value: "history",
  },
  {
    label: "成交记录",
    value: "trade",
  },
];

export default function OrderTabs({ onChange }: { onChange?: (tab: string) => void }) {
  const [active, setActive] = useState("current");

  const activeIndex = tabs.findIndex((item) => item.value === active);

  return (
    <div className="border-b border-[#232427]">
      <div className="relative flex">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setActive(tab.value)
              onChange?.(tab.value)
            }}
            className={cn(
              "relative flex-1 h-[46px] text-[14px] font-medium transition-colors",
              active === tab.value
                ? "text-white"
                : "text-[#737A87] hover:text-white"
            )}
          >
            {tab.label}
          </button>
        ))}

        {/* 底部滑块 */}
        <span
          className="absolute bottom-0 h-[2px] rounded-full transition-all duration-300 ease-in-out"
          style={{
            width: `${100 / tabs.length}%`,
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        >
          <span className="absolute left-1/2 top-0 h-[2px] w-[20px] -translate-x-1/2 rounded-full bg-white" />
        </span>
      </div>
    </div>
  );
}