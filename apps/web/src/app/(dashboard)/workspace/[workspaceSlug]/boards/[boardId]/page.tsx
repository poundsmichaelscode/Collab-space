'use client';

import { useParams } from 'next/navigation';
import { BoardView } from '@/components/tasks/board-view';
import { useTasks } from '@/hooks/use-workspace-data';

export default function BoardPage() {
  const params = useParams<{ boardId: string }>();
  const boardId = params.boardId === 'main' ? 'main' : params.boardId;
  const { data: tasks = [] } = useTasks(boardId);

  return <BoardView boardId={boardId} tasks={tasks} />;
}
