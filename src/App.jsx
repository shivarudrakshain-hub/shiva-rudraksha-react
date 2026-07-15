import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Gem,
  Globe2,
  HeartHandshake,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";
import Header from "./components/Header";
import ProductCard from "./components/ProductCard";
import { categories as starterCategories } from "./data/products";
import { loadPublicProducts } from "./data/productStore";
import { useEffect } from "react";

const categoryCards = [
  ["Nepal Rudraksha", "Large, natural beads selected for visible Mukhi lines.", "ॐ"],
  ["Indonesia Rudraksha", "Compact beads suitable for wearing and malas.", "✦"],
  ["Siddha Mala", "Curated multi-Mukhi spiritual sets.", "☸"],
  ["Special Rudraksha", "Gaurishankar, Ganesh and rare natural formations.", "✺"],
];

export default function App() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadPublicProducts().then(setProducts);
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set([...starterCategories.filter((x) => x !== "All"), ...products.map((p) => p.category)])],
    [products]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = category === "All" || p.category === category;
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  return (
    <>
      <Header />

      <main>
        <section id="home" className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="eyebrow"><Sparkles size={17} /> Authentic • Certified • Carefully Selected</div>
              <h1>Authentic Rudraksha for spiritual practice and purposeful living.</h1>
              <p>
                Explore Rudraksha beads, malas and combinations sourced from Nepal and Indonesia,
                supported by personal guidance from Shiva Rudraksha Inc. in Canada.
              </p>
              <div className="hero-actions">
                <button onClick={() => document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" })}>
                  Shop Rudraksha <ArrowRight size={18} />
                </button>
                <a href="#recommendation" className="secondary-button">Get a Recommendation</a>
              </div>
              <div className="trust-row">
                <span><ShieldCheck /> Authentic products</span>
                <span><Truck /> Canada & worldwide shipping</span>
                <span><HeartHandshake /> Personal guidance</span>
              </div>
            </div>

            <div className="hero-art">
              <div className="hero-orbit"></div>
              <div className="hero-bead">
                <span>ॐ</span>
              </div>
              <div className="floating-card card-one"><Gem /> Nepal & Indonesia origin</div>
              <div className="floating-card card-two"><ShieldCheck /> Certificate available</div>
            </div>
          </div>
        </section>

        <section className="section category-section">
          <div className="container">
            <div className="section-heading">
              <span>Browse collections</span>
              <h2>Shop by category</h2>
              <p>Find the right starting point based on origin, purpose or product type.</p>
            </div>
            <div className="category-grid">
              {categoryCards.map(([title, text, icon]) => (
                <article key={title} className="category-card">
                  <div className="category-icon">{icon}</div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <button onClick={() => {
                    setCategory(title === "Indonesia Rudraksha" ? "All" : title);
                    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
                  }}>
                    View products <ArrowRight size={16} />
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="shop" className="section shop-section">
          <div className="container">
            <div className="section-heading left">
              <span>Featured collection</span>
              <h2>Explore our Rudraksha products</h2>
            </div>

            <div className="shop-toolbar">
              <div className="search-box">
                <Search size={19} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products"
                  aria-label="Search products"
                />
              </div>
              <div className="filter-row">
                {categories.map((item) => (
                  <button
                    key={item}
                    className={category === item ? "filter active" : "filter"}
                    onClick={() => setCategory(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="product-grid">
              {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          </div>
        </section>

        <section id="recommendation" className="recommendation">
          <div className="container recommendation-grid">
            <div>
              <span className="section-label">Personal guidance</span>
              <h2>Not sure which Rudraksha is right for you?</h2>
              <p>
                Tell us your goal, profession or area of concern. We will help you understand suitable
                traditional options without making medical or financial guarantees.
              </p>
              <div className="benefit-list">
                {["Career and business", "Education and focus", "Harmony and relationships", "Spiritual growth"].map(x => (
                  <span key={x}><CheckCircle2 size={18} /> {x}</span>
                ))}
              </div>
              <a
                href="https://wa.me/14372671257?text=Hello%20Shiva%20Rudraksha%20Inc.%2C%20I%20would%20like%20a%20Rudraksha%20recommendation."
                target="_blank"
                rel="noreferrer"
                className="recommendation-button"
              >
                <MessageCircle size={19} /> Start on WhatsApp
              </a>
            </div>

            <div className="recommendation-card">
              <h3>Recommendation request</h3>
              <label>Your primary goal</label>
              <select defaultValue="">
                <option value="" disabled>Select a goal</option>
                <option>Business growth</option>
                <option>Career and employment</option>
                <option>Education and memory</option>
                <option>Marriage and relationships</option>
                <option>Spiritual growth</option>
              </select>
              <label>Preferred product</label>
              <select defaultValue="">
                <option value="" disabled>Select a product type</option>
                <option>Single Rudraksha</option>
                <option>Combination</option>
                <option>Mala</option>
                <option>Not sure</option>
              </select>
              <button onClick={() => window.open("https://wa.me/14372671257", "_blank")}>
                Request guidance
              </button>
            </div>
          </div>
        </section>

        <section id="guide" className="section guide-section">
          <div className="container">
            <div className="section-heading">
              <span>Learn before you buy</span>
              <h2>Rudraksha guide</h2>
              <p>Clear educational content for choosing, wearing and caring for Rudraksha.</p>
            </div>
            <div className="guide-grid">
              {[
                [BookOpen, "1–21 Mukhi Guide", "Understand traditional associations, deities and mantras."],
                [ShieldCheck, "Authenticity Guide", "Learn how origin, shape, lines and certification are assessed."],
                [Sparkles, "How to Energize", "Traditional steps for cleansing, energizing and wearing Rudraksha."],
                [Globe2, "Origins Explained", "Compare Nepal and Indonesia Rudraksha in a practical way."],
              ].map(([Icon, title, text]) => (
                <article key={title}>
                  <Icon />
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <a href="#contact">Learn more <ArrowRight size={15} /></a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="section about-section">
          <div className="container about-grid">
            <div>
              <span className="section-label">Why Shiva Rudraksha Inc.</span>
              <h2>Guidance, authenticity and service from Canada.</h2>
              <p>
                We help customers explore traditional Rudraksha products with clear origin details,
                actual product information and straightforward ordering support.
              </p>
            </div>
            <div className="stats">
              <div><strong>21+</strong><span>Mukhi varieties</span></div>
              <div><strong>2</strong><span>Primary origins</span></div>
              <div><strong>1:1</strong><span>Personal guidance</span></div>
            </div>
          </div>
        </section>

        <section className="section testimonials">
          <div className="container">
            <div className="section-heading">
              <span>Customer experience</span>
              <h2>Trusted personal service</h2>
            </div>
            <div className="testimonial-grid">
              {[1, 2, 3].map((n) => (
                <article key={n}>
                  <div className="stars">{[1,2,3,4,5].map(s => <Star key={s} size={16} fill="currentColor" />)}</div>
                  <p>“Excellent guidance, clear communication and a carefully packed product.”</p>
                  <strong>Verified customer</strong>
                  <span>Toronto, Canada</span>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer id="contact">
        <div className="container footer-grid">
          <div>
            <div className="footer-brand">ॐ SHIVA RUDRAKSHA INC.</div>
            <p>Authentic Rudraksha products and personal guidance from Scarborough, Ontario, Canada.</p>
          </div>
          <div>
            <h4>Shop</h4>
            <a href="#shop">Rudraksha</a>
            <a href="#shop">Siddha Mala</a>
            <a href="#shop">Combinations</a>
          </div>
          <div>
            <h4>Information</h4>
            <a href="#guide">Rudraksha Guide</a>
            <a href="#about">About Us</a>
            <a href="#contact">Shipping & Returns</a>
            <a href="#admin">Product Manager</a>
          </div>
          <div>
            <h4>Contact</h4>
            <a href="tel:+14372671257">437-267-1257</a>
            <a href="mailto:shivarudrakshain@gmail.com">shivarudrakshain@gmail.com</a>
            <span>Scarborough, Canada</span>
          </div>
        </div>
        <div className="container copyright">© 2026 Shiva Rudraksha Inc. All rights reserved.</div>
      </footer>

      <a
        className="whatsapp-float"
        href="https://wa.me/14372671257"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle />
      </a>
    </>
  );
}
