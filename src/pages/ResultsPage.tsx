import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { ExternalLink, FileText, Filter, Download, Dna, Pill } from 'lucide-react';
import api from '../services/api';

interface Article {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: string;
  abstract: string;
  url: string;
  entities: {
    proteins: string[];
    drugs: string[];
    interactions: {
      protein: string;
      drug: string;
      effect: string;
    }[];
  };
  data?: any; // Optional field for additional data
}

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') || '';
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!query) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await api.search(query);
        if (response.success) {
          setArticles(response.data.articles || []);
        } else {
          setError(response.error || 'An error occurred while fetching results');
        }
      } catch (err) {
        console.error('Error fetching results:', err);
        setError('Failed to fetch results. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [query]);

  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  // Extract all unique proteins and drugs for filtering
  const allProteins = Array.from(new Set(articles.flatMap(article => article.entities.proteins)));
  const allDrugs = Array.from(new Set(articles.flatMap(article => article.entities.drugs)));

  // Filter articles based on active filters
  const filteredArticles = articles.filter(article => {
    if (activeFilters.length === 0) return true;
    
    const articleProteins = article.entities.proteins;
    const articleDrugs = article.entities.drugs;
    
    return activeFilters.some(filter => 
      articleProteins.includes(filter) || articleDrugs.includes(filter)
    );
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Search Results for: <span className="text-indigo-600">"{query}"</span>
        </h1>
        <p className="text-gray-600">
          {isLoading ? 'Searching PubMed...' : error ? 'Error loading results' : `Found ${filteredArticles.length} articles`}
        </p>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters sidebar */}
        <div className="w-full md:w-64 bg-white rounded-lg shadow-md p-4 h-fit">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-800">Filters</h2>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden text-gray-500 hover:text-gray-700"
            >
              <Filter className="h-5 w-5" />
            </button>
          </div>
          
          <div className={`${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Proteins</h3>
              {allProteins.length > 0 ? (
                <div className="space-y-1">
                  {allProteins.map(protein => (
                    <div key={protein} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`protein-${protein}`}
                        checked={activeFilters.includes(protein)}
                        onChange={() => toggleFilter(protein)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`protein-${protein}`} className="ml-2 text-sm text-gray-700">
                        {protein}
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No proteins found</p>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Drugs</h3>
              {allDrugs.length > 0 ? (
                <div className="space-y-1">
                  {allDrugs.map(drug => (
                    <div key={drug} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`drug-${drug}`}
                        checked={activeFilters.includes(drug)}
                        onChange={() => toggleFilter(drug)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`drug-${drug}`} className="ml-2 text-sm text-gray-700">
                        {drug}
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No drugs found</p>
              )}
            </div>
            
            {activeFilters.length > 0 && (
              <button
                onClick={() => setActiveFilters([])}
                className="mt-4 text-sm text-indigo-600 hover:text-indigo-800"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
        
        {/* Results list */}
        <div className="flex-1">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : error ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-red-500">{error}</p>
              <Link to="/" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800">
                Return to search
              </Link>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-600">No articles found matching your query or filters.</p>
              <Link to="/" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800">
                Try a different search
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredArticles.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const handleProteinClick = (protein: string) => {
    navigate(`/protein-viewer/${protein}`);
  };

  const highlightEntities = (text: string) => {
    if (!text) return { __html: '' };
    let highlightedText = text;
    
    try {
        // Highlight proteins with clickable links
        article.entities.proteins.forEach((protein: string) => {
            if (protein) {
                const regex = new RegExp(`\\b${protein}\\b`, 'g');
                highlightedText = highlightedText.replace(
                    regex, 
                    `<span class="bg-blue-100 text-blue-800 px-1 rounded cursor-pointer hover:bg-blue-200" onclick="window.proteinClick('${protein}')">${protein}</span>`
                );
            }
        });
        
        // Highlight drugs
        article.entities.drugs.forEach((drug: string) => {
            if (drug) {
                const regex = new RegExp(`\\b${drug}\\b`, 'g');
                highlightedText = highlightedText.replace(
                    regex, 
                    `<span class="bg-green-100 text-green-800 px-1 rounded">${drug}</span>`
                );
            }
        });
    } catch (error) {
        console.error('Error highlighting entities:', error);
        return { __html: text };
    }
    
    return { __html: highlightedText };
  };

  // Add click handler to window for the proteins
  useEffect(() => {
    (window as any).proteinClick = handleProteinClick;
    return () => {
      delete (window as any).proteinClick;
    };
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{article.title}</h2>
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm ml-2"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            PubMed
          </a>
        </div>
        
        <div className="text-sm text-gray-600 mb-3">
          <p>{article.authors} • {article.journal} • {article.year}</p>
          <p className="text-gray-500 mt-1">{article.id}</p>
        </div>
        
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Identified Proteins:</h3>
          <div className="flex flex-wrap gap-2">
            {article.entities.proteins.map((protein, index) => (
              <button
                key={index}
                onClick={() => handleProteinClick(protein)}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 text-sm"
              >
                {protein}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <div 
            className={`text-gray-700 ${expanded ? '' : 'line-clamp-3'}`}
            dangerouslySetInnerHTML={highlightEntities(article.abstract)}
          />
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-indigo-600 hover:text-indigo-800 mt-1"
          >
            {expanded ? 'Show less' : 'Show more'}
          </button>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <div className="flex flex-wrap gap-2 mb-3">
            <h3 className="text-sm font-medium text-gray-700 mr-2">Proteins:</h3>
            {article.entities.proteins.length > 0 ? (
              article.entities.proteins.map((protein: string) => (
                <Link
                  key={protein}
                  to={`/protein-viewer/${protein}`}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200"
                >
                  <Dna className="h-3 w-3 mr-1" />
                  {protein}
                </Link>
              ))
            ) : (
              <span className="text-sm text-gray-500">None identified</span>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <h3 className="text-sm font-medium text-gray-700 mr-2">Drugs:</h3>
            {article.entities.drugs.length > 0 ? (
              article.entities.drugs.map((drug: string) => (
                <span
                  key={drug}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  <Pill className="h-3 w-3 mr-1" />
                  {drug}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-500">None identified</span>
            )}
          </div>
        </div>
        
        <div className="mt-4 flex justify-end space-x-2">
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <FileText className="h-4 w-4 mr-1" />
            Full Text
          </a>
          <button className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            <Download className="h-4 w-4 mr-1" />
            Export
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;