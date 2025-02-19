// components/GenerateForm.tsx
'use client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function GenerateForm() {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });
      
      if (!response.ok) throw new Error('Generation failed');
      const data = await response.json();
      setGeneratedContent(data.content);
      toast.success('Blog generated successfully!');
    } catch (error) {
      toast.error('Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter blog topic..."
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={isGenerating}
        />
        <button
          type="submit"
          disabled={isGenerating}
          className={`w-full p-3 text-white rounded-lg transition-colors ${
            isGenerating ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isGenerating ? 'Generating...' : 'Generate Blog Post'}
        </button>
      </form>
      {generatedContent && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Generated Content</h2>
          {/* For now, we display the content in a simple preformatted text block */}
          <pre className="whitespace-pre-wrap font-sans">{generatedContent}</pre>
        </div>
      )}
    </div>
  );
}
