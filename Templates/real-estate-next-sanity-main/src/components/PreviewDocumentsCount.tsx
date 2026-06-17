'use client'

import {usePreview} from '@/lib/sanity.preview'
import {query, DocumentsCount} from '@/components/DocumentsCount'

export default function PreviewDocumentsCount() {
  const data = usePreview(null, query)
  return <DocumentsCount data={data} />
}
