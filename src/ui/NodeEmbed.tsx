import { useEffect, useState } from 'react'
import type { BoardLinks } from './BoardCanvas.tsx'

export type EmbedPreview = { kind: 'image', src: string } | { kind: 'note' } | { kind: 'missing' | 'unsupported' }

/** Compact vault-only previews. Fixed geometry keeps async reads from shifting the board. */
export function NodeEmbed({ linktext, label, links }: { linktext: string, label: string, links: BoardLinks }) {
  const [preview, setPreview] = useState<EmbedPreview | null>(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    let active = true
    let generation = 0
    const refresh = () => {
      const request = ++generation
      setFailed(false)
      void (links.preview?.(linktext) ?? Promise.resolve({ kind: 'unsupported' } as EmbedPreview))
        .then(value => { if (active && request === generation) setPreview(value) })
        .catch(() => { if (active && request === generation) setPreview({ kind: 'missing' }) })
    }
    refresh()
    const stop = links.watchEmbeds?.(refresh)
    return () => { active = false; stop?.() }
  }, [links, linktext])
  if (preview?.kind === 'note') return <a
    className="internal-link flowmap-embed-note nodrag nopan" data-href={linktext} aria-label={linktext}
    onClick={e => { e.preventDefault(); e.stopPropagation(); links.open(linktext, e.ctrlKey || e.metaKey) }}
    onMouseEnter={e => links.hover(e.nativeEvent, e.currentTarget, linktext)}
    onDoubleClick={e => e.stopPropagation()}>{label}</a>
  return <span className="flowmap-embed nodrag nopan" onDoubleClick={e => e.stopPropagation()}>
    <button className="flowmap-embed-title" title={`Open ${linktext}`}
      onClick={e => { e.stopPropagation(); links.open(linktext, e.ctrlKey || e.metaKey) }}>{label}</button>
    <span className="flowmap-embed-body nowheel">
      {preview?.kind === 'image' && !failed
        ? <img src={preview.src} alt={label} draggable={false} loading="lazy" decoding="async" onError={() => setFailed(true)}
            onClick={e => { e.stopPropagation(); links.open(linktext, e.ctrlKey || e.metaKey) }} />
        : !preview ? 'Loading preview…' : failed || preview.kind === 'missing' ? 'Attachment not found or unavailable' : 'Preview unavailable for this file type'}
    </span>
  </span>
}