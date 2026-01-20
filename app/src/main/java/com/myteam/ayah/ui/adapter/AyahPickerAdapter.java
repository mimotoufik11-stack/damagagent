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

public class AyahPickerAdapter extends RecyclerView.Adapter<AyahPickerAdapter.AyahViewHolder> {
    
    private List<AyahItem> ayahs = new ArrayList<>();
    private OnAyahSelectedListener onAyahSelectedListener;
    
    public AyahPickerAdapter(OnAyahSelectedListener listener) {
        this.onAyahSelectedListener = listener;
    }
    
    @NonNull
    @Override
    public AyahViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_ayah_picker, parent, false);
        return new AyahViewHolder(view);
    }
    
    @Override
    public void onBindViewHolder(@NonNull AyahViewHolder holder, int position) {
        holder.bind(ayahs.get(position));
    }
    
    @Override
    public int getItemCount() {
        return ayahs.size();
    }
    
    public void setAyahs(List<AyahItem> ayahs) {
        this.ayahs = ayahs;
        notifyDataSetChanged();
    }
    
    class AyahViewHolder extends RecyclerView.ViewHolder {
        private TextView surahNameTextView;
        private TextView ayahNumberTextView;
        private TextView ayahTextView;
        
        public AyahViewHolder(@NonNull View itemView) {
            super(itemView);
            
            surahNameTextView = itemView.findViewById(R.id.tv_surah_name);
            ayahNumberTextView = itemView.findViewById(R.id.tv_ayah_number);
            ayahTextView = itemView.findViewById(R.id.tv_ayah_text);
            
            itemView.setOnClickListener(v -> {
                if (onAyahSelectedListener != null && getAdapterPosition() != RecyclerView.NO_POSITION) {
                    onAyahSelectedListener.onAyahSelected(ayahs.get(getAdapterPosition()));
                }
            });
        }
        
        public void bind(AyahItem ayah) {
            surahNameTextView.setText(ayah.surahName);
            ayahNumberTextView.setText(String.valueOf(ayah.ayahNumber));
            ayahTextView.setText(ayah.ayahText);
        }
    }
    
    public interface OnAyahSelectedListener {
        void onAyahSelected(AyahItem ayah);
    }
    
    public static class AyahItem {
        public int surahId;
        public String surahName;
        public int ayahNumber;
        public String ayahText;
        
        public AyahItem(int surahId, String surahName, int ayahNumber, String ayahText) {
            this.surahId = surahId;
            this.surahName = surahName;
            this.ayahNumber = ayahNumber;
            this.ayahText = ayahText;
        }
    }
}