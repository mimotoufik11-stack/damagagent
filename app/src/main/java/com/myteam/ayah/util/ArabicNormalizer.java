package com.myteam.ayah.util;

/**
 * Utility class for normalizing Arabic text for Quran matching.
 * Removes tashkeel, normalizes letters, and handles various Arabic text variations.
 */
public class ArabicNormalizer {
    
    // Mapping of various Arabic characters to their normalized forms
    private static final java.util.HashMap<Character, Character> CHARACTER_MAP = new java.util.HashMap<>();
    
    static {
        // Normalize different forms of Alif
        CHARACTER_MAP.put('أ', 'ا');
        CHARACTER_MAP.put('إ', 'ا');
        CHARACTER_MAP.put('آ', 'ا');
        
        // Normalize Ya and Maqsurah Ya
        CHARACTER_MAP.put('ى', 'ي');
        
        // Normalize Ta Marbuta
        CHARACTER_MAP.put('ة', 'ه');
        
        // Normalize Hamza forms
        CHARACTER_MAP.put('ؤ', 'و');
        CHARACTER_MAP.put('ئ', 'ي');
        CHARACTER_MAP.put('ء', 'ا');
    }
    
    /**
     * Normalizes Arabic text by removing tashkeel, normalizing letters, and cleaning whitespace.
     * 
     * @param text The Arabic text to normalize
     * @return Normalized text suitable for comparison
     */
    public static String normalize(String text) {
        if (text == null || text.isEmpty()) {
            return "";
        }
        
        StringBuilder normalized = new StringBuilder();
        
        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            
            // Skip tashkeel (diacritical marks)
            if (isTashkeel(c)) {
                continue;
            }
            
            // Remove tatweel (horizontal line)
            if (c == 'ـ') {
                continue;
            }
            
            // Normalize characters using the mapping
            if (CHARACTER_MAP.containsKey(c)) {
                c = CHARACTER_MAP.get(c);
            }
            
            // Handle punctuation and numbers
            if (isPunctuationOrNumber(c)) {
                continue;
            }
            
            normalized.append(c);
        }
        
        // Clean up extra spaces
        String result = normalized.toString().replaceAll("\\s+", " ").trim();
        
        return result.toLowerCase();
    }
    
    /**
     * Checks if a character is a tashkeel (diacritical mark).
     * 
     * @param c The character to check
     * @return true if the character is a tashkeel mark
     */
    private static boolean isTashkeel(char c) {
        return c >= 0x064B && c <= 0x065F || // Arabic diacritical marks
               c == 0x0670 || // Arabic superscript alef
               c == 0x0671; // Arabic word separator tatweel
    }
    
    /**
     * Checks if a character is punctuation or a number.
     * 
     * @param c The character to check
     * @return true if the character is punctuation or a number
     */
    private static boolean isPunctuationOrNumber(char c) {
        return (c >= '0' && c <= '9') || // Numbers
               c == '.' || c == ',' || c == '!' || c == '?' || // Basic punctuation
               c == '?' || c == '!' || c == ':' || c == ';' || // More punctuation
               c == '(' || c == ')' || c == '[' || c == ']' || // Brackets
               c == '{' || c == '}' || c == '"' || c == '\'' || // Quote marks
               c == '\\' || c == '/' || c == '|' || c == '-' || // Special chars
               c == '_' || c == '+' || c == '=' || c == '*'; // More special chars
    }
    
    /**
     * Splits text into tokens for matching algorithms.
     * 
     * @param text The text to tokenize
     * @return List of tokens
     */
    public static java.util.List<String> tokenize(String text) {
        String normalized = normalize(text);
        if (normalized.isEmpty()) {
            return new java.util.ArrayList<>();
        }
        
        // Split by spaces and filter empty tokens
        String[] tokens = normalized.split("\\s+");
        java.util.List<String> result = new java.util.ArrayList<>();
        
        for (String token : tokens) {
            if (!token.isEmpty()) {
                result.add(token);
            }
        }
        
        return result;
    }
    
    /**
     * Calculates the similarity score between two normalized Arabic texts.
     * Uses Jaccard similarity coefficient.
     * 
     * @param text1 First text
     * @param text2 Second text
     * @return Similarity score between 0.0 and 1.0
     */
    public static double calculateSimilarity(String text1, String text2) {
        if (text1 == null || text2 == null) {
            return 0.0;
        }
        
        String norm1 = normalize(text1);
        String norm2 = normalize(text2);
        
        if (norm1.isEmpty() && norm2.isEmpty()) {
            return 1.0;
        }
        
        if (norm1.isEmpty() || norm2.isEmpty()) {
            return 0.0;
        }
        
        java.util.Set<String> set1 = new java.util.HashSet<>(tokenize(norm1));
        java.util.Set<String> set2 = new java.util.HashSet<>(tokenize(norm2));
        
        java.util.Set<String> intersection = new java.util.HashSet<>(set1);
        intersection.retainAll(set2);
        
        java.util.Set<String> union = new java.util.HashSet<>(set1);
        union.addAll(set2);
        
        if (union.isEmpty()) {
            return 0.0;
        }
        
        return (double) intersection.size() / (double) union.size();
    }
}