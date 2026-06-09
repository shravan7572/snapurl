import "./LandingStats.css"

const STATS = [
    { value: "Free", label: "No paid tier", detail: "All features included" },
    { value: "∞", label: "Link limit", detail: "Create as many as you need" },
    { value: "Real-time", label: "Analytics", detail: "Per-click device data" },
    { value: "QR", label: "Every link", detail: "PNG download ready" },
]

export default function LandingStats() {
    return (
        <section className="landing-stats" aria-label="Product highlights">
            <div className="landing-stats-inner">
                {STATS.map((s, i) => (
                    <div key={s.label} className={`stat-box animate-in stagger-${i + 1}`}>
                        <span className="stat-box-value">{s.value}</span>
                        <span className="stat-box-label">{s.label}</span>
                        <span className="stat-box-detail">{s.detail}</span>
                    </div>
                ))}
            </div>
        </section>
    )
}
