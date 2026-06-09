import "./AnalyticsPreview.css"

const CLICKS = [
    { browser: "Chrome", os: "macOS", device: "Desktop" },
    { browser: "Safari", os: "iOS", device: "Mobile" },
    { browser: "Firefox", os: "Windows", device: "Desktop" },
]

export default function AnalyticsPreview() {
    return (
        <div className="analytics-preview" aria-hidden="true">
            <div className="analytics-preview-header">
                <div>
                    <p className="analytics-preview-label">Analytics preview</p>
                    <h3>snap.url/launch</h3>
                </div>
                <span className="badge"><span className="badge-dot" /> Live</span>
            </div>

            <div className="analytics-preview-metrics">
                <div className="metric-box">
                    <span className="metric-value">247</span>
                    <span className="metric-label">Total clicks</span>
                </div>
                <div className="metric-box">
                    <span className="metric-value">14</span>
                    <span className="metric-label">Today</span>
                </div>
                <div className="metric-box">
                    <span className="metric-value">68%</span>
                    <span className="metric-label">Mobile</span>
                </div>
            </div>

            <div className="analytics-preview-chart">
                <p className="analytics-preview-sublabel">Clicks — last 7 days</p>
                <div className="chart-bars">
                    {[35, 55, 40, 70, 50, 85, 65].map((h, i) => (
                        <div key={i} className="chart-bar-wrap">
                            <div className="chart-bar" style={{ height: `${h}%` }} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="analytics-preview-visits">
                <p className="analytics-preview-sublabel">Recent visits</p>
                <ul className="visit-list">
                    {CLICKS.map((c, i) => (
                        <li key={i} className="visit-row">
                            <span className="visit-num">#{i + 1}</span>
                            <span className="visit-info">{c.browser} · {c.os}</span>
                            <span className="visit-device">{c.device}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
