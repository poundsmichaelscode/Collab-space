// import mongoose, { Schema } from 'mongoose';

// const TaskSchema = new Schema(
//   {
//     workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
//     boardId: { type: Schema.Types.ObjectId, required: true, index: true },
//     columnKey: { type: String, enum: ['todo', 'in_progress', 'review', 'done'], default: 'todo' },
//     title: { type: String, required: true },
//     description: { type: String },
//     assigneeIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
//     reporterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//     priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
//     order: { type: Number, default: 0 },
//     dueDate: { type: Date }
//   },
//   { timestamps: true }
// );

// TaskSchema.index({ boardId: 1, columnKey: 1, order: 1 });

// export const TaskModel = mongoose.model('Task', TaskSchema);




import mongoose, { Schema } from 'mongoose';

const TaskSchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    boardId: { type: String, required: true, index: true },
    columnKey: {
      type: String,
      enum: ['todo', 'in_progress', 'review', 'done'],
      default: 'todo'
    },
    title: { type: String, required: true },
    description: { type: String },
    assigneeIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    reporterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    order: { type: Number, default: 0 },
    dueDate: { type: Date }
  },
  { timestamps: true }
);

TaskSchema.index({ boardId: 1, columnKey: 1, order: 1 });

export const TaskModel = mongoose.model('Task', TaskSchema);