import React, { useState } from "react";
import styles from "./Input.module.css";

type TInputForm = {
    id: string;
    name: string;
    label?: string;
    type?: 'text' | "button" | "checkbox" | "date" | "email" | "file" | "image" | "number" | "password" | "url";
    placeholder?: string | undefined;
    className?: any;
    onChange?: any;
    onBlur?: any;
    value?: string;
    error?: any;
}

export const InputForm = ({
    id,
    label,
    type = "text",
    placeholder,
    className,
    onChange,
    // onBlur,
    value,
    error
}: TInputForm) => {
    const [isFocused, setIsFocused] = useState(false);
    return (
        <div className={styles.inputContainer}>
            <input
                readOnly
                id={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(ev) => onChange(ev.target.value)}
                onBlur={() => {
                    // onBlur();
                    setIsFocused(false);
                }}
                onFocus={() => setIsFocused(true)}
                className={`
          ${styles.inputField}
          ${className}
          ${error ? styles.inputFieldWithError : ''}
        `}
            />
            <label
                htmlFor={id}
                className={`
          ${styles.label}
          ${isFocused || value ? styles.labelTop : styles.labelDefault}
          ${isFocused || value ? styles.labelFocused : ''}
          ${error ? styles.inputFieldWithError : ''}
        `}
            >
                {label}
            </label>

            {error && (
                <div className="flex pt-1 justify-end w-full">
                    <p className={styles.errorMessage}>
                        {error.message}
                    </p>
                </div>
            )}
        </div>
    );
}
