import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  MessageCircle,
  ShoppingCart,
  Ruler,
  ShieldCheck,
} from "lucide-react";
import { useMemo, useState } from "react";
import Gallery from "./Gallery";
import Logo from "./Logo";

export default function ProductDetails({ product, onBack }) {
  const variants = useMemo(() => {
    if (Array.isArray(product.variants) && product.variants.length) return product.variants;
    return [
      { name: "Small", price: Number(product.price || 0) },
      { name: "Medium", price: Number(product.price || 0) },
      { name: "Large", price: Number(product.price || 0) },
      { name: "Collector", price: Number(product.price || 0) },
      { name: "Super Collector", price: Number(product.price || 0) },
    ];
  }, [product]);

  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  const message = encodeURIComponent(
    `Hello Shiva Rudraksha Inc., I am interested in ${product.name} - ${selectedVariant.name} size (CAD $${Number(selectedVariant.price).toFixed(2)}). Please share availability, certificate and ordering details.`
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
            <span><Ruler /> Variants <strong>5 sizes</strong></span>
            <span><ShieldCheck /> Certificate <strong>Included</strong></span>
          </div>

          <p className="description">{product.description}</p>

          <div className="variant-selector">
            <label htmlFor="size-variant">Select bead size</label>
            <select
              id="size-variant"
              value={selectedVariant.name}
              onChange={(event) =>
                setSelectedVariant(variants.find((variant) => variant.name === event.target.value) || variants[0])
              }
            >
              {variants.map((variant) => (
                <option key={variant.name} value={variant.name}>
                  {variant.name} — CAD ${Number(variant.price).toFixed(2)}
                </option>
              ))}
            </select>
            <small>Product images are representative and shared across all size variants.</small>
          </div>

          <div className="price-box">
            <small>{selectedVariant.name} price in Canadian dollars</small>
            <strong>CAD ${Number(selectedVariant.price).toFixed(2)}</strong>
          </div>

          <div className="included-list">
            <span><CheckCircle2 /> Front view</span>
            <span><CheckCircle2 /> Back view</span>
            <span><CheckCircle2 /> Top view</span>
            <span><CheckCircle2 /> Bottom view</span>
            <span><CheckCircle2 /> Certificate</span>
            <span><CheckCircle2 /> X-ray</span>
          </div>

          <div className="product-action-buttons">
            <a
              className="whatsapp-button"
              href={`https://wa.me/14372671257?text=${message}`}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle /> Enquire on WhatsApp
            </a>

            {product.etsyUrl && (
              <a
                className="buy-button"
                href={product.etsyUrl}
                target="_blank"
                rel="noreferrer"
              >
                <ShoppingCart /> Buy Now
              </a>
            )}
          </div>

          <p className="disclaimer">
            Traditional spiritual descriptions are informational and are not
            medical or financial guarantees.
          </p>
        </section>
      </main>
    </div>
  );
}
