import React, { useState } from "react";
import "./page-dialog.css";

interface PagesPopupProps {
  onClose: () => void;
  onAdd: (pageName: string, description: string) => void;
}

const PagesPopup: React.FC<PagesPopupProps> = ({ onClose, onAdd }) => {
  const [pageName, setPageName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pageName.trim()) {
      onAdd(pageName.trim(), description.trim());
      setPageName("");
      setDescription("");
    }
  };

  return (
    <div className="pages-popup-overlay">
      <form className="pages-popup" onSubmit={handleSubmit}>
        <label htmlFor="pageName">Page Name</label>
        <input
          id="pageName"
          value={pageName}
          onChange={(e) => setPageName(e.target.value)}
          autoFocus
        />
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
        <div className="pages-popup-btns">
          <button
            type="button"
            className="pages-popup-btn cancel"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="pages-popup-btn add"
            disabled={!pageName.trim()}
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default PagesPopup;
