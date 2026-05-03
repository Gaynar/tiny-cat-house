import { RoomView } from './RoomView.jsx';

const ROOM_ORDER = ['living_room', 'kitchen', 'bedroom'];

export function Diorama({ draggingCatId, hoveredRoomId, roomMessage, onOpenCatInfo }) {
  return (
    <main className="app-main">
      <div className="diorama" aria-label="Cat house rooms">
        {ROOM_ORDER.map((roomId) => (
          <RoomView
            key={roomId}
            roomId={roomId}
            draggingCatId={draggingCatId}
            isDragHovered={hoveredRoomId === roomId}
            message={roomMessage?.roomId === roomId ? roomMessage.text : ''}
            onOpenCatInfo={onOpenCatInfo}
          />
        ))}
      </div>
    </main>
  );
}
