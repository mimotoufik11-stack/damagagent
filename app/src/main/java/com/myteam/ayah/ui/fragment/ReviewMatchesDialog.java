package com.myteam.ayah.ui.fragment;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.google.android.material.bottomsheet.BottomSheetDialogFragment;
import com.myteam.ayah.R;
import com.myteam.ayah.domain.model.QuranMatch;
import java.util.ArrayList;
import java.util.List;

public class ReviewMatchesDialog extends BottomSheetDialogFragment {
    
    private static final String ARG_SEGMENT_TEXT = "segment_text";
    private static final String ARG_ASR_CONFIDENCE = "asr_confidence";
    private static final String ARG_MATCHES = "matches";
    
    private String segmentText;
    private float asrConfidence;
    private List<QuranMatch> matches;
    
    private TextView segmentTextTextView;
    private TextView asrConfidenceTextView;
    private RecyclerView matchesRecyclerView;
    private MatchesAdapter matchesAdapter;
    private Button confirmButton;
    private Button cancelButton;
    
    private ReviewMatchesListener listener;
    
    public interface ReviewMatchesListener {
        void onMatchSelected(QuranMatch selectedMatch);
        void onNoMatchSelected();
    }
    
    public static ReviewMatchesDialog newInstance(String segmentText, float asrConfidence, List<QuranMatch> matches) {
        ReviewMatchesDialog fragment = new ReviewMatchesDialog();
        Bundle args = new Bundle();
        args.putString(ARG_SEGMENT_TEXT, segmentText);
        args.putFloat(ARG_ASR_CONFIDENCE, asrConfidence);
        args.putParcelableArrayList(ARG_MATCHES, new ArrayList<>(matches));
        fragment.setArguments(args);
        return fragment;
    }
    
    public void setReviewMatchesListener(ReviewMatchesListener listener) {
        this.listener = listener;
    }
    
    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            segmentText = getArguments().getString(ARG_SEGMENT_TEXT);
            asrConfidence = getArguments().getFloat(ARG_ASR_CONFIDENCE);
            matches = getArguments().getParcelableArrayList(ARG_MATCHES);
        }
        
        if (matches == null) {
            matches = new ArrayList<>();
        }
    }
    
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.dialog_review_matches, container, false);
    }
    
    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        
        initializeViews(view);
        setupRecyclerView();
        setupClickListeners();
        displaySegmentInfo();
        displayMatches();
    }
    
    private void initializeViews(View view) {
        segmentTextTextView = view.findViewById(R.id.tv_segment_text);
        asrConfidenceTextView = view.findViewById(R.id.tv_asr_confidence);
        matchesRecyclerView = view.findViewById(R.id.rv_matches);
        confirmButton = view.findViewById(R.id.btn_confirm);
        cancelButton = view.findViewById(R.id.btn_cancel);
    }
    
    private void setupRecyclerView() {
        matchesAdapter = new MatchesAdapter(this::onMatchSelected);
        matchesRecyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        matchesRecyclerView.setAdapter(matchesAdapter);
    }
    
    private void setupClickListeners() {
        confirmButton.setOnClickListener(v -> {
            QuranMatch selectedMatch = matchesAdapter.getSelectedMatch();
            if (selectedMatch != null && listener != null) {
                listener.onMatchSelected(selectedMatch);
            } else if (listener != null) {
                listener.onNoMatchSelected();
            }
            dismiss();
        });
        
        cancelButton.setOnClickListener(v -> dismiss());
    }
    
    private void displaySegmentInfo() {
        segmentTextTextView.setText(segmentText);
        asrConfidenceTextView.setText("مستوى الثقة: " + String.format("%.1f%%", asrConfidence * 100));
        
        // Set confidence color
        if (asrConfidence < 0.6f) {
            asrConfidenceTextView.setTextColor(getResources().getColor(R.color.error));
        } else if (asrConfidence < 0.8f) {
            asrConfidenceTextView.setTextColor(getResources().getColor(R.color.warning));
        } else {
            asrConfidenceTextView.setTextColor(getResources().getColor(R.color.success));
        }
    }
    
    private void displayMatches() {
        matchesAdapter.setMatches(matches);
    }
    
    private void onMatchSelected(QuranMatch match) {
        // Selection handled by adapter
    }
    
    private static class MatchesAdapter extends RecyclerView.Adapter<MatchesAdapter.MatchViewHolder> {
        private List<QuranMatch> matches = new ArrayList<>();
        private QuranMatch selectedMatch;
        private OnMatchSelectListener listener;
        
        public interface OnMatchSelectListener {
            void onMatchSelected(QuranMatch match);
        }
        
        public MatchesAdapter(OnMatchSelectListener listener) {
            this.listener = listener;
        }
        
        @NonNull
        @Override
        public MatchViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View view = LayoutInflater.from(parent.getContext())
                    .inflate(R.layout.item_match_candidate, parent, false);
            return new MatchViewHolder(view);
        }
        
        @Override
        public void onBindViewHolder(@NonNull MatchViewHolder holder, int position) {
            holder.bind(matches.get(position));
        }
        
        @Override
        public int getItemCount() {
            return matches.size();
        }
        
        public void setMatches(List<QuranMatch> matches) {
            this.matches = matches;
            notifyDataSetChanged();
        }
        
        public QuranMatch getSelectedMatch() {
            return selectedMatch;
        }
        
        class MatchViewHolder extends RecyclerView.ViewHolder {
            private TextView surahInfoTextView;
            private TextView verseTextView;
            private TextView confidenceTextView;
            private TextView tokenOverlapTextView;
            
            public MatchViewHolder(@NonNull View itemView) {
                super(itemView);
                
                surahInfoTextView = itemView.findViewById(R.id.tv_surah_info);
                verseTextView = itemView.findViewById(R.id.tv_verse_text);
                confidenceTextView = itemView.findViewById(R.id.tv_confidence);
                tokenOverlapTextView = itemView.findViewById(R.id.tv_token_overlap);
                
                itemView.setOnClickListener(v -> {
                    selectedMatch = matches.get(getAdapterPosition());
                    notifyDataSetChanged();
                    if (listener != null) {
                        listener.onMatchSelected(selectedMatch);
                    }
                });
            }
            
            public void bind(QuranMatch match) {
                surahInfoTextView.setText("سورة " + getSurahName(match.surahId) + " - آية " + match.ayahId);
                verseTextView.setText(match.verseText);
                confidenceTextView.setText(String.format("%.1f%%", match.confidence * 100));
                
                // Calculate token overlap
                int overlapCount = 0;
                if (match.asrTokens != null && match.verseTokens != null) {
                    for (String token : match.asrTokens) {
                        if (match.verseTokens.contains(token)) {
                            overlapCount++;
                        }
                    }
                }
                tokenOverlapTextView.setText("تطابق الكلمات: " + overlapCount + "/" + (match.asrTokens != null ? match.asrTokens.size() : 0));
                
                // Set confidence color
                if (match.confidence < 0.6f) {
                    confidenceTextView.setTextColor(itemView.getContext().getColor(R.color.error));
                } else if (match.confidence < 0.8f) {
                    confidenceTextView.setTextColor(itemView.getContext().getColor(R.color.warning));
                } else {
                    confidenceTextView.setTextColor(itemView.getContext().getColor(R.color.success));
                }
                
                // Highlight selected item
                if (selectedMatch == match) {
                    itemView.setBackgroundColor(itemView.getContext().getColor(R.color.primary_gold));
                } else {
                    itemView.setBackgroundColor(itemView.getContext().getColor(R.color.transparent));
                }
            }
            
            private String getSurahName(int surahId) {
                // This would normally fetch from SurahIndex
                String[] surahNames = {
                    "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام",
                    "الأعراف", "الأنفال", "التوبة", "يونس", "هود", "يوسف",
                    "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف",
                    "مريم", "طه", "الأنبياء", "الحج", "المؤمنون", "النور",
                    "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم",
                    "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس",
                    "الصافات", "ص", "الزمر", "غافر", "فصلت", "الشورى",
                    "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح",
                    "الحجرات", "ق", "الذاريات", "الطور", "النجم", "القمر",
                    "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة",
                    "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم",
                    "الملك", "القلم", "الحاقة", "المعارج", "نوح", "الجن",
                    "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ",
                    "النازعات", "عبس", "التكوير", "الانفطار", "المطففين", "الانشقاق",
                    "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد",
                    "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق",
                    "القدر", "البينة", "الزلزلة", "العاديات", "القارعة", "التكاثر",
                    "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر",
                    "الكافرون", "النصر", "المسد", "الإخلاص", "الفلق", "الناس"
                };
                
                if (surahId >= 1 && surahId <= surahNames.length) {
                    return surahNames[surahId - 1];
                }
                return "سورة " + surahId;
            }
        }
    }
}