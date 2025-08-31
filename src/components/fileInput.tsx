import React, { useState } from "react";

interface FileInputProps {
  onChange: (file: File) => void;
  label?: string;
}

const FileInput: React.FC<FileInputProps> = ({
  onChange,
  label = "Upload Image",
}) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreview(URL.createObjectURL(file));
      onChange(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Preview */}
      {preview ? (
        <img
          src={preview}
          alt="Preview"
          className="w-32 h-32 object-cover rounded-lg shadow-md border"
        />
      ) : (
        <div className="w-32 h-32 flex items-center justify-center bg-gray-100 rounded-lg border-dashed border-2 border-gray-300 text-gray-400">
          Preview
        </div>
      )}

      {/* Upload Button */}
      <label className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm">
        {label}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
    </div>
  );
};

export default FileInput;
