import React, { useEffect } from "react";

export default function Toast() {
  return (
    <>
      <div className="toast">
        <div className="toast-body" onClick={closeToast}></div>
        <div className="toast-button" onClick={closeToast}>
          X
        </div>
      </div>
      ;
    </>
  );

  function closeToast(e) {
    const toast = e.target.parentElement;
    if (Array.from(toast.classList).includes("show")) {
      toast.classList.remove("show");
    }
  }
}
