import { MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import Gallery from "./Gallery";

export default function ProductCard({ product, onOpen }) {
  const message = encodeURIComponent(
    `Hello Shiva Rudraksha Inc., I am interested in ${product.name}. Please share availability and ordering details.`
  );

  return (
    <article className="product-card">
      <button className="card-open" onClick={() => onOpen(product)}>
        <Gallery product={product} compact />
      </button>

      <div className="card-content">
        <div className="card-badges">
          <span>{product.badge}</span>
          <span>{product.stockStatus}</span>
        </div>

        <button className="product-name" onClick={() => onOpen(product)}>
          {product.name}
        </button>

        <p>{product.description}</p>

        <div className="card-meta">
          <span><MapPin /> {product.origin}</span>
          <span><ShieldCheck /> Certificate included</span>
        </div>

        <div className="card-bottom">
          <div>
            <small>CAD</small>
            <strong>${Number(product.price).toFixed(2)}</strong>
          </div>
          <button className="details-button" onClick={() => onOpen(product)}>
            View details
          </button>
          <a
            href={`https://wa.me/14372671257?text=${message}`}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle /> Enquire
          </a>
        </div>
      </div>
    </article>
  );
}
