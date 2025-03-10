
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Edit3 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export const TextEditor = () => {
  const [text, setText] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [misspelledWords, setMisspelledWords] = useState<Array<{word: string, index: number, suggestion: string}>>([]);
  const [tone, setTone] = useState('neutral');
  const [highlightedText, setHighlightedText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // Mock dictionary for spell checking
  const dictionary = {
    'teh': 'the',
    'thier': 'their',
    'recieve': 'receive',
    'wierd': 'weird',
    'alot': 'a lot',
    'definately': 'definitely',
    'seperate': 'separate',
    'occured': 'occurred',
    'beleive': 'believe',
    'accomodate': 'accommodate',
    'untill': 'until',
    'begining': 'beginning',
    'its': 'it\'s',
    'your': 'you\'re',
    'their': 'they\'re',
  };

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

  const checkSpelling = (content: string) => {
    const words = content.split(/\s+/);
    const misspelled: Array<{word: string, index: number, suggestion: string}> = [];
    const newSuggestions: string[] = [];
    
    words.forEach((word, idx) => {
      // Remove punctuation for checking
      const cleanWord = word.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
      
      if (cleanWord.length > 0 && dictionary[cleanWord as keyof typeof dictionary]) {
        const suggestion = dictionary[cleanWord as keyof typeof dictionary];
        const wordIndex = content.indexOf(word, idx > 0 ? words.slice(0, idx).join(' ').length : 0);
        
        misspelled.push({
          word: cleanWord,
          index: wordIndex,
          suggestion
        });
        
        newSuggestions.push(`"${cleanWord}" should be "${suggestion}"`);
      }
    });
    
    setMisspelledWords(misspelled);
    setSuggestions(newSuggestions);
    
    // Create highlighted HTML with misspelled words
    let highlightedContent = content;
    misspelled.sort((a, b) => b.index - a.index).forEach(item => {
      const start = item.index;
      const end = start + item.word.length;
      const before = highlightedContent.substring(0, start);
      const misspelledWord = highlightedContent.substring(start, end);
      const after = highlightedContent.substring(end);
      highlightedContent = `${before}<span class="text-red-500 underline decoration-wavy">${misspelledWord}</span>${after}`;
    });
    
    setHighlightedText(highlightedContent);
  };

  const applyCorrection = (originalWord: string, correctedWord: string) => {
    const newText = text.replace(new RegExp(originalWord, 'gi'), correctedWord);
    setText(newText);
    
    // Re-check spelling after correction
    checkSpelling(newText);
    
    toast({
      title: "Correction Applied",
      description: `Changed "${originalWord}" to "${correctedWord}"`,
      variant: "default",
    });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    
    if (newText.length > 2) {
      checkSpelling(newText);
      analyzeTone();
    } else {
      setSuggestions([]);
      setMisspelledWords([]);
      setHighlightedText('');
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
        
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            placeholder="Start writing here..."
            className="min-h-[200px] resize-none focus:ring-2 focus:ring-accent/50"
          />
          
          {highlightedText && (
            <div 
              className="absolute inset-0 pointer-events-none p-3 text-transparent bg-transparent"
              dangerouslySetInnerHTML={{ __html: highlightedText }}
            />
          )}
        </div>

        {suggestions.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Suggestions:</h3>
            <ul className="space-y-1">
              {suggestions.map((suggestion, index) => {
                const parts = suggestion.split('"');
                const originalWord = parts[1];
                const correctedWord = parts[3];
                
                return (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-gray-600">{suggestion}</span>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-6 px-2 ml-2 text-xs border-accent text-accent"
                      onClick={() => applyCorrection(originalWord, correctedWord)}
                    >
                      <Edit3 className="w-3 h-3 mr-1" /> Apply
                    </Button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button
            onClick={() => checkSpelling(text)}
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
