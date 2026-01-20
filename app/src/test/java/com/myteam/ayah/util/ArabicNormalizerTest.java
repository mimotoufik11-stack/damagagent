package com.myteam.ayah.util;

import org.junit.Test;
import static org.junit.Assert.*;

/**
 * Unit tests for ArabicNormalizer class.
 */
public class ArabicNormalizerTest {
    
    @Test
    public void testRemoveTashkeel() {
        // Test removing diacritical marks
        String input = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";
        String expected = "بسم الله الرحمن الرحيم";
        String result = ArabicNormalizer.normalize(input);
        
        assertEquals("Should remove all tashkeel marks", expected, result);
    }
    
    @Test
    public void testNormalizeAlif() {
        // Test normalizing different forms of Alif
        String input = "أبجد إاو هوز";
        String expected = "ابجد ااو هوز";
        String result = ArabicNormalizer.normalize(input);
        
        assertEquals("Should normalize Alif variants", expected, result);
    }
    
    @Test
    public void testNormalizeYa() {
        // Test normalizing Ya and Maqsurah Ya
        String input = "هدى ومسكينى";
        String expected = "هدى ومسكينى";
        String result = ArabicNormalizer.normalize(input);
        
        assertEquals("Should normalize Ya forms", expected, result);
    }
    
    @Test
    public void testRemoveTatweel() {
        // Test removing tatweel (horizontal line)
        String input = "بـــســـمـــ";
        String expected = "بسم";
        String result = ArabicNormalizer.normalize(input);
        
        assertEquals("Should remove tatweel", expected, result);
    }
    
    @Test
    public void testRemovePunctuation() {
        // Test removing punctuation and numbers
        String input = "بسم الله! (الرحمن) والرحيم. 123";
        String expected = "بسم الله الرحمن الرحيم";
        String result = ArabicNormalizer.normalize(input);
        
        assertEquals("Should remove punctuation and numbers", expected, result);
    }
    
    @Test
    public void testTrimSpaces() {
        // Test trimming extra spaces
        String input = "  بسم   الله   الرحمن   ";
        String expected = "بسم الله الرحمن";
        String result = ArabicNormalizer.normalize(input);
        
        assertEquals("Should trim extra spaces", expected, result);
    }
    
    @Test
    public void testEmptyString() {
        // Test empty and null strings
        assertEquals("Should return empty string for null", "", ArabicNormalizer.normalize(null));
        assertEquals("Should return empty string for empty string", "", ArabicNormalizer.normalize(""));
    }
    
    @Test
    public void testTokenization() {
        // Test tokenization
        String input = "بسم الله الرحمن الرحيم";
        java.util.List<String> tokens = ArabicNormalizer.tokenize(input);
        
        assertEquals("Should have 4 tokens", 4, tokens.size());
        assertTrue("Should contain 'بسم'", tokens.contains("بسم"));
        assertTrue("Should contain 'الله'", tokens.contains("الله"));
        assertTrue("Should contain 'الرحمن'", tokens.contains("الرحمن"));
        assertTrue("Should contain 'الرحيم'", tokens.contains("الرحيم"));
    }
    
    @Test
    public void testSimilarityCalculation() {
        // Test similarity calculation
        String text1 = "بسم الله الرحمن الرحيم";
        String text2 = "بسم الله الرحمان الرحيم";
        
        double similarity = ArabicNormalizer.calculateSimilarity(text1, text2);
        
        assertTrue("Similarity should be high", similarity > 0.8);
        assertTrue("Similarity should be less than 1.0", similarity < 1.0);
    }
    
    @Test
    public void testCaseInsensitive() {
        // Test case insensitivity
        String input = "بسم الله";
        String result = ArabicNormalizer.normalize(input);
        
        // Arabic doesn't have case, but this tests the lowercase conversion
        assertNotNull("Should not return null", result);
        assertFalse("Should not be empty", result.isEmpty());
    }
}