import { useEffect, useRef, useState } from 'react';
import { CatInfoPanel } from './components/CatInfoPanel.jsx';
import { CatRoster } from './components/CatRoster.jsx';
import { Diorama } from './components/Diorama.jsx';
import { ResourceBar } from './components/ResourceBar.jsx';
import { assignCat } from './store/actions.js';
import { GameStateProvider, useGameState } from './store/gameState.js';
import { resetSave } from './store/persistence.js';

const DRAG_THRESHOLD = 8;

function Game() {
  const { state, setState } = useGameState();
  const [activeCatInfoId, setActiveCatInfoId] = useState(null);
  const [dragState, setDragState] = useState(null);
  const [hoveredRoomId, setHoveredRoomId] = useState(null);
  const [roomMessage, setRoomMessage] = useState(null);
  const dragRef = useRef(null);
  const stateRef = useRef(state);
  const messageTimeoutRef = useRef(null);
  const isTrackingDrag = Boolean(dragState);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  function showRoomMessage(roomId, text) {
    window.clearTimeout(messageTimeoutRef.current);
    setRoomMessage({ roomId, text });
    messageTimeoutRef.current = window.setTimeout(() => setRoomMessage(null), 1200);
  }

  function roomIdFromPoint(x, y) {
    const element = document.elementFromPoint(x, y);
    return element?.closest('[data-room-id]')?.dataset.roomId ?? null;
  }

  function startCatDrag(catId, event) {
    if (event.button !== undefined && event.button !== 0) {
      return;
    }

    event.preventDefault();

    const nextDragState = {
      catId,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      x: event.clientX,
      y: event.clientY,
      isDragging: false,
    };

    dragRef.current = nextDragState;
    setDragState(nextDragState);
  }

  useEffect(() => {
    if (!isTrackingDrag) {
      return undefined;
    }

    function handlePointerMove(event) {
      const currentDrag = dragRef.current;
      if (!currentDrag || event.pointerId !== currentDrag.pointerId) {
        return;
      }

      const moved = Math.hypot(event.clientX - currentDrag.startX, event.clientY - currentDrag.startY);
      const nextDragState = {
        ...currentDrag,
        x: event.clientX,
        y: event.clientY,
        isDragging: currentDrag.isDragging || moved >= DRAG_THRESHOLD,
      };

      dragRef.current = nextDragState;
      setDragState(nextDragState);
      setHoveredRoomId(nextDragState.isDragging ? roomIdFromPoint(event.clientX, event.clientY) : null);
    }

    function handlePointerUp(event) {
      const currentDrag = dragRef.current;
      if (!currentDrag || event.pointerId !== currentDrag.pointerId) {
        return;
      }

      const finalDrag = {
        ...currentDrag,
        x: event.clientX,
        y: event.clientY,
      };

      if (finalDrag.isDragging) {
        const roomId = roomIdFromPoint(event.clientX, event.clientY);
        if (roomId) {
          const dropResult = assignCat(stateRef.current, finalDrag.catId, roomId, Date.now());
          if (dropResult.ok) {
            setState(dropResult.state);
          } else {
            showRoomMessage(roomId, dropResult.reason);
          }
        }
      } else {
        setActiveCatInfoId(finalDrag.catId);
      }

      dragRef.current = null;
      setDragState(null);
      setHoveredRoomId(null);
    }

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [isTrackingDrag, setState]);

  useEffect(() => () => window.clearTimeout(messageTimeoutRef.current), []);

  function handleResetSave() {
    resetSave();
    window.location.reload();
  }

  return (
    <div className="app-shell">
      <ResourceBar />
      <Diorama
        draggingCatId={dragState?.isDragging ? dragState.catId : null}
        hoveredRoomId={hoveredRoomId}
        roomMessage={roomMessage}
        onOpenCatInfo={setActiveCatInfoId}
      />
      <div className="debug-row">
        <button className="debug-reset" type="button" onClick={handleResetSave}>
          Reset save
        </button>
      </div>
      <CatRoster
        draggingCatId={dragState?.catId ?? null}
        isDragging={Boolean(dragState?.isDragging)}
        onCatPointerDown={startCatDrag}
        onOpenCatInfo={setActiveCatInfoId}
      />
      {dragState?.isDragging ? (
        <div
          className="cat-drag-ghost"
          style={{ '--drag-x': `${dragState.x}px`, '--drag-y': `${dragState.y}px` }}
          aria-hidden="true"
        >
          {dragState.catId.charAt(0).toUpperCase()}
        </div>
      ) : null}
      {activeCatInfoId ? <CatInfoPanel catId={activeCatInfoId} onClose={() => setActiveCatInfoId(null)} /> : null}
    </div>
  );
}

export default function App() {
  return (
    <GameStateProvider>
      <Game />
    </GameStateProvider>
  );
}
