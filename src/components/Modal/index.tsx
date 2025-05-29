import React, { useEffect, useCallback, useState } from "react";
import styles from "./Modal.module.css";

type ModalProps = {
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
};

const Modal: React.FC<ModalProps> = ({ onClose, children, title }) => {
  const [close, setClose] = useState<boolean>(true);
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <>
      {close && (
        <div className={styles.modalOverlay} onClick={handleOverlayClick}>
          <div className={title ? styles.modal : styles.modalNotTitle}>
            <div className={title ? styles.modalTitle : styles.modalNotTitle}>
              {title && (
                <div className={styles.modalFromTitle}>
                  <p className={styles.title}>{title}</p>
                </div>
              )}
              <div
                className={
                  title ? styles.modalHeader : styles.modalNottitleHeader
                }
              >
                <span
                  className={title ? styles.btnClose : styles.btnNotClose}
                  onClick={() => setClose(false)}
                >
                  <i aria-label="icon: close">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 16 16"
                      data-icon="close"
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                      className=""
                    >
                      <g id="comm_icon_x" transform="translate(-1209.5 -160.5)">
                        <path
                          id="Line_14"
                          data-name="Line 14"
                          d="M14,15a1,1,0,0,1-.707-.293l-14-14a1,1,0,0,1,0-1.414,1,1,0,0,1,1.414,0l14,14A1,1,0,0,1,14,15Z"
                          transform="translate(1210.5 161.5)"
                        ></path>
                        <path
                          id="Line_15"
                          data-name="Line 15"
                          d="M0,15a1,1,0,0,1-.707-.293,1,1,0,0,1,0-1.414l14-14a1,1,0,0,1,1.414,0,1,1,0,0,1,0,1.414l-14,14A1,1,0,0,1,0,15Z"
                          transform="translate(1210.5 161.5)"
                        ></path>
                      </g>
                    </svg>
                  </i>
                </span>
              </div>
            </div>
            <div className={styles.modalBody}>{children}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
