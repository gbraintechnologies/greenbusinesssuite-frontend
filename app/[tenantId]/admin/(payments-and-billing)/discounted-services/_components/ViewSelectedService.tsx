import React from "react";

function ViewSelectedService({ service }: { service: any }) {
  return (
    <div>
      <h4 className="font-semibold text-lg">Editing {service?.id}</h4>
    </div>
  );
}

export default ViewSelectedService;
