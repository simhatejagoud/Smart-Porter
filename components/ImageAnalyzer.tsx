
import React, { useState } from 'react';
import { analyzeImage } from '../services/geminiService';
import Button from './ui/Button';
import Spinner from './ui/Spinner';

interface ImageAnalyzerProps {
  onAnalysisComplete: (description: string, imageBase64: string, mimeType: string) => void;
}

const ImageAnalyzer: React.FC<ImageAnalyzerProps> = ({ onAnalysisComplete }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit for Gemini
        setError('Image size should be less than 4MB.');
        return;
      }
      setError(null);
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!imageFile || !preview) return;
    setLoading(true);
    setError(null);
    try {
      // preview is a data URL like "data:image/jpeg;base64,..."
      const base64Data = preview.split(',')[1];
      const mimeType = imageFile.type;
      const prompt = "Briefly describe this item for a delivery service. What is it, and are there any special handling instructions a delivery person should know?";

      const description = await analyzeImage(base64Data, mimeType, prompt);
      onAnalysisComplete(description, base64Data, mimeType);
    } catch (err) {
      setError('Failed to analyze image.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border border-dashed rounded-2xl">
      <label className="block text-sm font-medium text-gray-700">Upload Item Photo (Optional)</label>
      <input
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-dark/10 file:text-primary-dark hover:file:bg-primary-dark/20"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {preview && (
        <div className="mt-4 text-center">
          <img src={preview} alt="Item preview" className="max-h-48 mx-auto rounded-lg" />
          <Button onClick={handleAnalyze} isLoading={loading} className="mt-4" size="sm" variant="secondary">
            Analyze Item with AI
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageAnalyzer;
