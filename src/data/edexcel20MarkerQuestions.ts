import { IGCSETask, IGCSEUnit } from "../types";
import { EDEXCEL_20_MARKER_TASKS_PART2 } from "./edexcel20MarkerQuestionsPart2";

/**
 * =========================================================================
 * PEARSON EDEXCEL INTERNATIONAL GCSE (9-1) COMPUTER SCIENCE (4CP0)
 * PAPER 2: 20-MARKER CAPSTONE QUESTIONS BANK (QUESTION 6 STYLE)
 *
 * Each question is a full 20-mark algorithmic synthesis task featuring:
 * - 1D lists, parallel 1D lists, or 2D lists
 * - Subprograms (functions and procedures with parameters & return values)
 * - File handling (writing / updating text report files)
 * - Dynamic data manipulation, searching, validation, and formatted tables
 * - Multi-test automated verification suite
 * =========================================================================
 */

const EDEXCEL_20_MARKER_TASKS_PART1: IGCSETask[] = [
  // =========================================================================
  // 20-MARKER 1: Air Cargo Manifest & Unit Conversion
  // Parallel 1D lists + Subprograms + File Output + Unit Conversion
  // =========================================================================
  {
    id: "cap20_01_cargo_manifest",
    unit: "U20M",
    unitName: "Paper 2 20-Marker Capstone Mastery",
    title: "Q6 Air Cargo Weight Conversion & Manifest Exporter",
    level: "Exam-style",
    difficulty: "Hard",
    type: "code",
    marks: 20,
    brief:
      "An air freight company manages scheduled cargo flights.\n" +
      "Flight numbers, destinations, and cargo weights are stored in three parallel arrays:\n" +
      "• tbl_flight stores flight numbers (e.g. 'AF101', 'BA204').\n" +
      "• tbl_dest stores destination cities (e.g. 'Dubai', 'Tokyo').\n" +
      "• tbl_weight stores weights with a unit prefix 'K' for kilograms or 'L' for pounds (e.g. 'K450' or 'L990').\n\n" +
      "Conversion Formulas:\n" +
      "• Pounds from Kilograms: L = round(K * 2.2)\n" +
      "• Kilograms from Pounds: K = round(L / 2.2)\n\n" +
      "The program must:\n" +
      "1. Allow an operator to input a flight number and an updated weight code (e.g. 'BA204' and 'K600').\n" +
      "   - If the flight is in tbl_flight, update its weight code in tbl_weight.\n" +
      "   - If the flight is not in tbl_flight, output 'Flight not found'.\n" +
      "2. Define at least one subprogram convert_weight(weight_code) that returns both the rounded kilogram and pound integers.\n" +
      "3. Display a table with:\n" +
      "   - Header row ('Flight', 'Destination', 'Kilograms', 'Pounds') and dividing line.\n" +
      "   - Each flight's details with weights in both units.\n" +
      "   - Dividing line.\n" +
      "   - An overall average weight across all flights in both kilograms and pounds as rounded whole numbers.\n" +
      "4. Write the manifest rows to 'manifest.txt' and display 'manifest file has been created'.",
    starter:
      "# Q06 - Air Cargo Manifest & Unit Conversion (20 Marks)\n" +
      'tbl_flight = ["AF101", "BA204", "EK305", "LH402", "SQ510", "QR612"]\n' +
      'tbl_dest = ["Paris", "London", "Dubai", "Frankfurt", "Singapore", "Doha"]\n' +
      'tbl_weight = ["K450", "L990", "K820", "L1540", "K610", "L880"]\n\n' +
      "# Write your subprogram(s) and program below:\n",
    solution:
      "# Q06FINISHED - Air Cargo Manifest & Unit Conversion\n" +
      'tbl_flight = ["AF101", "BA204", "EK305", "LH402", "SQ510", "QR612"]\n' +
      'tbl_dest = ["Paris", "London", "Dubai", "Frankfurt", "Singapore", "Doha"]\n' +
      'tbl_weight = ["K450", "L990", "K820", "L1540", "K610", "L880"]\n\n' +
      "def convert_weight(weight_code):\n" +
      "    unit = weight_code[0].upper()\n" +
      "    val = float(weight_code[1:])\n" +
      '    if unit == "K":\n' +
      "        kg = round(val)\n" +
      "        lb = round(kg * 2.2)\n" +
      "    else:\n" +
      "        lb = round(val)\n" +
      "        kg = round(lb / 2.2)\n" +
      "    return kg, lb\n\n" +
      'flight_in = input("Enter flight number: ").strip()\n' +
      'weight_in = input("Enter new weight code: ").strip()\n\n' +
      "if flight_in in tbl_flight:\n" +
      "    idx = tbl_flight.index(flight_in)\n" +
      "    tbl_weight[idx] = weight_in\n" +
      "else:\n" +
      '    print("Flight not found")\n\n' +
      'print(f"{\'Flight\':<10} {\'Destination\':<14} {\'Kilograms\':>10} {\'Pounds\':>8}")\n' +
      'print("-" * 46)\n\n' +
      "total_kg = 0\n" +
      "total_lb = 0\n" +
      "n = len(tbl_flight)\n" +
      "lines_to_save = []\n\n" +
      "for i in range(n):\n" +
      "    kg, lb = convert_weight(tbl_weight[i])\n" +
      "    total_kg += kg\n" +
      "    total_lb += lb\n" +
      '    row = f"{tbl_flight[i]:<10} {tbl_dest[i]:<14} {kg:>10} {lb:>8}"\n' +
      "    print(row)\n" +
      "    lines_to_save.append(row)\n\n" +
      'print("-" * 46)\n' +
      "avg_kg = round(total_kg / n)\n" +
      "avg_lb = round(total_lb / n)\n" +
      'print(f"{\'Average\':<25} {avg_kg:>10} {avg_lb:>8}")\n\n' +
      "try:\n" +
      '    with open("manifest.txt", "w") as f:\n' +
      "        for line in lines_to_save:\n" +
      '            f.write(line + "\\n")\n' +
      "except Exception:\n" +
      "    pass\n\n" +
      'print("manifest file has been created")\n',
    tests: [
      {
        in: ["BA204", "K600"],
        out:
          "Flight     Destination     Kilograms   Pounds\n" +
          "----------------------------------------------\n" +
          "AF101      Paris                  450      990\n" +
          "BA204      London                 600     1320\n" +
          "EK305      Dubai                  820     1804\n" +
          "LH402      Frankfurt              700     1540\n" +
          "SQ510      Singapore              610     1342\n" +
          "QR612      Doha                   400      880\n" +
          "----------------------------------------------\n" +
          "Average                           597     1313\n" +
          "manifest file has been created",
        m: 10,
      },
      {
        in: ["UA999", "K300"],
        out:
          "Flight not found\n" +
          "Flight     Destination     Kilograms   Pounds\n" +
          "----------------------------------------------\n" +
          "AF101      Paris                  450      990\n" +
          "BA204      London                 450      990\n" +
          "EK305      Dubai                  820     1804\n" +
          "LH402      Frankfurt              700     1540\n" +
          "SQ510      Singapore              610     1342\n" +
          "QR612      Doha                   400      880\n" +
          "----------------------------------------------\n" +
          "Average                           572     1258\n" +
          "manifest file has been created",
        m: 10,
      },
    ],
    hint: "Use entry[0] for 'K' or 'L', and float(entry[1:]) for the value. Accumulate totals in your loop, and handle file creation with try/except.",
  },

  // =========================================================================
  // 20-MARKER 2: Hospital NEWS2 Vital Signs & Triage Audit
  // 1D List + 2D List + Subprograms + File Output + Thresholds
  // =========================================================================
  {
    id: "cap20_02_hospital_triage",
    unit: "U20M",
    unitName: "Paper 2 20-Marker Capstone Mastery",
    title: "Q6 Hospital Patient NEWS Vital Signs & Triage Audit",
    level: "Exam-style",
    difficulty: "Hard",
    type: "code",
    marks: 20,
    brief:
      "A hospital ward monitors patients using the National Early Warning Score (NEWS).\n" +
      "• Patient names are stored in tbl_patients.\n" +
      "• Hourly vital readings are stored in a two-dimensional array tbl_vitals, where each row contains [heart_rate, systolic_bp, temp_c].\n\n" +
      "Scoring Rules (subprogram calculate_score):\n" +
      "• Heart Rate: add 3 if HR > 110 or HR < 45; add 1 if HR is between 91 and 110; otherwise 0.\n" +
      "• Systolic BP: add 3 if BP < 90; add 2 if BP is between 90 and 100; otherwise 0.\n" +
      "• Temperature: add 3 if Temp >= 39.0 or Temp < 35.0; add 1 if Temp >= 38.0; otherwise 0.\n\n" +
      "Priority Classification:\n" +
      "• Total Score >= 5: 'High Priority'\n" +
      "• Total Score 3 to 4: 'Medium Priority'\n" +
      "• Total Score <= 2: 'Normal'\n\n" +
      "The program must:\n" +
      "1. Prompt for a patient's name and an updated temperature reading (e.g. 'Amira Khan' and '39.2').\n" +
      "   - If found, update the temperature (3rd element, index 2) for that patient.\n" +
      "   - If not found, output 'Patient not registered'.\n" +
      "2. Display a formatted table showing Patient name, Score, and Priority.\n" +
      "3. Count and display the number of High Priority patients.\n" +
      "4. Write high priority patient names and scores to 'triage_audit.txt' and output 'triage audit file has been created'.",
    starter:
      "# Q06 - Hospital Triage & Vital Signs (20 Marks)\n" +
      'tbl_patients = ["Amira Khan", "David Ross", "Elena Gomez", "Liam Chen", "Grace O\'Connor"]\n' +
      "tbl_vitals = [\n" +
      "    [95, 115, 37.2],\n" +
      "    [118, 88, 38.5],\n" +
      "    [74, 128, 36.6],\n" +
      "    [105, 96, 37.8],\n" +
      "    [62, 122, 36.4]\n" +
      "]\n\n" +
      "# Write your subprogram(s) and program below:\n",
    solution:
      "# Q06FINISHED - Hospital Triage & Vital Signs\n" +
      'tbl_patients = ["Amira Khan", "David Ross", "Elena Gomez", "Liam Chen", "Grace O\'Connor"]\n' +
      "tbl_vitals = [\n" +
      "    [95, 115, 37.2],\n" +
      "    [118, 88, 38.5],\n" +
      "    [74, 128, 36.6],\n" +
      "    [105, 96, 37.8],\n" +
      "    [62, 122, 36.4]\n" +
      "]\n\n" +
      "def calculate_score(vitals):\n" +
      "    hr = vitals[0]\n" +
      "    bp = vitals[1]\n" +
      "    temp = vitals[2]\n" +
      "    score = 0\n" +
      "    if hr > 110 or hr < 45:\n" +
      "        score += 3\n" +
      "    elif 91 <= hr <= 110:\n" +
      "        score += 1\n" +
      "    if bp < 90:\n" +
      "        score += 3\n" +
      "    elif 90 <= bp <= 100:\n" +
      "        score += 2\n" +
      "    if temp >= 39.0 or temp < 35.0:\n" +
      "        score += 3\n" +
      "    elif temp >= 38.0:\n" +
      "        score += 1\n" +
      "    return score\n\n" +
      "def get_priority(score):\n" +
      "    if score >= 5:\n" +
      '        return "High Priority"\n' +
      "    elif score >= 3:\n" +
      '        return "Medium Priority"\n' +
      "    else:\n" +
      '        return "Normal"\n\n' +
      'patient_in = input("Enter patient name: ").strip()\n' +
      'temp_in = float(input("Enter updated temperature: ").strip())\n\n' +
      "if patient_in in tbl_patients:\n" +
      "    idx = tbl_patients.index(patient_in)\n" +
      "    tbl_vitals[idx][2] = temp_in\n" +
      "else:\n" +
      '    print("Patient not registered")\n\n' +
      'print(f"{\'Patient\':<18} {\'Score\':>6}  {\'Priority\':<16}")\n' +
      'print("-" * 44)\n\n' +
      "high_priority_count = 0\n" +
      "audit_lines = []\n\n" +
      "for i in range(len(tbl_patients)):\n" +
      "    score = calculate_score(tbl_vitals[i])\n" +
      "    priority = get_priority(score)\n" +
      '    if priority == "High Priority":\n' +
      "        high_priority_count += 1\n" +
      '        audit_lines.append(f"{tbl_patients[i]} - Score {score}")\n' +
      '    print(f"{tbl_patients[i]:<18} {score:>6}  {priority:<16}")\n\n' +
      'print("-" * 44)\n' +
      'print(f"Total High Priority: {high_priority_count}")\n\n' +
      "try:\n" +
      '    with open("triage_audit.txt", "w") as f:\n' +
      "        for al in audit_lines:\n" +
      '            f.write(al + "\\n")\n' +
      "except Exception:\n" +
      "    pass\n\n" +
      'print("triage audit file has been created")\n',
    tests: [
      {
        in: ["Amira Khan", "39.2"],
        out:
          "Patient             Score  Priority        \n" +
          "--------------------------------------------\n" +
          "Amira Khan              4  Medium Priority \n" +
          "David Ross              7  High Priority   \n" +
          "Elena Gomez             0  Normal          \n" +
          "Liam Chen               3  Medium Priority \n" +
          "Grace O'Connor          0  Normal          \n" +
          "--------------------------------------------\n" +
          "Total High Priority: 1\n" +
          "triage audit file has been created",
        m: 10,
      },
      {
        in: ["John Smith", "38.0"],
        out:
          "Patient not registered\n" +
          "Patient             Score  Priority        \n" +
          "--------------------------------------------\n" +
          "Amira Khan              1  Normal          \n" +
          "David Ross              7  High Priority   \n" +
          "Elena Gomez             0  Normal          \n" +
          "Liam Chen               3  Medium Priority \n" +
          "Grace O'Connor          0  Normal          \n" +
          "--------------------------------------------\n" +
          "Total High Priority: 1\n" +
          "triage audit file has been created",
        m: 10,
      },
    ],
    hint: "Write calculate_score to sum up the 3 component rules. Update tbl_vitals[idx][2] when found, and write audit lines to triage_audit.txt.",
  },

  // =========================================================================
  // 20-MARKER 3: Wind Farm Turbine Fault Logger
  // Parallel 1D lists + Subprograms + File Output + Filtering & Averages
  // =========================================================================
  {
    id: "cap20_03_wind_farm_log",
    unit: "U20M",
    unitName: "Paper 2 20-Marker Capstone Mastery",
    title: "Q6 Offshore Wind Turbine Power Output & Fault Logger",
    level: "Exam-style",
    difficulty: "Hard",
    type: "code",
    marks: 20,
    brief:
      "An offshore wind farm tracks daily energy production for its turbines.\n" +
      "• Turbine identifiers, offshore sectors, and daily outputs in megawatt-hours (MWh) are stored in parallel arrays:\n" +
      "  - tbl_turbines (e.g. 'T-01', 'T-02')\n" +
      "  - tbl_sectors (e.g. 'North', 'South')\n" +
      "  - tbl_output (e.g. 24.5, 8.0)\n\n" +
      "Operational Rules:\n" +
      "• A turbine is classified as 'Fault' if its output is strictly less than 15.0 MWh.\n" +
      "• Otherwise, it is classified as 'Operational'.\n\n" +
      "The program must:\n" +
      "1. Allow an engineer to input a turbine ID and a new output in MWh (e.g. 'T-02' and '22.5').\n" +
      "   - If found, update its value in tbl_output.\n" +
      "   - If not found, display 'Turbine not found'.\n" +
      "2. Define a subprogram get_status(mwh) returning 'Operational' or 'Fault'.\n" +
      "3. Display a table with:\n" +
      "   - Header: 'Turbine', 'Sector', 'Output(MWh)', 'Status'\n" +
      "   - Each turbine's output formatted to 1 decimal place.\n" +
      "   - Total farm output and the number of operational turbines.\n" +
      "4. Write all turbines with 'Fault' status to 'fault_log.txt' and display 'turbine fault log has been created'.",
    starter:
      "# Q06 - Offshore Wind Turbine Logger (20 Marks)\n" +
      'tbl_turbines = ["T-01", "T-02", "T-03", "T-04", "T-05", "T-06"]\n' +
      'tbl_sectors = ["North", "North", "East", "East", "South", "South"]\n' +
      "tbl_output = [28.4, 9.2, 31.0, 12.5, 25.8, 14.1]\n\n" +
      "# Write your subprogram(s) and program below:\n",
    solution:
      "# Q06FINISHED - Offshore Wind Turbine Logger\n" +
      'tbl_turbines = ["T-01", "T-02", "T-03", "T-04", "T-05", "T-06"]\n' +
      'tbl_sectors = ["North", "North", "East", "East", "South", "South"]\n' +
      "tbl_output = [28.4, 9.2, 31.0, 12.5, 25.8, 14.1]\n\n" +
      "def get_status(mwh):\n" +
      "    if mwh < 15.0:\n" +
      '        return "Fault"\n' +
      "    else:\n" +
      '        return "Operational"\n\n' +
      'turb_in = input("Enter turbine ID: ").strip()\n' +
      'mwh_in = float(input("Enter new output: ").strip())\n\n' +
      "if turb_in in tbl_turbines:\n" +
      "    idx = tbl_turbines.index(turb_in)\n" +
      "    tbl_output[idx] = mwh_in\n" +
      "else:\n" +
      '    print("Turbine not found")\n\n' +
      'print(f"{\'Turbine\':<10} {\'Sector\':<10} {\'Output(MWh)\':>12}  {\'Status\':<12}")\n' +
      'print("-" * 48)\n\n' +
      "total_mwh = 0.0\n" +
      "op_count = 0\n" +
      "fault_lines = []\n\n" +
      "for i in range(len(tbl_turbines)):\n" +
      "    mwh = tbl_output[i]\n" +
      "    total_mwh += mwh\n" +
      "    status = get_status(mwh)\n" +
      '    if status == "Operational":\n' +
      "        op_count += 1\n" +
      "    else:\n" +
      '        fault_lines.append(f"{tbl_turbines[i]} ({tbl_sectors[i]}): {mwh:.1f} MWh")\n' +
      '    print(f"{tbl_turbines[i]:<10} {tbl_sectors[i]:<10} {mwh:>12.1f}  {status:<12}")\n\n' +
      'print("-" * 48)\n' +
      'print(f"Total Output: {total_mwh:.1f} MWh | Operational: {op_count}")\n\n' +
      "try:\n" +
      '    with open("fault_log.txt", "w") as f:\n' +
      "        for fl in fault_lines:\n" +
      '            f.write(fl + "\\n")\n' +
      "except Exception:\n" +
      "    pass\n\n" +
      'print("turbine fault log has been created")\n',
    tests: [
      {
        in: ["T-02", "25.0"],
        out:
          "Turbine    Sector     Output(MWh)  Status      \n" +
          "------------------------------------------------\n" +
          "T-01       North             28.4  Operational \n" +
          "T-02       North             25.0  Operational \n" +
          "T-03       East              31.0  Operational \n" +
          "T-04       East              12.5  Fault       \n" +
          "T-05       South             25.8  Operational \n" +
          "T-06       South             14.1  Fault       \n" +
          "------------------------------------------------\n" +
          "Total Output: 136.8 MWh | Operational: 4\n" +
          "turbine fault log has been created",
        m: 10,
      },
      {
        in: ["T-99", "10.0"],
        out:
          "Turbine not found\n" +
          "Turbine    Sector     Output(MWh)  Status      \n" +
          "------------------------------------------------\n" +
          "T-01       North             28.4  Operational \n" +
          "T-02       North              9.2  Fault       \n" +
          "T-03       East              31.0  Operational \n" +
          "T-04       East              12.5  Fault       \n" +
          "T-05       South             25.8  Operational \n" +
          "T-06       South             14.1  Fault       \n" +
          "------------------------------------------------\n" +
          "Total Output: 121.0 MWh | Operational: 3\n" +
          "turbine fault log has been created",
        m: 10,
      },
    ],
    hint: "Use get_status(mwh) returning 'Operational' if mwh >= 15.0 else 'Fault'. Format outputs with :.1f.",
  },

  // =========================================================================
  // 20-MARKER 4: Science Olympiad Decathlon & Merit File Exporter
  // 1D List + 2D List + Subprograms + File Output + Drop Lowest Score
  // =========================================================================
  {
    id: "cap20_04_olympiad_decathlon",
    unit: "U20M",
    unitName: "Paper 2 20-Marker Capstone Mastery",
    title: "Q6 Science Olympiad 2D Multi-Round Awards & Merit Exporter",
    level: "Exam-style",
    difficulty: "Hard",
    type: "code",
    marks: 20,
    brief:
      "Students participate in a 4-round Science Olympiad competition.\n" +
      "• Candidate IDs are stored in tbl_candidates.\n" +
      "• Round scores (each out of 30) are stored in a two-dimensional array tbl_scores.\n\n" +
      "Scoring Rules (subprogram calculate_olympiad_result):\n" +
      "• The lowest score among the 4 rounds is dropped.\n" +
      "• The remaining 3 scores are summed to give an overall score out of 90.\n" +
      "• Awards:\n" +
      "  - Score >= 75: 'Gold Honor'\n" +
      "  - Score 60 to 74: 'Silver Honor'\n" +
      "  - Score 45 to 59: 'Bronze Honor'\n" +
      "  - Score < 45: 'Participation'\n\n" +
      "The program must:\n" +
      "1. Prompt for candidate ID and a revised score for Round 1 (index 0) (e.g. 'C-102' and '28').\n" +
      "   - If found, update Round 1 for that candidate.\n" +
      "   - If not found, output 'Candidate not found'.\n" +
      "2. Display a table of Candidate, Total Score (out of 90), and Award.\n" +
      "3. Compute and display the highest total score in the competition.\n" +
      "4. Write all 'Gold Honor' recipients to 'merit_certificates.txt' and output 'certificates file has been created'.",
    starter:
      "# Q06 - Science Olympiad 2D Scores (20 Marks)\n" +
      'tbl_candidates = ["C-101", "C-102", "C-103", "C-104", "C-105"]\n' +
      "tbl_scores = [\n" +
      "    [24, 26, 28, 22],\n" +
      "    [18, 20, 19, 15],\n" +
      "    [29, 30, 27, 28],\n" +
      "    [14, 16, 12, 18],\n" +
      "    [25, 22, 26, 24]\n" +
      "]\n\n" +
      "# Write your subprogram(s) and program below:\n",
    solution:
      "# Q06FINISHED - Science Olympiad 2D Scores\n" +
      'tbl_candidates = ["C-101", "C-102", "C-103", "C-104", "C-105"]\n' +
      "tbl_scores = [\n" +
      "    [24, 26, 28, 22],\n" +
      "    [18, 20, 19, 15],\n" +
      "    [29, 30, 27, 28],\n" +
      "    [14, 16, 12, 18],\n" +
      "    [25, 22, 26, 24]\n" +
      "]\n\n" +
      "def calculate_olympiad_result(rounds):\n" +
      "    # Drop lowest, sum remaining 3\n" +
      "    total = sum(rounds) - min(rounds)\n" +
      "    if total >= 75:\n" +
      '        award = "Gold Honor"\n' +
      "    elif total >= 60:\n" +
      '        award = "Silver Honor"\n' +
      "    elif total >= 45:\n" +
      '        award = "Bronze Honor"\n' +
      "    else:\n" +
      '        award = "Participation"\n' +
      "    return total, award\n\n" +
      'cand_in = input("Enter candidate ID: ").strip()\n' +
      'r1_in = int(input("Enter new Round 1 score: ").strip())\n\n' +
      "if cand_in in tbl_candidates:\n" +
      "    idx = tbl_candidates.index(cand_in)\n" +
      "    tbl_scores[idx][0] = r1_in\n" +
      "else:\n" +
      '    print("Candidate not found")\n\n' +
      'print(f"{\'Candidate\':<12} {\'Total\':>6}  {\'Award\':<16}")\n' +
      'print("-" * 38)\n\n' +
      "max_score = -1\n" +
      "gold_lines = []\n\n" +
      "for i in range(len(tbl_candidates)):\n" +
      "    total, award = calculate_olympiad_result(tbl_scores[i])\n" +
      "    if total > max_score:\n" +
      "        max_score = total\n" +
      '    if award == "Gold Honor":\n' +
      '        gold_lines.append(f"{tbl_candidates[i]} - {total}")\n' +
      '    print(f"{tbl_candidates[i]:<12} {total:>6}  {award:<16}")\n\n' +
      'print("-" * 38)\n' +
      'print(f"Highest Score: {max_score}")\n\n' +
      "try:\n" +
      '    with open("merit_certificates.txt", "w") as f:\n' +
      "        for g in gold_lines:\n" +
      '            f.write(g + "\\n")\n' +
      "except Exception:\n" +
      "    pass\n\n" +
      'print("certificates file has been created")\n',
    tests: [
      {
        in: ["C-102", "28"],
        out:
          "Candidate     Total  Award           \n" +
          "--------------------------------------\n" +
          "C-101            78  Gold Honor      \n" +
          "C-102            67  Silver Honor    \n" +
          "C-103            87  Gold Honor      \n" +
          "C-104            48  Bronze Honor    \n" +
          "C-105            75  Gold Honor      \n" +
          "--------------------------------------\n" +
          "Highest Score: 87\n" +
          "certificates file has been created",
        m: 10,
      },
      {
        in: ["C-999", "30"],
        out:
          "Candidate not found\n" +
          "Candidate     Total  Award           \n" +
          "--------------------------------------\n" +
          "C-101            78  Gold Honor      \n" +
          "C-102            57  Bronze Honor    \n" +
          "C-103            87  Gold Honor      \n" +
          "C-104            48  Bronze Honor    \n" +
          "C-105            75  Gold Honor      \n" +
          "--------------------------------------\n" +
          "Highest Score: 87\n" +
          "certificates file has been created",
        m: 10,
      },
    ],
    hint: "Total is sum(rounds) - min(rounds). Use an if/elif ladder to determine award, and export Gold Honor candidates to merit_certificates.txt.",
  },

  // =========================================================================
  // 20-MARKER 5: Grand Hotel Billing & Surcharge Auditor
  // Parallel 1D lists + Prefix Parsing + Subprograms + File Output
  // =========================================================================
  {
    id: "cap20_05_hotel_billing",
    unit: "U20M",
    unitName: "Paper 2 20-Marker Capstone Mastery",
    title: "Q6 Grand Hotel Room Billing & Surcharge Auditor",
    level: "Exam-style",
    difficulty: "Hard",
    type: "code",
    marks: 20,
    brief:
      "A luxury hotel manages checkout billing for its guests.\n" +
      "• Room numbers, guest names, and account balances are stored in three parallel arrays:\n" +
      "  - tbl_room (e.g. 101, 204)\n" +
      "  - tbl_guest (e.g. 'Dr. Thorne', 'Ms. Lin')\n" +
      "  - tbl_account (e.g. 'V450', 'S280' where 'V' denotes VIP guest, 'S' denotes Standard guest, followed by base bill in pounds).\n\n" +
      "Billing Rules (subprogram calculate_invoice):\n" +
      "• VIP guest ('V'): Base bill receives a 10% discount, plus a 5% service surcharge on the discounted bill.\n" +
      "  - discounted = base * 0.90\n" +
      "  - final_bill = round(discounted * 1.05 + extra_charges)\n" +
      "• Standard guest ('S'): Base bill has no discount, plus a 10% service surcharge.\n" +
      "  - final_bill = round(base * 1.10 + extra_charges)\n\n" +
      "The program must:\n" +
      "1. Prompt for room number and an additional minibar charge (e.g. 204 and 35.0).\n" +
      "   - If room found, add the extra charge into its invoice.\n" +
      "   - If not found, output 'Room not found'.\n" +
      "2. Display a table with columns: 'Room', 'Guest', 'Type', 'Final(£)'.\n" +
      "3. Output total revenue across all rooms.\n" +
      "4. Write all guest billing lines to 'billing_export.txt' and output 'billing export file has been created'.",
    starter:
      "# Q06 - Hotel Room Billing (20 Marks)\n" +
      "tbl_room = [101, 102, 201, 202, 301]\n" +
      'tbl_guest = ["Lord Sterling", "Ms. Alvarez", "Sir Higgins", "Mr. Dupont", "Prof. Moriarty"]\n' +
      'tbl_account = ["V600", "S250", "V480", "S310", "S190"]\n\n' +
      "# Write your subprogram(s) and program below:\n",
    solution:
      "# Q06FINISHED - Hotel Room Billing\n" +
      "tbl_room = [101, 102, 201, 202, 301]\n" +
      'tbl_guest = ["Lord Sterling", "Ms. Alvarez", "Sir Higgins", "Mr. Dupont", "Prof. Moriarty"]\n' +
      'tbl_account = ["V600", "S250", "V480", "S310", "S190"]\n\n' +
      "def calculate_invoice(account_str, extra):\n" +
      "    cat = account_str[0].upper()\n" +
      "    base = float(account_str[1:])\n" +
      '    if cat == "V":\n' +
      "        discounted = base * 0.90\n" +
      "        final = round(discounted * 1.05 + extra)\n" +
      '        label = "VIP"\n' +
      "    else:\n" +
      "        final = round(base * 1.10 + extra)\n" +
      '        label = "Standard"\n' +
      "    return label, final\n\n" +
      'room_in = int(input("Enter room number: ").strip())\n' +
      'extra_in = float(input("Enter extra charges: ").strip())\n\n' +
      "found = False\n" +
      "target_idx = -1\n" +
      "if room_in in tbl_room:\n" +
      "    found = True\n" +
      "    target_idx = tbl_room.index(room_in)\n" +
      "else:\n" +
      '    print("Room not found")\n\n' +
      'print(f"{\'Room\':<6} {\'Guest\':<18} {\'Type\':<10} {\'Final(£)\':>8}")\n' +
      'print("-" * 46)\n\n' +
      "total_rev = 0\n" +
      "billing_lines = []\n\n" +
      "for i in range(len(tbl_room)):\n" +
      "    extra = extra_in if (found and i == target_idx) else 0.0\n" +
      "    label, final = calculate_invoice(tbl_account[i], extra)\n" +
      "    total_rev += final\n" +
      '    row = f"{tbl_room[i]:<6} {tbl_guest[i]:<18} {label:<10} {final:>8}"\n' +
      "    print(row)\n" +
      "    billing_lines.append(row)\n\n" +
      'print("-" * 46)\n' +
      'print(f"Total Revenue: £{total_rev}")\n\n' +
      "try:\n" +
      '    with open("billing_export.txt", "w") as f:\n' +
      "        for bl in billing_lines:\n" +
      '            f.write(bl + "\\n")\n' +
      "except Exception:\n" +
      "    pass\n\n" +
      'print("billing export file has been created")\n',
    tests: [
      {
        in: ["102", "50.0"],
        out:
          "Room   Guest              Type       Final(£)\n" +
          "----------------------------------------------\n" +
          "101    Lord Sterling      VIP             567\n" +
          "102    Ms. Alvarez        Standard        325\n" +
          "201    Sir Higgins        VIP             454\n" +
          "202    Mr. Dupont         Standard        341\n" +
          "301    Prof. Moriarty     Standard        209\n" +
          "----------------------------------------------\n" +
          "Total Revenue: £1896\n" +
          "billing export file has been created",
        m: 10,
      },
      {
        in: ["404", "25.0"],
        out:
          "Room not found\n" +
          "Room   Guest              Type       Final(£)\n" +
          "----------------------------------------------\n" +
          "101    Lord Sterling      VIP             567\n" +
          "102    Ms. Alvarez        Standard        275\n" +
          "201    Sir Higgins        VIP             454\n" +
          "202    Mr. Dupont         Standard        341\n" +
          "301    Prof. Moriarty     Standard        209\n" +
          "----------------------------------------------\n" +
          "Total Revenue: £1846\n" +
          "billing export file has been created",
        m: 10,
      },
    ],
    hint: "Extract account_str[0] for category and account_str[1:] for base. Apply extra charge to the target room if found, then export lines to billing_export.txt.",
  },

  // =========================================================================
  // 20-MARKER 6: EV Fleet Battery Range & Fast-Charge Dispatch
  // 2D List + Subprograms + File Output + Formula Calculation
  // =========================================================================
  {
    id: "cap20_06_ev_fleet_dispatch",
    unit: "U20M",
    unitName: "Paper 2 20-Marker Capstone Mastery",
    title: "Q6 EV Delivery Fleet Battery Range & Charge Dispatcher",
    level: "Exam-style",
    difficulty: "Hard",
    type: "code",
    marks: 20,
    brief:
      "A logistics depot monitors its fleet of electric delivery vans.\n" +
      "• Van identifiers are stored in tbl_van_ids.\n" +
      "• Fleet battery specs are stored in a two-dimensional array tbl_fleet, where each row has [battery_pct, wh_per_km].\n" +
      "• Each van has a 60,000 Wh (60 kWh) battery pack.\n\n" +
      "Range Formula (subprogram calculate_range):\n" +
      "• usable_wh = (battery_pct / 100.0) * 60000\n" +
      "• range_km = round(usable_wh / wh_per_km)\n\n" +
      "Dispatch Action:\n" +
      "• If range_km < 75: 'Recharge Required'\n" +
      "• Otherwise: 'Ready for Route'\n\n" +
      "The program must:\n" +
      "1. Prompt for van ID and an updated battery percentage (e.g. 'EV-03' and '95').\n" +
      "   - If found, update battery_pct for that van.\n" +
      "   - If not found, output 'Van ID not recognised'.\n" +
      "2. Display a table of Van ID, Battery %, Range (km), and Action.\n" +
      "3. Output the total operational fleet range (sum of all ranges) and number of vans requiring recharge.\n" +
      "4. Write vans requiring recharge to 'recharge_dispatch.txt' and output 'dispatch file has been created'.",
    starter:
      "# Q06 - EV Fleet Battery Dispatcher (20 Marks)\n" +
      'tbl_van_ids = ["EV-01", "EV-02", "EV-03", "EV-04", "EV-05"]\n' +
      "tbl_fleet = [\n" +
      "    [80, 240],\n" +
      "    [25, 250],\n" +
      "    [40, 220],\n" +
      "    [90, 260],\n" +
      "    [20, 230]\n" +
      "]\n\n" +
      "# Write your subprogram(s) and program below:\n",
    solution:
      "# Q06FINISHED - EV Fleet Battery Dispatcher\n" +
      'tbl_van_ids = ["EV-01", "EV-02", "EV-03", "EV-04", "EV-05"]\n' +
      "tbl_fleet = [\n" +
      "    [80, 240],\n" +
      "    [25, 250],\n" +
      "    [40, 220],\n" +
      "    [90, 260],\n" +
      "    [20, 230]\n" +
      "]\n\n" +
      "def calculate_range(pct, wh_per_km):\n" +
      "    usable = (pct / 100.0) * 60000\n" +
      "    return round(usable / wh_per_km)\n\n" +
      "def get_action(range_km):\n" +
      "    if range_km < 75:\n" +
      '        return "Recharge Required"\n' +
      "    else:\n" +
      '        return "Ready for Route"\n\n' +
      'van_in = input("Enter van ID: ").strip()\n' +
      'pct_in = int(input("Enter new battery %: ").strip())\n\n' +
      "if van_in in tbl_van_ids:\n" +
      "    idx = tbl_van_ids.index(van_in)\n" +
      "    tbl_fleet[idx][0] = pct_in\n" +
      "else:\n" +
      '    print("Van ID not recognised")\n\n' +
      'print(f"{\'Van ID\':<8} {\'Battery%\':>8} {\'Range(km)\':>10}  {\'Action\':<18}")\n' +
      'print("-" * 48)\n\n' +
      "total_range = 0\n" +
      "recharge_count = 0\n" +
      "recharge_lines = []\n\n" +
      "for i in range(len(tbl_van_ids)):\n" +
      "    pct = tbl_fleet[i][0]\n" +
      "    wh = tbl_fleet[i][1]\n" +
      "    rng = calculate_range(pct, wh)\n" +
      "    action = get_action(rng)\n" +
      "    total_range += rng\n" +
      '    if action == "Recharge Required":\n' +
      "        recharge_count += 1\n" +
      '        recharge_lines.append(f"{tbl_van_ids[i]}: {rng} km remaining")\n' +
      '    print(f"{tbl_van_ids[i]:<8} {pct:>8} {rng:>10}  {action:<18}")\n\n' +
      'print("-" * 48)\n' +
      'print(f"Total Fleet Range: {total_range} km | Recharge Queue: {recharge_count}")\n\n' +
      "try:\n" +
      '    with open("recharge_dispatch.txt", "w") as f:\n' +
      "        for rl in recharge_lines:\n" +
      '            f.write(rl + "\\n")\n' +
      "except Exception:\n" +
      "    pass\n\n" +
      'print("dispatch file has been created")\n',
    tests: [
      {
        in: ["EV-02", "90"],
        out:
          "Van ID   Battery%  Range(km)  Action            \n" +
          "------------------------------------------------\n" +
          "EV-01          80        200  Ready for Route   \n" +
          "EV-02          90        216  Ready for Route   \n" +
          "EV-03          40        109  Ready for Route   \n" +
          "EV-04          90        208  Ready for Route   \n" +
          "EV-05          20         52  Recharge Required \n" +
          "------------------------------------------------\n" +
          "Total Fleet Range: 785 km | Recharge Queue: 1\n" +
          "dispatch file has been created",
        m: 10,
      },
      {
        in: ["EV-99", "100"],
        out:
          "Van ID not recognised\n" +
          "Van ID   Battery%  Range(km)  Action            \n" +
          "------------------------------------------------\n" +
          "EV-01          80        200  Ready for Route   \n" +
          "EV-02          25         60  Recharge Required \n" +
          "EV-03          40        109  Ready for Route   \n" +
          "EV-04          90        208  Ready for Route   \n" +
          "EV-05          20         52  Recharge Required \n" +
          "------------------------------------------------\n" +
          "Total Fleet Range: 629 km | Recharge Queue: 2\n" +
          "dispatch file has been created",
        m: 10,
      },
    ],
    hint: "usable_wh = (pct / 100.0) * 60000; range_km = round(usable_wh / wh_per_km). Check range < 75 for recharge.",
  },

  // =========================================================================
  // 20-MARKER 7: Premier League Tournament Table & Relegation Monitor
  // 1D List + 2D List + Subprograms + File Output + Points Calculation
  // =========================================================================
  {
    id: "cap20_07_sports_league",
    unit: "U20M",
    unitName: "Paper 2 20-Marker Capstone Mastery",
    title: "Q6 Sports League Standings & Relegation Monitor",
    level: "Exam-style",
    difficulty: "Hard",
    type: "code",
    marks: 20,
    brief:
      "A football league maintains seasonal statistics for its clubs.\n" +
      "• Club names are stored in tbl_clubs.\n" +
      "• Match records are stored in a two-dimensional array tbl_stats, where each row represents [won, drawn, lost, goals_for, goals_against].\n\n" +
      "Points & Goal Difference (subprogram calculate_league_points):\n" +
      "• Points = (won * 3) + (drawn * 1)\n" +
      "• Goal Difference (GD) = goals_for - goals_against\n\n" +
      "The program must:\n" +
      "1. Allow recording a new match result for a club:\n" +
      "   - Prompt for club name, match outcome ('W', 'D', or 'L'), goals scored, and goals conceded.\n" +
      "   - If found, update the corresponding won/drawn/lost counter and add to goals_for and goals_against.\n" +
      "   - If not found, output 'Club not found'.\n" +
      "2. Display a formatted league table with columns: 'Club', 'Won', 'Drawn', 'Lost', 'GD', 'Points'.\n" +
      "3. Identify and print the club currently in first place (highest points).\n" +
      "4. Write current standings to 'league_standings.txt' and output 'standings file has been saved'.",
    starter:
      "# Q06 - Sports League Standings (20 Marks)\n" +
      'tbl_clubs = ["Arsenal", "Chelsea", "Liverpool", "Man City", "Tottenham"]\n' +
      "tbl_stats = [\n" +
      "    [14, 4, 2, 42, 18],\n" +
      "    [10, 5, 5, 34, 25],\n" +
      "    [13, 5, 2, 45, 20],\n" +
      "    [15, 3, 2, 48, 16],\n" +
      "    [9, 4, 7, 30, 28]\n" +
      "]\n\n" +
      "# Write your subprogram(s) and program below:\n",
    solution:
      "# Q06FINISHED - Sports League Standings\n" +
      'tbl_clubs = ["Arsenal", "Chelsea", "Liverpool", "Man City", "Tottenham"]\n' +
      "tbl_stats = [\n" +
      "    [14, 4, 2, 42, 18],\n" +
      "    [10, 5, 5, 34, 25],\n" +
      "    [13, 5, 2, 45, 20],\n" +
      "    [15, 3, 2, 48, 16],\n" +
      "    [9, 4, 7, 30, 28]\n" +
      "]\n\n" +
      "def calculate_league_points(stats_row):\n" +
      "    w, d, l, gf, ga = stats_row\n" +
      "    pts = (w * 3) + (d * 1)\n" +
      "    gd = gf - ga\n" +
      "    return gd, pts\n\n" +
      'club_in = input("Enter club: ").strip()\n' +
      'res_in = input("Enter result (W/D/L): ").strip().upper()\n' +
      'gf_in = int(input("Enter goals scored: ").strip())\n' +
      'ga_in = int(input("Enter goals conceded: ").strip())\n\n' +
      "if club_in in tbl_clubs:\n" +
      "    idx = tbl_clubs.index(club_in)\n" +
      '    if res_in == "W":\n' +
      "        tbl_stats[idx][0] += 1\n" +
      '    elif res_in == "D":\n' +
      "        tbl_stats[idx][1] += 1\n" +
      "    else:\n" +
      "        tbl_stats[idx][2] += 1\n" +
      "    tbl_stats[idx][3] += gf_in\n" +
      "    tbl_stats[idx][4] += ga_in\n" +
      "else:\n" +
      '    print("Club not found")\n\n' +
      'print(f"{\'Club\':<12} {\'Won\':>4} {\'Drawn\':>6} {\'Lost\':>5} {\'GD\':>5} {\'Points\':>7}")\n' +
      'print("-" * 43)\n\n' +
      "best_club = None\n" +
      "max_pts = -1\n" +
      "standings_lines = []\n\n" +
      "for i in range(len(tbl_clubs)):\n" +
      "    gd, pts = calculate_league_points(tbl_stats[i])\n" +
      "    if pts > max_pts:\n" +
      "        max_pts = pts\n" +
      "        best_club = tbl_clubs[i]\n" +
      "    w, d, l, gf, ga = tbl_stats[i]\n" +
      '    row = f"{tbl_clubs[i]:<12} {w:>4} {d:>6} {l:>5} {gd:>5} {pts:>7}"\n' +
      "    print(row)\n" +
      "    standings_lines.append(row)\n\n" +
      'print("-" * 43)\n' +
      'print(f"League Leader: {best_club} ({max_pts} pts)")\n\n' +
      "try:\n" +
      '    with open("league_standings.txt", "w") as f:\n' +
      "        for sl in standings_lines:\n" +
      '            f.write(sl + "\\n")\n' +
      "except Exception:\n" +
      "    pass\n\n" +
      'print("standings file has been saved")\n',
    tests: [
      {
        in: ["Arsenal", "W", "3", "0"],
        out:
          "Club          Won  Drawn  Lost    GD  Points\n" +
          "-------------------------------------------\n" +
          "Arsenal        15      4     2    27       49\n" +
          "Chelsea        10      5     5     9       35\n" +
          "Liverpool      13      5     2    25       44\n" +
          "Man City       15      3     2    32       48\n" +
          "Tottenham       9      4     7     2       31\n" +
          "-------------------------------------------\n" +
          "League Leader: Arsenal (49 pts)\n" +
          "standings file has been saved",
        m: 10,
      },
      {
        in: ["Everton", "W", "1", "0"],
        out:
          "Club not found\n" +
          "Club          Won  Drawn  Lost    GD  Points\n" +
          "-------------------------------------------\n" +
          "Arsenal        14      4     2    24       46\n" +
          "Chelsea        10      5     5     9       35\n" +
          "Liverpool      13      5     2    25       44\n" +
          "Man City       15      3     2    32       48\n" +
          "Tottenham       9      4     7     2       31\n" +
          "-------------------------------------------\n" +
          "League Leader: Man City (48 pts)\n" +
          "standings file has been saved",
        m: 10,
      },
    ],
    hint: "Points = won * 3 + drawn. GD = goals_for - goals_against. If result is 'W', increment stats[0], if 'D', stats[1], else stats[2].",
  },

  // =========================================================================
  // 20-MARKER 8: Warehouse Stock Auditor & Automated Purchase Order
  // Parallel 1D lists + Subprograms + File Output + Inventory Logic
  // =========================================================================
  {
    id: "cap20_08_warehouse_inventory",
    unit: "U20M",
    unitName: "Paper 2 20-Marker Capstone Mastery",
    title: "Q6 Warehouse Inventory Stock Auditor & Automated Purchase Order",
    level: "Exam-style",
    difficulty: "Hard",
    type: "code",
    marks: 20,
    brief:
      "An automated warehouse manages item inventories.\n" +
      "• SKUs, item descriptions, current stock, and reorder levels are stored in parallel arrays:\n" +
      "  - tbl_sku (e.g. 'SKU-10', 'SKU-20')\n" +
      "  - tbl_desc (e.g. 'Wireless Mouse', 'Mechanical Keyboard')\n" +
      "  - tbl_stock (e.g. 45, 12)\n" +
      "  - tbl_reorder (e.g. 20, 15)\n\n" +
      "Reorder Rule (subprogram evaluate_reorder):\n" +
      "• If current stock <= reorder level, the item triggers an order of 50 units, with status 'REORDER'.\n" +
      "• Otherwise, status is 'OK'.\n\n" +
      "The program must:\n" +
      "1. Allow dispatching an order:\n" +
      "   - Prompt for SKU and quantity sold.\n" +
      "   - If SKU not found, display 'SKU not found'.\n" +
      "   - If quantity sold > current stock, display 'Insufficient stock'.\n" +
      "   - Otherwise, subtract the quantity from stock.\n" +
      "2. Display a table of SKU, Description, Stock, Reorder Level, and Status.\n" +
      "3. Display total units in warehouse and how many items require reordering.\n" +
      "4. Write reorder items to 'purchase_orders.txt' and display 'purchase orders file has been written'.",
    starter:
      "# Q06 - Warehouse Inventory Auditor (20 Marks)\n" +
      'tbl_sku = ["SKU-101", "SKU-102", "SKU-103", "SKU-104", "SKU-105"]\n' +
      'tbl_desc = ["Wireless Mouse", "USB-C Hub", "HDMI Cable", "Laptop Stand", "Webcam 1080p"]\n' +
      "tbl_stock = [42, 14, 85, 9, 28]\n" +
      "tbl_reorder = [20, 15, 30, 10, 25]\n\n" +
      "# Write your subprogram(s) and program below:\n",
    solution:
      "# Q06FINISHED - Warehouse Inventory Auditor\n" +
      'tbl_sku = ["SKU-101", "SKU-102", "SKU-103", "SKU-104", "SKU-105"]\n' +
      'tbl_desc = ["Wireless Mouse", "USB-C Hub", "HDMI Cable", "Laptop Stand", "Webcam 1080p"]\n' +
      "tbl_stock = [42, 14, 85, 9, 28]\n" +
      "tbl_reorder = [20, 15, 30, 10, 25]\n\n" +
      "def evaluate_reorder(stock, reorder_lvl):\n" +
      "    if stock <= reorder_lvl:\n" +
      '        return "REORDER", 50\n' +
      "    else:\n" +
      '        return "OK", 0\n\n' +
      'sku_in = input("Enter SKU: ").strip()\n' +
      'qty_in = int(input("Enter units dispatched: ").strip())\n\n' +
      "if sku_in in tbl_sku:\n" +
      "    idx = tbl_sku.index(sku_in)\n" +
      "    if qty_in > tbl_stock[idx]:\n" +
      '        print("Insufficient stock")\n' +
      "    else:\n" +
      "        tbl_stock[idx] -= qty_in\n" +
      "else:\n" +
      '    print("SKU not found")\n\n' +
      'print(f"{\'SKU\':<9} {\'Description\':<20} {\'Stock\':>6} {\'ReorderLvl\':>11}  {\'Status\':<8}")\n' +
      'print("-" * 58)\n\n' +
      "total_units = 0\n" +
      "reorder_count = 0\n" +
      "order_lines = []\n\n" +
      "for i in range(len(tbl_sku)):\n" +
      "    stk = tbl_stock[i]\n" +
      "    r_lvl = tbl_reorder[i]\n" +
      "    status, order_qty = evaluate_reorder(stk, r_lvl)\n" +
      "    total_units += stk\n" +
      '    if status == "REORDER":\n' +
      "        reorder_count += 1\n" +
      '        order_lines.append(f"{tbl_sku[i]} - {tbl_desc[i]}: Order {order_qty} units")\n' +
      '    print(f"{tbl_sku[i]:<9} {tbl_desc[i]:<20} {stk:>6} {r_lvl:>11}  {status:<8}")\n\n' +
      'print("-" * 58)\n' +
      'print(f"Total Warehouse Stock: {total_units} | Items to Reorder: {reorder_count}")\n\n' +
      "try:\n" +
      '    with open("purchase_orders.txt", "w") as f:\n' +
      "        for ol in order_lines:\n" +
      '            f.write(ol + "\\n")\n' +
      "except Exception:\n" +
      "    pass\n\n" +
      'print("purchase orders file has been written")\n',
    tests: [
      {
        in: ["SKU-101", "25"],
        out:
          "SKU       Description           Stock  ReorderLvl  Status  \n" +
          "----------------------------------------------------------\n" +
          "SKU-101   Wireless Mouse           17          20  REORDER \n" +
          "SKU-102   USB-C Hub                14          15  REORDER \n" +
          "SKU-103   HDMI Cable               85          30  OK      \n" +
          "SKU-104   Laptop Stand              9          10  REORDER \n" +
          "SKU-105   Webcam 1080p             28          25  OK      \n" +
          "----------------------------------------------------------\n" +
          "Total Warehouse Stock: 153 | Items to Reorder: 3\n" +
          "purchase orders file has been written",
        m: 10,
      },
      {
        in: ["SKU-102", "50"],
        out:
          "Insufficient stock\n" +
          "SKU       Description           Stock  ReorderLvl  Status  \n" +
          "----------------------------------------------------------\n" +
          "SKU-101   Wireless Mouse           42          20  OK      \n" +
          "SKU-102   USB-C Hub                14          15  REORDER \n" +
          "SKU-103   HDMI Cable               85          30  OK      \n" +
          "SKU-104   Laptop Stand              9          10  REORDER \n" +
          "SKU-105   Webcam 1080p             28          25  OK      \n" +
          "----------------------------------------------------------\n" +
          "Total Warehouse Stock: 178 | Items to Reorder: 2\n" +
          "purchase orders file has been written",
        m: 10,
      },
    ],
    hint: "Validate quantity sold <= stock before deducting. Check stock <= reorder level, and write reorder items to purchase_orders.txt.",
  },

  // =========================================================================
  // 20-MARKER 9: Weather Station Rainfall Synthesis & Drought Advisory
  // 1D List + 2D List + Subprograms + File Output + Environmental Analysis
  // =========================================================================
  {
    id: "cap20_09_meteorological_rainfall",
    unit: "U20M",
    unitName: "Paper 2 20-Marker Capstone Mastery",
    title: "Q6 Weather Station Rainfall Synthesis & Drought Advisory",
    level: "Exam-style",
    difficulty: "Hard",
    type: "code",
    marks: 20,
    brief:
      "A meteorological agency tracks quarterly rainfall totals (in millimetres) across several weather stations.\n" +
      "• Station names are stored in tbl_stations.\n" +
      "• Quarterly rainfall readings [Q1, Q2, Q3, Q4] are stored in a two-dimensional array tbl_rainfall.\n\n" +
      "Classification Rules (subprogram assess_drought):\n" +
      "• Calculate annual total = sum(readings).\n" +
      "• Drought Advisory Status:\n" +
      "  - Annual total < 250: 'Severe Drought'\n" +
      "  - Annual total 250 to 500: 'Moderate Drought'\n" +
      "  - Annual total > 500: 'Normal Rainfall'\n\n" +
      "The program must:\n" +
      "1. Prompt for a station name and an updated reading for Q4 (index 3) (e.g. 'Mojave Post' and '45').\n" +
      "   - If found, update Q4 for that station.\n" +
      "   - If not found, output 'Station not found'.\n" +
      "2. Display a table of Station, Annual Total (mm), and Advisory.\n" +
      "3. Compute and display the overall average annual rainfall across all stations rounded to 1 decimal place.\n" +
      "4. Write all stations under 'Severe Drought' to 'drought_advisory.txt' and output 'drought advisory file has been exported'.",
    starter:
      "# Q06 - Weather Station Rainfall Synthesis (20 Marks)\n" +
      'tbl_stations = ["Sahara Base", "Mojave Post", "Atacama Lab", "Highland Hill", "Valley Grove"]\n' +
      "tbl_rainfall = [\n" +
      "    [12, 5, 8, 15],\n" +
      "    [65, 42, 38, 70],\n" +
      "    [4, 2, 6, 8],\n" +
      "    [180, 210, 195, 230],\n" +
      "    [95, 110, 85, 120]\n" +
      "]\n\n" +
      "# Write your subprogram(s) and program below:\n",
    solution:
      "# Q06FINISHED - Weather Station Rainfall Synthesis\n" +
      'tbl_stations = ["Sahara Base", "Mojave Post", "Atacama Lab", "Highland Hill", "Valley Grove"]\n' +
      "tbl_rainfall = [\n" +
      "    [12, 5, 8, 15],\n" +
      "    [65, 42, 38, 70],\n" +
      "    [4, 2, 6, 8],\n" +
      "    [180, 210, 195, 230],\n" +
      "    [95, 110, 85, 120]\n" +
      "]\n\n" +
      "def assess_drought(readings):\n" +
      "    total = sum(readings)\n" +
      "    if total < 250:\n" +
      '        status = "Severe Drought"\n' +
      "    elif total <= 500:\n" +
      '        status = "Moderate Drought"\n' +
      "    else:\n" +
      '        status = "Normal Rainfall"\n' +
      "    return total, status\n\n" +
      'station_in = input("Enter station name: ").strip()\n' +
      'q4_in = int(input("Enter updated Q4 rainfall: ").strip())\n\n' +
      "if station_in in tbl_stations:\n" +
      "    idx = tbl_stations.index(station_in)\n" +
      "    tbl_rainfall[idx][3] = q4_in\n" +
      "else:\n" +
      '    print("Station not found")\n\n' +
      'print(f"{\'Station\':<16} {\'Annual(mm)\':>10}  {\'Advisory\':<18}")\n' +
      'print("-" * 48)\n\n' +
      "overall_total = 0\n" +
      "drought_lines = []\n\n" +
      "for i in range(len(tbl_stations)):\n" +
      "    total, status = assess_drought(tbl_rainfall[i])\n" +
      "    overall_total += total\n" +
      '    if status == "Severe Drought":\n' +
      '        drought_lines.append(f"{tbl_stations[i]}: {total} mm")\n' +
      '    print(f"{tbl_stations[i]:<16} {total:>10}  {status:<18}")\n\n' +
      'print("-" * 48)\n' +
      "avg_rain = overall_total / len(tbl_stations)\n" +
      'print(f"Average Annual Rainfall: {avg_rain:.1f} mm")\n\n' +
      "try:\n" +
      '    with open("drought_advisory.txt", "w") as f:\n' +
      "        for dl in drought_lines:\n" +
      '            f.write(dl + "\\n")\n' +
      "except Exception:\n" +
      "    pass\n\n" +
      'print("drought advisory file has been exported")\n',
    tests: [
      {
        in: ["Mojave Post", "45"],
        out:
          "Station          Annual(mm)  Advisory          \n" +
          "------------------------------------------------\n" +
          "Sahara Base              40  Severe Drought    \n" +
          "Mojave Post             190  Severe Drought    \n" +
          "Atacama Lab              20  Severe Drought    \n" +
          "Highland Hill           815  Normal Rainfall   \n" +
          "Valley Grove            410  Moderate Drought  \n" +
          "------------------------------------------------\n" +
          "Average Annual Rainfall: 295.0 mm\n" +
          "drought advisory file has been exported",
        m: 10,
      },
      {
        in: ["Greenland Peak", "50"],
        out:
          "Station not found\n" +
          "Station          Annual(mm)  Advisory          \n" +
          "------------------------------------------------\n" +
          "Sahara Base              40  Severe Drought    \n" +
          "Mojave Post             215  Severe Drought    \n" +
          "Atacama Lab              20  Severe Drought    \n" +
          "Highland Hill           815  Normal Rainfall   \n" +
          "Valley Grove            410  Moderate Drought  \n" +
          "------------------------------------------------\n" +
          "Average Annual Rainfall: 300.0 mm\n" +
          "drought advisory file has been exported",
        m: 10,
      },
    ],
    hint: "Total = sum(readings). Check total < 250 for Severe Drought and total <= 500 for Moderate Drought. Write Severe Drought stations to drought_advisory.txt.",
  },

  // =========================================================================
  // 20-MARKER 10: University Module Weighted Mark & Transcript Exporter
  // Parallel 1D lists + 2D List + Subprograms + File Output + Degree Classes
  // =========================================================================
  {
    id: "cap20_10_university_coursework",
    unit: "U20M",
    unitName: "Paper 2 20-Marker Capstone Mastery",
    title: "Q6 University Weighted Mark Normaliser & Transcript Exporter",
    level: "Exam-style",
    difficulty: "Hard",
    type: "code",
    marks: 20,
    brief:
      "A university department calculates final degree module scores.\n" +
      "• Student IDs and names are stored in parallel arrays: tbl_student_id, tbl_names.\n" +
      "• Raw assessment component scores are stored in a two-dimensional array tbl_components, where each row has [exam_mark, coursework_mark].\n" +
      "  - Exam is out of 100 and weighted at 60%.\n" +
      "  - Coursework is out of 50 and weighted at 40% (scale to percentage by multiplying by 2, then weight by 0.4).\n\n" +
      "Weighting Formula (subprogram compute_weighted_score):\n" +
      "• cw_pct = (coursework_mark / 50.0) * 100\n" +
      "• weighted_total = round((exam_mark * 0.60) + (cw_pct * 0.40))\n\n" +
      "Degree Classification:\n" +
      "• >= 70: 'First Class'\n" +
      "• 60 to 69: 'Upper Second'\n" +
      "• 50 to 59: 'Lower Second'\n" +
      "• 40 to 49: 'Third Class'\n" +
      "• < 40: 'Fail'\n\n" +
      "The program must:\n" +
      "1. Prompt for student ID and an updated coursework mark (e.g. 'ST-201' and '44').\n" +
      "   - If found, update the coursework mark (index 1) for that student.\n" +
      "   - If not found, output 'Student not found'.\n" +
      "2. Display a transcript table with: Student ID, Name, Overall %, and Degree Class.\n" +
      "3. Display the cohort average overall percentage as a rounded whole number.\n" +
      "4. Write students earning 'First Class' or 'Upper Second' to 'honors_transcripts.txt' and output 'transcripts file has been generated'.",
    starter:
      "# Q06 - University Module Normaliser (20 Marks)\n" +
      'tbl_student_id = ["ST-201", "ST-202", "ST-203", "ST-204", "ST-205"]\n' +
      'tbl_names = ["Bethany Taylor", "Callum Scott", "Diana Prince", "Ethan Hunt", "Fiona Gallagher"]\n' +
      "tbl_components = [\n" +
      "    [68, 38],\n" +
      "    [84, 46],\n" +
      "    [52, 28],\n" +
      "    [76, 42],\n" +
      "    [35, 20]\n" +
      "]\n\n" +
      "# Write your subprogram(s) and program below:\n",
    solution:
      "# Q06FINISHED - University Module Normaliser\n" +
      'tbl_student_id = ["ST-201", "ST-202", "ST-203", "ST-204", "ST-205"]\n' +
      'tbl_names = ["Bethany Taylor", "Callum Scott", "Diana Prince", "Ethan Hunt", "Fiona Gallagher"]\n' +
      "tbl_components = [\n" +
      "    [68, 38],\n" +
      "    [84, 46],\n" +
      "    [52, 28],\n" +
      "    [76, 42],\n" +
      "    [35, 20]\n" +
      "]\n\n" +
      "def compute_weighted_score(exam, cw):\n" +
      "    cw_pct = (cw / 50.0) * 100\n" +
      "    final_mark = round((exam * 0.60) + (cw_pct * 0.40))\n" +
      "    if final_mark >= 70:\n" +
      '        d_class = "First Class"\n' +
      "    elif final_mark >= 60:\n" +
      '        d_class = "Upper Second"\n' +
      "    elif final_mark >= 50:\n" +
      '        d_class = "Lower Second"\n' +
      "    elif final_mark >= 40:\n" +
      '        d_class = "Third Class"\n' +
      "    else:\n" +
      '        d_class = "Fail"\n' +
      "    return final_mark, d_class\n\n" +
      'sid_in = input("Enter student ID: ").strip()\n' +
      'cw_in = int(input("Enter updated coursework: ").strip())\n\n' +
      "if sid_in in tbl_student_id:\n" +
      "    idx = tbl_student_id.index(sid_in)\n" +
      "    tbl_components[idx][1] = cw_in\n" +
      "else:\n" +
      '    print("Student not found")\n\n' +
      'print(f"{\'ID\':<8} {\'Name\':<18} {\'Overall%\':>8}  {\'Degree Class\':<14}")\n' +
      'print("-" * 52)\n\n' +
      "total_pct = 0\n" +
      "honors_lines = []\n\n" +
      "for i in range(len(tbl_student_id)):\n" +
      "    exam = tbl_components[i][0]\n" +
      "    cw = tbl_components[i][1]\n" +
      "    final_mark, d_class = compute_weighted_score(exam, cw)\n" +
      "    total_pct += final_mark\n" +
      '    if d_class in ["First Class", "Upper Second"]:\n' +
      '        honors_lines.append(f"{tbl_student_id[i]} {tbl_names[i]} - {final_mark}% ({d_class})")\n' +
      '    print(f"{tbl_student_id[i]:<8} {tbl_names[i]:<18} {final_mark:>8}  {d_class:<14}")\n\n' +
      'print("-" * 52)\n' +
      "cohort_avg = round(total_pct / len(tbl_student_id))\n" +
      'print(f"Cohort Average: {cohort_avg}%")\n\n' +
      "try:\n" +
      '    with open("honors_transcripts.txt", "w") as f:\n' +
      "        for hl in honors_lines:\n" +
      '            f.write(hl + "\\n")\n' +
      "except Exception:\n" +
      "    pass\n\n" +
      'print("transcripts file has been generated")\n',
    tests: [
      {
        in: ["ST-201", "44"],
        out:
          "ID       Name               Overall%  Degree Class  \n" +
          "----------------------------------------------------\n" +
          "ST-201   Bethany Taylor           76  First Class   \n" +
          "ST-202   Callum Scott             87  First Class   \n" +
          "ST-203   Diana Prince             54  Lower Second  \n" +
          "ST-204   Ethan Hunt               79  First Class   \n" +
          "ST-205   Fiona Gallagher          37  Fail          \n" +
          "----------------------------------------------------\n" +
          "Cohort Average: 67%\n" +
          "transcripts file has been generated",
        m: 10,
      },
      {
        in: ["ST-999", "50"],
        out:
          "Student not found\n" +
          "ID       Name               Overall%  Degree Class  \n" +
          "----------------------------------------------------\n" +
          "ST-201   Bethany Taylor           71  First Class   \n" +
          "ST-202   Callum Scott             87  First Class   \n" +
          "ST-203   Diana Prince             54  Lower Second  \n" +
          "ST-204   Ethan Hunt               79  First Class   \n" +
          "ST-205   Fiona Gallagher          37  Fail          \n" +
          "----------------------------------------------------\n" +
          "Cohort Average: 66%\n" +
          "transcripts file has been generated",
        m: 10,
      },
    ],
    hint: "cw_pct = (cw / 50.0) * 100. final_mark = round((exam * 0.60) + (cw_pct * 0.40)). Check final_mark for degree classifications and export honors lines.",
  },
];

export const EDEXCEL_20_MARKER_TASKS: IGCSETask[] = [
  ...EDEXCEL_20_MARKER_TASKS_PART1,
  ...EDEXCEL_20_MARKER_TASKS_PART2,
];

/**
 * Returns the Unit object for the 20-marker capstone mastery module.
 */
export function get20MarkerUnit(): IGCSEUnit {
  return {
    code: "U20M",
    title: "Paper 2 Capstone 20-Marker Mastery (1D & 2D Lists, Parallel Arrays, Files & Subprograms)",
    topicGroup: "Past Examination Papers",
    paper: "Paper 2",
    blurb:
      "Full 20-mark comprehensive Paper 2 Question 6 synthesis problems: Air cargo manifests, hospital triage, wind turbines, Olympiad 2D matrix, hotel billing, EV dispatch, sports leagues, warehouse inventory, meteorological rainfall, degree transcripts, airline excess baggage, smart greenhouse 2D sensors, emergency blood bank, school bus fleet routes, cinema 2D seating, loyalty cashback rebates, solar telemetry, marathon chip timing, library overdue fines, and orbital space station docking.",
    tasks: EDEXCEL_20_MARKER_TASKS,
  };
}
