
import React, { useState, useCallback, useRef, ChangeEvent, ClipboardEvent } from 'react';
import { Button } from './Button';
import { Spinner } from './Spinner';
import { geminiService } from '../services/geminiService';
import { GEMINI_MODEL_NAME } from '../constants';

const CopyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 4.625-2.25-2.25m0 0L15.75 15m2.25-2.25L15.75 10.5m2.25 2.25h-5.25" />
  </svg>
);

const ClearIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.56 0c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
);

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L22.75 5.25l-.813 2.846a4.5 4.5 0 0 0-3.09 3.09L16.25 12l2.846.813a4.5 4.5 0 0 0 3.09 3.09L22.75 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L18.25 12Z" />
  </svg>
);

const WandIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-2.122 2.122L6.106 20.488A3 3 0 0 0 8.228 22.61l2.266-.339a3 3 0 0 0 2.122-2.122l2.266-.339a3 3 0 0 0 2.122-2.122l.339-2.266a3 3 0 0 0-2.122-2.122l-2.266-.339a3 3 0 0 0-2.122-2.122L11.772 8.23a3 3 0 0 0-2.122-2.122L7.384 3.842a3 3 0 0 0-2.266.339L3 6.106a3 3 0 0 0-2.122 2.122L1.384 10.49a3 3 0 0 0 2.122 2.122l2.266.339a3 3 0 0 0 2.122 2.122l.339 2.266Zm3.187-1.187L16.122 9.53M14.061 14.06L17.47 10.65m-5.151 5.151L10.65 17.47m3.411-3.411 1.706-1.705" />
    <path strokeLinecap="round" strokeLinejoin="round" d="m11.164 12.836 2.091-2.09a1.5 1.5 0 0 1 2.121 0l2.09 2.09a1.5 1.5 0 0 1 0 2.121l-2.09 2.09a1.5 1.5 0 0 1-2.121 0l-2.09-2.09a1.5 1.5 0 0 1 0-2.121Z" />
  </svg>
);

const PhotoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.158 0a.225.225 0 0 1 .225-.225h.008a.225.225 0 0 1 .225.225v.008a.225.225 0 0 1-.225.225h-.008a.225.225 0 0 1-.225-.225v-.008Z" />
  </svg>
);

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.56 0c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
);

const DocumentMagnifyingGlassIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 10.875a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
  </svg>
);


type ActiveTab = 'rough' | 'refine' | 'image';
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const LatexEditor: React.FC = () => {
  const [rawLatex, setRawLatex] = useState<string>('');
  const [correctedLatex, setCorrectedLatex] = useState<string>('');
  const [promptText, setPromptText] = useState<string>('');
  const [selectedText, setSelectedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefining, setIsRefining] = useState<boolean>(false);
  const [isExtractingImage, setIsExtractingImage] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<string>('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('rough');

  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const polishedOutputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcessLatex = useCallback(async () => {
    if (!rawLatex.trim()) {
      setError('Please enter some LaTeX code to process.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setCorrectedLatex(''); 
    setCopySuccess('');

    try {
      const result = await geminiService.correctLatex(rawLatex, GEMINI_MODEL_NAME);
      setCorrectedLatex(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [rawLatex]);

  const handleRefineWithPrompt = useCallback(async () => {
    if (!promptText.trim()) {
      setError('Please enter a prompt to refine the LaTeX output.');
      return;
    }
    if (!correctedLatex.trim()) {
      setError('There is no polished LaTeX output to refine. Please process some LaTeX first, manually enter it, or extract from an image.');
      return;
    }
    setIsRefining(true);
    setError(null);
    setCopySuccess('');

    try {
      const result = await geminiService.refineLatexWithPrompt(correctedLatex, promptText, selectedText, GEMINI_MODEL_NAME);
      setCorrectedLatex(result);
      setSelectedText(''); 
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during refinement.');
    } finally {
      setIsRefining(false);
      setPromptText(''); 
    }
  }, [correctedLatex, promptText, selectedText]);

  const handleTextSelection = () => {
    const textarea = polishedOutputRef.current;
    if (textarea) {
      const currentSelection = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
      setSelectedText(currentSelection);
    }
  };

  const handleCopyToClipboard = useCallback(() => {
    if (!correctedLatex) return;
    navigator.clipboard.writeText(correctedLatex).then(() => {
      setCopySuccess('Copied to clipboard!');
      setTimeout(() => setCopySuccess(''), 2000);
    }).catch(err => {
      setError('Failed to copy text.');
      console.error('Failed to copy text: ', err);
    });
  }, [correctedLatex]);

  const resetImageState = useCallback(() => {
    setSelectedImageFile(null);
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setImagePreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
  }, [imagePreviewUrl, setSelectedImageFile, setImagePreviewUrl]);
  
  const handleClearFields = useCallback(() => {
    setRawLatex('');
    setCorrectedLatex('');
    setPromptText('');
    setSelectedText('');
    setError(null);
    setCopySuccess('');
    resetImageState();
  }, [resetImageState]);


  const processSelectedFile = useCallback((file: File) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError(`Invalid file type. Please upload an image (${ALLOWED_IMAGE_TYPES.join(', ')}).`);
      resetImageState();
      return;
    }
    setError(null);
    setSelectedImageFile(file);
    if (imagePreviewUrl) { // Revoke previous object URL if one exists
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setImagePreviewUrl(URL.createObjectURL(file));
  }, [imagePreviewUrl, setError, resetImageState, setSelectedImageFile, setImagePreviewUrl]);


  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };
  
  const handleImagePaste = useCallback((event: ClipboardEvent<HTMLDivElement>) => {
    if (activeTab !== 'image') return; // Only handle paste if image tab is active

    const items = event.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          processSelectedFile(file);
          event.preventDefault(); 
          return;
        }
      }
    }
  }, [processSelectedFile, activeTab]);

  const handleRemoveImage = () => {
    resetImageState();
  };
  
  const fileToGenerativePart = async (file: File): Promise<{ base64Data: string; mimeType: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const [metadata, data] = base64String.split(',');
        const mimeType = metadata.substring(metadata.indexOf(':') + 1, metadata.indexOf(';'));
        resolve({ base64Data: data, mimeType });
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleExtractFromImage = useCallback(async () => {
    if (!selectedImageFile) {
      setError('Please select an image first.');
      return;
    }
    setIsExtractingImage(true);
    setError(null);
    setCorrectedLatex('');
    setRawLatex(''); 
    setPromptText(''); 
    setCopySuccess('');

    try {
      const { base64Data, mimeType } = await fileToGenerativePart(selectedImageFile);
      const result = await geminiService.extractLatexFromImage(base64Data, mimeType, GEMINI_MODEL_NAME);
      setCorrectedLatex(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during image extraction.');
    } finally {
      setIsExtractingImage(false);
    }
  }, [selectedImageFile]);

  const tabButtonStyle = (tabName: ActiveTab) => 
    `py-3 px-6 font-medium text-lg rounded-t-lg transition-colors duration-200 focus:outline-none ` +
    (activeTab === tabName 
      ? 'bg-slate-800/70 text-sky-300 border-b-2 border-sky-400' 
      : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700/80 hover:text-sky-400');

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Output Section (Left Column) */}
        <div className="bg-slate-800/70 p-6 rounded-xl shadow-2xl space-y-4 ring-1 ring-slate-700">
          <label htmlFor="correctedLatex" className="block text-xl font-semibold text-teal-300">
            Polished LaTeX Output
          </label>
          <textarea
            id="correctedLatex"
            ref={polishedOutputRef}
            value={correctedLatex}
            onChange={(e) => setCorrectedLatex(e.target.value)}
            onSelect={handleTextSelection}
            onMouseUp={handleTextSelection} 
            onTouchEnd={handleTextSelection} 
            placeholder="Corrected LaTeX will appear here..."
            className="w-full h-80 p-4 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-shadow duration-300 ease-in-out shadow-inner resize-none"
            spellCheck="false"
            aria-label="Polished LaTeX Output Area"
            aria-live="polite"
          />
          {correctedLatex && (
            <Button onClick={handleCopyToClipboard} variant="secondary" className="w-full" aria-label="Copy Polished LaTeX to Clipboard">
              <CopyIcon className="w-5 h-5 mr-2"/>
              {copySuccess ? copySuccess : 'Copy to Clipboard'}
            </Button>
          )}
        </div>

        {/* Right Column: Tabbed Input Area */}
        <div className="flex flex-col space-y-0">
          {/* Tab Buttons */}
          <div className="flex">
            <button
              onClick={() => setActiveTab('rough')}
              className={tabButtonStyle('rough')}
              aria-pressed={activeTab === 'rough'}
            >
              Rough LaTeX
            </button>
            <button
              onClick={() => setActiveTab('refine')}
              className={tabButtonStyle('refine')}
              aria-pressed={activeTab === 'refine'}
            >
              Refinement Prompt
            </button>
            <button
              onClick={() => setActiveTab('image')}
              className={tabButtonStyle('image')}
              aria-pressed={activeTab === 'image'}
            >
              Image to LaTeX
            </button>
             <div className="flex-grow border-b-2 border-slate-700"></div> {/* Fills rest of the line under tabs */}
          </div>

          {/* Tab Content Area */}
          <div 
            className="bg-slate-800/70 p-6 rounded-b-xl rounded-tr-xl shadow-2xl ring-1 ring-slate-700 flex-grow min-h-[calc(20rem+100px)]"
            onPaste={activeTab === 'image' ? handleImagePaste : undefined} // Attach paste listener here for image tab
          >
            {activeTab === 'rough' && (
              <div className="space-y-4 h-full flex flex-col">
                <label htmlFor="rawLatex" className="block text-xl font-semibold text-sky-300">
                  Rough LaTeX Input
                </label>
                <textarea
                  id="rawLatex"
                  value={rawLatex}
                  onChange={(e) => setRawLatex(e.target.value)}
                  placeholder="Paste your rough LaTeX code here..."
                  className="w-full flex-grow h-80 p-4 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow duration-300 ease-in-out shadow-inner resize-none"
                  spellCheck="false"
                  aria-label="Rough LaTeX Input Area"
                />
                <div className="flex space-x-3 mt-auto">
                  <Button onClick={handleProcessLatex} disabled={isLoading || !rawLatex.trim()} variant="primary" className="w-full" aria-label="Polish LaTeX Code">
                    {isLoading ? <Spinner className="w-5 h-5 mr-2"/> : <SparklesIcon className="w-5 h-5 mr-2" />}
                    {isLoading ? 'Polishing...' : 'Polish LaTeX'}
                  </Button>
                  <Button onClick={handleClearFields} variant="secondary" title="Clear All Fields" aria-label="Clear Input and Output Fields">
                    <ClearIcon className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'refine' && (
              <div className="space-y-4 h-full flex flex-col">
                <label htmlFor="promptText" className="block text-xl font-semibold text-purple-300">
                  Refinement Prompt
                </label>
                <textarea
                  id="promptText"
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="Enter your refinement prompt (e.g., 'Simplify this explanation', or select text in Polished Output and type 'Rephrase this sentence')"
                  className="w-full flex-grow h-80 p-4 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow duration-300 ease-in-out shadow-inner resize-none"
                  spellCheck="false"
                  aria-label="Refinement Prompt Input Area"
                />
                 {selectedText && (
                  <p className="text-xs text-slate-400 italic -mt-2 mb-2">
                    Selected text to refine: "{selectedText.length > 50 ? selectedText.substring(0, 50) + '...' : selectedText}"
                  </p>
                )}
                <Button 
                  onClick={handleRefineWithPrompt} 
                  disabled={isRefining || !promptText.trim() || !correctedLatex.trim()} 
                  variant="primary" 
                  className="w-full bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 mt-auto" 
                  aria-label="Refine Polished LaTeX with Prompt"
                >
                  {isRefining ? <Spinner className="w-5 h-5 mr-2"/> : <WandIcon className="w-5 h-5 mr-2" />}
                  {isRefining ? 'Refining...' : 'Refine with Prompt'}
                </Button>
              </div>
            )}
            
            {activeTab === 'image' && (
              <div className="space-y-4 h-full flex flex-col items-center justify-start">
                 <label className="block text-xl font-semibold text-indigo-300 self-start">
                  Image Input
                </label>
                
                {!imagePreviewUrl && (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        processSelectedFile(e.dataTransfer.files[0]);
                      }
                    }}
                    className="w-full h-60 border-2 border-dashed border-slate-600 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400 hover:text-indigo-300 cursor-pointer transition-colors"
                    tabIndex={0} 
                    role="button"
                    aria-label="Image dropzone and click to upload area"
                  >
                    <PhotoIcon className="w-16 h-16 mb-2"/>
                    <p>Drag &amp; drop image, paste, or click to upload.</p>
                    <p className="text-xs mt-1">Supported: PNG, JPG, WEBP, GIF</p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept={ALLOWED_IMAGE_TYPES.join(',')}
                      className="hidden"
                      aria-hidden="true"
                    />
                  </div>
                )}

                {imagePreviewUrl && (
                  <div className="w-full space-y-3 flex flex-col items-center">
                    <img src={imagePreviewUrl} alt="Selected preview" className="max-h-60 w-auto object-contain rounded-md border border-slate-700 shadow-md"/>
                    <Button onClick={handleRemoveImage} variant="secondary" size="sm" aria-label="Remove selected image">
                      <TrashIcon className="w-5 h-5 mr-2"/> Remove Image
                    </Button>
                  </div>
                )}

                <Button
                  onClick={handleExtractFromImage}
                  disabled={!selectedImageFile || isExtractingImage}
                  variant="primary"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 mt-auto"
                  aria-label="Extract LaTeX from selected image"
                >
                  {isExtractingImage ? <Spinner className="w-5 h-5 mr-2"/> : <DocumentMagnifyingGlassIcon className="w-5 h-5 mr-2"/>}
                  {isExtractingImage ? 'Extracting...' : 'Extract LaTeX from Image'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-800/50 border border-red-700 text-red-300 rounded-lg shadow-md animate-pulseOnce" role="alert">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {copySuccess && !error && (
         <div 
            className="fixed bottom-10 right-10 bg-green-700/90 text-white p-4 rounded-lg shadow-xl transition-opacity duration-300 ease-in-out" 
            role="status"
            aria-live="polite"
          >
           {copySuccess}
         </div>
      )}
    </div>
  );
};
