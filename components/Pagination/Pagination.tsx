import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface Props {
  limit: number;
  variant?: "normal" | "mobile-full" | "no-text";
  page: number;
  currentData: any[];
  setPage: any;
}

export default function Pagination({
  limit = 10,
  setPage,
  variant = "normal",
  page = 1,
  currentData = [],
}: Props) {
  const canGoPrev = page > 0;
  const canGoNext = (currentData?.length ?? 0) >= limit;

  const prevButton = (
    <button
      type="button"
      disabled={!canGoPrev}
      onClick={() => setPage(page - 1)}
      className="inline-flex h-9 w-9 items-center justify-center rounded-l-full border border-slate-200 bg-white text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
      aria-label="Previous page"
    >
      <FiChevronLeft className="size-5" />
    </button>
  );

  const nextButton = (
    <button
      type="button"
      disabled={!canGoNext}
      onClick={() => setPage(page + 1)}
      className="inline-flex h-9 w-9 items-center justify-center rounded-r-full border border-l-0 border-slate-200 bg-white text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
      aria-label="Next page"
    >
      <FiChevronRight className="size-5" />
    </button>
  );

  return (
    <>
      {variant === "mobile-full" && (
        <div>
          <p className="mb-3 block text-sm text-gray-500">
            Showing results for page {page + 1}
          </p>
          <div className="flex items-center">
            <button
              type="button"
              disabled={!canGoPrev}
              onClick={() => setPage(page - 1)}
              className="inline-flex w-24 items-center justify-center gap-1 rounded-l-full border border-slate-200 bg-white py-2 text-sm text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FiChevronLeft className="size-4" /> Previous
            </button>
            <button
              type="button"
              disabled={!canGoNext}
              onClick={() => setPage(page + 1)}
              className="inline-flex w-24 items-center justify-center gap-1 rounded-r-full border border-l-0 border-slate-200 bg-white py-2 text-sm text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next <FiChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      {variant === "normal" && (
        <div className="flex items-center">
          <span className="mr-4 hidden text-sm text-gray-500 md:block">
            Showing results for page {page + 1}
          </span>
          {prevButton}
          {nextButton}
        </div>
      )}

      {variant === "no-text" && (
        <div className="flex items-center">
          {prevButton}
          {nextButton}
        </div>
      )}
    </>
  );
}
