import React from "react";

export default function Button({
    children,
    ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...rest}
            className={`cursor-pointer px-4 py-2 bg-blue-600 text-white rounded ${rest.className}`}
        >
            {children}
        </button>
    );
}
