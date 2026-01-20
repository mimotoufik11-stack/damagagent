package com.myteam.ayah.util;

import com.myteam.ayah.domain.model.QuranVerse;
import com.myteam.ayah.domain.model.QuranMatch;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Handles matching of ASR (Automatic Speech Recognition) segments with Quran verses.
 * Uses sliding window tokenization and similarity scoring to find the best matches.
 */
public class QuranMatcher {
    
    private static final int MIN_TOKEN_COUNT = 5;
    private static final int MAX_TOKEN_COUNT = 12;
    private static final double CONFIDENCE_THRESHOLD = 0.7;
    
    private List<QuranVerse> quranVerses;
    private Map<String, List<QuranVerse>> tokenIndex;
    
    public QuranMatcher(List<QuranVerse> quranVerses) {
        this.quranVerses = quranVerses;
        this.tokenIndex = buildTokenIndex();
    }
    
    /**
     * Matches an ASR segment with Quran verses.
     * 
     * @param asrText The recognized text from speech recognition
     * @param startMs Start time of the segment in milliseconds
     * @param endMs End time of the segment in milliseconds
     * @param confidence ASR confidence score
     * @return List of possible matches sorted by confidence
     */
    public List<QuranMatch> matchSegment(String asrText, long startMs, long endMs, float confidence) {
        if (asrText == null || asrText.trim().isEmpty()) {
            return new ArrayList<>();
        }
        
        String normalizedAsr = ArabicNormalizer.normalize(asrText);
        if (normalizedAsr.isEmpty()) {
            return new ArrayList<>();
        }
        
        List<String> tokens = ArabicNormalizer.tokenize(normalizedAsr);
        if (tokens.size() < MIN_TOKEN_COUNT) {
            return new ArrayList<>();
        }
        
        List<QuranMatch> candidates = new ArrayList<>();
        
        // Try different window sizes
        for (int windowSize = Math.min(MAX_TOKEN_COUNT, tokens.size()); 
             windowSize >= MIN_TOKEN_COUNT; windowSize--) {
            
            for (int start = 0; start <= tokens.size() - windowSize; start++) {
                List<String> window = tokens.subList(start, start + windowSize);
                List<QuranMatch> windowMatches = findMatchesForWindow(window, startMs, endMs, confidence);
                candidates.addAll(windowMatches);
            }
        }
        
        // Sort candidates by confidence and remove duplicates
        candidates.sort((a, b) -> Double.compare(b.confidence, a.confidence));
        
        return filterTopCandidates(candidates);
    }
    
    /**
     * Finds matches for a specific token window.
     */
    private List<QuranMatch> findMatchesForWindow(List<String> tokens, long startMs, long endMs, float asrConfidence) {
        List<QuranMatch> matches = new ArrayList<>();
        
        // Build token signature for this window
        String tokenSignature = String.join(" ", tokens);
        
        // Search in token index
        for (String token : tokens) {
            List<QuranVerse> candidateVerses = tokenIndex.get(token);
            if (candidateVerses == null) continue;
            
            for (QuranVerse verse : candidateVerses) {
                QuranMatch match = calculateMatchScore(verse, tokens, startMs, endMs, asrConfidence);
                if (match != null && match.confidence >= CONFIDENCE_THRESHOLD) {
                    matches.add(match);
                }
            }
        }
        
        return matches;
    }
    
    /**
     * Calculates match score between tokens and a verse.
     */
    private QuranMatch calculateMatchScore(QuranVerse verse, List<String> tokens, 
                                          long startMs, long endMs, float asrConfidence) {
        String normalizedVerse = ArabicNormalizer.normalize(verse.text);
        List<String> verseTokens = ArabicNormalizer.tokenize(normalizedVerse);
        
        if (verseTokens.isEmpty()) {
            return null;
        }
        
        // Calculate token overlap
        int overlapCount = 0;
        for (String token : tokens) {
            if (verseTokens.contains(token)) {
                overlapCount++;
            }
        }
        
        // Calculate edit distance
        double editDistanceScore = calculateEditDistanceScore(tokens, verseTokens);
        
        // Calculate Jaccard similarity
        double jaccardScore = ArabicNormalizer.calculateSimilarity(
            String.join(" ", tokens), normalizedVerse);
        
        // Weighted final score
        double confidence = (overlapCount * 0.4 + editDistanceScore * 0.3 + jaccardScore * 0.3) * asrConfidence;
        
        if (confidence < CONFIDENCE_THRESHOLD) {
            return null;
        }
        
        return new QuranMatch(
            verse.surahId,
            verse.ayahId,
            verse.text,
            startMs,
            endMs,
            (float) confidence,
            tokens,
            verseTokens
        );
    }
    
    /**
     * Calculates edit distance-based similarity score.
     */
    private double calculateEditDistanceScore(List<String> tokens1, List<String> tokens2) {
        if (tokens1.isEmpty() || tokens2.isEmpty()) {
            return 0.0;
        }
        
        int maxLen = Math.max(tokens1.size(), tokens2.size());
        int editDistance = levenshteinDistance(tokens1, tokens2);
        
        return Math.max(0.0, 1.0 - (double) editDistance / maxLen);
    }
    
    /**
     * Levenshtein distance algorithm for token lists.
     */
    private int levenshteinDistance(List<String> tokens1, List<String> tokens2) {
        int m = tokens1.size();
        int n = tokens2.size();
        
        int[][] dp = new int[m + 1][n + 1];
        
        for (int i = 0; i <= m; i++) {
            dp[i][0] = i;
        }
        
        for (int j = 0; j <= n; j++) {
            dp[0][j] = j;
        }
        
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                int cost = tokens1.get(i - 1).equals(tokens2.get(j - 1)) ? 0 : 1;
                dp[i][j] = Math.min(
                    Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1),
                    dp[i - 1][j - 1] + cost
                );
            }
        }
        
        return dp[m][n];
    }
    
    /**
     * Builds a token index for efficient verse lookup.
     */
    private Map<String, List<QuranVerse>> buildTokenIndex() {
        Map<String, List<QuranVerse>> index = new HashMap<>();
        
        for (QuranVerse verse : quranVerses) {
            List<String> tokens = ArabicNormalizer.tokenize(verse.text);
            for (String token : tokens) {
                if (!index.containsKey(token)) {
                    index.put(token, new ArrayList<>());
                }
                index.get(token).add(verse);
            }
        }
        
        return index;
    }
    
    /**
     * Filters and removes duplicate candidates, keeping only the best matches.
     */
    private List<QuranMatch> filterTopCandidates(List<QuranMatch> candidates) {
        List<QuranMatch> filtered = new ArrayList<>();
        
        for (QuranMatch candidate : candidates) {
            boolean isDuplicate = false;
            for (QuranMatch existing : filtered) {
                if (existing.surahId == candidate.surahId && 
                    existing.ayahId == candidate.ayahId) {
                    isDuplicate = true;
                    break;
                }
            }
            
            if (!isDuplicate) {
                filtered.add(candidate);
            }
        }
        
        // Limit to top 10 candidates
        if (filtered.size() > 10) {
            filtered = filtered.subList(0, 10);
        }
        
        return filtered;
    }
    
    /**
     * Finds the best match from a list of candidates.
     */
    public QuranMatch findBestMatch(List<QuranMatch> candidates) {
        if (candidates.isEmpty()) {
            return null;
        }
        
        return Collections.max(candidates, new Comparator<QuranMatch>() {
            @Override
            public int compare(QuranMatch a, QuranMatch b) {
                return Double.compare(a.confidence, b.confidence);
            }
        });
    }
}