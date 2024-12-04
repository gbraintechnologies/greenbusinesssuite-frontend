import React from 'react';

interface CustomCardProps {
    name: string;
    description: string | string[]; // Allow either a string or an array of strings
    extraClasses?: string; // To allow additional custom styling
}

const CardDescription: React.FC<CustomCardProps> = ({
    name,
    description,
    extraClasses,
}) => {
    return (
        <div
            className={`bg-gray-50 text-gray-800 rounded-lg shadow-md p-4 
        hover:bg-gray-200 transition-colors duration-200 ease-in-out 
        cursor-pointer min-h-40 ${extraClasses}`}
        >
            <h2 className="text-lg font-semibold">{name}</h2>

            {/* Check if description is an array or a string */}
            {Array.isArray(description) ? (
                <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
                    {description.map((desc, index) => (
                        <li key={index}>{desc}</li>
                    ))}
                </ul>
            ) : (
                <p className="mt-2 text-sm">{description}</p>
            )}
        </div>
    );
};

export default CardDescription;
