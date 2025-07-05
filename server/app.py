from flask import Flask, request, jsonify
import requests
import os
from flask_cors import CORS
import time
from Bio import Entrez
import xml.etree.ElementTree as ET
import re
from urllib.parse import quote_plus

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure NCBI APi
Entrez.email = "sharma.anushkaaaa@gmail.com"  
Entrez.api_key = "e4116ee2dc11a7df245928ff03a173a5bd08"  
Entrez.tool = "protein_drug_finder"  

# PDB API base URL
PDB_API_BASE = "https://data.rcsb.org/rest/v1"

# Debug logging helper
def log_debug(message):
    print(f"DEBUG: {message}")

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok"}), 200


def is_valid_pdb_id(id_str):
    """
    Validate PDB ID format using a strict regex pattern.
    Must be exactly 4 characters long containing only letters and numbers.
    """
    if not id_str:
        return False
    # First check if it's a standard PDB ID
    pattern = r'^[a-zA-Z0-9]{4}$'
    return bool(re.match(pattern, id_str))

def get_protein(protein_id):
    if not is_valid_protein_name(protein_id):  # Add validation function
        return jsonify({"error": "Invalid protein name"}), 400
    # Check fallback PDB IDs first for common protein names
    fallback_pdb_ids = {
        "EGFR": "3W32",
        "KRAS": "4DSO",
        "HER2": "1N8Z",
        "PD-1": "5WT9",
        "TP53": "2OCJ",}

    

def extract_pdb_ids(text):
    """ Extract valid PDB IDs from text. """
    pattern = r'\b[1-9A-Z][A-Z0-9]{3}\b'
    potential_ids = re.findall(pattern, text.upper())
    return list({pid for pid in potential_ids if is_valid_pdb_id(pid)})

def extract_entities(text):
    # Improved protein pattern with comprehensive rules
    protein_pattern = r'\b(?:[A-Z][A-Z0-9]{1,}(?:-[A-Z0-9]+)?|[A-Z]{2,}[0-9]*|CD[0-9]{2,3}|[A-Z]{2,}[A-Z][a-z]|[A-Z][A-Z0-9]*(?:-[A-Z][a-z]+)+|p[0-9]{2,3}|[A-Z][a-z]{2,}[0-9]+)\b'
    drug_pattern = r'\b[A-Z][a-z]+(?:mab|nib|zib|mib|tinib|olimus|ciclib|rafenib|metinib|imus|parin|oxacin|mycin|zosin|cilin|dronate|lukast|prazole|sartan|afil|oxetine|dipine|ridone|setron|azole|fungin|vaptan|cycline|conazole)\b'
    
    # Enhanced common words list with more biomedical terms to exclude
    common_words = {
        'DNA', 'RNA', 'THE', 'AND', 'FOR', 'WITH', 'FROM', 'INTO', 'THROUGH',
        'AFTER', 'BEFORE', 'DURING', 'UNDER', 'OVER', 'THIS', 'THAT', 'THESE',
        'THOSE', 'WHICH', 'WHAT', 'WHERE', 'WHEN', 'WHY', 'HOW', 'ALL', 'ANY',
        'BOTH', 'EACH', 'FEW', 'MORE', 'MOST', 'OTHER', 'SOME', 'SUCH', 'THAN',
        'TOO', 'VERY', 'CAN', 'WILL', 'JUST', 'DON', 'NOT', 'ARE', 'BUT', 'NOW',
        'OUT', 'USE', 'EVEN', 'NEW', 'WANT', 'WAY', 'WAYS', 'WEEK', 'WELL',
        'WHO', 'WHAT', 'WHERE', 'WHEN', 'WHY', 'HOW', 'WHICH', 'WHO', 'WHOM',
        'WHOSE', 'THAT', 'THERE', 'HERE', 'HAVE', 'HAS', 'HAD', 'WAS', 'WERE',
        'BEEN', 'BEING', 'GET', 'GETS', 'GOT', 'GOTTEN', 'MAY', 'MIGHT', 'MUST',
        'SHALL', 'SHOULD', 'WOULD', 'COULD', 'CAN', 'CANNOT', 'CANT',
        'PCR', 'MRI', 'CAT', 'PET', 'ECG', 'EEG', 'HIV', 'ATP', 'ADP', 'GTP',
        'GDP', 'AMP', 'GMP', 'NAD', 'FAD', 'COA', 'RNA', 'DNA', 'IgG', 'IgM',
        'IgA', 'IgE', 'IgD'
    }
    
    def is_valid_protein(p):
        # Must be at least 2 characters long
        if len(p) < 2:
            return False
        # Exclude if it's a common word or abbreviation
        if p.upper() in common_words:
            return False
        # Must contain at least one letter
        if not any(c.isalpha() for c in p):
            return False
        # Should not be all numbers
        if p.isdigit():
            return False
        # Must start with a capital letter or 'p' followed by numbers (e.g., p53)
        if not (p[0].isupper() or (p[0] == 'p' and len(p) > 1 and p[1].isdigit())):
            return False
        # Allow hyphenated protein names with proper capitalization
        if '-' in p:
            parts = p.split('-')
            if not all(part and (part[0].isupper() or (part[0] == 'p' and len(part) > 1 and part[1].isdigit())) for part in parts):
                return False
            # Check for at least one alphabetic character in each part
            if not all(any(c.isalpha() for c in part) for part in parts):
                return False
        # Additional validation for protein naming conventions
        if len(p) >= 2 and p[0].isupper():
            # Check for valid protein name patterns
            if not any([
                # Standard protein names (e.g., BRCA1, TP53)
                bool(re.match(r'^[A-Z][A-Z0-9]{1,}$', p)),
                # Hyphenated names (e.g., HER2-alpha)
                bool(re.match(r'^[A-Z][A-Z0-9]*(?:-[A-Z][a-z]+)+$', p)),
                # CD markers (e.g., CD4, CD19)
                bool(re.match(r'^CD[0-9]{1,3}$', p)),
                # Complex protein names
                bool(re.match(r'^[A-Z][A-Z0-9]*[A-Z][a-z]+[0-9]*$', p))
            ]):
                return False
        return True
    
    potential_proteins = [p for p in set(re.findall(protein_pattern, text)) if is_valid_protein(p)]
    drugs = list(set(re.findall(drug_pattern, text)))
    
    return potential_proteins, drugs

# Simple in-memory cache for search results
search_cache = {}
CACHE_TIMEOUT = 3600  # 1 hour in seconds

@app.route('/api/search', methods=['GET'])
def search():
    query = request.args.get('query', '')
    if not query:
        return jsonify({"success": False, "error": "No search query provided"}), 400

    log_debug(f"Searching for: {query}")

    # Check cache first
    cache_key = quote_plus(query.lower())
    current_time = time.time()
    if cache_key in search_cache:
        cached_result, timestamp = search_cache[cache_key]
        if current_time - timestamp < CACHE_TIMEOUT:
            log_debug(f"Cache hit for query: {query}")
            return jsonify(cached_result)

    try:
        # Add retry mechanism for API calls
        max_retries = 3
        retry_count = 0
        while retry_count < max_retries:
            try:
                handle = Entrez.esearch(db="pubmed", term=query, retmax=20)
                record = Entrez.read(handle)
                handle.close()
                break
            except Exception as e:
                retry_count += 1
                if retry_count == max_retries:
                    raise e
                time.sleep(1)  # Wait before retrying

        if not record.get("IdList"):
            log_debug(f"No PubMed articles found for query: {query}")
            return jsonify({"success": True, "data": {"articles": [], "interactions": []}})

        handle = Entrez.efetch(db="pubmed", id=",".join(record["IdList"]), rettype="xml")
        articles_xml = handle.read()
        handle.close()

        root = ET.fromstring(articles_xml)
        articles = root.findall(".//PubmedArticle")
        processed_articles = []
        all_proteins = set()
        all_drugs = set()

        for article in articles:
            try:
                title_elem = article.find(".//ArticleTitle")
                abstract_elem = article.find(".//AbstractText")

                title = title_elem.text if title_elem is not None else ""
                abstract = abstract_elem.text if abstract_elem is not None else ""

                if not title and not abstract:
                    log_debug(f"Skipping article with no content")
                    continue

                text_to_search = f"{title} {abstract}"
                proteins, drugs = extract_entities(text_to_search)
                
                all_proteins.update(proteins)
                all_drugs.update(drugs)

                # Get authors
                authors = []
                author_list = article.findall(".//Author")
                for author in author_list:
                    last_name = author.find(".//LastName")
                    fore_name = author.find(".//ForeName")
                    if last_name is not None and fore_name is not None:
                        authors.append(f"{fore_name.text} {last_name.text}")
                
                # Get journal and year
                journal_elem = article.find(".//Journal/Title")
                year_elem = article.find(".//PubDate/Year")
                
                # Get PMID for URL
                pmid = article.find(".//PMID").text if article.find(".//PMID") else ""
                
                processed_articles.append({
                    'id': pmid,
                    'title': title,
                    'abstract': abstract,
                    'authors': ", ".join(authors[:3]) + (" et al." if len(authors) > 3 else ""),
                    'journal': journal_elem.text if journal_elem is not None else "",
                    'year': year_elem.text if year_elem is not None else "",
                    'url': f"https://pubmed.ncbi.nlm.nih.gov/{pmid}/" if pmid else "",
                    'entities': {
                        'proteins': list(proteins),
                        'drugs': list(drugs)
                    }
                })
                log_debug(f"Processed article with {len(proteins)} proteins and {len(drugs)} drugs")
            except Exception as e:
                log_debug(f"Error processing article: {str(e)}")
                continue

        # Create interactions list for both proteins and drugs
        interactions = []
        for p in all_proteins:
            interactions.append({"id": f"int_{p}", "protein": p, "type": "protein"})
        for d in all_drugs:
            interactions.append({"id": f"int_{d}", "drug": d, "type": "drug"})

        result = {"success": True, "data": {"articles": processed_articles, "interactions": interactions}}
        
        # Cache the successful result
        search_cache[cache_key] = (result, current_time)
        
        # Clean up old cache entries
        for key in list(search_cache.keys()):
            if current_time - search_cache[key][1] > CACHE_TIMEOUT:
                del search_cache[key]
        
        return jsonify(result)

    except Exception as e:
        log_debug(f"Error in PubMed search: {str(e)}")
        error_message = "Error searching PubMed. "
        if "API rate limit" in str(e):
            error_message += "Rate limit exceeded. Please try again in a few minutes."
        elif "Network" in str(e):
            error_message += "Network connection issue. Please check your connection."
        else:
            error_message += "Please try again."
        return jsonify({"success": False, "error": error_message}), 500

# Cache for protein data
protein_cache = {}
PROTEIN_CACHE_TIMEOUT = 3600  # 1 hour

@app.route('/api/protein/<protein_id>', methods=['GET'])
def get_protein(protein_id):
    log_debug(f"Fetching protein details for: {protein_id}")
    
    # Check cache first
    cache_key = protein_id.upper()
    current_time = time.time()
    if cache_key in protein_cache:
        cached_result, timestamp = protein_cache[cache_key]
        if current_time - timestamp < PROTEIN_CACHE_TIMEOUT:
            log_debug(f"Cache hit for protein: {protein_id}")
            return jsonify(cached_result)

    # Check fallback PDB IDs first for common protein names
    fallback_pdb_ids = {
        "EGFR": "3W32",
        "KRAS": "4DSO",
        "HER2": "1N8Z",
        "PD-1": "5WT9",
        "TP53": "2OCJ",
        "BRAF": "4MNE",
        "BRCA1": "1JM7",
        "CDK2": "1HCK",
        "MAPK1": "4G5E",
        "AKT1": "3O96",
        "ALK": "2XP2",
        "BCL2": "4LVT",
        "CDK4": "2W96",
        "ERBB2": "1N8Z",
        "JAK2": "4FVQ",
        "MDM2": "4HBM",
        "MET": "2WGJ",
        "MEK": "3EQF",  # Added MEK with a valid PDB ID
        "NRAS": "3CON",
        "PARP1": "4HHZ",
        "PIK3CA": "4JPS",
        "RET": "2IVS",
        "ROS1": "3ZBF",
        "SMO": "4O9R",
        "SRC": "2SRC",
        "VEGFR2": "2XIR"
    }

    pdb_id = fallback_pdb_ids.get(protein_id.upper())
    
    if not pdb_id:
        search_url = "https://search.rcsb.org/rcsbsearch/v2/query"
        headers = {'Content-Type': 'application/json'}

        search_query = {
            "query": {
                "type": "terminal",
                "service": "text",
                "parameters": {
                    # "attribute": "rcsb_entity_source_organism.rcsb_gene_name.value",
                    "attribute": "rcsb_polymer_entity_container_identifiers.reference_sequence_identifiers.database_accession",
                    "operator": "exact_match",
                    "value": protein_id
                }
            },
            "return_type": "entry",
            "request_options": {"paginate": {"start": 0, "rows": 1}}
        }

            max_retries = 3
            retry_count = 0
            while retry_count < max_retries:
                try:
                    response = requests.post(search_url, json=search_query, headers=headers, timeout=10)
                    if response.ok:
                        try:
                            search_data = response.json()
                            if search_data and 'result_set' in search_data and search_data['result_set']:
                                pdb_id = search_data['result_set'][0]['identifier']
                                break
                        except ValueError as json_err:
                            log_debug(f"Invalid JSON response from PDB search API: {str(json_err)}")
                            # Continue to retry if JSON parsing fails
                    retry_count += 1
                    if retry_count == max_retries:
                        log_debug(f"Failed to search PDB after {max_retries} attempts")
                        return jsonify({
                            "success": False,
                            "error": "Failed to search protein database after multiple attempts."
                        }), 503
                    time.sleep(1)
                except Exception as e:
                    log_debug(f"Error searching PDB (attempt {retry_count + 1}): {str(e)}")
                    retry_count += 1
                    if retry_count == max_retries:
                        return jsonify({
                            "success": False,
                            "error": "Error searching protein database."
                        }), 500
                    time.sleep(1)

    if not pdb_id:
        return jsonify({
            "success": False,
            "error": "No matching PDB structure found."
        }), 404

    try:
        # Fetch basic protein info with retry mechanism
        max_retries = 3
        retry_count = 0
        while retry_count < max_retries:
            try:
                pdb_url = f"{PDB_API_BASE}/entry/{pdb_id}"
                log_debug(f"Attempting to fetch PDB data from: {pdb_url}")
                pdb_response = requests.get(pdb_url, timeout=10)
                log_debug(f"PDB API response status: {pdb_response.status_code}")
                
                if pdb_response.ok:
                    try:
                        pdb_data = pdb_response.json()
                        log_debug(f"Successfully parsed PDB data for {pdb_id}")
                        break
                    except ValueError as json_err:
                        log_debug(f"Invalid JSON response from PDB API: {str(json_err)}")
                        log_debug(f"Response content: {pdb_response.text[:200]}...")
                        raise Exception(f"Invalid JSON response from PDB API: {str(json_err)}")
                else:
                    log_debug(f"PDB API error response: {pdb_response.text[:200]}...")
                    
                retry_count += 1
                if retry_count == max_retries:
                    return jsonify({
                        "success": False,
                        "error": f"Failed to fetch PDB data (Status: {pdb_response.status_code})"
                    }), pdb_response.status_code
                log_debug(f"Retrying PDB API request (attempt {retry_count + 1})")
                time.sleep(1)
            except Exception as e:
                log_debug(f"Error fetching PDB data (attempt {retry_count + 1}): {str(e)}")
                retry_count += 1
                if retry_count == max_retries:
                    return jsonify({
                        "success": False,
                        "error": "Error fetching protein data after multiple attempts."
                    }), 503
                time.sleep(1)

        # Fetch additional entity info with proper error handling
        entity_url = f"{PDB_API_BASE}/entry/{pdb_id}/nonpolymer_entities"
        entity_data = {}
        try:
            entity_response = requests.get(entity_url, timeout=10)
            if entity_response.ok:
                try:
                    entity_data = entity_response.json()
                except ValueError as json_err:
                    log_debug(f"Invalid JSON response from entity API: {str(json_err)}")
        except Exception as e:
            log_debug(f"Error fetching entity data: {str(e)}")
            # Continue with empty entity data

        # Construct response data
        protein_info = {
            "name": pdb_data.get('struct.title', 'Unknown Protein'),
            "pdbId": pdb_id,
            "description": pdb_data.get('struct.pdbx_descriptor', 'No description available'),
            "function": pdb_data.get('pdbx_vrpt_summary.text_analysis_report', 'Function information not available'),
            "relatedDrugs": [entity.get('pdbx_description', '') for entity in entity_data.values() if entity.get('pdbx_description')],
            "externalLinks": {
                "uniprot": f"https://www.uniprot.org/uniprotkb?query={pdb_id}",
                "pdb": f"https://www.rcsb.org/structure/{pdb_id}",
                "genecards": f"https://www.genecards.org/Search/Keyword?queryString={protein_id}"
            }
        }

        result = {
            "success": True,
            "data": protein_info
        }
        
        # Cache the successful result
        protein_cache[cache_key] = (result, current_time)
        
        # Clean up old cache entries
        for key in list(protein_cache.keys()):
            if current_time - protein_cache[key][1] > PROTEIN_CACHE_TIMEOUT:
                del protein_cache[key]
        
        return jsonify(result)

    except Exception as e:
        log_debug(f"Error retrieving PDB data: {str(e)}")
        return jsonify({
            "success": False,
            "error": "Error fetching protein structure."
        }), 500




if __name__ == '__main__':
    app.run(debug=True)
