import React, { ReactNode, useMemo, useState } from "react";
import "./custom-tabs.css";

interface Tab {
  label: string;
  content: ReactNode;
}

export interface CustomTabsProps {
  tabs: Tab[];
  initialTab?: number;
}

const CustomTabs: React.FC<CustomTabsProps> = ({ tabs, initialTab = 0 }) => {
  const defaultTabIndex = useMemo(() => {
    if (initialTab >= 0 && initialTab < tabs.length) return initialTab;
    return 0;
  }, [initialTab, tabs.length]);

  const [selectedTab, setSelectedTab] = useState(defaultTabIndex);
  const activeTabIndex =
    selectedTab < tabs.length ? selectedTab : defaultTabIndex;

  return (
    <div className="mui-tabs-root">
      <div className="mui-tabs-list">
        {tabs.map((tab, idx) => (
          <button
            key={tab.label}
            className={`mui-tab${activeTabIndex === idx ? " mui-tab-active" : ""}`}
            onClick={() => setSelectedTab(idx)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mui-tab-panel">{tabs[activeTabIndex]?.content}</div>
    </div>
  );
};

export default CustomTabs;
