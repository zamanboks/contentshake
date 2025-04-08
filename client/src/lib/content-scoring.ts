// Basic content scoring algorithm
export function scoreContent(content: string, keywords: string[]): number {
  if (!content || !keywords || keywords.length === 0) {
    return 0;
  }

  const contentLower = content.toLowerCase();
  const wordCount = content.split(/\s+/).length;
  let score = 0;

  // Check for minimum word count (at least 300 words)
  if (wordCount >= 300) {
    score += 20;
  } else {
    score += (wordCount / 300) * 20;
  }

  // Check for ideal word count (around 800-1500 words)
  if (wordCount >= 800 && wordCount <= 1500) {
    score += 15;
  } else if (wordCount > 1500) {
    score += 10;
  } else {
    score += (wordCount / 800) * 15;
  }

  // Check for keywords presence
  let keywordScore = 0;
  const maxKeywordScore = 25;
  const keywordDensityTarget = 0.02; // 2% keyword density target

  for (const keyword of keywords) {
    const keywordLower = keyword.toLowerCase();
    const keywordCount = (contentLower.match(new RegExp('\\b' + keywordLower + '\\b', 'g')) || []).length;
    const keywordDensity = keywordCount / wordCount;

    // Calculate score based on keyword presence and density
    if (keywordCount > 0) {
      if (keywordDensity <= keywordDensityTarget) {
        // Ideal density
        keywordScore += (maxKeywordScore / keywords.length) * (keywordDensity / keywordDensityTarget);
      } else {
        // Keyword stuffing penalty
        keywordScore += (maxKeywordScore / keywords.length) * (keywordDensityTarget / keywordDensity);
      }
    }
  }

  score += keywordScore;

  // Check for heading structure (h1, h2, h3)
  const h1Count = (content.match(/<h1>|<H1>|# /g) || []).length;
  const h2Count = (content.match(/<h2>|<H2>|## /g) || []).length;
  const h3Count = (content.match(/<h3>|<H3>|### /g) || []).length;

  if (h1Count === 1) {
    score += 10; // One main heading
  }
  
  if (h2Count >= 2) {
    score += 10; // At least 2 subheadings
  } else {
    score += h2Count * 5;
  }
  
  if (h3Count >= 2) {
    score += 5; // Some sub-subheadings
  } else {
    score += h3Count * 2.5;
  }

  // Check for paragraphs (reasonable length)
  const paragraphs = content.split(/\n\n+/);
  const reasonableParagraphCount = paragraphs.filter(p => {
    const words = p.trim().split(/\s+/).length;
    return words > 20 && words < 150;
  }).length;

  if (paragraphs.length > 0) {
    score += 10 * (reasonableParagraphCount / paragraphs.length);
  }

  // Check for links
  const linkCount = (content.match(/<a\s|http/g) || []).length;
  if (linkCount > 0 && linkCount <= 5) {
    score += 5;
  } else if (linkCount > 5) {
    score += 5 * (5 / linkCount); // Diminishing returns for too many links
  }

  // Round the score and ensure it's between 0 and 100
  return Math.min(100, Math.max(0, Math.round(score)));
}

export function getScoreColor(score: number): string {
  if (score >= 90) return 'bg-green-500';
  if (score >= 70) return 'bg-yellow-500';
  if (score >= 50) return 'bg-orange-500';
  return 'bg-red-500';
}

export function getScoreTextColor(score: number): string {
  if (score >= 90) return 'text-green-600';
  if (score >= 70) return 'text-yellow-600';
  if (score >= 50) return 'text-orange-600';
  return 'text-red-600';
}

export function getScoringFeedback(score: number, content: string, keywords: string[]): string[] {
  const feedback: string[] = [];
  const wordCount = content.split(/\s+/).length;
  
  // Word count feedback
  if (wordCount < 300) {
    feedback.push('Content is too short. Aim for at least 300 words.');
  } else if (wordCount < 800) {
    feedback.push('Consider adding more content. Optimal length is 800-1500 words.');
  } else if (wordCount > 2000) {
    feedback.push('Content may be too long. Consider breaking it into multiple pieces.');
  } else {
    feedback.push('Word count is good.');
  }
  
  // Heading structure feedback
  const h1Count = (content.match(/<h1>|<H1>|# /g) || []).length;
  const h2Count = (content.match(/<h2>|<H2>|## /g) || []).length;
  
  if (h1Count === 0) {
    feedback.push('Missing main heading (H1). Add a clear title to your content.');
  } else if (h1Count > 1) {
    feedback.push('Too many main headings. Use only one H1 per page.');
  }
  
  if (h2Count < 2) {
    feedback.push('Add more subheadings (H2) to structure your content better.');
  }
  
  // Keyword usage feedback
  for (const keyword of keywords) {
    const keywordLower = keyword.toLowerCase();
    const keywordCount = (content.toLowerCase().match(new RegExp('\\b' + keywordLower + '\\b', 'g')) || []).length;
    const keywordDensity = keywordCount / wordCount;
    
    if (keywordCount === 0) {
      feedback.push(`Keyword "${keyword}" not found in the content.`);
    } else if (keywordDensity > 0.03) {
      feedback.push(`Keyword "${keyword}" appears too frequently (${(keywordDensity * 100).toFixed(1)}%). Aim for 1-2%.`);
    }
  }
  
  // Paragraph structure feedback
  const paragraphs = content.split(/\n\n+/);
  const longParagraphs = paragraphs.filter(p => p.trim().split(/\s+/).length > 150).length;
  
  if (longParagraphs > 0) {
    feedback.push(`${longParagraphs} paragraph(s) are too long. Break them into smaller chunks for better readability.`);
  }
  
  return feedback;
}
