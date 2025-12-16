import React from "react";
import { TableLink } from "./tableLink";
import { PortadasTable } from "./tablePortada";
import { TableServicio } from "./tableServicio";

const page = () => {
  return (
    <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
      <TableLink />
      <PortadasTable />
      <TableServicio />
    </div>
  );
};

export default page;
