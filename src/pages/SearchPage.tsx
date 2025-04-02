// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Search, Database, Dna, Pill } from 'lucide-react';
// import api from '../services/api';

// const SearchPage: React.FC = () => {
//   const [query, setQuery] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   // const handleSubmit = async (e: React.FormEvent) => {
//   //   e.preventDefault();
//   //   if (!query.trim()) return;
    
//   //   setIsLoading(true);
//   //   setError(null);
    
//   //   try {
//   //     // Make a real API call to the backend
//   //     await api.search(query);
//   //     navigate(`/results?q=${encodeURIComponent(query)}`);
//   //   } catch (err) {
//   //     console.error('Search error:', err);
//   //     setError('An error occurred while searching. Please try again.');
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };

//   const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();
//   if (!query.trim()) return;

//   setIsLoading(true);
//   setError(null);

//   try {
//     const results = await api.search(query);

//     // Debugging Step: Log results to see if there's a Symbol
//     console.log("Search Results:", results);

//     // Ensure results are JSON-safe
//     navigate(`/results?q=${encodeURIComponent(query)}`, { state: JSON.parse(JSON.stringify(results)) });
//   } catch (err) {
//     console.error('Search error:', err);
//     setError('An error occurred while searching. Please try again.');
//   } finally {
//     setIsLoading(false);
//   }
// };


//   return (
//     <div className="flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-b from-indigo-50 to-white min-h-[80vh]">
//       <div className="text-center mb-10">
//         <h1 className="text-4xl font-bold text-indigo-800 mb-4">
//           AI-Powered Protein and Drug Target Identification
//         </h1>
//         <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//           Extract target proteins and potential drug targets from biomedical literature using advanced AI models
//         </p>
//       </div>
      
//       <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 mb-10">
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="relative">
//             <input
//               type="text"
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               placeholder="Enter disease, pathway, or drug target (e.g., 'lung cancer drug targets')"
//               className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//               required
//             />
//             <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
//           </div>
          
//           {error && (
//             <div className="text-red-500 text-sm">{error}</div>
//           )}
          
//           <button
//             type="submit"
//             disabled={isLoading}
//             className={`w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-medium flex items-center justify-center ${
//               isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700'
//             } transition-colors`}
//           >
//             {isLoading ? (
//               <>
//                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Processing...
//               </>
//             ) : (
//               <>
//                 <Search className="mr-2 h-5 w-5" />
//                 Search Biomedical Literature
//               </>
//             )}
//           </button>
//         </form>
        
//         <div className="mt-6 text-sm text-gray-500">
//           <p>Example searches:</p>
//           <ul className="list-disc pl-5 mt-1 space-y-1">
//             <li><button onClick={() => setQuery('EGFR lung cancer')} className="text-indigo-600 hover:underline">EGFR lung cancer</button></li>
//             <li><button onClick={() => setQuery('BRAF inhibitors melanoma')} className="text-indigo-600 hover:underline">BRAF inhibitors melanoma</button></li>
//             <li><button onClick={() => setQuery('HER2 breast cancer therapy')} className="text-indigo-600 hover:underline">HER2 breast cancer therapy</button></li>
//           </ul>
//         </div>
//       </div>
      
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
//         <FeatureCard 
//           icon={<Database className="h-10 w-10 text-indigo-500" />}
//           title="Live Literature Integration"
//           description="Retrieves real-time articles from PubMed and other scientific databases via NCBI Entrez"
//         />
//         <FeatureCard 
//           icon={<Dna className="h-10 w-10 text-indigo-500" />}
//           title="AI Entity Extraction"
//           description="Uses state-of-the-art NLP models to identify proteins, drugs, and their interactions"
//         />
//         <FeatureCard 
//           icon={<Pill className="h-10 w-10 text-indigo-500" />}
//           title="3D Visualization"
//           description="Interactive protein structure visualization with NGL Viewer integration"
//         />
//       </div>
//     </div>
//   );
// };

// interface FeatureCardProps {
//   icon: React.ReactNode;
//   title: string;
//   description: string;
// }

// const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md text-center">
//       <div className="flex justify-center mb-4">{icon}</div>
//       <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
//       <p className="text-gray-600">{description}</p>
//     </div>
//   );
// };

// export default SearchPage;


// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Search, Database, Dna, Pill } from 'lucide-react';
// import api from '../services/api';

// const SearchPage: React.FC = () => {
//   const [query, setQuery] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!query.trim()) return;

//     setIsLoading(true);
//     setError(null);

//     try {
//       const results = await api.search(query);

//       // Debugging Step: Log results to see if there's an issue
//       console.log("Search Results:", results);

//       // Ensure results are JSON-safe
//       const safeResults = JSON.parse(JSON.stringify(results));

//       navigate(`/results?q=${encodeURIComponent(query)}`, { state: safeResults });
//     } catch (err) {
//       console.error('Search error:', err);
//       setError('An error occurred while searching. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-b from-indigo-50 to-white min-h-[80vh]">
//       <div className="text-center mb-10">
//         <h1 className="text-4xl font-bold text-indigo-800 mb-4">
//           AI-Powered Protein and Drug Target Identification
//         </h1>
//         <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//           Extract target proteins and potential drug targets from biomedical literature using advanced AI models
//         </p>
//       </div>
      
//       <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 mb-10">
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="relative">
//             <input
//               type="text"
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               placeholder="Enter disease, pathway, or drug target (e.g., 'lung cancer drug targets')"
//               className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//               required
//             />
//             <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
//           </div>
          
//           {error && <div className="text-red-500 text-sm">{error}</div>}
          
//           <button
//             type="submit"
//             disabled={isLoading}
//             className={`w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-medium flex items-center justify-center ${
//               isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700'
//             } transition-colors`}
//           >
//             {isLoading ? (
//               <>
//                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Processing...
//               </>
//             ) : (
//               <>
//                 <Search className="mr-2 h-5 w-5" />
//                 Search Biomedical Literature
//               </>
//             )}
//           </button>
//         </form>
        
//         <div className="mt-6 text-sm text-gray-500">
//           <p>Example searches:</p>
//           <ul className="list-disc pl-5 mt-1 space-y-1">
//             <li><button onClick={() => setQuery('EGFR lung cancer')} className="text-indigo-600 hover:underline">EGFR lung cancer</button></li>
//             <li><button onClick={() => setQuery('BRAF inhibitors melanoma')} className="text-indigo-600 hover:underline">BRAF inhibitors melanoma</button></li>
//             <li><button onClick={() => setQuery('HER2 breast cancer therapy')} className="text-indigo-600 hover:underline">HER2 breast cancer therapy</button></li>
//           </ul>
//         </div>
//       </div>
      
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
//         <FeatureCard 
//           icon={<Database className="h-10 w-10 text-indigo-500" />}
//           title="Live Literature Integration"
//           description="Retrieves real-time articles from PubMed and other scientific databases via NCBI Entrez"
//         />
//         <FeatureCard 
//           icon={<Dna className="h-10 w-10 text-indigo-500" />}
//           title="AI Entity Extraction"
//           description="Uses state-of-the-art NLP models to identify proteins, drugs, and their interactions"
//         />
//         <FeatureCard 
//           icon={<Pill className="h-10 w-10 text-indigo-500" />}
//           title="3D Visualization"
//           description="Interactive protein structure visualization with NGL Viewer integration"
//         />
//       </div>
//     </div>
//   );
// };

// interface FeatureCardProps {
//   icon: React.ReactNode;
//   title: string;
//   description: string;
// }

// const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md text-center">
//       <div className="flex justify-center mb-4">{icon}</div>
//       <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
//       <p className="text-gray-600">{description}</p>
//     </div>
//   );
// };

// export default SearchPage;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Database, Dna, Pill } from 'lucide-react';
import api from '../services/api';

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.search(query);
      
      console.log("Search Results:", response);
      
      if (response.success && response.data) {
        const safeResults = JSON.parse(JSON.stringify(response.data));
        navigate(`/results?q=${encodeURIComponent(query)}`, { state: safeResults });
      } else {
        throw new Error(response.error || 'Failed to fetch search results');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('An error occurred while searching. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-b from-indigo-50 to-white min-h-[80vh]">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-indigo-800 mb-4">
          AI-Powered Protein and Drug Target Identification
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Extract target proteins and potential drug targets from biomedical literature using advanced AI models
        </p>
      </div>
      
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 mb-10">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter disease, pathway, or drug target (e.g., 'lung cancer drug targets')"
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          </div>
          
          {error && <div className="text-red-500 text-sm">{error}</div>}
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-medium flex items-center justify-center ${
              isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700'
            } transition-colors`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <Search className="mr-2 h-5 w-5" />
                Search Biomedical Literature
              </>
            )}
          </button>
        </form>
        
        <div className="mt-6 text-sm text-gray-500">
          <p>Example searches:</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li><button onClick={() => setQuery('EGFR lung cancer')} className="text-indigo-600 hover:underline">EGFR lung cancer</button></li>
            <li><button onClick={() => setQuery('BRAF inhibitors melanoma')} className="text-indigo-600 hover:underline">BRAF inhibitors melanoma</button></li>
            <li><button onClick={() => setQuery('HER2 breast cancer therapy')} className="text-indigo-600 hover:underline">HER2 breast cancer therapy</button></li>
          </ul>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
        <FeatureCard 
          icon={<Database className="h-10 w-10 text-indigo-500" />}
          title="Live Literature Integration"
          description="Retrieves real-time articles from PubMed and other scientific databases via NCBI Entrez"
        />
        <FeatureCard 
          icon={<Dna className="h-10 w-10 text-indigo-500" />}
          title="AI Entity Extraction"
          description="Uses state-of-the-art NLP models to identify proteins, drugs, and their interactions"
        />
        <FeatureCard 
          icon={<Pill className="h-10 w-10 text-indigo-500" />}
          title="3D Visualization"
          description="Interactive protein structure visualization with NGL Viewer integration"
        />
      </div>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default SearchPage;
