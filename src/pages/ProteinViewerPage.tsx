import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import api from '../services/api';
import { Stage } from 'ngl';

// Import ProteinData interface from API service
import { ProteinData } from '../services/api';

// Use any type for NGL-related interfaces since @types/ngl is not available
type NGLStage = any;
type NGLComponent = any;

const ProteinViewer: React.FC = () => {
  const { proteinId } = useParams<{ proteinId: string }>();
  const navigate = useNavigate();
  const [proteinData, setProteinData] = useState<ProteinData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewerError, setViewerError] = useState<string | null>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<NGLStage | null>(null);
  const [structureLoaded, setStructureLoaded] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    const fetchProteinData = async () => {
      if (!proteinId) {
        setError('No protein ID provided. Please search for a protein.');
        setIsLoading(false);
        return;
      }

      try {
        const jsonData = await api.getProtein(proteinId);
        if (!jsonData.success) {
          setError(jsonData.error || 'Protein not found');
          return;
        }
        
        if (jsonData.success && jsonData.data) {
          setProteinData(jsonData.data);
          setError(null);
          // Initialize viewer after data is loaded
          if (!structureLoaded && jsonData.data.pdbId) {
            await initializeViewer(jsonData.data.pdbId);
          }
        } else {
          setError(jsonData.error || 'Failed to fetch protein data.');
        }
      } catch (err) {
        console.error('Error fetching protein data:', err);
        if (retryCount < MAX_RETRIES) {
          setRetryCount(prev => prev + 1);
          setTimeout(fetchProteinData, 1000 * (retryCount + 1));
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProteinData();

    return () => {
      if (stageRef.current) {
        stageRef.current.dispose();
        stageRef.current = null;
        setStructureLoaded(false);
      }
    };
  }, [proteinId, retryCount]);

  const initializeViewer = async (pdbId: string) => {
    if (!viewerRef.current || structureLoaded) return;

    try {
      if (stageRef.current) {
        stageRef.current.dispose();
      }

      const stage = new Stage(viewerRef.current, {
        backgroundColor: 'white',
        quality: 'medium',
        useWorker: true,
        impostor: true,
        camera: 'perspective',
        clipDist: 0,
        fogNear: 100,
        fogFar: 100,
        cameraType: 'perspective',
        sampleLevel: 0
      });

      stageRef.current = stage;

      stage.mouseControls.add('drag-clip', 'drag');
      stage.mouseControls.add('zoom', 'scroll');
      stage.mouseControls.add('pan', 'pan');

      const url = `https://www.ebi.ac.uk/pdbe/entry-files/download/${pdbId.toUpperCase()}.bcif`;
      
      const component = await stage.loadFile(url, {
        ext: 'bcif',
        defaultRepresentation: false
      });

      component.addRepresentation('cartoon', {
        sele: 'protein',
        color: 'chainid',
        smoothSheet: true,
        quality: 'medium'
      });

      component.autoView(2000);
      stage.setFocus(75);

      setStructureLoaded(true);
      setViewerError(null);
    } catch (err) {
      console.error('Error initializing NGL viewer:', err);
      setViewerError('Failed to initialize protein structure viewer. Please try refreshing the page.');
      setStructureLoaded(false);
    }
  };
  // Add error handling for missing structures


  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-2">Loading protein data...</span>
        </div>
      </div>
    );
  }

  if (error || !proteinData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error || 'Protein data not available.'}</span>
          {error && error.includes('No matching PDB structure') && (
            <div className="mt-3">
              <p className="font-semibold">Suggestions:</p>
              <ul className="list-disc list-inside mt-1">
                <li>Try using a standard protein name (e.g., EGFR, BRAF, TP53)</li>
                <li>Use the official gene symbol instead of aliases</li>
                <li>Check for typos in the protein name</li>
                <li>Try using a known PDB ID if available (e.g., 1ABC)</li>
              </ul>
            </div>
          )}
          <button 
            onClick={() => navigate('/')} 
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Return to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">{proteinData.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p>{proteinData.description}</p>
            </div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Function</h2>
              <p>{proteinData.function}</p>
            </div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Related Drugs</h2>
              {proteinData.relatedDrugs && proteinData.relatedDrugs.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {proteinData.relatedDrugs.map((drug, index) => (
                    <li key={index} className="text-gray-700">{drug}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No related drugs found</p>
              )}
            </div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">External Resources</h2>
              <div className="space-y-2">
                <a
                  href={proteinData.externalLinks.uniprot}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-indigo-600 hover:text-indigo-800"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View on UniProt
                </a>
                <a
                  href={`https://www.rcsb.org/structure/${proteinData.pdbId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-indigo-600 hover:text-indigo-800"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View on RCSB PDB
                </a>
                <a
                  href={proteinData.externalLinks.genecards}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-indigo-600 hover:text-indigo-800"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View on GeneCards
                </a>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">3D Structure (PDB ID: {proteinData.pdbId})</h2>
            {viewerError ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <p>{viewerError}</p>
              </div>
            ) : (
              <div
                ref={viewerRef}
                className="w-full h-[500px] border rounded-lg bg-gray-50"
                style={{ minHeight: '500px' }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProteinViewer;

