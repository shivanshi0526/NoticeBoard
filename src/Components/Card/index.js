// card.js

import React, { useRef, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import PushPinIcon from '@mui/icons-material/PushPin';
import EditIcon from '@mui/icons-material/Edit';

const Card = ({
  id,
  content,
  pinned,
  editing,
  position,
  setCards,
  cards,
  zIndex
}) => {
  const contentEditableRef = useRef(null);

  useEffect(() => {
    if (contentEditableRef.current && editing && !pinned) {
      contentEditableRef.current.focus();
      const selection = window.getSelection();
      selection.removeAllRanges();
      const range = document.createRange();
      range.setStart(contentEditableRef.current, 0);
      selection.addRange(range);
    }
  }, [editing, pinned]);

  const handlePin = (cardId) => {
    const cardToPin = cards.find((card) => card.id === cardId);

    if (cardToPin && !cardToPin.pinned) {
      const isOverlapping = (element1, element2) => {
        const rect1 = element1.getBoundingClientRect();
        const rect2 = element2.getBoundingClientRect();
        return !(
          rect1.right < rect2.left ||
          rect1.left > rect2.right ||
          rect1.bottom < rect2.top ||
          rect1.top > rect2.bottom
        );
      };

      let isOverlappingPinned = false;
      cards.forEach((card) => {
        if (card.pinned && card.id !== cardId) {
          const pinnedCard = document.getElementById(card.id);
          const cardToPinElement = document.getElementById(cardId);
          if (isOverlapping(cardToPinElement, pinnedCard)) {
            isOverlappingPinned = true;
          }
        }
      });

      if (!isOverlappingPinned) {
        const updatedCards = cards.map((card) =>
          card.id === cardId ? { ...card, pinned: true ,zIndex:99999} : card
        );
        setCards(updatedCards);
      }
    }
  };

  const handleDrag = (e, cardId) => {
    if (!pinned) {
      e.dataTransfer.setData('cardId', cardId);
    }
  };

  const handleEdit = (cardId) => {
    const updatedCards = cards.map((card) =>
      card.id === cardId ? { ...card, editing: true } : card
    );
    setCards(updatedCards);
  };

  const handleBlur = (cardId) => {
    const updatedCards = cards.map((card) =>
      card.id === cardId ? { ...card, editing: false } : card
    );
    setCards(updatedCards);
  };

  const handleDelete = (cardId) => {
    const updatedCards = cards.filter((card) => card.id !== cardId);
    setCards(updatedCards);
  };

  return (
    <div
      className={`card ${pinned ? 'pinned' : ''}`}
      id={id}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: zIndex
      }}
      draggable={!pinned}
      onDragStart={(e) => handleDrag(e, id)}
      onDragOver={(e) => e.preventDefault()}
    >
      <div
        className={`card-content ${editing && !pinned ? 'editing' : ''}`}
        contentEditable={editing && !pinned}
        suppressContentEditableWarning={true}
        onBlur={() => handleBlur(id)}
        onDoubleClick={() => handleEdit(id)}
        ref={(ref) => {
          if (editing) {
            contentEditableRef.current = ref;
          }
        }}
      >
        {content}
      </div>
      <EditIcon
      className="edit-btn"
      fontSize="small"
      style={{ opacity: pinned ? '0' : '1' }}
      onClick={() => handleEdit(id)}/>
      <PushPinIcon
        className="pin-btn"
        fontSize="small"
        style={{ opacity: pinned ? '0' : '1' }}
        onClick={() => handlePin(id)}
      />
      <CloseIcon
        fontSize="small"
        className="delete-btn"
        onClick={() => handleDelete(id)}
      />
    </div>
  );
};

export default Card;
