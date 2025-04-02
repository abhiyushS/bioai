<<<<<<< HEAD
# bioai
=======
# BioTarget AI: AI-Powered Protein and Drug Target Identification Tool

BioTarget AI is a full-stack application that leverages artificial intelligence to extract target proteins and potential drug targets from biomedical literature. The system streamlines the literature review process by automatically retrieving relevant articles, extracting key entities (proteins, drugs, and their interactions), and displaying the results with direct links to the original research.

## Features

- **User Query Interface**: A web-based UI where researchers can input search terms related to diseases, pathways, or drug targets.
- **External Data Integration**: Uses APIs (e.g., PubMed API) to fetch biomedical articles based on the user query.
- **NLP Processing**: Implements Named Entity Recognition (NER) and Relation Extraction (RE) using state-of-the-art pretrained models to extract proteins, drugs, and their interactions.
- **Data Storage**: Stores fetched and processed data for caching and quick retrieval.
- **Results Display**: Presents a list of articles with detailed information such as article IDs, titles, abstracts, extracted entities, and hyperlinks to the original research.
- **Visualization**: Integrates NGL Viewer to visualize protein structures in 3D.

## Technology Stack

### Frontend
- React.js with TypeScript
- Tailwind CSS for styling
- NGL Viewer for 3D protein visualization
- Lucide React for icons

### Backend
- Flask (Python)
- RESTful API architecture
- PubMed API integration (simulated in the current version)

### AI & NLP (Planned Implementation)
- Hugging Face Transformers
- BioBERT/PubMedBERT
- Named Entity Recognition (NER)
- Relation Extraction (RE)

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/biotarget-ai.git
cd biotarget-ai
```

2. Install frontend dependencies:
```
npm install
```

3. Install backend dependencies:
```
cd server
pip install -r requirements.txt
cd ..
```

### Running the Application

1. Start the frontend development server:
```
npm run dev
```

2. In a separate terminal, start the backend server:
```
npm run server
```

3. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
biotarget-ai/
├── public/                  # Static files
├── server/                  # Flask backend
│   ├── app.py               # Main server file
│   └── requirements.txt     # Python dependencies
├── src/                     # React frontend
│   ├── components/          # Reusable UI components
│   ├── pages/               # Page components
│   ├── App.tsx              # Main App component
│   └── main.tsx             # Entry point
├── package.json             # Node.js dependencies
└── README.md                # Project documentation
```

## Future Enhancements

- User authentication and saved searches
- Integration with additional biomedical databases
- Advanced filtering and sorting options
- Batch processing of multiple queries
- Export functionality for research findings
- Improved NLP models with higher accuracy for biomedical entity extraction

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- PubMed for providing access to biomedical literature
- NGL Viewer for protein visualization capabilities
- Hugging Face for transformer models
>>>>>>> 3641244 (bioai)
