
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export const TextEditor = () => {
  const [text, setText] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [tone, setTone] = useState('neutral');

  const analyzeTone = () => {
    // Simplified tone analysis
    const words = text.toLowerCase().split(' ');
    if (words.some(w => ['happy', 'excited', 'wonderful'].includes(w))) {
      setTone('positive');
    } else if (words.some(w => ['sad', 'angry', 'upset'].includes(w))) {
      setTone('negative');
    } else {
      setTone('neutral');
    }
  };

  const checkGrammar = () => {
    // Simple grammar checking logic (placeholder)
    const commonErrors = [
      { error: "its", correction: "it's" },
      { error: "your", correction: "you're" },
      { error: "their", correction: "they're" },
    ];

    const newSuggestions = [];
    const words = text.split(' ');
    
    for (const word of words) {
      const error = commonErrors.find(e => e.error === word.toLowerCase());
      if (error) {
        newSuggestions.push(`Consider using "${error.correction}" instead of "${word}"`);
      }
    }
    
    setSuggestions(newSuggestions);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (e.target.value.length > 10) {
      analyzeTone();
      checkGrammar();
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto bg-white/80 backdrop-blur-sm shadow-lg animate-slide-in">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-primary">Writing Assistant</h2>
          <Badge variant="outline" className={`
            ${tone === 'positive' ? 'bg-green-100 text-green-800' : ''}
            ${tone === 'negative' ? 'bg-red-100 text-red-800' : ''}
            ${tone === 'neutral' ? 'bg-gray-100 text-gray-800' : ''}
          `}>
            {tone.charAt(0).toUpperCase() + tone.slice(1)} Tone
          </Badge>
        </div>
        
        <Textarea
          value={text}
          onChange={handleTextChange}
          placeholder="Start writing here..."
          className="min-h-[200px] resize-none focus:ring-2 focus:ring-accent/50"
        />

        {suggestions.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Suggestions:</h3>
            <ul className="space-y-1">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button
            onClick={checkGrammar}
            className="bg-accent hover:bg-accent/90 text-white"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Check Writing
          </Button>
        </div>
      </div>
    </Card>
  );
};
