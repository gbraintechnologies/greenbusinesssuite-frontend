"use client";

import { BarList } from "@tremor/react";
import { Spinner } from "@heroui/react";
import DashboardPanel from "./DashboardPanel";

type PipelineItem = {
  name: string;
  value: number;
};

type Props = {
  data: PipelineItem[];
  isLoading?: boolean;
};

export default function FormPipelineChart({ data, isLoading }: Props) {
  return (
    <DashboardPanel title="Form Pipeline">
      {isLoading ? (
        <div className="flex h-56 items-center justify-center">
          <Spinner color="primary" />
        </div>
      ) : (
        <BarList
          data={data}
          className="mt-2"
          color="violet"
          valueFormatter={(value: number) => value.toLocaleString()}
        />
      )}
    </DashboardPanel>
  );
}
