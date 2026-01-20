package com.myteam.ayah.ui.adapter;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.myteam.ayah.R;
import com.myteam.ayah.domain.model.Segment;
import java.util.ArrayList;
import java.util.List;

public class TimelineSegmentAdapter extends RecyclerView.Adapter<TimelineSegmentAdapter.SegmentViewHolder> {
    
    private List<Segment> segments = new ArrayList<>();
    private OnSegmentSelectedListener onSegmentSelectedListener;
    
    public TimelineSegmentAdapter(OnSegmentSelectedListener listener) {
        this.onSegmentSelectedListener = listener;
    }
    
    @NonNull
    @Override
    public SegmentViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_timeline_segment, parent, false);
        return new SegmentViewHolder(view);
    }
    
    @Override
    public void onBindViewHolder(@NonNull SegmentViewHolder holder, int position) {
        holder.bind(segments.get(position));
    }
    
    @Override
    public int getItemCount() {
        return segments.size();
    }
    
    public void setSegments(List<Segment> segments) {
        this.segments = segments;
        notifyDataSetChanged();
    }
    
    class SegmentViewHolder extends RecyclerView.ViewHolder {
        private TextView textTextView;
        private TextView timeTextView;
        private TextView confidenceTextView;
        private View confidenceBadge;
        
        public SegmentViewHolder(@NonNull View itemView) {
            super(itemView);
            
            textTextView = itemView.findViewById(R.id.tv_segment_text);
            timeTextView = itemView.findViewById(R.id.tv_time_range);
            confidenceTextView = itemView.findViewById(R.id.tv_confidence);
            confidenceBadge = itemView.findViewById(R.id.v_confidence_badge);
            
            itemView.setOnClickListener(v -> {
                if (onSegmentSelectedListener != null && getAdapterPosition() != RecyclerView.NO_POSITION) {
                    onSegmentSelectedListener.onSegmentSelected(segments.get(getAdapterPosition()));
                }
            });
        }
        
        public void bind(Segment segment) {
            String displayText = segment.displayText != null ? segment.displayText : segment.segmentText;
            textTextView.setText(displayText);
            
            // Format time range
            String timeRange = String.format("%02d:%02d - %02d:%02d",
                segment.startMs / 60000, (segment.startMs % 60000) / 1000,
                segment.endMs / 60000, (segment.endMs % 60000) / 1000);
            timeTextView.setText(timeRange);
            
            // Set confidence badge
            float confidence = segment.confidence;
            confidenceTextView.setText(String.format("%.1f", confidence));
            
            if (confidence < 0.6f) {
                confidenceBadge.setBackgroundColor(itemView.getContext().getColor(R.color.error));
                confidenceTextView.setText("يحتاج مراجعة");
            } else if (confidence < 0.8f) {
                confidenceBadge.setBackgroundColor(itemView.getContext().getColor(R.color.warning));
            } else {
                confidenceBadge.setBackgroundColor(itemView.getContext().getColor(R.color.success));
            }
        }
    }
    
    public interface OnSegmentSelectedListener {
        void onSegmentSelected(Segment segment);
    }
}