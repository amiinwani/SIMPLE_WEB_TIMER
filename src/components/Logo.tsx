import React from 'react';

interface LogoProps {
    emoji: string;
}

export default function Logo({ emoji }: LogoProps) {
    return (
        <span style={{ fontSize: '2rem', marginRight: '0.5rem', userSelect: 'none' }} role="img" aria-label="Logo">
            {emoji}
        </span>
    );
}
