import { useState } from "react"
import "./LinkRow.css"

const BASE_URL = import.meta.env.VITE_BASE_URL

export default function LinkRow({
    url,
    copiedId,
    showAnalytics,
    analyticsData,
    onCopy,
    onToggle,
    onDelete,
    onAnalytics,
    onQr,
}) {
    const [deleting, setDeleting] = useState(false)
    const isCopied = copiedId === url._id
    const analyticsOpen = showAnalytics === url._id

    async function handleDelete() {
        setDeleting(true)
        await onDelete(url._id)
        setDeleting(false)
    }

    return (
        <article className={`link-row ${!url.isActive ? "link-row--disabled" : ""}`}>
            <div className="link-row-main">
                <div className="link-row-info">
                    <a
                        href={`${BASE_URL}/${url.shorturl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="link-row-short"
                    >
                        {BASE_URL}/{url.shorturl}
                    </a>
                    <p className="link-row-original" title={url.originalurl}>{url.originalurl}</p>
                </div>

                <div className="link-row-stats">
                    <span className="link-row-clicks">{url.clicks} clicks</span>
                    <span className={`badge ${url.isActive ? "" : "badge--inactive"}`}>
                        <span className={`badge-dot ${url.isActive ? "" : "badge-dot--off"}`} />
                        {url.isActive ? "Active" : "Paused"}
                    </span>
                </div>
            </div>

            <div className="link-row-actions">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => onCopy(url.shorturl, url._id)}>
                    {isCopied ? "Copied" : "Copy"}
                </button>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => onQr(url)}>QR</button>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => onAnalytics(url._id)}>
                    {analyticsOpen ? "Hide stats" : "Stats"}
                </button>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => onToggle(url._id)}>
                    {url.isActive ? "Pause" : "Resume"}
                </button>
                <button type="button" className="btn btn-ghost btn-sm btn-danger" onClick={handleDelete} disabled={deleting}>
                    {deleting ? "…" : "Delete"}
                </button>
            </div>

            {analyticsOpen && analyticsData && (
                <div className="link-row-analytics">
                    {analyticsData.length === 0 ? (
                        <p className="link-row-analytics-empty">No clicks recorded yet.</p>
                    ) : (
                        <div className="link-row-analytics-grid">
                            {analyticsData.slice(0, 6).map((click, i) => (
                                <div key={i} className="analytics-cell">
                                    <span className="analytics-cell-label">Visit {i + 1}</span>
                                    <span className="analytics-cell-value">{click.browser}</span>
                                    <span className="analytics-cell-meta">{click.os} · {click.device}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </article>
    )
}
