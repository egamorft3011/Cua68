import * as React from "react";
import "./loading.css";
import { LoaddingIcon } from "@/shared/Svgs/Svg.component";

export default function SimpleBackdrop() {
  return (
    <div className="SimpleBackdrop">
      <div className="backdrop">
        <div className="loader-container">
          <LoaddingIcon className="pl" width="160px" height="160px" />
        </div>
      </div>
    </div>
  );
}
