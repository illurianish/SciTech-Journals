"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardBody,
  UnderlineTab,
  OutlineButton,
  SolidButton,
  ButtonRow,
} from "./components/ui";

import {
  loadUnitData,
  saveUnitData,
  clearUnitData,
} from "../../../../../../rest/storage";
import type { UnitLevelFormData } from "../../../../../../rest/types";

import T1 from "./components/T1CoreLeaseInfo";
import T2 from "./components/T2PremisesUseParking";
import T3 from "./components/T3FinancialObligations";
import T4 from "./components/T4TenantOpsSignage";
import T5 from "./components/T5OptionsRights";
import T6 from "./components/T6LegalConsentsDefault";

type TabKey = "t1" | "t2" | "t3" | "t4" | "t5" | "t6";

const DEFAULT_DATA: UnitLevelFormData = {
  t1: { leaseType: "" },
  t2: { parkingAgreement: "" },
  t3: {},
  t4: {},
  t5: {},
  t6: {},
};

function hasAnyData(d: UnitLevelFormData) {
  const sections = Object.values(d) as any[];
  for (const s of sections) {
    if (s && typeof s === "object") {
      for (const v of Object.values(s)) {
        if (v !== "" && v != null && !(Array.isArray(v) && v.length === 0))
          return true;
      }
    }
  }
  return false;
}

export default function UnitLevelTab() {
  const params = useParams<{ id: string }>();
  const propertyId = useMemo(() => (params?.id ?? "").toString(), [params]);

  const [active, setActive] = useState<TabKey>("t1");
  const [data, setData] = useState<UnitLevelFormData>(DEFAULT_DATA);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [editing, setEditing] = useState<boolean>(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!propertyId) return;
    const cached = loadUnitData(propertyId);
    if (cached && hasAnyData(cached)) {
      setData({ ...DEFAULT_DATA, ...cached });
      setSavedAt(cached.lastEditedISO ?? null);
      setEditing(false);
    } else {
      setData(DEFAULT_DATA);
      setSavedAt(null);
      setEditing(true); // start editable if nothing saved
    }
  }, [propertyId]);

  const patch = (k: TabKey, v: any) =>
    setData((d) => ({ ...d, [k]: { ...(d as any)[k], ...v } }));

  const onEdit = () => setEditing(true);
  const onSave = () => {
    if (!propertyId) return;
    saveUnitData(propertyId, data);
    setSavedAt(new Date().toISOString());
    setEditing(false);
  };
  const onReset = () => {
    if (!confirm("Clear Unit Level data for this property?")) return;
    setData(DEFAULT_DATA);
    if (propertyId) clearUnitData(propertyId);
    setSavedAt(null);
    setEditing(true);
  };
  const onExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `unit-level-${propertyId || "property"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const onImportClick = () => fileRef.current?.click();
  const onImportFile: React.ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as UnitLevelFormData;
      setData({ ...DEFAULT_DATA, ...parsed });
      setEditing(true);
    } catch {
      alert("Invalid JSON export.");
    } finally {
      e.target.value = "";
    }
  };

  return (
    <Card>
      <CardBody>
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex gap-6">
              <UnderlineTab
                active={active === "t1"}
                onClick={() => setActive("t1")}
              >
                Core Lease Info
              </UnderlineTab>
              <UnderlineTab
                active={active === "t2"}
                onClick={() => setActive("t2")}
              >
                Premises &amp; Use
              </UnderlineTab>
              <UnderlineTab
                active={active === "t3"}
                onClick={() => setActive("t3")}
              >
                Financial Obligations
              </UnderlineTab>
              <UnderlineTab
                active={active === "t4"}
                onClick={() => setActive("t4")}
              >
                Ops &amp; Signage
              </UnderlineTab>
              <UnderlineTab
                active={active === "t5"}
                onClick={() => setActive("t5")}
              >
                Options &amp; Rights
              </UnderlineTab>
              <UnderlineTab
                active={active === "t6"}
                onClick={() => setActive("t6")}
              >
                Legal &amp; Default
              </UnderlineTab>
            </div>
          </div>
        </div>

        {/* Sections — flat (no inner card) */}
        <div className="mt-4 space-y-6">
          {active === "t1" && (
            <T1
              value={data.t1}
              onChange={(p) => patch("t1", p)}
              disabled={!editing}
            />
          )}
          {active === "t2" && (
            <T2
              value={data.t2}
              onChange={(p) => patch("t2", p)}
              disabled={!editing}
            />
          )}
          {active === "t3" && (
            <T3
              value={data.t3}
              onChange={(p) => patch("t3", p)}
              disabled={!editing}
            />
          )}
          {active === "t4" && (
            <T4
              value={data.t4}
              onChange={(p) => patch("t4", p)}
              disabled={!editing}
            />
          )}
          {active === "t5" && (
            <T5
              value={data.t5}
              onChange={(p) => patch("t5", p)}
              disabled={!editing}
            />
          )}
          {active === "t6" && (
            <T6
              value={data.t6}
              onChange={(p) => patch("t6", p)}
              disabled={!editing}
            />
          )}
        </div>

        {/* Bottom buttons */}
        <div className="mt-6">
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={onImportFile}
          />
          <ButtonRow>
            <OutlineButton onClick={onReset}>Reset</OutlineButton>
            {editing ? (
              <SolidButton onClick={onSave}>Save</SolidButton>
            ) : (
              <SolidButton onClick={onEdit}>Edit</SolidButton>
            )}
            <OutlineButton onClick={onImportClick}>Import</OutlineButton>
            <OutlineButton onClick={onExport}>Export</OutlineButton>
          </ButtonRow>
        </div>
      </CardBody>
    </Card>
  );
}
