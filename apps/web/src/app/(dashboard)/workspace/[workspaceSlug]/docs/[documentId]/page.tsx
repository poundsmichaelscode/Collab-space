'use client';

import { useParams } from 'next/navigation';
import { DocumentEditor } from '@/components/docs/document-editor';
import { useDocument, useDocuments, useWorkspaces } from '@/hooks/use-workspace-data';

export default function DocumentPage() {
  const params = useParams<{ workspaceSlug: string; documentId: string }>();
  const { data: workspaces = [] } = useWorkspaces();
  const workspace = workspaces.find((item) => item.slug === params.workspaceSlug);
  const { data: docs = [] } = useDocuments(workspace?._id ?? '');
  const fallbackDoc = docs[0];
  const selectedId = params.documentId === 'home' ? fallbackDoc?._id : params.documentId;
  const { data: document } = useDocument(selectedId ?? '');

  if (!document) {
    return <div className="rounded-2xl border border-dashed border-border p-8 text-sm text-muted">Loading document...</div>;
  }

  return <DocumentEditor document={document} />;
}
