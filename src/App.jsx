import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  Menu,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import Logo from "./components/Logo";
import ProductCard from "./components/ProductCard";
import ProductDetails from "./components/ProductDetails";
import Admin from "./components/Admin";
import BirthChartRecommendation from "./components/BirthChartRecommendation";
import { loadProducts } from "./data/catalogue";

const categories = [
  "Nepal Rudraksha",
  "Indonesia Rudraksha",
  "Siddha Mala",
  "Gaurishankar",
  "Ganesh Rudraksha",
  "Rudraksha Combinations",
  "Bracelets & Malas",
  "Gemstones & Spiritual Products",
];

export default function App() {
  const [route, setRoute] = useState(window.location.hash || "#home");
  const [products, setProducts] = useState([]);
  const [guide, setGuide] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Nepal Rudraksha");
  const [shopOpen, setShopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const listener = () => setRoute(window.location.hash || "#home");
    window.addEventListener("hashchange", listener);
    return () => window.removeEventListener("hashchange", listener);
  }, []);

  useEffect(() => {
    loadProducts().then(setProducts).catch(console.error);
    fetch(`${import.meta.env.BASE_URL}data/rudraksha-guide.json`)
      .then((response) => response.json())
      .then(setGuide)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!route.startsWith("#product/")) return;
    const id = decodeURIComponent(route.substring("#product/".length));
    setSelected(products.find((product) => product.id === id) || null);
  }, [route, products]);

  const visible = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = `${product.name} ${product.mukhi} ${product.origin}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        category === "All" ||
        product.category === category ||
        (category === "Nepal Rudraksha" && product.origin === "Nepal");
      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  const navigate = (hash) => {
    window.location.hash = hash;
    setRoute(hash);
    setMobileOpen(false);
    setShopOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openProduct = (product) => {
    setSelected(product);
    navigate(`#product/${encodeURIComponent(product.id)}`);
  };

  if (route === "#admin") {
    return <Admin onBack={() => navigate("#home")} />;
  }

  if (route.startsWith("#product/") && selected) {
    return (
      <ProductDetails
        product={selected}
        onBack={() => navigate("#shop")}
      />
    );
  }

  const active = route.replace("#", "") || "home";

  return (
    <>
      <header className="luxury-header">
        <div className="luxury-nav container">
          <Logo />
          <button className="mobile-menu-button" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X /> : <Menu />}
          </button>

          <nav className={mobileOpen ? "open" : ""}>
            <button className={active === "home" ? "active" : ""} onClick={() => navigate("#home")}>Home</button>
            <div className="shop-menu" onMouseEnter={() => setShopOpen(true)} onMouseLeave={() => setShopOpen(false)}>
              <button className={active === "shop" ? "active" : ""} onClick={() => navigate("#shop")}>
                Shop <ChevronDown />
              </button>
              {shopOpen && (
                <div className="shop-dropdown">
                  {categories.map((item) => (
                    <button key={item} onClick={() => { setCategory(item); navigate("#shop"); }}>
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className={active === "guide" ? "active" : ""} onClick={() => navigate("#guide")}>Rudraksha Guide</button>
            <button className={active === "recommendations" ? "active" : ""} onClick={() => navigate("#recommendations")}>Recommendations</button>
            <button className={active === "about" ? "active" : ""} onClick={() => navigate("#about")}>About</button>
            <button className={active === "contact" ? "active" : ""} onClick={() => navigate("#contact")}>Contact</button>
          </nav>

          <div className="nav-actions">
            <button className="outline-button" onClick={() => navigate("#shop")}>View Catalog</button>
            <a className="green-button" href="https://wa.me/14372671257" target="_blank" rel="noreferrer">
              <MessageCircle /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </header>

      {active === "home" && (
        <main>
          <section className="lovable-hero">
            <div className="container lovable-hero-grid">
              <div>
                <span className="source-pill"><Sparkles /> DIRECTLY SOURCED • CERTIFIED</span>
                <h1>Authentic Certified Rudraksha from <em>Nepal</em>.</h1>
                <p>
                  Carefully selected Rudraksha beads, malas and spiritual
                  combinations—supplied in Canada, the United States and worldwide.
                </p>
                <div className="hero-actions">
                  <button className="maroon-button" onClick={() => navigate("#shop")}>Shop Rudraksha <ArrowRight /></button>
                  <button className="outline-button large" onClick={() => navigate("#recommendations")}>Get a Recommendation</button>
                </div>
                <div className="promise-grid">
                  <span><BadgeCheck /> Authentic Rudraksha</span>
                  <span><BadgeCheck /> Certificate Available</span>
                  <span><BadgeCheck /> Canada-Based Business</span>
                  <span><BadgeCheck /> Worldwide Shipping</span>
                  <span><BadgeCheck /> Personal Consultation</span>
                </div>
              </div>
              <div className="hero-product-panel">
                <img src={`${import.meta.env.BASE_URL}images/products/1-mukhi-nepal-rudraksha/front.jpeg`} alt="Certified Nepal Rudraksha" />
              </div>
            </div>
          </section>

          <section className="home-featured container">
            <div className="section-kicker">FEATURED COLLECTION</div>
            <h2>Discover authentic Nepal Rudraksha</h2>
            <div className="product-grid">
              {products.slice(0, 3).map((product) => (
                <ProductCard key={product.id} product={product} onOpen={openProduct} />
              ))}
            </div>
          </section>
        </main>
      )}

      {active === "shop" && (
        <main className="page-shell shop-page">
          <div className="container">
            <div className="page-heading">
              <span>SHOP</span>
              <h1>The full collection</h1>
              <p>Every bead is inspected and, where applicable, certified. Prices are in CAD.</p>
            </div>

            <div className="catalogue-controls">
              <label className="search-box"><Search /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" /></label>
              <div className="category-pills">
                {categories.map((item) => (
                  <button key={item} className={category === item ? "selected" : ""} onClick={() => setCategory(item)}>{item}</button>
                ))}
              </div>
            </div>

            <div className="product-grid lovable-grid">
              {visible.map((product) => (
                <ProductCard key={product.id} product={product} onOpen={openProduct} />
              ))}
            </div>
          </div>
        </main>
      )}

      {active === "guide" && (
        <main className="page-shell guide-page">
          <div className="container">
            <div className="page-heading">
              <span>RUDRAKSHA GUIDE</span>
              <h1>1–21 Mukhi traditional guide</h1>
              <p>Traditional associations for educational and spiritual reference.</p>
            </div>
            <div className="guide-grid">
              {guide.map((item) => (
                <article className="guide-card" key={item.mukhi}>
                  <div className="guide-number">{item.mukhi}</div>
                  <div>
                    <h2>{item.mukhi} Mukhi Rudraksha</h2>
                    <p className="guide-benefits">{item.benefits}</p>
                    <dl>
                      <div><dt>Ruling deity</dt><dd>{item.deity}</dd></div>
                      <div><dt>Planet</dt><dd>{item.planet}</dd></div>
                      <div><dt>Chakra</dt><dd>{item.chakra}</dd></div>
                    </dl>
                  </div>
                </article>
              ))}
            </div>
            <p className="tradition-note">
              Deity, planetary and chakra associations differ among traditions and teachers.
              These descriptions are spiritual information, not medical, legal or financial advice.
            </p>
          </div>
        </main>
      )}

      {active === "recommendations" && (
        <main className="recommendation-page">
          <BirthChartRecommendation />
        </main>
      )}

      {active === "about" && (
        <main className="page-shell">
          <div className="container text-page">
            <div className="page-heading"><span>ABOUT</span><h1>Rudraksha, honestly sourced.</h1></div>
            <p>Shiva Rudraksha Inc. is a Canada-based supplier of authentic Rudraksha beads, malas and spiritual combinations. Our collection is sourced through trusted partners and presented with actual product photographs, certificates and X-ray images where available.</p>
            <h3>What we promise</h3>
            <p>Direct sourcing, honest descriptions, product-image transparency, personal guidance and support before and after purchase.</p>
            <h3>What we do not promise</h3>
            <p>We do not promise medical, financial or supernatural outcomes. Benefits described on this site reflect traditional and spiritual beliefs.</p>
          </div>
        </main>
      )}

      {active === "contact" && (
        <main className="page-shell">
          <div className="container contact-page">
            <div className="page-heading"><span>CONTACT</span><h1>We reply personally.</h1><p>Message us and you will hear back from a person, not an auto-responder.</p></div>
            <div className="contact-grid">
              <a href="https://wa.me/14372671257"><MessageCircle /><span><small>WHATSAPP (FASTEST)</small><strong>Chat with us</strong></span></a>
              <a href="tel:+14372671257"><span className="contact-icon">☎</span><span><small>CALL</small><strong>437-267-1257</strong></span></a>
              <a href="mailto:shivarudrakshain@gmail.com"><span className="contact-icon">✉</span><span><small>EMAIL</small><strong>shivarudrakshain@gmail.com</strong></span></a>
              <div><span className="contact-icon">⌖</span><span><small>ADDRESS</small><strong>Scarborough, Ontario, Canada</strong></span></div>
            </div>
          </div>
        </main>
      )}

      <a className="floating-whatsapp" href="https://wa.me/14372671257" target="_blank" rel="noreferrer"><MessageCircle /></a>

      <footer>
        <div className="container footer-layout">
          <Logo />
          <div><strong>Explore</strong><button onClick={() => navigate("#shop")}>Shop</button><button onClick={() => navigate("#guide")}>Rudraksha Guide</button></div>
          <div><strong>Contact</strong><a href="tel:+14372671257">437-267-1257</a><a href="mailto:shivarudrakshain@gmail.com">shivarudrakshain@gmail.com</a></div>
          <div><strong>Manage</strong><a href="#admin">Product Manager</a></div>
        </div>
      </footer>
    </>
  );
}
