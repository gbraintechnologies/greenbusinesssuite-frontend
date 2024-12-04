import React from "react";

interface CustomCardProps {
  name: string;
  description: string | string[] | Record<string, string>; // Allow string, array, or object
  extraClasses?: string; // To allow additional custom styling
}

const CardDescription: React.FC<CustomCardProps> = ({
  name,
  description,
  extraClasses,
}) => {
  // Parse the description if it's a string that looks like an object
  let parsedDescription = description;
  if (typeof description === "string") {
    try {
      parsedDescription = JSON.parse(description); // Try to parse it as JSON
    } catch (error) {
      // If JSON.parse fails, keep the description as it is
      console.error("Invalid JSON format in description", error);
    }
  }

  return (
    <div
      className={`bg-gray-50 text-gray-800 rounded-lg p-4 
        hover:bg-gray-100 transition-colors border border-gray-100 duration-200 ease-in-out 
        cursor-pointer min-h-40 ${extraClasses}`}
    >
      <h2 className="text-lg font-semibold">{name}</h2>

      {/* Handle different types of description */}
      {typeof parsedDescription === "object" && !Array.isArray(parsedDescription) ? (
        <div className="mt-2 text-sm space-y-2">
          {/* {Object.entries(parsedDescription).map(([key, value], index) => (
            <div key={index} className="space-y-1">
              <p className="font-medium">
                <span className="list-disc inline-block mr-2">•</span> {key}: "{value}"
              </p>
            </div>
          ))} */}
        </div>
      ) : Array.isArray(parsedDescription) ? (
        <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
          {parsedDescription.map((desc, index) => (
            <li key={index} className="flex items-center">
              <span className="mr-2">•</span> {desc}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm">{parsedDescription}</p>
      )}
    </div>
  );
};

export default CardDescription;
