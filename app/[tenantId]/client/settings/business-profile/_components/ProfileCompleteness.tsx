import React from "react";

function ProfileCompleteness({ completed = false }: { completed?: boolean }) {
  return (
    <div className="border border-rounded-xl px-6 border-gray-300 text-center p-4 rounded-xl">
      <h5 className="font-semibold">Profile completeness</h5>
      {completed ? (
        <p className="bg-green-100 rounded-full border-green-600 border p-1 text-sm text-green-700 mt-2">
          Complete
        </p>
      ) : (
        <p className="bg-red-100 rounded-full border-red-600 border p-1 text-sm text-red-700 mt-2">
          Incomplete
        </p>
      )}
    </div>
  );
}

export default ProfileCompleteness;
