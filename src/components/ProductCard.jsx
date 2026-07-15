import { MessageCircle, MapPin, ShieldCheck } from "lucide-react";
import ProductImage from "./ProductImage";

export default function ProductCard({ product }) {
  const message = encodeURIComponent(
    `Hello Shiva Rudraksha Inc., I am interested in ${product.name}. Please share availability and certificate details.`
  );

  return (
    <article className="product-card">
      <div className="badge">{product.badge}</div>
      {product.image ? (
        <div className="product-image uploaded-product-image"><img src={product.image} alt={product.name} /></div>
      ) : (
        <ProductImage label={product.name} />
      )}
      <div className="product-body">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="meta">
          <span><MapPin size={16} /> {product.origin}</span>
          <span><ShieldCheck size={16} /> Certificate available</span>
        </div>
        <div className="product-footer">
          <div>
            <small>Starting from</small>
            <strong>CAD ${product.price.toLocaleString()}</strong>
          </div>
          <a
            href={`https://wa.me/14372671257?text=${message}`}
            target="_blank"
            rel="noreferrer"
            className="product-button"
          >
            <MessageCircle size={17} /> Enquire
          </a>
        </div>
      </div>
    </article>
  );
}
