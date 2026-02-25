import React from 'react';

const Section = ({
    children,
    className = "",
    id,
    container = true,
    padding = "py-24"
}) => {
    return (
        <section id={id} className={`${padding} px-4 ${className}`}>
            {container ? (
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            ) : children}
        </section>
    );
};

export default Section;
