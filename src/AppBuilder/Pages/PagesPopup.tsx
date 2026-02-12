import React, { useState } from "react";
import "./PagesPopup.css";

interface PagesPopupProps {
  onClose: () => void;
  onAdd: (pageName: string) => void;
}

const PagesPopup: React.FC<PagesPopupProps> = ({ onClose, onAdd }) => {
  const [pageName, setPageName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pageName.trim()) {
      onAdd(pageName.trim());
      setPageName("");
    }
  };

  return (
    <div className="pages-popup-overlay">
      <form className="pages-popup" onSubmit={handleSubmit}>
        <label htmlFor="pageName">Page Name</label>
        <input
          id="pageName"
          value={pageName}
          onChange={e => setPageName(e.target.value)}
          autoFocus
        />
        <div className="pages-popup-btns">
          <button type="button" className="pages-popup-btn cancel" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="pages-popup-btn add" disabled={!pageName.trim()}>
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default PagesPopup;
