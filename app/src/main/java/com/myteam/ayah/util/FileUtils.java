package com.myteam.ayah.util;

import android.content.Context;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.IOException;

public class FileUtils {
    
    /**
     * Copies a file from source to destination.
     */
    public static void copyFile(File source, File destination) throws IOException {
        FileInputStream fis = new FileInputStream(source);
        FileOutputStream fos = new FileOutputStream(destination);
        
        byte[] buffer = new byte[8192];
        int bytesRead;
        
        while ((bytesRead = fis.read(buffer)) != -1) {
            fos.write(buffer, 0, bytesRead);
        }
        
        fis.close();
        fos.close();
    }
    
    /**
     * Writes text content to a file.
     */
    public static void writeTextToFile(File file, String content) throws IOException {
        FileOutputStream fos = new FileOutputStream(file);
        fos.write(content.getBytes());
        fos.close();
    }
    
    /**
     * Reads text content from a file.
     */
    public static String readTextFromFile(File file) throws IOException {
        StringBuilder content = new StringBuilder();
        FileInputStream fis = new FileInputStream(file);
        BufferedReader reader = new BufferedReader(new InputStreamReader(fis));
        
        String line;
        while ((line = reader.readLine()) != null) {
            content.append(line).append("\n");
        }
        
        reader.close();
        fis.close();
        
        return content.toString();
    }
    
    /**
     * Reads text content from an asset file.
     */
    public static String readTextFromAsset(Context context, String assetPath) throws IOException {
        StringBuilder content = new StringBuilder();
        InputStream is = context.getAssets().open(assetPath);
        BufferedReader reader = new BufferedReader(new InputStreamReader(is));
        
        String line;
        while ((line = reader.readLine()) != null) {
            content.append(line).append("\n");
        }
        
        reader.close();
        is.close();
        
        return content.toString();
    }
    
    /**
     * Creates a directory if it doesn't exist.
     */
    public static void createDirectory(File directory) {
        if (!directory.exists()) {
            directory.mkdirs();
        }
    }
    
    /**
     * Deletes a file or directory recursively.
     */
    public static boolean deleteRecursive(File fileOrDirectory) {
        if (fileOrDirectory.isDirectory()) {
            File[] files = fileOrDirectory.listFiles();
            if (files != null) {
                for (File file : files) {
                    deleteRecursive(file);
                }
            }
        }
        return fileOrDirectory.delete();
    }
}