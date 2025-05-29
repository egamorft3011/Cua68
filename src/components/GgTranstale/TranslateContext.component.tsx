import { useEffect } from "react";
import "./Translate.module.css";
declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

const TranslateGoogle: React.FC = () => {
  const googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement(
      {
        pageLanguage: "en",
        includedLanguages: "en,hi",
        autoDisplay: false,
      },
      "google_translate_element"
    );

    // Thêm đoạn mã sau để thay đổi option đầu tiên
    window.setTimeout(function () {
      const select = document.querySelector(
        "#google_translate_element select"
      ) as HTMLSelectElement;
      if (select) {
        select.options[0].text = "Select language";
      }
    }, 1000);
  };

  useEffect(() => {
    const addScript = document.createElement("script");
    addScript.setAttribute(
      "src",
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
    );
    document.body.appendChild(addScript);
    window.googleTranslateElementInit = googleTranslateElementInit;
  }, []);

  return (
    <>
      <div id="google_translate_element"></div>
    </>
  );
};

export default TranslateGoogle;
