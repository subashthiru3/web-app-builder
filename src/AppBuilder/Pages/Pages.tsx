import React, { useState } from "react";
import styles from "./Pages.module.css";
import PagesPopup from "./PagesPopup";
import { usePagesStore } from "@/lib/pagesStore";

const Pages: React.FC = () => {
  const { pages, activePageId, addPage, setActivePage, deletePage } =
    usePagesStore();
  const [showPopup, setShowPopup] = useState(false);
  console.log(
    "Rendering Pages component, pages:",
    pages,
    "activePageId:",
    activePageId,
  );

  return (
    <div className={styles.pagesSidebar}>
      <div className={styles.pagesHeader}>
        <span>Pages</span>
        <button
          className={styles.addPageBtn}
          onClick={() => setShowPopup(true)}
          aria-label="Add Page"
        >
          + Add Page
        </button>
      </div>
      <ul className={styles.pagesList}>
        {pages.map((page) => (
          <li
            key={page.id}
            className={
              page.id === activePageId ? styles.activePage : styles.pageItem
            }
            onClick={() => setActivePage(page.id)}
            tabIndex={0}
            role="button"
            aria-current={page.id === activePageId}
          >
            <span className={styles.pageName}>{page.name}</span>
            {page.id === activePageId && (
              <button
                type="button"
                className={styles.deletePageBtn}
                onClick={(event) => {
                  event.stopPropagation();
                  deletePage(page.id);
                }}
                aria-label={`Delete ${page.name}`}
              >
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>
      {showPopup && (
        <PagesPopup
          onClose={() => setShowPopup(false)}
          onAdd={(name, description) => {
            addPage(name, description);
            setShowPopup(false);
          }}
        />
      )}
    </div>
  );
};

export default Pages;
