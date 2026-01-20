package com.myteam.ayah.domain.usecase;

import android.content.Context;
import android.net.Uri;
import com.myteam.ayah.AyahApp;
import com.myteam.ayah.data.db.AppDatabase;
import com.myteam.ayah.data.db.ProjectEntity;
import com.myteam.ayah.data.repository.ProjectRepository;
import com.myteam.ayah.domain.model.Project;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.Date;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class ImportVideoUseCase {
    private final ExecutorService executor;
    private final ProjectRepository projectRepository;
    
    public ImportVideoUseCase(Context context) {
        this.executor = Executors.newCachedThreadPool();
        AppDatabase database = AyahApp.getInstance().getDatabase();
        this.projectRepository = new ProjectRepository(database.projectDao());
    }
    
    public void importVideo(Uri videoUri, String title, ImportVideoCallback callback) {
        executor.execute(() -> {
            try {
                // Create project directory
                String projectId = UUID.randomUUID().toString();
                File projectDir = new File(AyahApp.getInstance().getFilesDir(), "projects/" + projectId);
                projectDir.mkdirs();
                
                // Copy video file
                File videoFile = new File(projectDir, "video.mp4");
                copyUriToFile(videoUri, videoFile);
                
                // Create thumbnail (placeholder for now)
                File thumbnailFile = new File(projectDir, "thumbnail.jpg");
                thumbnailFile.createNewFile();
                
                // Create project entity
                Project project = new Project();
                project.title = title != null ? title : "مشروع جديد";
                project.videoPath = videoFile.getAbsolutePath();
                project.audioPath = null; // Will be generated during processing
                project.thumbnailPath = thumbnailFile.getAbsolutePath();
                project.projectPath = projectDir.getAbsolutePath();
                project.createdAt = new Date();
                project.updatedAt = new Date();
                project.status = "draft";
                project.videoWidth = 0;
                project.videoHeight = 0;
                project.videoDurationMs = 0;
                project.aspectRatio = "original";
                
                projectRepository.insertProject(project, new ProjectRepository.ProjectRepositoryCallback<Long>() {
                    @Override
                    public void onSuccess(Long result) {
                        if (callback != null) {
                            callback.onSuccess(result);
                        }
                    }
                    
                    @Override
                    public void onError(String message) {
                        if (callback != null) {
                            callback.onError(message);
                        }
                    }
                });
                
            } catch (Exception e) {
                if (callback != null) {
                    callback.onError(e.getMessage());
                }
            }
        });
    }
    
    private void copyUriToFile(Uri uri, File destination) throws Exception {
        InputStream inputStream = AyahApp.getInstance().getContentResolver().openInputStream(uri);
        FileOutputStream outputStream = new FileOutputStream(destination);
        
        byte[] buffer = new byte[8192];
        int bytesRead;
        while ((bytesRead = inputStream.read(buffer)) != -1) {
            outputStream.write(buffer, 0, bytesRead);
        }
        
        inputStream.close();
        outputStream.close();
    }
    
    public interface ImportVideoCallback {
        void onSuccess(long projectId);
        void onError(String message);
    }
}