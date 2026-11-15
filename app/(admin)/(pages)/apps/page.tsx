"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { FiExternalLink, FiImage, FiPlus, FiTrash2 } from "react-icons/fi";
import { createEmptySuiteProduct, type SuiteProduct } from "@/lib/suiteProducts";
import services from "@/services";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-brand-500";

function isDraftId(id: string) {
  return String(id).startsWith("draft-");
}

export default function AppsAdminPage() {
  const [products, setProducts] = useState<SuiteProduct[]>([]);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const load = async () => {
    try {
      const apps = await services.listAllSuiteApps();
      setProducts(apps);
    } catch {
      toast.error("Could not load apps from the server.");
      setProducts([]);
    } finally {
      setReady(true);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const publishedCount = useMemo(
    () => products.filter((item) => item.published).length,
    [products]
  );

  const updateProduct = (id: string, patch: Partial<SuiteProduct>) => {
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const next = { ...item, ...patch };
        if (patch.name && !patch.mark) {
          next.mark = patch.name.trim().charAt(0).toUpperCase() || "A";
        }
        return next;
      })
    );
  };

  const addApp = () => {
    setProducts((prev) => [
      createEmptySuiteProduct({
        name: "New app",
        tagline: "Short tagline",
        description: "Describe what customers can do with this app.",
        href: "https://",
        published: false,
      }),
      ...prev,
    ]);
  };

  const removeApp = async (id: string) => {
    if (isDraftId(id)) {
      setProducts((prev) => prev.filter((item) => item.id !== id));
      return;
    }
    try {
      await services.deleteSuiteApp(id);
      setProducts((prev) => prev.filter((item) => item.id !== id));
      toast.success("App deleted.");
    } catch {
      toast.error("Could not delete app.");
    }
  };

  const persist = async () => {
    const invalid = products.find(
      (item) => !item.name.trim() || !item.href.trim()
    );
    if (invalid) {
      toast.error("Each app needs a name and website link.");
      return;
    }

    setSaving(true);
    try {
      const saved: SuiteProduct[] = [];
      for (const product of products) {
        if (isDraftId(product.id)) {
          saved.push(await services.createSuiteApp(product));
        } else {
          saved.push(await services.updateSuiteApp(product.id, product));
        }
      }
      setProducts(saved);
      toast.success("Apps saved. Published apps show on marketing and signup.");
    } catch {
      toast.error("Could not save apps.");
    } finally {
      setSaving(false);
    }
  };

  const onLogoPick = async (id: string, file?: File | null) => {
    if (!file) return;
    setUploadingId(id);
    try {
      const url = await services.uploadSuiteAppLogo(file);
      updateProduct(id, { logoUrl: url });
      toast.success("Logo uploaded. Save changes to keep it.");
    } catch (error: any) {
      toast.error(error?.message || "Logo upload failed.");
    } finally {
      setUploadingId(null);
    }
  };

  if (!ready) {
    return (
      <div className="px-5 py-8 text-sm text-slate-500">Loading apps…</div>
    );
  }

  return (
    <div className="px-5 py-6 pb-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Apps</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Publish suite apps with website links and logos for Green Account
            signup, company marketing pages, and customer portals.{" "}
            {publishedCount} published.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={addApp}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <FiPlus size={16} />
            Add app
          </button>
          <button
            type="button"
            onClick={persist}
            disabled={saving}
            className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {product.logoUrl ? (
                  <div className="relative h-11 w-11 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                    <Image
                      src={product.logoUrl}
                      alt=""
                      fill
                      className="object-contain p-1"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl text-sm font-semibold text-white ${product.accent}`}
                  >
                    {product.mark || "A"}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-slate-900">
                    {product.name || "Untitled app"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {product.published ? "Published" : "Draft"}
                    {isDraftId(product.id) ? " · unsaved" : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={product.published}
                    onChange={(e) =>
                      updateProduct(product.id, {
                        published: e.target.checked,
                      })
                    }
                  />
                  Publish
                </label>
                {product.href && (
                  <a
                    href={product.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
                    aria-label="Open website"
                  >
                    <FiExternalLink size={15} />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => removeApp(product.id)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-red-500 hover:bg-red-50"
                  aria-label="Delete app"
                >
                  <FiTrash2 size={15} />
                </button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="App name">
                <input
                  className={inputClass}
                  value={product.name}
                  onChange={(e) =>
                    updateProduct(product.id, { name: e.target.value })
                  }
                  placeholder="Autobus"
                />
              </Field>
              <Field label="Website link">
                <input
                  className={inputClass}
                  value={product.href}
                  onChange={(e) =>
                    updateProduct(product.id, { href: e.target.value })
                  }
                  placeholder="https://example.com"
                />
              </Field>
              <Field label="Tagline">
                <input
                  className={inputClass}
                  value={product.tagline}
                  onChange={(e) =>
                    updateProduct(product.id, { tagline: e.target.value })
                  }
                  placeholder="Short line under the name"
                />
              </Field>
              <Field label="Category">
                <input
                  className={inputClass}
                  value={product.category}
                  onChange={(e) =>
                    updateProduct(product.id, { category: e.target.value })
                  }
                  placeholder="Operations"
                />
              </Field>
              <div className="md:col-span-2">
                <Field label="Description">
                  <textarea
                    className={`${inputClass} min-h-[88px] resize-y`}
                    value={product.description}
                    onChange={(e) =>
                      updateProduct(product.id, {
                        description: e.target.value,
                      })
                    }
                    placeholder="What customers get from this app"
                  />
                </Field>
              </div>
              <div className="md:col-span-2">
                <span className="mb-1.5 block text-xs font-medium text-slate-500">
                  App logo
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    ref={(el) => {
                      fileRefs.current[product.id] = el;
                    }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      onLogoPick(product.id, e.target.files?.[0])
                    }
                  />
                  <button
                    type="button"
                    disabled={uploadingId === product.id}
                    onClick={() => fileRefs.current[product.id]?.click()}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                  >
                    <FiImage size={16} />
                    {uploadingId === product.id
                      ? "Uploading…"
                      : product.logoUrl
                        ? "Replace logo"
                        : "Upload logo"}
                  </button>
                  {product.logoUrl && (
                    <button
                      type="button"
                      onClick={() =>
                        updateProduct(product.id, { logoUrl: undefined })
                      }
                      className="text-sm font-medium text-slate-500 hover:text-red-600"
                    >
                      Remove logo
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <p className="font-semibold text-slate-900">No apps yet</p>
            <p className="mt-1 text-sm text-slate-500">
              Add an app with a website link and logo, then publish it.
            </p>
            <button
              type="button"
              onClick={addApp}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white"
            >
              <FiPlus size={16} />
              Add app
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
