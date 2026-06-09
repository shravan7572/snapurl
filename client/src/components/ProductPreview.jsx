import "./ProductPreview.css"

export default function ProductPreview() {
    return (
        <div className="product-preview" aria-hidden="true">
            <div className="product-preview-chrome">
                <div className="product-preview-dots">
                    <span /><span /><span />
                </div>
                <span className="product-preview-title">snap.url/dashboard</span>
            </div>
            <div className="product-preview-body">
                <div className="preview-form">
                    <span className="preview-label">Destination URL</span>
                    <div className="preview-input preview-input--filled">
                        https://example.com/very/long/path
                    </div>
                    <span className="preview-label">Custom alias</span>
                    <div className="preview-input">launch</div>
                    <div className="preview-btn">Create short link</div>
                </div>
                <div className="preview-result">
                    <div className="preview-result-head">
                        <span>Short link created</span>
                        <span className="badge"><span className="badge-dot" /> Active</span>
                    </div>
                    <div className="preview-short">snap.url/launch</div>
                    <div className="preview-meta">
                        <span>0 clicks</span>
                        <span>QR ready</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
