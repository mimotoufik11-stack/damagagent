package com.myteam.ayah.ui.adapter;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.myteam.ayah.R;
import java.util.ArrayList;
import java.util.List;

public class ProjectsAdapter extends RecyclerView.Adapter<ProjectsAdapter.ProjectViewHolder> {
    
    private List<ProjectItem> projects = new ArrayList<>();
    private OnProjectSelectedListener onProjectSelectedListener;
    private OnProjectDeletedListener onProjectDeletedListener;
    
    public ProjectsAdapter(OnProjectSelectedListener onProjectSelectedListener, 
                          OnProjectDeletedListener onProjectDeletedListener) {
        this.onProjectSelectedListener = onProjectSelectedListener;
        this.onProjectDeletedListener = onProjectDeletedListener;
    }
    
    @NonNull
    @Override
    public ProjectViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_project, parent, false);
        return new ProjectViewHolder(view);
    }
    
    @Override
    public void onBindViewHolder(@NonNull ProjectViewHolder holder, int position) {
        holder.bind(projects.get(position));
    }
    
    @Override
    public int getItemCount() {
        return projects.size();
    }
    
    public void setProjects(List<ProjectItem> projects) {
        this.projects = projects;
        notifyDataSetChanged();
    }
    
    class ProjectViewHolder extends RecyclerView.ViewHolder {
        private TextView titleTextView;
        private TextView dateTextView;
        private TextView editButton;
        private TextView deleteButton;
        
        public ProjectViewHolder(@NonNull View itemView) {
            super(itemView);
            
            titleTextView = itemView.findViewById(R.id.tv_title);
            dateTextView = itemView.findViewById(R.id.tv_date);
            editButton = itemView.findViewById(R.id.btn_edit);
            deleteButton = itemView.findViewById(R.id.btn_delete);
            
            itemView.setOnClickListener(v -> {
                if (onProjectSelectedListener != null && getAdapterPosition() != RecyclerView.NO_POSITION) {
                    onProjectSelectedListener.onProjectSelected(projects.get(getAdapterPosition()).id);
                }
            });
            
            editButton.setOnClickListener(v -> {
                if (onProjectSelectedListener != null && getAdapterPosition() != RecyclerView.NO_POSITION) {
                    onProjectSelectedListener.onProjectSelected(projects.get(getAdapterPosition()).id);
                }
            });
            
            deleteButton.setOnClickListener(v -> {
                if (onProjectDeletedListener != null && getAdapterPosition() != RecyclerView.NO_POSITION) {
                    onProjectDeletedListener.onProjectDeleted(projects.get(getAdapterPosition()).id);
                }
            });
        }
        
        public void bind(ProjectItem project) {
            titleTextView.setText(project.title);
            dateTextView.setText(project.createdDate);
        }
    }
    
    public interface OnProjectSelectedListener {
        void onProjectSelected(long projectId);
    }
    
    public interface OnProjectDeletedListener {
        void onProjectDeleted(long projectId);
    }
    
    public static class ProjectItem {
        public long id;
        public String title;
        public String createdDate;
        public String thumbnailPath;
        
        public ProjectItem(long id, String title, String createdDate, String thumbnailPath) {
            this.id = id;
            this.title = title;
            this.createdDate = createdDate;
            this.thumbnailPath = thumbnailPath;
        }
    }
}