# Teams
|Role| Name| NIM|
|-|-|-|
|Dev 1| Jumanta| 1003240040|
|Dev 2| Syahrul Ramadhan| 1002230052|
|Dev 3| Zikri Firmansyah| 1003230043|
|Dev 4| Deni Hermawan| 1003230027|
|Dev 5| Vointra Namara Fidelito| 1002230062|
|Dev 6| Muhammad Syahid Azhar Azizi| 1003230019|
|Dev 7| Dyo Aristo| 1003230028|
|Reviewer| R. Purba Kusuma| 1002230076|
|PM + QA| Lutfi Zain| 1001230027|


# Timeline
```mermaid
gantt
    title Jadwal Proyek Mobile App - Kelompok 6
    dateFormat  YYYY-MM-DD HH:mm
    axisFormat  Day %d
    excludes    weekends

    %% --- Setup Phase ---
    section 0. Project Setup
    %% Dev 1: Jumanta
    Init RN Project (Dev 1 - Jumanta)        :id0_1, 2024-01-01 08:00, 2h
    Navigation Setup (Dev 1 - Jumanta)       :id0_2, after id0_1, 3h
    TS Types & Interfaces (Dev 1 - Jumanta)  :id0_3, after id0_1, 2h
    Storage & Mock Data (Dev 1 - Jumanta)    :id0_4, after id0_1, 2h
    Git Workflow (Dev 1 - Jumanta)           :id0_5, after id0_1, 1h

    %% --- Login Screen ---
    section 1. Login Screen
    %% Dev 2: Syahrul Ramadhan
    UI Form Email/Pass (Dev 2 - Syahrul)     :id1_1, after id0_2, 2h
    Logic Validate/Save (Dev 2 - Syahrul)    :id1_2, after id0_4 id1_1, 2h
    Forgot Password (Dev 2 - Syahrul)        :id1_3, after id1_1, 1h

    %% --- Home Screen ---
    section 2. Home Screen
    %% Dev 3: Zikri Firmansyah
    Recipe Card Comp (Dev 3 - Zikri)         :id2_1, after id0_3, 3h
    Feed Layout (Dev 3 - Zikri)              :id2_2, after id2_1, 2h
    Search Bar (Dev 3 - Zikri)               :id2_3, after id2_2, 2h
    Category Filter (Dev 3 - Zikri)          :id2_4, after id2_2, 2h
    Pull Refresh (Dev 3 - Zikri)             :id2_5, after id2_2, 1h

    %% --- Recipe Detail ---
    section 3. Recipe Detail
    %% Dev 4: Deni Hermawan
    UI Parallax Header (Dev 4 - Deni)        :id3_1, after id2_1, 3h
    Logic View Data (Dev 4 - Deni)           :id3_2, after id0_4 id3_1, 2h
    Action Buttons (Dev 4 - Deni)            :id3_3, after id3_1, 1h
    Share Feature (Dev 4 - Deni)             :id3_4, after id3_1, 1h

    %% --- My Recipes ---
    section 4. My Recipes
    %% Dev 5: Vointra Namara
    UI Tab Layout (Dev 5 - Vointra)          :id4_1, after id2_1, 2h
    List Logic (Dev 5 - Vointra)             :id4_2, after id0_4 id4_1, 3h
    Empty State (Dev 5 - Vointra)            :id4_3, after id4_1, 1h
    Delete Action (Dev 5 - Vointra)          :id4_4, after id4_2, 1h

    %% --- Saved Recipes ---
    section 5. Saved Recipes
    %% Dev 6: M. Syahid Azhar
    UI List Saved (Dev 6 - Syahid)           :id5_1, after id2_1, 2h
    Storage Logic (Dev 6 - Syahid)           :id5_2, after id0_4 id5_1, 2h
    Sync Status (Dev 6 - Syahid)             :id5_3, after id5_2, 1h

    %% --- Create/Edit Recipe ---
    section 6. Create/Edit
    %% Dev 7: Dyo Aristo
    Form UI (Dev 7 - Dyo)                    :id6_1, after id0_3, 4h
    Image Picker (Dev 7 - Dyo)               :id6_2, after id6_1, 2h
    Form Validation (Dev 7 - Dyo)            :id6_3, after id6_1, 2h
    Draft Mode (Dev 7 - Dyo)                 :id6_4, after id6_3, 1h
    CRUD Logic (Dev 7 - Dyo)                 :id6_5, after id0_4 id6_3, 3h
    Edit Mode Setup (Dev 7 - Dyo)            :id6_6, after id6_5, 2h
    Preview Screen (Dev 7 - Dyo)             :id6_7, after id6_1, 1h

    %% --- Profile Screen ---
    section 7. Profile Screen
    %% Dev 1: Jumanta (Balik lagi)
    UI Profile (Dev 1 - Jumanta)             :id7_1, after id0_2, 2h
    Logic User Data (Dev 1 - Jumanta)        :id7_2, after id1_2 id7_1, 2h
    Settings & Logout (Dev 1 - Jumanta)      :id7_3, after id7_2, 1h

    %% --- Code Review ---
    section Review (R. Purba)
    Review Setup                             :idR_1, after id0_5, 1h
    Review Login                             :idR_2, after id1_3, 1h
    Review Home                              :idR_3, after id2_5, 2h
    Review Recipe Detail                     :idR_4, after id3_4, 1h
    Review My Recipes                        :idR_5, after id4_4, 1h
    Review Saved Recipes                     :idR_6, after id5_3, 1h
    Review Create/Edit                       :idR_7, after id6_7, 2h
    Review Profile                           :idR_8, after id7_3, 1h
    Final Integration Review                 :idR_9, after idR_2 idR_3 idR_4 idR_5 idR_6 idR_7 idR_8, 2h

    %% --- QA Testing ---
    section QA (Lutfi Zain)
    Test Plan & Setup                        :idQ_1, after id0_2, 2h
    Test Login Screen                        :idQ_2, after idR_2, 2h
    Test Home Screen                         :idQ_3, after idR_3, 3h
    Test Recipe Detail                       :idQ_4, after idR_4, 2h
    Test My Recipes                          :idQ_5, after idR_5, 2h
    Test Saved Recipes                       :idQ_6, after idR_6, 2h
    Test Create/Edit                         :idQ_7, after idR_7, 4h
    Test Profile                             :idQ_8, after idR_8, 2h
    Final E2E Testing                        :idQ_9, after idQ_2 idQ_3 idQ_4 idQ_5 idQ_6 idQ_7 idQ_8, 4h
```