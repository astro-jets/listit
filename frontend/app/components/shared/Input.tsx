import React from "react";

export default function Input({
    ...rest
}: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...rest}
            className={`border p-2 w-full rounded ${rest.className}`}
        />
    );
}
