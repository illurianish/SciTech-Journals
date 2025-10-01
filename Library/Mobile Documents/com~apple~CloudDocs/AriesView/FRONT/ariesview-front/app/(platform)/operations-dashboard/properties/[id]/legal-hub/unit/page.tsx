import React from "react";
import { HeaderBar } from "../unit/components/ui";
import UnitLevelTab from "./UnitLevelTab";

export default function Page() {
  return (
    <div className="space-y-4">
      <HeaderBar title="AriesView Legal Analysis Hub" subtitle="Unit Level" />
      <UnitLevelTab />
    </div>
  );
}
