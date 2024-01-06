// board.js

import React, { useState } from 'react';
import Card from '../Card';// Importing the Card component
import '../NoticeBoard.scss'; // Assuming you have a separate CSS file for the board styles

const Board = () => {
  const [cardCount, setCardCount] = useState(0);
  const [cards, setCards] = useState([]);
  const [zIndex, setZindex] = useState(0)

  const addCard = () => {
    const newCardId = `card${cardCount}`;
    const newCard = {
      id: newCardId,
      content: `Card ${cardCount + 1}`,
      pinned: false,
      editing: false,
      position: { x: 0, y: 0 },
      width: 150, // Set your card width
      height: 20, // Set your card height
      zIndex:zIndex
    };
    setCards([...cards, newCard]);
    setCardCount(cardCount + 1);
    setZindex(zIndex+1)
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const draggedCardId = e.dataTransfer.getData('cardId');
    const draggedCard = cards.find((card) => card.id === draggedCardId);
  
    if (draggedCard && !draggedCard.pinned) {
      const boardRect = e.currentTarget.getBoundingClientRect();
      const cardHeight = document.querySelector(`#${draggedCardId}`).clientHeight;
  
      const offsetX = e.clientX - boardRect.left - draggedCard.width / 2;
      const offsetY = e.clientY - boardRect.top - cardHeight / 2;
  
      const draggedBounds = {
        left: offsetX,
        top: offsetY,
        right: offsetX + draggedCard.width,
        bottom: offsetY + draggedCard.height,
      };
  
      let isOverlapping = false;
      cards.forEach((card) => {
        if (card.pinned && card.id !== draggedCardId) {
          const pinnedCardRect = document.getElementById(card.id).getBoundingClientRect();
          const pinnedBounds = {
            left: pinnedCardRect.left,
            top: pinnedCardRect.top,
            right: pinnedCardRect.right,
            bottom: pinnedCardRect.bottom,
          };
  
          if (
            draggedBounds.left < pinnedBounds.right &&
            draggedBounds.right > pinnedBounds.left &&
            draggedBounds.top < pinnedBounds.bottom &&
            draggedBounds.bottom > pinnedBounds.top
          ) {
            isOverlapping = true;
          }
        }
      });
  
      if (!isOverlapping) {
        const updatedCards = cards.map((card) =>
          card.id === draggedCardId ? { ...card, position: { x: offsetX, y: offsetY },zIndex:zIndex+1 } : card
        );
        setCards(updatedCards);
      }
    }
  };

  return (
    <div className="notice-board">
      <div className="board-container" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
        <button className="add-card-btn" onClick={addCard}>
          Add Card
        </button>
        {cards.map((card) => (
          <Card
            key={card.id}
            id={card.id}
            content={card.content}
            pinned={card.pinned}
            editing={card.editing}
            position={card.position}
            cards={cards}
            setCards={setCards}
            zIndex={card.zIndex}
          />
        ))}
      </div>
    </div>
  );
};

export default Board;
