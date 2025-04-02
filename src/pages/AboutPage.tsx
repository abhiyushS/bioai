import React from 'react';
import { Database, Dna, Pill, Search, Server, Cpu } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">About BioTarget AI</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Overview</h2>
          <p className="text-gray-700 mb-4">
            BioTarget AI is an advanced tool designed to streamline the process of identifying potential drug targets from biomedical literature. By leveraging state-of-the-art AI and natural language processing techniques, our platform automatically extracts proteins, drugs, and their interactions from scientific publications, saving researchers valuable time and accelerating the drug discovery process.
          </p>
          <p className="text-gray-700">
            Whether you're a pharmaceutical researcher, academic scientist, or bioinformatics specialist, BioTarget AI provides a powerful solution for navigating the vast landscape of biomedical literature and identifying promising therapeutic targets.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureCard 
              icon={<Search className="h-8 w-8 text-indigo-500" />}
              title="Intelligent Search"
              description="Search across millions of biomedical articles using natural language queries about diseases, pathways, or specific proteins."
            />
            <FeatureCard 
              icon={<Database className="h-8 w-8 text-indigo-500" />}
              title="Live Literature Integration"
              description="Seamless integration with PubMed and other scientific databases via NCBI Entrez to retrieve the most relevant and up-to-date research."
            />
            <FeatureCard 
              icon={<Cpu className="h-8 w-8 text-indigo-500" />}
              title="AI-Powered Entity Extraction"
              description="Advanced NLP models identify proteins, drugs, and their interactions with high precision and recall."
            />
            <FeatureCard 
              icon={<Dna className="h-8 w-8 text-indigo-500" />}
              title="3D Protein Visualization"
              description="Interactive visualization of protein structures using NGL Viewer, allowing researchers to explore molecular details."
            />
            <FeatureCard 
              icon={<Pill className="h-8 w-8 text-indigo-500" />}
              title="Drug-Target Relationship Analysis"
              description="Automatically identify and categorize relationships between drugs and their target proteins."
            />
            <FeatureCard 
              icon={<Server className="h-8 w-8 text-indigo-500" />}
              title="Data Caching & Export"
              description="Save search results and export data in various formats for further analysis and integration with other tools."
            />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Technology Stack</h2>
          
          <div className="space-y-4">
            <TechSection 
              title="Frontend"
              items={["React.js with TypeScript", "Tailwind CSS for styling", "NGL Viewer for 3D visualization", "Axios for API requests"]}
            />
            <TechSection 
              title="Backend"
              items={["Flask (Python)", "RESTful API architecture", "Biopython for NCBI Entrez integration", "PubMed API integration"]}
            />
            <TechSection 
              title="AI & NLP"
              items={["Pattern matching and regex for entity extraction", "Future: Hugging Face Transformers", "Future: BioBERT/PubMedBERT", "Future: Named Entity Recognition (NER)"]}
            />
            <TechSection 
              title="External APIs"
              items={["NCBI Entrez Programming Utilities (E-utilities)", "PDB (Protein Data Bank) API", "UniProt and GeneCards integration"]}
            />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">How to Use</h2>
          
          <ol className="list-decimal list-inside space-y-4 text-gray-700">
            <li>
              <span className="font-medium">Enter your query</span> - Start by entering a research query related to diseases, pathways, or specific proteins of interest.
            </li>
            <li>
              <span className="font-medium">Review search results</span> - Browse through the list of relevant articles, with automatically highlighted proteins and drugs.
            </li>
            <li>
              <span className="font-medium">Filter and refine</span> - Use the filtering options to narrow down results based on specific proteins, drugs, or other criteria.
            </li>
            <li>
              <span className="font-medium">Explore protein details</span> - Click on any protein to view detailed information and 3D structure visualization.
            </li>
            <li>
              <span className="font-medium">Access original research</span> - Follow the provided links to access the original publications for in-depth reading.
            </li>
            <li>
              <span className="font-medium">Export findings</span> - Save or export your results for further analysis or integration with other research tools.
            </li>
          </ol>
        </div>
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
    <div className="flex space-x-4">
      <div className="flex-shrink-0 mt-1">{icon}</div>
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-1">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

interface TechSectionProps {
  title: string;
  items: string[];
}

const TechSection: React.FC<TechSectionProps> = ({ title, items }) => {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-800 mb-2">{title}</h3>
      <ul className="list-disc list-inside text-gray-700 pl-2">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default AboutPage;