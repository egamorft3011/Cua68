import React from "react";
import styles from './ButtonCus.module.css';

type TButtonCus = {
    name: string;
    onPress: () => void;
    disabled?: boolean;
    type?: "submit" | "button" | "reset";
    className?: any;
}

export const ButtonCus = ({
    name,
    onPress,
    disabled = false,
}: TButtonCus) => {
    return (
        <div className={styles.customButtonContainer}>
            <button
                disabled={disabled}
                onClick={() => onPress()}
                className={styles.customButton}
                style={{ userSelect: 'none' }}
            >
                {name}
            </button>
        </div>
    );
};
