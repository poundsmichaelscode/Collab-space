'use client';

import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '@/types';
import { useMoveTask } from '@/hooks/use-workspace-data';

const columns: Task['columnKey'][] = ['todo', 'in_progress', 'review', 'done'];

function TaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id, data: { task } });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.6 : 1 };
  return (
    <div ref={setNodeRef} style={style} className="rounded-xl border border-border bg-background p-3 text-sm shadow-sm" {...attributes} {...listeners}>
      <p className="font-medium">{task.title}</p>
      {task.description ? <p className="mt-1 text-xs text-muted">{task.description}</p> : null}
      <span className="mt-3 inline-flex rounded-full border border-border px-2 py-1 text-[10px] uppercase tracking-wide text-muted">{task.priority}</span>
    </div>
  );
}

export function BoardView({ boardId, tasks }: { boardId: string; tasks: Task[] }) {
  const moveTask = useMoveTask();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const grouped = Object.fromEntries(columns.map((column) => [column, tasks.filter((task) => task.columnKey === column).sort((a, b) => a.order - b.order)])) as Record<Task['columnKey'], Task[]>;

  function findTask(id: string) { return tasks.find((task) => task._id === id); }

  function onDragEnd(event: DragEndEvent) {
    const activeTask = findTask(String(event.active.id));
    if (!activeTask) return;
    const overTask = event.over ? findTask(String(event.over.id)) : undefined;
    const targetColumn = overTask?.columnKey ?? activeTask.columnKey;
    const targetList = grouped[targetColumn];
    const targetIndex = overTask ? targetList.findIndex((task) => task._id === overTask._id) : targetList.length;
    moveTask.mutate({ taskId: activeTask._id, columnKey: targetColumn, order: Math.max(targetIndex, 0), boardId });
  }

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {columns.map((column) => {
          const columnTasks = grouped[column];
          return (
            <section key={column} className="rounded-2xl border border-border bg-surface p-4">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">{column.replace('_', ' ')}</h2>
              <SortableContext items={columnTasks.map((task) => task._id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3 min-h-[200px]">
                  {columnTasks.map((task) => <TaskCard key={task._id} task={task} />)}
                  {columnTasks.length === 0 ? <div className="rounded-xl border border-dashed border-border p-4 text-xs text-muted">Drop tasks here.</div> : null}
                </div>
              </SortableContext>
            </section>
          );
        })}
      </div>
    </DndContext>
  );
}
