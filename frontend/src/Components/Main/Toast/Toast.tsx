import React from "react";

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

  function closeToast(e:React.MouseEvent<HTMLDivElement>) {
    const toast = (e.target as HTMLElement).parentElement;
    if(!toast){
      console.error('Toast parent element is empty')
      return
    }
    if (Array.from(toast.classList).includes("show")) {
      toast.classList.remove("show");
    }
  }
}


