import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Button } from "@heroui/react";

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
  return (
    <>
      {variant === "mobile-full" && (
        <div>
          <p className="block mb-3 text-sm text-gray-500">
            {" "}
            Showing results for page {page + 1}
          </p>
          <div className="flex items-center">
            <Button
              isDisabled={page <= 0}
              disabled={page <= 0}
              onPress={() => setPage(page - 1)}
              className="rounded-l-full test-sm w-24 disabled:cursor-not-allowed"
              isIconOnly
              variant="bordered"
            >
              <FiChevronLeft className="size-4" /> Previous
            </Button>
            <Button
              onPress={() => setPage(page + 1)}
              isDisabled={currentData.length < limit}
              disabled={currentData.length <= limit}
              className="rounded-r-full w-24 text-sm  disabled:cursor-not-allowed"
              isIconOnly
              variant="bordered"
            >
              Next <FiChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {variant === "normal" && (
        <div className="flex items-center">
          <span className="hidden md:block mr-4 text-sm text-gray-500">
            {" "}
            Showing results for page {page + 1}
          </span>
          <Button
            isDisabled={page <= 0}
            disabled={page <= 0}
            onPress={() => setPage(page - 1)}
            className="rounded-l-full disabled:cursor-not-allowed"
            isIconOnly
            variant="bordered"
          >
            <FiChevronLeft className="size-5" />
          </Button>
          <Button
            onPress={() => setPage(page + 1)}
            isDisabled={currentData.length < limit}
            className="rounded-r-full border-l-0 disabled:cursor-not-allowed"
            isIconOnly
            variant="bordered"
          >
            <FiChevronRight className="size-5" />
          </Button>
        </div>
      )}

      {variant === "no-text" && (
        <div className="flex items-center">
          <Button
            isDisabled={page <= 0}
            disabled={page <= 0}
            onPress={() => setPage(page - 1)}
            className="rounded-l-full disabled:cursor-not-allowed"
            isIconOnly
            variant="bordered"
          >
            <FiChevronLeft className="size-5" />
          </Button>
          <Button
            onPress={() => setPage(page + 1)}
            isDisabled={currentData.length < limit}
            className="rounded-r-full border-l-0 disabled:cursor-not-allowed"
            isIconOnly
            variant="bordered"
          >
            <FiChevronRight className="size-5" />
          </Button>
        </div>
      )}
    </>
  );
}
