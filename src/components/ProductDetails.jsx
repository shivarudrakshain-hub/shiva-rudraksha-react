import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  MessageCircle,
  Ruler,
  Scale,
  ShieldCheck,
} from "lucide-react";
import Gallery from "./Gallery";
import Logo from "./Logo";

export default function ProductDetails({ product, onBack }) {
  const message = encodeURIComponent(
    `Hello Shiva Rudraksha Inc., I am interested in ${product.name}. Please share availability, certificate and ordering details.`
  );

  return (
    <div className="details-page">
      <header className="detail-header">
        <div className="container detail-header-inner">
          <button onClick={onBack}><ArrowLeft /> Back to catalogue</button>
          <Logo compact />
        </div>
      </header>

      <main className="container details-layout">
        <Gallery product={product} />

        <section className="product-information">
          <span className="premium-label">{product.badge}</span>
          <h1>{product.name}</h1>

          <div className="information-grid">
            <span><MapPin /> Origin <strong>{product.origin}</strong></span>
            <span><Ruler /> Size <strong>{product.size}</strong></span>
            <span><Scale /> Weight <strong>{product.weight}</strong></span>
            <span><ShieldCheck /> Certificate <strong>Included</strong></span>
          </div>

          <p className="description">{product.description}</p>

          <div className="price-box">
            <small>Price in Canadian dollars</small>
            <strong>CAD ${Number(product.price).toFixed(2)}</strong>
          </div>

          <div className="included-list">
            <span><CheckCircle2 /> Front view</span>
            <span><CheckCircle2 /> Back view</span>
            <span><CheckCircle2 /> Top view</span>
            <span><CheckCircle2 /> Bottom view</span>
            <span><CheckCircle2 /> Certificate</span>
            <span><CheckCircle2 /> X-ray</span>
          </div>

          <a
            className="whatsapp-button"
            href={`https://wa.me/14372671257?text=${message}`}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle /> Enquire on WhatsApp
          </a>

          <p className="disclaimer">
            Traditional spiritual descriptions are informational and are not
            medical or financial guarantees.
          </p>
        </section>
      </main>
    </div>
  );
}
