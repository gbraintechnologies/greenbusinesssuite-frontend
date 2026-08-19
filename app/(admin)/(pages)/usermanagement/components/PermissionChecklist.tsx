"use client";

import React from "react";

export type PermissionOption = {
  id: string | number;
  name: string;
  module?: string;
  action?: string;
  description?: string;
};

type Props = {
  permissions: PermissionOption[];
  selectedIds: Array<string | number>;
  onChange: (ids: Array<string | number>) => void;
  isLoading?: boolean;
  disabled?: boolean;
};

function permissionLabel(permission: PermissionOption) {
  const name = permission.name?.replaceAll("_", " ") || "Permission";
  if (permission.action) {
    return `${permission.module ? `${permission.module} · ` : ""}${permission.action}`;
  }
  return name;
}

export default function PermissionChecklist({
  permissions,
  selectedIds,
  onChange,
  isLoading = false,
  disabled = false,
}: Props) {
  const selected = new Set(selectedIds.map((id) => String(id)));

  const grouped = permissions.reduce<Record<string, PermissionOption[]>>(
    (acc, permission) => {
      const key = permission.module || "General";
      acc[key] = acc[key] ?? [];
      acc[key].push(permission);
      return acc;
    },
    {}
  );

  const toggle = (id: string | number) => {
    const key = String(id);
    const next = new Set(selected);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onChange(
      permissions
        .map((permission) => permission.id)
        .filter((permissionId) => next.has(String(permissionId)))
    );
  };

  const toggleAll = (checked: boolean) => {
    onChange(checked ? permissions.map((permission) => permission.id) : []);
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
        Loading permissions…
      </div>
    );
  }

  if (permissions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
        Select a role to load its permissions, or this role has none assigned.
      </div>
    );
  }

  const allSelected =
    permissions.length > 0 && selected.size === permissions.length;

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-800">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300"
            checked={allSelected}
            disabled={disabled}
            onChange={(e) => toggleAll(e.target.checked)}
          />
          Select all
        </label>
        <span className="text-xs text-slate-500">
          {selected.size} of {permissions.length} selected
        </span>
      </div>

      <div className="max-h-80 space-y-4 overflow-y-auto px-4 py-3">
        {Object.entries(grouped).map(([moduleName, items]) => (
          <div key={moduleName}>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              {moduleName.replaceAll("_", " ")}
            </p>
            <div className="flex flex-col gap-2">
              {items.map((permission) => {
                const checked = selected.has(String(permission.id));
                return (
                  <label
                    key={String(permission.id)}
                    className="flex cursor-pointer items-start gap-3 rounded-lg bg-slate-50 px-3 py-2.5"
                  >
                    <input
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 rounded border-slate-300"
                      checked={checked}
                      disabled={disabled}
                      onChange={() => toggle(permission.id)}
                    />
                    <span>
                      <span className="block text-sm font-medium capitalize text-slate-800">
                        {permissionLabel(permission)}
                      </span>
                      {permission.description && (
                        <span className="block text-xs text-slate-500">
                          {permission.description}
                        </span>
                      )}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
