import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { compressSelectedImages } from '@/features/images/imageSlice';
import { AppDispatch } from '../../store/store';

const CompressSingleImage = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [targetSize, setTargetSize] = useState<number>(150); // Default target size in KB
  const [folderName, setFolderName] = useState<string>('output'); // Default output folder
  const dispatch = useDispatch<AppDispatch>();

  const handleImageUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('target_size_kb', targetSize.toString());
      formData.append('folder_name', folderName); // Add folder name to FormData

      dispatch(compressSelectedImages(formData));
    }
  };

  return (
    <form className="bg-white p-6 rounded-lg shadow-lg space-y-4" onSubmit={handleImageUpload}>
      <div className="flex flex-col space-y-2">
        <label htmlFor="imageFile" className="font-semibold text-gray-800"> 
          Select Image File:
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="p-2 border rounded text-gray-700" 
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="targetSize" className="font-semibold text-gray-800"> 
          Target Size (KB):
        </label>
        <input
          type="number"
          value={targetSize}
          onChange={(e) => setTargetSize(parseInt(e.target.value))}
          min={1}
          className="p-2 border rounded text-gray-700"
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="folderName" className="font-semibold text-gray-800"> 
          Output Folder Path:
        </label>
        <input
          type="text"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          className="p-2 border rounded text-gray-700"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Compress Image
      </button>
    </form>
  );
};

export default CompressSingleImage;
