import React, { ReactNode } from "react";
import "./CustomTabs.css";
import { useBuilderStore } from "@/lib/store";

interface Tab {
  label: string;
  content: ReactNode;
}

export interface CustomTabsProps {
  tabs: Tab[];
  initialTab?: number;
}

const CustomTabs: React.FC<CustomTabsProps> = ({ tabs }) => {
  const selectedTab = useBuilderStore((state) => state.selectedTab);
  const setSelectedTab = useBuilderStore((state) => state.setSelectedTab);

  return (
    <div className="mui-tabs-root">
      <div className="mui-tabs-list">
        {tabs.map((tab, idx) => (
          <button
            key={tab.label}
            className={`mui-tab${selectedTab === idx ? " mui-tab-active" : ""}`}
            onClick={() => setSelectedTab(idx, tab.label)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mui-tab-panel">{tabs[selectedTab]?.content}</div>
    </div>
  );
};

export default CustomTabs;
