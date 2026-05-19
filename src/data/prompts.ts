/**
 * Research Paper Prompt Collection — 50 ready-to-use AI prompts
 * Covers the full paper lifecycle: Summary / Rewrite / Analysis / Writing Assistance / Productivity
 */

export interface Prompt {
  id: string
  category: 'summary' | 'rewrite' | 'analysis' | 'writing' | 'productivity'
  title: string
  template: string
  description: string
}

export const prompts: Prompt[] = [
  // ===== 1. Paper Summary =====
  {
    id: '001',
    category: 'summary',
    title: 'General Research Summary',
    template: 'I am conducting research on [research topic] using [research method]. Please help me write a 150-200 word academic abstract that includes research background, objectives, methods, key findings, and conclusions. Tone: formal, objective, concise.',
    description: 'Generate a standard academic abstract based on research topic and methods',
  },
  {
    id: '002',
    category: 'summary',
    title: 'Computer Science Abstract',
    template: 'You are an academic editor in computer science. Please write an English abstract of up to 200 words for my research [paper title]. My research primarily addresses [core problem], uses [method/algorithm], and achieves [key results] on [dataset/benchmark]. Please highlight technical contributions and innovations.',
    description: 'English abstract for CS papers, emphasizing technical contributions',
  },
  {
    id: '003',
    category: 'summary',
    title: 'Biomedical Abstract',
    template: 'Please write a 250-word Abstract (in English) based on the following information: Background: [background]; Objective: [objective]; Methods: [experimental methods, e.g., sample size, groups, measurements]; Results: [key data including statistical significance]; Conclusion: [main conclusion]. Format should follow IMRaD structure.',
    description: 'Biomedical IMRaD-format English abstract',
  },
  {
    id: '004',
    category: 'summary',
    title: 'Social Science Abstract',
    template: 'Please write a concise abstract (about 150 words) for my social science research paper. Research topic: [topic]; Data source: [data source, e.g., surveys/interviews/public data]; Sample size: [sample size]; Analysis method: [analysis method, e.g., regression analysis/thematic analysis]; Key findings: [core findings]. The abstract should include theoretical and practical implications.',
    description: 'Concise abstract for social science research papers',
  },
  {
    id: '005',
    category: 'summary',
    title: '100-Word Short Abstract (Journal Special)',
    template: 'Please compress the core content of the following paper into a super short abstract of under 100 words, retaining only the most essential information: research question, main method, key conclusions. Original abstract: [paste your original abstract]',
    description: 'Compress abstract to under 100 words, suitable for journal submission limits',
  },
  {
    id: '006',
    category: 'summary',
    title: '300-Word Detailed Abstract',
    template: 'Please expand the following paper content into a detailed abstract of about 300 words. Requirements: clearly present research motivation, distinction from prior work, method details, experimental results and their significance. Can include 1-2 key data points. Source information: [enter your research content]',
    description: 'Expand to a 300-word detailed abstract with method details and significance',
  },
  {
    id: '007',
    category: 'summary',
    title: '500-Word Review Abstract',
    template: 'Please write a comprehensive abstract of 400-500 words for my review paper. Research field: [field]; Time span covered: [time]; Number of included papers: [number]; Key review findings: [findings]. The abstract should include the development trajectory of the field, current controversies, and future directions.',
    description: 'Comprehensive review abstract covering development trajectory and future directions',
  },
  {
    id: '008',
    category: 'summary',
    title: 'Chinese Short Abstract',
    template: 'Please write a Chinese abstract of under 150 words for my paper. Use concise, standard academic Chinese, avoiding long sentences. Research field: [field]; Research question: [question]; Method: [method]; Conclusion: [conclusion]. Include 3-5 keywords.',
    description: 'Under 150-word Chinese academic abstract + keywords',
  },
  {
    id: '009',
    category: 'summary',
    title: 'Extended English Abstract (Conference/Expanded)',
    template: 'Please write an extended abstract (400-500 words) for my conference paper on [your topic]. The abstract should follow this structure: (1) Problem statement and motivation; (2) Related work and research gap; (3) Proposed approach/methodology; (4) Experimental setup and results; (5) Conclusion and broader impact. Include quantitative results where applicable.',
    description: 'Extended English abstract for conferences with problem, method, results, impact',
  },
  {
    id: '010',
    category: 'summary',
    title: 'Graphical Abstract Caption',
    template: 'I need to design a Graphical Abstract for my paper. Based on the following paper content, generate a caption of under 50 words, and propose a visual design plan (describing suggested icons, flowchart structure, and color scheme). Paper content: [enter your research]',
    description: 'Generate graphical abstract caption + visual design plan',
  },

  // ===== 2. Paper Rewriting =====
  {
    id: '011',
    category: 'rewrite',
    title: 'Chinese to English · Academic Translation',
    template: 'Please translate the following Chinese paper paragraph into authentic English academic language. Requirements: maintain academic rigor, use accurate terminology, and follow English academic writing conventions. Avoid Chinglish from literal translation. Original: "[paste Chinese paragraph]"',
    description: 'Translate Chinese paper paragraphs into authentic English academic language',
  },
  {
    id: '012',
    category: 'rewrite',
    title: 'English to Chinese · Academic Translation',
    template: 'Please translate the following English academic paragraph into fluent Chinese academic language. Requirements: use mainstream terminology used in Chinese academia, follow Chinese academic expression conventions, and properly handle passive voice and long sentences. Original: "[paste English paragraph]"',
    description: 'Translate English academic paragraphs into fluent Chinese academic language',
  },
  {
    id: '013',
    category: 'rewrite',
    title: 'Academic Style Upgrade · From Informal to Formal',
    template: 'The following text is somewhat informal. Please rewrite it in a formal academic style. Requirements: use more specialized vocabulary, tighter sentence structures, and clearer logical hierarchy. Keep the original meaning unchanged. (Add transition words and connectors as needed.) Original: "[paste your draft]"',
    description: 'Rewrite informal text into formal academic style',
  },
  {
    id: '014',
    category: 'rewrite',
    title: 'Academic Style Downgrade · From Academic to Accessible',
    template: 'I need to use this academic content for popular science / grant application background / interdisciplinary readers. Please make the following text more accessible, reduce jargon, add analogies and explanations, so that researchers outside the field can also understand. Original: "[paste academic paragraph]"',
    description: 'Rewrite academic content into accessible popular science style',
  },
  {
    id: '015',
    category: 'rewrite',
    title: 'Paraphrase · Preserve Core Meaning',
    template: 'Please paraphrase the following paragraph (to avoid plagiarism detection), requiring:\n1. Keep all core information and academic viewpoints unchanged\n2. Change sentence structure (active/passive conversion, word order adjustment, clause splitting/combining)\n3. Replace synonyms without changing professional meaning\n4. Maintain the same academic rigor and word count (±10%)\n\nOriginal: "[paste paragraph to paraphrase]"',
    description: 'Paraphrase while preserving core information',
  },
  {
    id: '016',
    category: 'rewrite',
    title: 'Paraphrase · Deep Restructuring',
    template: 'Please deeply restructure the following long paragraph. Do not settle for synonym replacement; reorganize the logical chain of arguments, change the order of discussion, and use different illustrative approaches. The goal: significantly reduce similarity score while fully preserving academic quality and original meaning. Original: "[paste long paragraph]"',
    description: 'Deep restructuring of long paragraphs to significantly reduce similarity',
  },
  {
    id: '017',
    category: 'rewrite',
    title: 'Passive ↔ Active Voice Conversion',
    template: 'Please convert all passive voice to active voice (or vice versa) in the following paragraph. Maintain academic rigor and do not change the emphasis of key information. If the conversion sounds unnatural, adjust the sentence structure appropriately. Original: "[paste paragraph]"',
    description: 'Convert between passive and active voice',
  },
  {
    id: '018',
    category: 'rewrite',
    title: 'Condense · Refine Expression',
    template: 'The following paragraph needs to be compressed to half its original length (from [word count A] words to about [word count A/2] words). Requirements: remove redundant modifiers, merge similar points, simplify examples, and retain all core information. Original: "[paste paragraph]"',
    description: 'Condense to half length while refining expression',
  },
  {
    id: '019',
    category: 'rewrite',
    title: 'Expand · Enrich Arguments',
    template: 'The following paragraph needs to be expanded to twice its original length (from [word count B] words to about [word count B*2] words). Requirements: add background context, supplement argument details, include suggested literature citations, and enrich arguments and evidence. Do not add content unrelated to the topic. Original: "[paste paragraph]"',
    description: 'Expand to twice the length with enriched arguments',
  },
  {
    id: '020',
    category: 'rewrite',
    title: 'Academic Style Conversion (APA/MLA/Chicago)',
    template: 'Please unify the format and style of the following paper content according to [APA/MLA/Chicago] requirements. This includes but is not limited to: citation format, heading hierarchy, number formatting conventions, reference list format, etc. Original: "[paste content]"',
    description: 'Unify paper style according to APA/MLA/Chicago format',
  },

  // ===== 3. Paper Analysis =====
  {
    id: '021',
    category: 'analysis',
    title: 'Critical Analysis of Research Question',
    template: 'Please analyze the following research question from a reviewer\'s perspective:\n"[enter research question]"\nAnalysis dimensions:\n1. Innovation and value of this research question (1-5 score, with reasoning)\n2. Is the research question clear and actionable?\n3. Potential methodological pitfalls\n4. Suggestions for improvement/focusing the research question',
    description: 'Critical analysis of research question from a reviewer\'s perspective',
  },
  {
    id: '022',
    category: 'analysis',
    title: 'Methodology Evaluation',
    template: 'Please evaluate the rationality and potential flaws of the following methodology section:\n"[paste methodology section]"\n\nAnalyze from the following angles:\n- Does the method match the research question?\n- Is the sample size/data volume sufficient?\n- Are control variables adequate?\n- Are statistical methods appropriate?\n- How reproducible is it?\n- Suggested improvements',
    description: 'Evaluate the rationality and potential flaws of research methods',
  },
  {
    id: '023',
    category: 'analysis',
    title: 'Deep Interpretation of Experimental Results',
    template: 'Based on the following experimental results data, please provide an in-depth interpretation:\n"[paste results/chart descriptions]"\n\nAnalyze from the following dimensions:\n1. Direct conclusions (what the data itself shows)\n2. Implicit meanings (scientific significance behind the data)\n3. Limitations (which factors may affect the reliability of conclusions)\n4. Comparison with existing literature (if reference information available)\n5. Suggestions for future research directions',
    description: 'Deep interpretation of experimental results with analysis of implicit meanings',
  },
  {
    id: '024',
    category: 'analysis',
    title: 'Overall Paper Weakness Diagnosis',
    template: 'Please review the following paper (or paper abstract/framework) as a top-journal reviewer:\n"[paste content]"\n\nOutput format (1-10 score per dimension):\n- Innovation + evaluation + improvement suggestions\n- Methodological rigor + evaluation + improvement suggestions\n- Experimental/argument sufficiency + evaluation + improvement suggestions\n- Writing and structure + evaluation + improvement suggestions\n- Reference quality + evaluation + improvement suggestions\n- Overall score\n- Recommendation: accept/reject',
    description: 'Comprehensive paper diagnosis from a top-journal reviewer\'s perspective',
  },
  {
    id: '025',
    category: 'analysis',
    title: 'Cited Literature Analysis',
    template: 'Please analyze the usage quality of the following references in the paper:\n"[paste reference list]"\n\nAnalyze from the following angles:\n1. Is the distribution of literature age reasonable?\n2. Does it cover core classic literature in the field?\n3. Are there obvious literature gaps?\n4. Evaluation of the authority of source journals\n5. Suggested high-citation/important literature to add',
    description: 'Analyze the quality and coverage of cited references',
  },
  {
    id: '026',
    category: 'analysis',
    title: 'Argument Logic Chain Analysis',
    template: 'Please analyze the argumentation logic of the following paragraph/chapter:\n"[paste content]"\n\nAnalysis requirements:\n1. Map the logical argument chain (premise → reasoning → conclusion)\n2. Identify logical fallacies in the argument (if any)\n3. Point out areas where evidence is insufficient to support conclusions\n4. Suggestions for strengthening the argument chain\n5. Evaluate overall persuasiveness',
    description: 'Analyze argument logic chains and identify logical fallacies',
  },
  {
    id: '027',
    category: 'analysis',
    title: 'Connection to Latest Literature',
    template: 'Here is a list of important papers published in the last two years related to this topic:\n"[paste latest literature list]"\n\nPlease analyze:\n1. The relationship between my research and the latest developments in this field\n2. Whether my research has been surpassed or complemented by the latest studies\n3. Which new literature should be cited in the Introduction or Discussion\n4. Whether my research conclusions need revision based on the latest literature',
    description: 'Analyze connection to latest literature with suggested citations',
  },
  {
    id: '028',
    category: 'analysis',
    title: 'Statistical Methods Check',
    template: 'Please check the following statistical analysis section for common errors:\n"[paste statistical method description and results]"\n\nChecklist:\n- Was normality test performed?\n- Is variance homogeneity satisfied?\n- Was multiple comparison correction (Bonferroni/FDR, etc.) applied?\n- Is effect size reported?\n- Are confidence intervals provided?\n- Is sample size sufficient (power analysis)?\n- Any suspicion of p-hacking?\n- Is missing data handling reasonable?',
    description: 'Check for common errors in statistical analysis methods',
  },
  {
    id: '029',
    category: 'analysis',
    title: 'Figure/Chart Quality Assessment',
    template: 'Please evaluate the academic quality of the following paper figures/charts:\n"[paste figure/chart title/description/caption]"\n\nAssessment dimensions:\n1. Self-sufficiency (can it be understood without the main text?)\n2. Is the visual design clear and non-misleading?\n3. Are axes, legends, and annotations complete and correct?\n4. Are there better data visualization alternatives?\n5. Does it comply with the target journal\'s figure guidelines?',
    description: 'Assess academic quality and design of paper figures/charts',
  },
  {
    id: '030',
    category: 'analysis',
    title: 'Limitations Analysis and Future Directions',
    template: 'Based on the following paper content, systematically list the limitations of this study, and for each limitation propose feasible future research directions:\n"[paste paper content or key findings]"\n\nFormat:\n| Limitation | Severity | Impact on Conclusions | Future Improvement Direction |\n|------------|----------|----------------------|-----------------------------|\n\nList at least 5 limitations with corresponding future directions.',
    description: 'Systematically analyze research limitations and propose future directions',
  },

  // ===== 4. Writing Assistance =====
  {
    id: '031',
    category: 'writing',
    title: 'Introduction Writing · Funnel Structure',
    template: 'Please draft the introduction paragraphs for my paper using a funnel structure (from broad to narrow):\n1. First paragraph (broad background): [enter broad background, e.g., industry development/social need]\n2. Second paragraph (focusing on the problem): What gaps exist in existing research on [enter specific problem]?\n3. Third paragraph (our approach): This paper proposes [enter method] to address [enter goal]\n4. Fourth paragraph (contribution summary): The three main contributions of this paper are…\n\nWord count: about 500-800 words. Please provide 3 different versions for each paragraph.',
    description: 'Draft paper introduction using funnel structure',
  },
  {
    id: '032',
    category: 'writing',
    title: 'Literature Review Generation · Theme Clustering',
    template: 'Please help me generate a literature review of 400-600 words on [enter research topic]. Organize it by theme clusters rather than listing paper by paper. My focused sub-directions are:\n- [Sub-direction 1]\n- [Sub-direction 2]\n- [Sub-direction 3]\n\nPlease include a table at the end summarizing representative work, methods, and limitations for each direction.',
    description: 'Generate literature review organized by theme clusters',
  },
  {
    id: '033',
    category: 'writing',
    title: 'Literature Review · Historical Evolution',
    template: 'Please write a literature review for [enter field] following the timeline of historical evolution. Requirements:\n- Divide into 3-4 developmental stages\n- For each stage, identify key milestone papers and their contributions\n- Point out the limitations and turning points of each stage\n- Conclude with current research frontiers and open questions\n\nWord count: about 800 words. My existing references: [optional: paste key papers]',
    description: 'Write literature review following chronological evolution',
  },
  {
    id: '034',
    category: 'writing',
    title: 'Methods Section Writing',
    template: 'Based on the following information, write the Methods section of my paper (in English, about 300-400 words):\n- Data/sample source: [enter source]\n- Experiment/data collection process: [enter process]\n- Key metrics/variables: [enter metrics]\n- Data analysis method: [enter method]\n- Statistical tools: [enter tools, e.g., SPSS/Python/R]\n\nLanguage requirements: clear, precise, reproducible. Use past tense.',
    description: 'Write English Methods section (300-400 words)',
  },
  {
    id: '035',
    category: 'writing',
    title: 'Results Section Writing',
    template: 'Based on the following data and key points, write the Results section of my paper (300-500 words):\n- Key finding 1: [enter finding and data]\n- Key finding 2: [enter finding and data]\n- Key finding 3: [enter finding and data]\n- Supporting/negative findings: [if any]\n\nRequirements: state facts objectively without interpretation, include appropriate transitions and summary sentences. Each paragraph corresponds to one figure/table (label as Figure/Table X).',
    description: 'Objectively write Results section with figure/table references',
  },
  {
    id: '036',
    category: 'writing',
    title: 'Discussion Section Writing',
    template: 'Based on the following content, draft the Discussion section of my paper (500-800 words):\n- Summary of key findings: [enter core findings]\n- Comparison with existing literature: [enter comparison info]\n- Unexpected findings and explanations: [if any]\n- Limitations: [enter limitations]\n- Theoretical and practical implications: [enter implications]\n\nSuggested structure:\n1. Briefly restate key findings (1-2 sentences)\n2. Compare with existing literature (develop argument)\n3. Limitations and alternative explanations\n4. Theoretical and practical implications\n5. Suggestions for future work',
    description: 'Write Discussion section with comparison to existing literature',
  },
  {
    id: '037',
    category: 'writing',
    title: 'Conclusion Writing',
    template: 'Please write the Conclusion section (200-300 words) for my paper. Requirements:\n1. Summarize core findings (1-2 sentences)\n2. Highlight theoretical/practical contributions (2-3 sentences)\n3. Note limitations (1-2 sentences)\n4. Look forward to future directions (2-3 sentences)\n\nCore information: [enter your core conclusions]',
    description: 'Write conclusion section summarizing findings and future outlook',
  },
  {
    id: '038',
    category: 'writing',
    title: 'Title Generation (A/B Test Optimization)',
    template: 'Based on the following paper content, generate 10 alternative paper titles:\n- 5 academic style (high information density, accurate terminology)\n- 3 impact style (eye-catching, suitable for high-impact journals)\n- 2 conversational style (suitable for preprints/social media)\n\nPapers core content: [enter title/abstract/key findings]\n\nAlso provide a brief pros/cons analysis for each title.',
    description: 'Generate 10 alternative titles with pros/cons analysis',
  },
  {
    id: '039',
    category: 'writing',
    title: 'Keyword Recommendations',
    template: 'Please recommend 6-8 keywords for my paper. Requirements:\n- First 2 are core domain terms (covering broad categories)\n- Next 3-4 are specific techniques/methods/concepts\n- Last 1-2 are emerging/hot frontier terms\n\nPapers info: [enter title + abstract]\n\nAlso recommend 3 alternative keywords (as backup if the first set is taken).',
    description: 'Recommend 6-8 keywords + 3 backups',
  },
  {
    id: '040',
    category: 'writing',
    title: 'Cover Letter Writing',
    template: 'Please help me write a Cover Letter for journal submission. Target journal: [enter journal name]. Manuscript title: [enter title]. Please include:\n1. Editor salutation (Dear Editor,)\n2. Submission statement\n3. Description of innovation and fit with journal scope (2-3 paragraphs)\n4. Statement of non-duplicate publication and no conflict of interest\n5. Suggested reviewers (if applicable)\n6. Closing\n\nAlso provide 3 suggested reviewers and 3 reviewers to avoid, with reasoning.',
    description: 'Write journal submission Cover Letter + reviewer recommendations',
  },

  // ===== 5. Productivity =====
  {
    id: '041',
    category: 'productivity',
    title: 'Reference Formatting',
    template: 'Please convert the following reference information to [APA 7th / MLA 9th / Chicago / GB/T 7714] format:\n"[paste original reference information]"\n\nProcess at least 5 entries in batch, checking each for standard completeness (journal name italicized, author name abbreviation correct, DOI present, etc.).',
    description: 'Batch format references to specified format',
  },
  {
    id: '042',
    category: 'productivity',
    title: 'Paper Structure Planning · Outline Generation',
    template: 'I am writing an academic paper on [enter topic] for target journal [enter journal]. Please help me design a detailed paper outline, including every section (section) and subsection with core points for each subsection. Type: [research paper / review / short communication / case report]. Target word count: about [enter word count]. Number of figures/tables: about [enter number].',
    description: 'Generate detailed paper outline (with subsections and key points)',
  },
  {
    id: '043',
    category: 'productivity',
    title: 'Response to Reviewers',
    template: 'Here are the reviewers\' comments and revision requests. Please help me draft a point-by-point response:\n\n**Reviewer 1 Comments:**\n- Comment 1: "[paste comment 1]"\n- Comment 2: "[paste comment 2]"\n\n**Reviewer 2 Comments:**\n- Comment 3: "[paste comment 3]"\n\nResponse template requirements:\n- Thank each comment first, then explain what was changed\n- Start with "We thank the reviewer for this comment."\n- Specify revision location (Page X, Line Y-Z)\n- If disagreeing, politely explain reasoning with cited literature\n- Tone: formal, respectful, humble',
    description: 'Draft point-by-point reviewer responses',
  },
  {
    id: '044',
    category: 'productivity',
    title: 'Post-Plagiarism-Check Revision Strategy',
    template: 'My plagiarism check report shows a high similarity rate (X%, exceeding the journal\'s requirement of Y%). The main overlaps come from the following paragraphs:\n"[paste high-similarity paragraphs]"\n\nPlease provide targeted revision strategies for these paragraphs:\n1. If methodology description — try rewriting the experimental process in your own words\n2. If literature review — try reorganizing the literature clustering approach\n3. If introduction — change the order of discussion and the angle of introduction\n\nProvide specific revision plans for each paragraph.',
    description: 'Provide targeted revision strategies for high-similarity paragraphs',
  },
  {
    id: '045',
    category: 'productivity',
    title: 'Grant Application Abstract Writing',
    template: 'Please write an abstract of under 300 words for my grant application. Grant type: [NSFC general/youth/regional/key]. Project name: [enter name]. Research content: [enter content]. Innovation points: [enter innovations]. Expected outcomes: [enter outcomes]\n\nRequirements: highlight scientific significance and innovation, use concise and powerful language, make it understandable to reviewers outside the field.',
    description: 'Write grant application abstract (under 300 words)',
  },
  {
    id: '046',
    category: 'productivity',
    title: 'Academic PPT/Demo Content Extraction',
    template: 'I need to create a PPT for a 15-minute academic presentation. Please extract the following paper content into key points for a 15-slide PPT (including Title and Thank-you slides):\n"[paste full paper or key content]"\n\nPer slide format: "Slide N - Title | Key points (3-5 bullet points) | Suggested visual type"\nIndicate which slides need extra time for detailed explanation.',
    description: 'Extract key points for 15-slide academic presentation PPT',
  },
  {
    id: '047',
    category: 'productivity',
    title: 'Academic Email Writing',
    template: 'Please help me write an academic email.\n\n**Scenario:** [Journal inquiry / Requesting full paper / Applying for postdoc/PhD position / Inviting collaboration / Academic conference inquiry]\n**Recipient:** [Professor/Editor/Journal office] Name: [enter name]\n**Subject:** [enter subject]\n**Key points:** [enter key points]\n\nTone requirements: polite, professional, concise. Provide both a formal version and a concise version.',
    description: 'Write formal and concise versions of academic emails',
  },
  {
    id: '048',
    category: 'productivity',
    title: 'LaTeX Template and Format Check',
    template: 'Please check the following LaTeX code snippet for format issues and improvement suggestions:\n"[paste LaTeX code]"\n\nCheck items:\n- Is reference format correct?\n- Are figure/table references using cross-references?\n- Is mathematical notation properly written?\n- Are there common typesetting issues (missing \\, overly long lines, etc.)?\n- Are there missing packages or commands?',
    description: 'Check LaTeX code for format issues and provide suggestions',
  },
  {
    id: '049',
    category: 'productivity',
    title: 'Academic Debate · Dual-Side Argument Generation',
    template: 'I need to discuss a controversial viewpoint in my paper: "[enter controversial topic]".\n\nPlease help me generate:\n1. Pro arguments (academic basis supporting the viewpoint, 3-4 points)\n2. Con arguments (academic basis opposing the viewpoint, 3-4 points)\n3. Neutral/synthesizing arguments (how to integrate both sides, 2-3 points)\n4. Representative references for each argument (as real and usable as possible)\n\nLabel the strength of each argument (strong/medium/weak).',
    description: 'Generate pro/con arguments + references',
  },
  {
    id: '050',
    category: 'productivity',
    title: 'Pre-Submission Self-Checklist',
    template: 'Based on the requirements of [target journal name], please generate a final pre-submission checklist for me. I provide the following information: paper topic: [enter topic]; format requirements: [e.g., double-column/single-column/word limit, etc.]. Please generate a checklist with the following categories (5-10 items per category):\n\n- Format specifications (font size, line spacing, margins, etc.)\n- Content completeness (IMRaD structure, declarations, acknowledgments, etc.)\n- Figure/table quality (resolution, format, captions)\n- References (format, completeness, currency)\n- Language polish (grammar, terminology, consistency)\n- Ethics and copyright (informed consent, citation permissions, etc.)\n\nMark each item as "Required" or "Recommended".',
    description: 'Generate final pre-submission checklist',
  },
]

export const categories = [
  { key: 'summary', label: '📋 Summary', labelEn: 'Summary' },
  { key: 'rewrite', label: '✏️ Rewrite', labelEn: 'Rewrite' },
  { key: 'analysis', label: '🔍 Analysis', labelEn: 'Analysis' },
  { key: 'writing', label: '📝 Writing', labelEn: 'Writing' },
  { key: 'productivity', label: '⚡ Productivity', labelEn: 'Productivity' },
] as const

export const categoryMap: Record<string, Prompt['category']> = {
  summary: 'summary',
  rewrite: 'rewrite',
  analysis: 'analysis',
  writing: 'writing',
  productivity: 'productivity',
}

export function getPromptsByCategory(category: string): Prompt[] {
  return prompts.filter(p => p.category === category)
}

export function getPromptById(id: string): Prompt | undefined {
  return prompts.find(p => p.id === id)
}
