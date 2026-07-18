import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Edit3,
  Github,
  ImagePlus,
  LoaderCircle,
  LogOut,
  RefreshCw,
  Save,
  Trash2,
} from "lucide-react";
import Logo from "./Logo";
import { IMAGE_SLOTS, assetUrl, emptyImages } from "../data/catalogue";
import {
  clearSettings,
  getSettings,
  loadRepositoryProducts,
  removeImage,
  saveRepositoryProducts,
  saveSettings,
  uploadSlotImage,
  verifyRepository,
} from "../data/github";

const newProduct = () => ({
  id: "",
  mukhi: "",
  name: "",
  category: "Nepal Rudraksha",
  origin: "Nepal",
  variants: [
    { name: "Small", price: "" },
    { name: "Medium", price: "" },
    { name: "Large", price: "" },
    { name: "Collector", price: "" },
    { name: "Super Collector", price: "" },
  ],
  description: "",
  certificateAvailable: true,
  stockStatus: "Available",
  badge: "Certified",
  images: emptyImages(),
});

const slugify = (name) =>
  name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const normalizeVariants = (product = {}) => {
  const names = ["Small", "Medium", "Large", "Collector", "Super Collector"];
  const existing = Array.isArray(product.variants) ? product.variants : [];
  return names.map((name) => {
    const found = existing.find((item) => item.name === name);
    return { name, price: found?.price ?? product.price ?? "" };
  });
};

export default function Admin({ onBack }) {
  const [settings, setSettingsState] = useState({
    owner: "shivarudrakshain-hub",
    repo: "shiva-rudraksha-react",
    branch: "main",
    token: "",
    ...getSettings(),
  });
  const [connected, setConnected] = useState(false);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(newProduct());
  const [files, setFiles] = useState({});
  const [previews, setPreviews] = useState({});
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState("");

  const visible = useMemo(
    () =>
      products.filter((product) =>
        `${product.name} ${product.origin}`.toLowerCase().includes(search.toLowerCase())
      ),
    [products, search]
  );

  const updateSetting = (event) =>
    setSettingsState((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));

  const updateField = (event) =>
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));

  const updateVariantPrice = (index, value) =>
    setForm((current) => ({
      ...current,
      variants: current.variants.map((variant, variantIndex) =>
        variantIndex === index ? { ...variant, price: value } : variant
      ),
    }));

  async function connect(event) {
    event.preventDefault();
    setBusy(true);
    setStatus("Connecting to GitHub…");
    try {
      await verifyRepository(settings);
      const loaded = (await loadRepositoryProducts(settings)).map((product) => ({
        ...product,
        variants: normalizeVariants(product),
        images: { ...emptyImages(), ...(product.images || {}) },
      }));
      setProducts(loaded);
      saveSettings(settings);
      setConnected(true);
      setStatus(`Connected. ${loaded.length} products loaded.`);
    } catch (error) {
      setStatus(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function refresh() {
    setBusy(true);
    try {
      const loaded = (await loadRepositoryProducts(settings)).map((product) => ({
        ...product,
        variants: normalizeVariants(product),
      }));
      setProducts(loaded);
      setStatus("Catalogue refreshed.");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setBusy(false);
    }
  }

  function selectImage(slot, event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setStatus("Please select an image file.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setStatus("Each image must be smaller than 8 MB.");
      return;
    }
    setFiles((current) => ({ ...current, [slot]: file }));
    setPreviews((current) => ({ ...current, [slot]: URL.createObjectURL(file) }));
  }

  function resetForm() {
    Object.values(previews).forEach((url) => url?.startsWith("blob:") && URL.revokeObjectURL(url));
    setForm(newProduct());
    setFiles({});
    setPreviews({});
  }

  function editProduct(product) {
    resetForm();
    setForm({ ...product, variants: normalizeVariants(product) });
    setPreviews(
      Object.fromEntries(
        Object.entries(product.images || {})
          .filter(([, value]) => value)
          .map(([key, value]) => [key, assetUrl(value)])
      )
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveProduct(event) {
    event.preventDefault();
    if (!form.name.trim()) return setStatus("Product name is required.");
    if (!form.images.front && !files.front) return setStatus("Front image is required.");

    setBusy(true);
    try {
      const images = { ...emptyImages(), ...(form.images || {}) };

      for (const slot of IMAGE_SLOTS) {
        if (!files[slot.key]) continue;
        setStatus(`Uploading ${slot.label} image…`);
        images[slot.key] = await uploadSlotImage(
          settings,
          files[slot.key],
          form.name,
          slot.key
        );
      }

      const saved = {
        ...form,
        id: form.id || slugify(form.name),
        mukhi: Number(form.mukhi) || null,
        variants: form.variants.map((variant) => ({
          name: variant.name,
          price: Number(variant.price),
        })),
        name: form.name.trim(),
        certificateAvailable: true,
        images,
      };

      const updated = form.id
        ? products.map((product) => (product.id === form.id ? saved : product))
        : [saved, ...products];

      await saveRepositoryProducts(
        settings,
        updated,
        form.id ? `Update ${saved.name}` : `Add ${saved.name}`
      );

      setProducts(updated);
      resetForm();
      setStatus("Saved to GitHub. Run the deployment workflow when ready.");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function deleteProduct(product) {
    if (!confirm(`Delete ${product.name}?`)) return;
    setBusy(true);
    try {
      const updated = products.filter((item) => item.id !== product.id);
      await saveRepositoryProducts(settings, updated, `Delete ${product.name}`);
      for (const path of Object.values(product.images || {})) {
        try { await removeImage(settings, path); } catch {}
      }
      setProducts(updated);
      setStatus("Product deleted.");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setBusy(false);
    }
  }

  if (!connected) {
    return (
      <div className="admin-page">
        <header className="admin-topbar">
          <div className="container admin-topbar-inner">
            <Logo />
            <button onClick={onBack}><ArrowLeft /> Catalogue</button>
          </div>
        </header>
        <main className="admin-login">
          <section>
            <Github className="github-icon" />
            <span>REPOSITORY CONNECTION</span>
            <h1>Connect the product manager to GitHub</h1>
            <p>Use a fine-grained token with Contents: Read and write access.</p>
            {status && <div className="status-message">{status}</div>}
            <form onSubmit={connect}>
              <label>GitHub owner<input name="owner" value={settings.owner} onChange={updateSetting} required /></label>
              <label>Repository<input name="repo" value={settings.repo} onChange={updateSetting} required /></label>
              <label>Branch<input name="branch" value={settings.branch} onChange={updateSetting} required /></label>
              <label>Fine-grained token<input type="password" name="token" value={settings.token} onChange={updateSetting} required /></label>
              <button disabled={busy}>{busy ? <LoaderCircle className="spin" /> : <Github />} Connect</button>
            </form>
            <aside><strong>Token safety</strong><p>The token is kept only in this browser session.</p></aside>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-topbar">
        <div className="container admin-topbar-inner">
          <Logo />
          <div>
            <button onClick={refresh}><RefreshCw /> Refresh</button>
            <button onClick={() => { clearSettings(); setConnected(false); }}><LogOut /> Disconnect</button>
            <button onClick={onBack}><ArrowLeft /> Catalogue</button>
          </div>
        </div>
      </header>

      <main className="container admin-content">
        <div className="admin-heading">
          <div>
            <span>GITHUB PRODUCT MANAGER</span>
            <h1>Manage catalogue and six product images</h1>
          </div>
          <div className="connected"><CheckCircle2 /> Connected</div>
        </div>

        {status && <div className="status-message">{status}</div>}

        <div className="admin-grid">
          <form className="product-form" onSubmit={saveProduct}>
            <h2>{form.id ? "Edit product" : "Add product"}</h2>
            <div className="field-grid">
              <label className="wide">Product name<input name="name" value={form.name} onChange={updateField} required /></label>
              <label>Mukhi number<input type="number" name="mukhi" value={form.mukhi} onChange={updateField} /></label>
              <label>Origin<input name="origin" value={form.origin} onChange={updateField} /></label>
              <div className="wide variant-price-editor">
                <strong>Size variant prices (CAD)</strong>
                <div className="variant-price-grid">
                  {form.variants.map((variant, index) => (
                    <label key={variant.name}>
                      {variant.name}
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={variant.price}
                        onChange={(event) => updateVariantPrice(index, event.target.value)}
                        required
                      />
                    </label>
                  ))}
                </div>
                <small>The same six product images are used for every size variant.</small>
              </div>
              <label>Stock status<select name="stockStatus" value={form.stockStatus} onChange={updateField}><option>Available</option><option>Out of stock</option><option>Reserved</option></select></label>
              <label className="wide">Description<textarea rows="4" name="description" value={form.description} onChange={updateField} /></label>
            </div>

            <h3>Product images</h3>
            <div className="upload-grid">
              {IMAGE_SLOTS.map((slot) => {
                const preview = previews[slot.key] || (form.images?.[slot.key] ? assetUrl(form.images[slot.key]) : "");
                return (
                  <div className="upload-card" key={slot.key}>
                    <div><strong>{slot.label}</strong>{slot.key === "front" && <span>Required</span>}</div>
                    <label>
                      {preview ? <img src={preview} alt={slot.label} /> : <p><ImagePlus /> Upload {slot.label}</p>}
                      <input type="file" accept="image/*" onChange={(e) => selectImage(slot.key, e)} />
                    </label>
                  </div>
                );
              })}
            </div>

            <button className="save-button" disabled={busy}>
              {busy ? <LoaderCircle className="spin" /> : <Save />}
              {form.id ? "Save product changes" : "Add product"}
            </button>
          </form>

          <section className="product-admin-list">
            <div className="admin-list-title">
              <div><span>CATALOGUE</span><h2>{products.length} products</h2></div>
              <input placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            {visible.map((product) => (
              <article key={product.id}>
                <img src={assetUrl(product.images?.front)} alt={product.name} />
                <div>
                  <strong>{product.name}</strong>
                  <span>{product.origin} • 5 size variants</span>
                  <b>From CAD ${Math.min(...normalizeVariants(product).map((variant) => Number(variant.price) || 0)).toFixed(2)}</b>
                  <em>{Object.values(product.images || {}).filter(Boolean).length}/6 images</em>
                </div>
                <div>
                  <button onClick={() => editProduct(product)}><Edit3 /></button>
                  <button onClick={() => deleteProduct(product)}><Trash2 /></button>
                </div>
              </article>
            ))}
          </section>
        </div>

        <div className="manual-publish">
          <strong>Manual publishing enabled</strong>
          <p>Product changes are committed to GitHub but are not published until you run the GitHub Pages workflow manually.</p>
        </div>
      </main>
    </div>
  );
}
