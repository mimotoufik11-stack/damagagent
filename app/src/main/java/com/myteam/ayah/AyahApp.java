package com.myteam.ayah;

import android.app.Application;
import androidx.room.Room;
import androidx.work.Configuration;
import com.myteam.ayah.data.db.AppDatabase;
import timber.log.Timber;

public class AyahApp extends Application implements Configuration.Provider {

    private AppDatabase database;
    private static AyahApp instance;

    @Override
    public void onCreate() {
        super.onCreate();
        instance = this;

        // Initialize Timber for logging
        if (BuildConfig.DEBUG) {
            Timber.plant(new Timber.DebugTree());
        }

        // Initialize Room database
        database = Room.databaseBuilder(
                getApplicationContext(),
                AppDatabase.class,
                "ayah_database"
        ).build();
    }

    public static AyahApp getInstance() {
        return instance;
    }

    public AppDatabase getDatabase() {
        return database;
    }

    @Override
    public Configuration getWorkManagerConfiguration() {
        return new Configuration.Builder()
                .setMinimumLoggingLevel(android.util.Log.INFO)
                .build();
    }
}