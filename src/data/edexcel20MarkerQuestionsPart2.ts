import { IGCSETask } from "../types";

/**
 * =========================================================================
 * PEARSON EDEXCEL INTERNATIONAL GCSE (9-1) COMPUTER SCIENCE (4CP0)
 * PAPER 2: 20-MARKER CAPSTONE QUESTIONS BANK - PART 2 (QUESTIONS 11 TO 20)
 *
 * Each question is a full 20-mark algorithmic synthesis task featuring:
 * - 1D lists, parallel 1D lists, or 2D lists
 * - Subprograms (functions and procedures with parameters & return values)
 * - File handling (writing / updating text report files)
 * - Dynamic data manipulation, searching, validation, and formatted tables
 * - Multi-test automated verification suite with Anti-Hardcoding Shields
 * =========================================================================
 */

export const EDEXCEL_20_MARKER_TASKS_PART2: IGCSETask[] = [
  // =========================================================================
  // 20-MARKER 11: International Airline Excess Baggage & Audit Logger
  // Parallel 1D lists + Subprograms + Excess Fee Calculation + File Handling
  // =========================================================================
  {
    id: "cap20_11_airline_baggage",
    unit: "U20M",
    unitName: "Paper 2 20-Marker Capstone Mastery",
    title: "Q6 Airline Baggage Allowance & Excess Fee Audit Logger",
    level: "Exam-style",
    difficulty: "Hard",
    type: "code",
    marks: 20,
    brief:
      "An airline check-in terminal tracks passenger luggage allowances.\n" +
      "Passenger IDs, ticket classes ('E' for Economy, 'B' for Business, 'F' for First Class), and checked baggage weights (kg) are stored in three parallel lists:\n" +
      "• tbl_passengers = ['PA-101', 'PA-102', 'PA-103', 'PA-104', 'PA-105', 'PA-106']\n" +
      "• tbl_classes = ['E', 'B', 'E', 'F', 'E', 'B']\n" +
      "• tbl_weights = [21.5, 34.0, 26.2, 42.0, 19.8, 31.5]\n\n" +
      "Allowance Rules & Excess Charges:\n" +
      "• Economy ('E'): Standard allowance is 20 kg. Excess weight is charged at £12 per full kg (using math.floor or int for excess).\n" +
      "• Business ('B'): Standard allowance is 30 kg. Excess weight is charged at £15 per full kg.\n" +
      "• First Class ('F'): Standard allowance is 40 kg. Excess weight is charged at £20 per full kg.\n\n" +
      "Requirements:\n" +
      "1. Allow the check-in agent to input a passenger ID and a new weighed baggage weight (e.g. 'PA-103' and '28.5').\n" +
      "   - If the passenger ID is found, update the weight in tbl_weights.\n" +
      "   - If not found, output 'Passenger not found'.\n" +
      "2. Define at least one subprogram calculate_excess(ticket_class, weight) that returns the integer excess kg and the calculated fee (£).\n" +
      "3. Display a formatted manifest table with:\n" +
      "   - Columns: Passenger ID, Class, Weight(kg), Excess(kg), Fee(£)\n" +
      "   - Table dividing lines\n" +
      "   - Total baggage revenue collected across all passengers\n" +
      "4. Write the audited manifest to 'baggage_audit.txt' and print 'baggage audit file has been generated'.",
    starter:
      "# Q06 - Airline Baggage Allowance & Excess Fee Audit Logger (20 Marks)\n" +
      'tbl_passengers = ["PA-101", "PA-102", "PA-103", "PA-104", "PA-105", "PA-106"]\n' +
      'tbl_classes = ["E", "B", "E", "F", "E", "B"]\n' +
      'tbl_weights = [21.5, 34.0, 26.2, 42.0, 19.8, 31.5]\n\n' +
      "# Write your subprogram(s) and program below:\n",
    solution:
      "# Q06 - Airline Baggage Solution\n" +
      'tbl_passengers = ["PA-101", "PA-102", "PA-103", "PA-104", "PA-105", "PA-106"]\n' +
      'tbl_classes = ["E", "B", "E", "F", "E", "B"]\n' +
      'tbl_weights = [21.5, 34.0, 26.2, 42.0, 19.8, 31.5]\n\n' +
      "def calculate_excess(ticket_class, weight):\n" +
      '    if ticket_class == "E":\n' +
      "        allowance, rate = 20, 12\n" +
      '    elif ticket_class == "B":\n' +
      "        allowance, rate = 30, 15\n" +
      "    else:\n" +
      "        allowance, rate = 40, 20\n" +
      "    if weight > allowance:\n" +
      "        excess_kg = int(weight - allowance)\n" +
      "        fee = excess_kg * rate\n" +
      "    else:\n" +
      "        excess_kg = 0\n" +
      "        fee = 0\n" +
      "    return excess_kg, fee\n\n" +
      'p_in = input("Enter passenger ID: ").strip()\n' +
      'w_in = float(input("Enter new baggage weight: ").strip())\n\n' +
      "if p_in in tbl_passengers:\n" +
      "    idx = tbl_passengers.index(p_in)\n" +
      "    tbl_weights[idx] = w_in\n" +
      "else:\n" +
      '    print("Passenger not found")\n\n' +
      'print("ID        Class  Weight(kg)  Excess(kg)  Fee(£)")\n' +
      'print("-" * 47)\n' +
      "total_rev = 0\n" +
      'audit_rows = ["ID,Class,Weight,Excess,Fee\\n"]\n' +
      "for i in range(len(tbl_passengers)):\n" +
      "    ex, fee = calculate_excess(tbl_classes[i], tbl_weights[i])\n" +
      "    total_rev += fee\n" +
      '    row_str = f"{tbl_passengers[i]:<10}{tbl_classes[i]:<7}{tbl_weights[i]:<12.1f}{ex:<12}{fee}"\n' +
      "    print(row_str)\n" +
      '    audit_rows.append(f"{tbl_passengers[i]},{tbl_classes[i]},{tbl_weights[i]},{ex},{fee}\\n")\n' +
      'print("-" * 47)\n' +
      'print(f"Total Excess Revenue: £{total_rev}")\n\n' +
      'with open("baggage_audit.txt", "w") as f:\n' +
      "    f.writelines(audit_rows)\n" +
      'print("baggage audit file has been generated")\n',
    markScheme:
      "Pearson Edexcel 4CP0 Specification Mark Scheme (20 Marks):\n" +
      "• Subprogram declaration calculate_excess with parameters and return value (4 marks)\n" +
      "• Input reading and validation/updating parallel list values (3 marks)\n" +
      "• Correct mathematical excess computation by ticket tier (4 marks)\n" +
      "• Formatting table output with consistent column alignment and dividing rules (4 marks)\n" +
      "• Accurate accumulation of revenue and console reporting (2 marks)\n" +
      "• File writing to baggage_audit.txt with success confirmation (3 marks)\n" +
      "Specification Note: Any valid method that calculates correct outputs is awarded full credit.",
    tests: [
      {
        in: ["PA-103", "28.5"],
        out:
          "ID        Class  Weight(kg)  Excess(kg)  Fee(£)\n" +
          "-----------------------------------------------\n" +
          "PA-101    E      21.5        1           12\n" +
          "PA-102    B      34.0        4           60\n" +
          "PA-103    E      28.5        8           96\n" +
          "PA-104    F      42.0        2           40\n" +
          "PA-105    E      19.8        0           0\n" +
          "PA-106    B      31.5        1           15\n" +
          "-----------------------------------------------\n" +
          "Total Excess Revenue: £223\n" +
          "baggage audit file has been generated\n",
        m: 10,
      },
      {
        in: ["PA-999", "25.0"],
        out:
          "Passenger not found\n" +
          "ID        Class  Weight(kg)  Excess(kg)  Fee(£)\n" +
          "-----------------------------------------------\n" +
          "PA-101    E      21.5        1           12\n" +
          "PA-102    B      34.0        4           60\n" +
          "PA-103    E      26.2        6           72\n" +
          "PA-104    F      42.0        2           40\n" +
          "PA-105    E      19.8        0           0\n" +
          "PA-106    B      31.5        1           15\n" +
          "-----------------------------------------------\n" +
          "Total Excess Revenue: £199\n" +
          "baggage audit file has been generated\n",
        m: 10,
      },
    ],
    hint: "Calculate excess kg using int(weight - allowance) if weight exceeds the class allowance, otherwise 0.",
  },

  // =========================================================================
  // 20-MARKER 12: Smart Greenhouse 2D Moisture & Temperature Grid
  // 2D Matrix Grid + Subprograms + Anomaly Detection + File Handling
  // =========================================================================
  {
    id: "cap20_12_smart_greenhouse",
    unit: "U20M",
    unitName: "Paper 2 20-Marker Capstone Mastery",
    title: "Q6 Commercial Smart Greenhouse 2D Moisture Grid Monitor",
    level: "Exam-style",
    difficulty: "Hard",
    type: "code",
    marks: 20,
    brief:
      "A commercial horticultural greenhouse is divided into a 3x4 grid of growing sectors.\n" +
      "Soil moisture percentages are represented in a 2D list (3 rows x 4 columns):\n" +
      "grid_moisture = [\n" +
      "  [45, 62, 38, 55],\n" +
      "  [70, 31, 48, 64],\n" +
      "  [52, 59, 29, 73]\n" +
      "]\n\n" +
      "Irrigation Criteria:\n" +
      "• Moisture < 40%: 'DRY' (Valve ON)\n" +
      "• 40% <= Moisture <= 65%: 'OPTIMAL' (Valve OFF)\n" +
      "• Moisture > 65%: 'DAMP' (Ventilation ON)\n\n" +
      "Requirements:\n" +
      "1. Allow an agronomist to enter a target row (0 to 2), a target column (0 to 3), and an updated sensor reading (e.g. 1, 1, 58).\n" +
      "   - Validate that row is 0..2 and col is 0..3. If invalid, output 'Invalid coordinates'.\n" +
      "   - Otherwise update the moisture value at grid_moisture[row][col].\n" +
      "2. Write a subprogram get_sector_status(moisture_value) that returns 'DRY', 'OPTIMAL', or 'DAMP'.\n" +
      "3. Display a 2D formatted map showing each sector's moisture and status code:\n" +
      "   - For example: [Row 0] Col 0: 45%(OPTIMAL)  Col 1: 62%(OPTIMAL) ...\n" +
      "   - Calculate the overall average moisture of the entire greenhouse (rounded whole number).\n" +
      "   - Count the total number of sectors marked 'DRY'.\n" +
      "4. Write an alert list of all sectors needing irrigation ('DRY') to 'irrigation_alerts.txt' and print 'irrigation alert file generated'.",
    starter:
      "# Q06 - Commercial Smart Greenhouse 2D Moisture Grid (20 Marks)\n" +
      "grid_moisture = [\n" +
      "    [45, 62, 38, 55],\n" +
      "    [70, 31, 48, 64],\n" +
      "    [52, 59, 29, 73]\n" +
      "]\n\n" +
      "# Write your subprogram(s) and program below:\n",
    solution:
      "# Q06 - Smart Greenhouse Solution\n" +
      "grid_moisture = [\n" +
      "    [45, 62, 38, 55],\n" +
      "    [70, 31, 48, 64],\n" +
      "    [52, 59, 29, 73]\n" +
      "]\n\n" +
      "def get_sector_status(val):\n" +
      "    if val < 40:\n" +
      '        return "DRY"\n' +
      "    elif val <= 65:\n" +
      '        return "OPTIMAL"\n' +
      "    else:\n" +
      '        return "DAMP"\n\n' +
      'r_in = int(input("Enter row (0-2): ").strip())\n' +
      'c_in = int(input("Enter column (0-3): ").strip())\n' +
      'val_in = int(input("Enter moisture percentage: ").strip())\n\n' +
      "if 0 <= r_in < 3 and 0 <= c_in < 4:\n" +
      "    grid_moisture[r_in][c_in] = val_in\n" +
      "else:\n" +
      '    print("Invalid coordinates")\n\n' +
      'print("--- Greenhouse Moisture Map ---")\n' +
      "total_sum = 0\n" +
      "cell_count = 0\n" +
      "dry_count = 0\n" +
      "alerts = []\n\n" +
      "for r in range(3):\n" +
      '    row_line = f"Row {r}: "\n' +
      "    for c in range(4):\n" +
      "        m = grid_moisture[r][c]\n" +
      "        stat = get_sector_status(m)\n" +
      "        total_sum += m\n" +
      "        cell_count += 1\n" +
      '        if stat == "DRY":\n' +
      "            dry_count += 1\n" +
      '            alerts.append(f"Sector ({r},{c}): {m}% - Valve ON\\n")\n' +
      '        row_line += f"[{m}% {stat}] "\n' +
      "    print(row_line.strip())\n\n" +
      "avg_m = round(total_sum / cell_count)\n" +
      'print("-" * 35)\n' +
      'print(f"Average Moisture: {avg_m}%")\n' +
      'print(f"Dry Sectors Requiring Water: {dry_count}")\n\n' +
      'with open("irrigation_alerts.txt", "w") as f:\n' +
      "    f.writelines(alerts)\n" +
      'print("irrigation alert file generated")\n',
    markScheme:
      "Pearson Edexcel 4CP0 Specification Mark Scheme (20 Marks):\n" +
      "• 2D array indexing and coordinate boundary validation (3 marks)\n" +
      "• Subprogram declaration with correct conditional returns ('DRY', 'OPTIMAL', 'DAMP') (4 marks)\n" +
      "• Nested loop traversal through 3x4 2D list (4 marks)\n" +
      "• Accurate mathematical calculation of mean moisture and dry sector counter (3 marks)\n" +
      "• Formatted visual grid map output (3 marks)\n" +
      "• Writing alert report to file with confirmation message (3 marks)",
    tests: [
      {
        in: ["1", "1", "58"],
        out:
          "--- Greenhouse Moisture Map ---\n" +
          "Row 0: [45% OPTIMAL] [62% OPTIMAL] [38% DRY] [55% OPTIMAL]\n" +
          "Row 1: [70% DAMP] [58% OPTIMAL] [48% OPTIMAL] [64% OPTIMAL]\n" +
          "Row 2: [52% OPTIMAL] [59% OPTIMAL] [29% DRY] [73% DAMP]\n" +
          "-----------------------------------\n" +
          "Average Moisture: 54%\n" +
          "Dry Sectors Requiring Water: 2\n" +
          "irrigation alert file generated\n",
        m: 10,
      },
      {
        in: ["5", "0", "40"],
        out:
          "Invalid coordinates\n" +
          "--- Greenhouse Moisture Map ---\n" +
          "Row 0: [45% OPTIMAL] [62% OPTIMAL] [38% DRY] [55% OPTIMAL]\n" +
          "Row 1: [70% DAMP] [31% DRY] [48% OPTIMAL] [64% OPTIMAL]\n" +
          "Row 2: [52% OPTIMAL] [59% OPTIMAL] [29% DRY] [73% DAMP]\n" +
          "-----------------------------------\n" +
          "Average Moisture: 52%\n" +
          "Dry Sectors Requiring Water: 3\n" +
          "irrigation alert file generated\n",
        m: 10,
      },
    ],
    hint: "Use nested loops: for r in range(3): for c in range(4): to process each sector in the 2D matrix.",
  },

  // =========================================================================
  // 20-MARKER 13: Emergency Blood Bank Donor Matching & Callout
  // Parallel 1D lists + Subprograms + Compatibility Algorithm + File Handling
  // =========================================================================
  {
    id: "cap20_13_blood_bank_donor_system",
    unit: "U20M",
    unitName: "Paper 2 20-Marker Capstone Mastery",
    title: "Q6 Emergency Blood Bank Donor Compatibility & Callout System",
    level: "Exam-style",
    difficulty: "Hard",
    type: "code",
    marks: 20,
    brief:
      "A national health service operates a regional blood donor registry.\n" +
      "Donor details are stored across four parallel lists:\n" +
      "• tbl_donor_id = ['D101', 'D102', 'D103', 'D104', 'D105', 'D106', 'D107']\n" +
      "• tbl_blood_group = ['O-', 'O+', 'A+', 'B+', 'AB+', 'O-', 'A-']\n" +
      "• tbl_months_since_donation = [4, 1, 5, 2, 7, 3, 2]\n" +
      "• tbl_phone = ['077009001', '077009002', '077009003', '077009004', '077009005', '077009006', '077009007']\n\n" +
      "Eligibility & Compatibility Rules:\n" +
      "• Minimum Wait Period: A donor must not have donated for at least 3 months (months >= 3) to be eligible.\n" +
      "• Universal Donor: Group 'O-' can donate to ANY blood group.\n" +
      "• Same Group: Any donor can donate to their identical group.\n\n" +
      "Requirements:\n" +
      "1. Allow an emergency coordinator to enter a recipient's requested blood group (e.g. 'A+').\n" +
      "2. Write a subprogram is_compatible(donor_group, recipient_group) returning True or False.\n" +
      "3. Write a subprogram is_eligible(months) returning True if months >= 3 else False.\n" +
      "4. Display a table of all matched ELIGIBLE donors:\n" +
      "   - Header: Donor ID, Blood Group, Months Inactive, Contact\n" +
      "   - Total count of eligible matching donors\n" +
      "5. Export the callout contact list to 'urgent_donors.txt' and display 'urgent donor file generated'.",
    starter:
      "# Q06 - Emergency Blood Bank Donor System (20 Marks)\n" +
      'tbl_donor_id = ["D101", "D102", "D103", "D104", "D105", "D106", "D107"]\n' +
      'tbl_blood_group = ["O-", "O+", "A+", "B+", "AB+", "O-", "A-"]\n' +
      "tbl_months_since_donation = [4, 1, 5, 2, 7, 3, 2]\n" +
      'tbl_phone = ["077009001", "077009002", "077009003", "077009004", "077009005", "077009006", "077009007"]\n\n' +
      "# Write your subprogram(s) and program below:\n",
    solution:
      "# Q06 - Blood Bank Solution\n" +
      'tbl_donor_id = ["D101", "D102", "D103", "D104", "D105", "D106", "D107"]\n' +
      'tbl_blood_group = ["O-", "O+", "A+", "B+", "AB+", "O-", "A-"]\n' +
      "tbl_months_since_donation = [4, 1, 5, 2, 7, 3, 2]\n" +
      'tbl_phone = ["077009001", "077009002", "077009003", "077009004", "077009005", "077009006", "077009007"]\n\n' +
      "def is_compatible(donor_group, recipient_group):\n" +
      '    if donor_group == "O-":\n' +
      "        return True\n" +
      "    return donor_group == recipient_group\n\n" +
      "def is_eligible(months):\n" +
      "    return months >= 3\n\n" +
      'recip_group = input("Enter recipient blood group: ").strip().upper()\n\n' +
      'print(f"--- Eligible Compatible Donors for {recip_group} ---")\n' +
      'print("ID      Group   Months  Phone      ")\n' +
      'print("-" * 35)\n' +
      "matched_count = 0\n" +
      "export_lines = []\n\n" +
      "for i in range(len(tbl_donor_id)):\n" +
      "    d_grp = tbl_blood_group[i]\n" +
      "    d_months = tbl_months_since_donation[i]\n" +
      "    if is_compatible(d_grp, recip_group) and is_eligible(d_months):\n" +
      "        matched_count += 1\n" +
      '        line = f"{tbl_donor_id[i]:<8}{d_grp:<8}{d_months:<8}{tbl_phone[i]}"\n' +
      "        print(line)\n" +
      '        export_lines.append(f"{tbl_donor_id[i]},{d_grp},{tbl_phone[i]}\\n")\n\n' +
      'print("-" * 35)\n' +
      'print(f"Total Eligible Donors Found: {matched_count}")\n\n' +
      'with open("urgent_donors.txt", "w") as f:\n' +
      "    f.writelines(export_lines)\n" +
      'print("urgent donor file generated")\n',
    markScheme:
      "Pearson Edexcel 4CP0 Specification Mark Scheme (20 Marks):\n" +
      "• Defining modular subprograms with boolean return values (4 marks)\n" +
      "• Multi-list parallel iteration and index synchronization (4 marks)\n" +
      "• Implementing compatibility and eligibility logic correctly (4 marks)\n" +
      "• Formatted console table display with headers and dividers (3 marks)\n" +
      "• Accurate accumulation of donor count (2 marks)\n" +
      "• File writing to urgent_donors.txt and confirmation message (3 marks)",
    tests: [
      {
        in: ["A+"],
        out:
          "--- Eligible Compatible Donors for A+ ---\n" +
          "ID      Group   Months  Phone      \n" +
          "-----------------------------------\n" +
          "D101    O-      4       077009001\n" +
          "D103    A+      5       077009003\n" +
          "D106    O-      3       077009006\n" +
          "-----------------------------------\n" +
          "Total Eligible Donors Found: 3\n" +
          "urgent donor file generated\n",
        m: 10,
      },
      {
        in: ["B+"],
        out:
          "--- Eligible Compatible Donors for B+ ---\n" +
          "ID      Group   Months  Phone      \n" +
          "-----------------------------------\n" +
          "D101    O-      4       077009001\n" +
          "D106    O-      3       077009006\n" +
          "-----------------------------------\n" +
          "Total Eligible Donors Found: 2\n" +
          "urgent donor file generated\n",
        m: 10,
      },
    ],
    hint: "A donor is compatible if their group is 'O-' OR matches the recipient's group. Eligible if months >= 3.",
  },

  // =========================================================================
  // 20-MARKER 14: School Bus Fleet Route Allocation & Capacity Audit
  // Parallel 1D lists + Subprograms + Overcrowding Detection + File Handling
  // =========================================================================
  {
    id: "cap20_14_school_bus_routes",
    unit: "U20M",
    unitName: "Paper 2 20-Marker Capstone Mastery",
    title: "Q6 School Bus Route Capacity & Passenger Dispatcher",
    level: "Exam-style",
    difficulty: "Hard",
    type: "code",
    marks: 20,
    brief:
      "A district school bus transport company monitors fleet seat allocation.\n" +
      "Route IDs, vehicle capacity, current registered passengers, and driver names are stored in four parallel arrays:\n" +
      "• routes = ['R-01', 'R-02', 'R-03', 'R-04', 'R-05']\n" +
      "• capacities = [52, 45, 60, 32, 50]\n" +
      "• passengers = [48, 45, 59, 36, 42]\n" +
      "• drivers = ['Harrison', 'Mendoza', 'Patel', 'Davies', 'Al-Mansoor']\n\n" +
      "Capacity Status Criteria:\n" +
      "• passengers > capacity: 'OVERCROWDED' (Safety violation)\n" +
      "• passengers == capacity: 'FULL'\n" +
      "• passengers < capacity: 'SEATS AVAILABLE'\n\n" +
      "Requirements:\n" +
      "1. Allow a logistics supervisor to enter a route ID and additional students requesting transfer (e.g. 'R-01' and 3).\n" +
      "   - If route is found, add the transfer students to that route's passenger count.\n" +
      "   - If not found, output 'Route not found'.\n" +
      "2. Write a subprogram get_utilization_pct(passengers, capacity) that returns the utilization percentage as a rounded integer.\n" +
      "3. Write a subprogram get_status(passengers, capacity) returning 'OVERCROWDED', 'FULL', or 'SEATS AVAILABLE'.\n" +
      "4. Display a route audit table with columns: Route, Driver, Capacity, Passengers, Utilisation%, Status.\n" +
      "   - Display total passengers transported across the district.\n" +
      "   - Count how many routes are OVERCROWDED.\n" +
      "5. Export all routes with their status to 'bus_fleet_status.csv' and print 'bus fleet report file has been created'.",
    starter:
      "# Q06 - School Bus Fleet Route Allocation (20 Marks)\n" +
      'routes = ["R-01", "R-02", "R-03", "R-04", "R-05"]\n' +
      "capacities = [52, 45, 60, 32, 50]\n" +
      "passengers = [48, 45, 59, 36, 42]\n" +
      'drivers = ["Harrison", "Mendoza", "Patel", "Davies", "Al-Mansoor"]\n\n' +
      "# Write your subprogram(s) and program below:\n",
    solution:
      "# Q06 - School Bus Solution\n" +
      'routes = ["R-01", "R-02", "R-03", "R-04", "R-05"]\n' +
      "capacities = [52, 45, 60, 32, 50]\n" +
      "passengers = [48, 45, 59, 36, 42]\n" +
      'drivers = ["Harrison", "Mendoza", "Patel", "Davies", "Al-Mansoor"]\n\n' +
      "def get_utilization_pct(p, c):\n" +
      "    return round((p / c) * 100)\n\n" +
      "def get_status(p, c):\n" +
      "    if p > c:\n" +
      '        return "OVERCROWDED"\n' +
      "    elif p == c:\n" +
      '        return "FULL"\n' +
      "    else:\n" +
      '        return "SEATS AVAILABLE"\n\n' +
      'r_in = input("Enter route ID: ").strip()\n' +
      'add_p = int(input("Enter additional passengers: ").strip())\n\n' +
      "if r_in in routes:\n" +
      "    idx = routes.index(r_in)\n" +
      "    passengers[idx] += add_p\n" +
      "else:\n" +
      '    print("Route not found")\n\n' +
      'print("Route   Driver        Capacity  Passengers  Util%  Status         ")\n' +
      'print("-" * 65)\n' +
      "total_passengers = 0\n" +
      "overcrowded_count = 0\n" +
      'csv_lines = ["Route,Driver,Capacity,Passengers,Util%,Status\\n"]\n\n' +
      "for i in range(len(routes)):\n" +
      "    total_passengers += passengers[i]\n" +
      "    util = get_utilization_pct(passengers[i], capacities[i])\n" +
      "    stat = get_status(passengers[i], capacities[i])\n" +
      '    if stat == "OVERCROWDED":\n' +
      "        overcrowded_count += 1\n" +
      '    row = f"{routes[i]:<8}{drivers[i]:<14}{capacities[i]:<10}{passengers[i]:<12}{util:<7}{stat}"\n' +
      "    print(row)\n" +
      '    csv_lines.append(f"{routes[i]},{drivers[i]},{capacities[i]},{passengers[i]},{util}%,{stat}\\n")\n\n' +
      'print("-" * 65)\n' +
      'print(f"Total District Passengers: {total_passengers}")\n' +
      'print(f"Overcrowded Routes: {overcrowded_count}")\n\n' +
      'with open("bus_fleet_status.csv", "w") as f:\n' +
      "    f.writelines(csv_lines)\n" +
      'print("bus fleet report file has been created")\n',
    markScheme:
      "Pearson Edexcel 4CP0 Specification Mark Scheme (20 Marks):\n" +
      "• Subprograms with parameters and percentage calculations (4 marks)\n" +
      "• Linear search and updating corresponding array element in parallel list (3 marks)\n" +
      "• Condition evaluation for status classification (3 marks)\n" +
      "• Displaying aligned summary table with accurate totals (4 marks)\n" +
      "• Counting safety violations (overcrowded routes) (3 marks)\n" +
      "• CSV file generation with success confirmation (3 marks)",
    tests: [
      {
        in: ["R-01", "6"],
        out:
          "Route   Driver        Capacity  Passengers  Util%  Status         \n" +
          "-----------------------------------------------------------------\n" +
          "R-01    Harrison      52        54          104    OVERCROWDED    \n" +
          "R-02    Mendoza       45        45          100    FULL           \n" +
          "R-03    Patel         60        59          98     SEATS AVAILABLE\n" +
          "R-04    Davies        32        36          112    OVERCROWDED    \n" +
          "R-05    Al-Mansoor    50        42          84     SEATS AVAILABLE\n" +
          "-----------------------------------------------------------------\n" +
          "Total District Passengers: 236\n" +
          "Overcrowded Routes: 2\n" +
          "bus fleet report file has been created\n",
        m: 10,
      },
      {
        in: ["R-99", "5"],
        out:
          "Route not found\n" +
          "Route   Driver        Capacity  Passengers  Util%  Status         \n" +
          "-----------------------------------------------------------------\n" +
          "R-01    Harrison      52        48          92     SEATS AVAILABLE\n" +
          "R-02    Mendoza       45        45          100    FULL           \n" +
          "R-03    Patel         60        59          98     SEATS AVAILABLE\n" +
          "R-04    Davies        32        36          112    OVERCROWDED    \n" +
          "R-05    Al-Mansoor    50        42          84     SEATS AVAILABLE\n" +
          "-----------------------------------------------------------------\n" +
          "Total District Passengers: 230\n" +
          "Overcrowded Routes: 1\n" +
          "bus fleet report file has been created\n",
        m: 10,
      },
    ],
    hint: "Update passengers[idx] += add_p if the route exists. Check status using if passengers > capacity.",
  },

  // =========================================================================
  // 20-MARKER 15: Cinema Seating 2D Matrix Booking & Takings Audit
  // 2D Array Grid + Subprograms + Seat Allocation + File Handling
  // =========================================================================
  {
    id: "cap20_15_cinema_seat_booking",
    unit: "U20M",
    unitName: "Paper 2 20-Marker Capstone Mastery",
    title: "Q6 Cinema Auditor 2D Seating Grid & Box Office Takings",
    level: "Exam-style",
    difficulty: "Hard",
    type: "code",
    marks: 20,
    brief:
      "A boutique cinema screen contains 4 rows and 5 seats per row.\n" +
      "Seating status is stored in a 2D list where '.' represents an empty seat and 'B' represents a booked seat:\n" +
      "cinema_grid = [\n" +
      "  ['.', 'B', 'B', '.', '.'],\n" +
      "  ['B', 'B', '.', '.', 'B'],\n" +
      "  ['.', '.', '.', 'B', 'B'],\n" +
      "  ['B', '.', '.', '.', '.']\n" +
      "]\n\n" +
      "Ticket Pricing:\n" +
      "• Front row (Row 0): £10 per seat\n" +
      "• Standard rows (Rows 1 & 2): £14 per seat\n" +
      "• Premium back row (Row 3): £18 per seat\n\n" +
      "Requirements:\n" +
      "1. Allow a box office clerk to enter a target row (0-3) and seat number (0-4) to book a seat.\n" +
      "   - If coordinates are out of bounds, print 'Invalid seat coordinates'.\n" +
      "   - If seat is already 'B', print 'Seat already booked'.\n" +
      "   - If available ('.'), change it to 'B' and print 'Seat booked successfully'.\n" +
      "2. Write a subprogram get_seat_price(row_index) that returns the price for any seat in that row.\n" +
      "3. Display the visual 2D seating layout showing row indices and seat letters.\n" +
      "4. Calculate and output:\n" +
      "   - Total seats booked\n" +
      "   - Total box office takings (£) across all booked seats\n" +
      "   - Total empty seats remaining\n" +
      "5. Write the booking manifest to 'box_office_summary.txt' and output 'box office file has been saved'.",
    starter:
      "# Q06 - Cinema Seating 2D Matrix Booking (20 Marks)\n" +
      "cinema_grid = [\n" +
      '    [".", "B", "B", ".", "."],\n' +
      '    ["B", "B", ".", ".", "B"],\n' +
      '    [".", ".", ".", "B", "B"],\n' +
      '    ["B", ".", ".", ".", "."]\n' +
      "]\n\n" +
      "# Write your subprogram(s) and program below:\n",
    solution:
      "# Q06 - Cinema Seating Solution\n" +
      "cinema_grid = [\n" +
      '    [".", "B", "B", ".", "."],\n' +
      '    ["B", "B", ".", ".", "B"],\n' +
      '    [".", ".", ".", "B", "B"],\n' +
      '    ["B", ".", ".", ".", "."]\n' +
      "]\n\n" +
      "def get_seat_price(row_idx):\n" +
      "    if row_idx == 0:\n" +
      "        return 10\n" +
      "    elif row_idx in (1, 2):\n" +
      "        return 14\n" +
      "    else:\n" +
      "        return 18\n\n" +
      'r_in = int(input("Enter row (0-3): ").strip())\n' +
      's_in = int(input("Enter seat (0-4): ").strip())\n\n' +
      "if 0 <= r_in < 4 and 0 <= s_in < 5:\n" +
      '    if cinema_grid[r_in][s_in] == "B":\n' +
      '        print("Seat already booked")\n' +
      "    else:\n" +
      '        cinema_grid[r_in][s_in] = "B"\n' +
      '        print("Seat booked successfully")\n' +
      "else:\n" +
      '    print("Invalid seat coordinates")\n\n' +
      'print("--- Cinema Seating Grid ---")\n' +
      "booked_count = 0\n" +
      "total_revenue = 0\n" +
      "empty_count = 0\n" +
      "manifest_lines = []\n\n" +
      "for r in range(4):\n" +
      '    row_str = f"Row {r}: "\n' +
      "    p = get_seat_price(r)\n" +
      "    for s in range(5):\n" +
      "        st = cinema_grid[r][s]\n" +
      '        row_str += st + " "\n' +
      '        if st == "B":\n' +
      "            booked_count += 1\n" +
      "            total_revenue += p\n" +
      "        else:\n" +
      "            empty_count += 1\n" +
      "    print(row_str.strip())\n" +
      '    manifest_lines.append(f"Row {r}: {row_str.strip()}\\n")\n\n' +
      'print("-" * 30)\n' +
      'print(f"Total Booked: {booked_count}")\n' +
      'print(f"Total Empty: {empty_count}")\n' +
      'print(f"Total Box Office: £{total_revenue}")\n\n' +
      'with open("box_office_summary.txt", "w") as f:\n' +
      "    f.writelines(manifest_lines)\n" +
      'print("box office file has been saved")\n',
    markScheme:
      "Pearson Edexcel 4CP0 Specification Mark Scheme (20 Marks):\n" +
      "• 2D array coordinate validation and availability check (4 marks)\n" +
      "• Subprogram declaration returning row tier pricing (3 marks)\n" +
      "• Correct update of 2D list element from '.' to 'B' (3 marks)\n" +
      "• Nested loop traversal rendering 2D grid correctly (4 marks)\n" +
      "• Accurate accumulation of booked seats, empty seats, and total revenue (3 marks)\n" +
      "• File writing to box_office_summary.txt with success message (3 marks)",
    tests: [
      {
        in: ["0", "0"],
        out:
          "Seat booked successfully\n" +
          "--- Cinema Seating Grid ---\n" +
          "Row 0: B B B . .\n" +
          "Row 1: B B . . B\n" +
          "Row 2: . . . B B\n" +
          "Row 3: B . . . .\n" +
          "------------------------------\n" +
          "Total Booked: 9\n" +
          "Total Empty: 11\n" +
          "Total Box Office: £126\n" +
          "box office file has been saved\n",
        m: 10,
      },
      {
        in: ["1", "0"],
        out:
          "Seat already booked\n" +
          "--- Cinema Seating Grid ---\n" +
          "Row 0: . B B . .\n" +
          "Row 1: B B . . B\n" +
          "Row 2: . . . B B\n" +
          "Row 3: B . . . .\n" +
          "------------------------------\n" +
          "Total Booked: 8\n" +
          "Total Empty: 12\n" +
          "Total Box Office: £116\n" +
          "box office file has been saved\n",
        m: 10,
      },
    ],
    hint: "Row 0 is £10, Rows 1-2 are £14, Row 3 is £18. Check if cinema_grid[r][s] == '.' before booking.",
  },

  // =========================================================================
  // 20-MARKER 16: Supermarket Loyalty Scheme Cashback & Promotion Engine
  // Parallel 1D lists + Subprograms + Tiered Cashback + File Handling
  // =========================================================================
  {
    id: "cap20_16_supermarket_loyalty_rebate",
    unit: "U20M",
    unitName: "Paper 2 20-Marker Capstone Mastery",
    title: "Q6 Supermarket Loyalty Scheme Cashback & Voucher Exporter",
    level: "Exam-style",
    difficulty: "Hard",
    type: "code",
    marks: 20,
    brief:
      "A supermarket chain calculates annual cashback vouchers for its members.\n" +
      "Customer cards, membership tiers ('Bronze', 'Silver', 'Gold'), and total annual spend (£) are stored in parallel lists:\n" +
      "• cards = ['CRD-501', 'CRD-502', 'CRD-503', 'CRD-504', 'CRD-505', 'CRD-506']\n" +
      "• tiers = ['Bronze', 'Gold', 'Silver', 'Bronze', 'Silver', 'Gold']\n" +
      "• spends = [420.00, 2150.00, 890.00, 150.00, 1420.00, 3100.00]\n\n" +
      "Cashback Voucher Rules:\n" +
      "• Bronze: 1% cashback on spend. If spend > £500, upgrade tier to 'Silver'.\n" +
      "• Silver: 2% cashback on spend. If spend > £2000, upgrade tier to 'Gold'.\n" +
      "• Gold: 4% cashback on spend + a bonus £25 voucher.\n" +
      "• Vouchers are rounded to 2 decimal places.\n\n" +
      "Requirements:\n" +
      "1. Allow a store cashier to enter a customer card ID and an additional purchase amount to add to their annual spend (e.g. 'CRD-501' and 120.00).\n" +
      "   - If card is in cards, add purchase to spends.\n" +
      "   - If not found, print 'Card not recognized'.\n" +
      "2. Write a subprogram calc_voucher(tier, spend) that returns the total voucher amount in £.\n" +
      "3. Write a subprogram check_tier_upgrade(current_tier, spend) that returns the new tier name.\n" +
      "4. Display a formatted member rewards table:\n" +
      "   - Columns: Card ID, Tier, Total Spend(£), Voucher(£)\n" +
      "   - Dividing lines and overall sum of all vouchers issued\n" +
      "5. Write the voucher distribution list to 'rebate_vouchers.txt' and display 'rebate voucher file generated'.",
    starter:
      "# Q06 - Supermarket Loyalty Scheme Cashback (20 Marks)\n" +
      'cards = ["CRD-501", "CRD-502", "CRD-503", "CRD-504", "CRD-505", "CRD-506"]\n' +
      'tiers = ["Bronze", "Gold", "Silver", "Bronze", "Silver", "Gold"]\n' +
      "spends = [420.00, 2150.00, 890.00, 150.00, 1420.00, 3100.00]\n\n" +
      "# Write your subprogram(s) and program below:\n",
    solution:
      "# Q06 - Supermarket Loyalty Solution\n" +
      'cards = ["CRD-501", "CRD-502", "CRD-503", "CRD-504", "CRD-505", "CRD-506"]\n' +
      'tiers = ["Bronze", "Gold", "Silver", "Bronze", "Silver", "Gold"]\n' +
      "spends = [420.00, 2150.00, 890.00, 150.00, 1420.00, 3100.00]\n\n" +
      "def calc_voucher(tier, spend):\n" +
      '    if tier == "Bronze":\n' +
      "        return round(spend * 0.01, 2)\n" +
      '    elif tier == "Silver":\n' +
      "        return round(spend * 0.02, 2)\n" +
      "    else:\n" +
      "        return round((spend * 0.04) + 25.0, 2)\n\n" +
      "def check_tier_upgrade(current_tier, spend):\n" +
      '    if current_tier == "Bronze" and spend > 500:\n' +
      '        return "Silver"\n' +
      '    if current_tier == "Silver" and spend > 2000:\n' +
      '        return "Gold"\n' +
      "    return current_tier\n\n" +
      'card_in = input("Enter card ID: ").strip()\n' +
      'spend_in = float(input("Enter additional spend: ").strip())\n\n' +
      "if card_in in cards:\n" +
      "    idx = cards.index(card_in)\n" +
      "    spends[idx] += spend_in\n" +
      "    tiers[idx] = check_tier_upgrade(tiers[idx], spends[idx])\n" +
      "else:\n" +
      '    print("Card not recognized")\n\n' +
      'print("Card ID     Tier        Spend(£)    Voucher(£)  ")\n' +
      'print("-" * 48)\n' +
      "total_vouchers = 0.0\n" +
      "file_rows = []\n\n" +
      "for i in range(len(cards)):\n" +
      "    v = calc_voucher(tiers[i], spends[i])\n" +
      "    total_vouchers += v\n" +
      '    row = f"{cards[i]:<12}{tiers[i]:<12}{spends[i]:<12.2f}{v:<12.2f}"\n' +
      "    print(row)\n" +
      '    file_rows.append(f"{cards[i]},{tiers[i]},{spends[i]:.2f},{v:.2f}\\n")\n\n' +
      'print("-" * 48)\n' +
      'print(f"Total Vouchers Issued: £{total_vouchers:.2f}")\n\n' +
      'with open("rebate_vouchers.txt", "w") as f:\n' +
      "    f.writelines(file_rows)\n" +
      'print("rebate voucher file generated")\n',
    markScheme:
      "Pearson Edexcel 4CP0 Specification Mark Scheme (20 Marks):\n" +
      "• Subprogram declaration with arithmetic percentages and conditional bonus (4 marks)\n" +
      "• Tier promotion logic subprogram with threshold checks (3 marks)\n" +
      "• Updating parallel lists with new spend and upgraded status (4 marks)\n" +
      "• Correct table formatting with currency values to 2 d.p. (3 marks)\n" +
      "• Accurate accumulation of total voucher liability (3 marks)\n" +
      "• File writing to rebate_vouchers.txt with completion notice (3 marks)",
    tests: [
      {
        in: ["CRD-501", "100.00"],
        out:
          "Card ID     Tier        Spend(£)    Voucher(£)  \n" +
          "------------------------------------------------\n" +
          "CRD-501     Silver      520.00      10.40       \n" +
          "CRD-502     Gold        2150.00     111.00      \n" +
          "CRD-503     Silver      890.00      17.80       \n" +
          "CRD-504     Bronze      150.00      1.50        \n" +
          "CRD-505     Silver      1420.00     28.40       \n" +
          "CRD-506     Gold        3100.00     149.00      \n" +
          "------------------------------------------------\n" +
          "Total Vouchers Issued: £318.10\n" +
          "rebate voucher file generated\n",
        m: 10,
      },
      {
        in: ["CRD-999", "50.00"],
        out:
          "Card not recognized\n" +
          "Card ID     Tier        Spend(£)    Voucher(£)  \n" +
          "------------------------------------------------\n" +
          "CRD-501     Bronze      420.00      4.20        \n" +
          "CRD-502     Gold        2150.00     111.00      \n" +
          "CRD-503     Silver      890.00      17.80       \n" +
          "CRD-504     Bronze      150.00      1.50        \n" +
          "CRD-505     Silver      1420.00     28.40       \n" +
          "CRD-506     Gold        3100.00     149.00      \n" +
          "------------------------------------------------\n" +
          "Total Vouchers Issued: £311.90\n" +
          "rebate voucher file generated\n",
        m: 10,
      },
    ],
    hint: "If spend > £500 for Bronze, update tier to Silver before calculating voucher.",
  },

  // =========================================================================
  // 20-MARKER 17: Solar Farm Array 2D Power Telemetry Analysis
  // 2D Array Grid + Subprograms + Inverter Health Audit + File Handling
  // =========================================================================
  {
    id: "cap20_17_solar_panel_telemetry",
    unit: "U20M",
    unitName: "Paper 2 20-Marker Capstone Mastery",
    title: "Q6 Solar Photovoltaic Array 2D Power Telemetry Monitor",
    level: "Exam-style",
    difficulty: "Hard",
    type: "code",
    marks: 20,
    brief:
      "A solar farm monitors kilowatt (kW) output across 4 panel arrays over a 5-day work week.\n" +
      "The readings are stored in a 2D list (4 rows representing Arrays A, B, C, D and 5 columns representing Mon-Fri):\n" +
      "solar_grid = [\n" +
      "  [120, 135, 110, 140, 125],\n" +
      "  [85, 90, 78, 60, 80],\n" +
      "  [160, 155, 145, 170, 165],\n" +
      "  [95, 105, 100, 110, 98]\n" +
      "]\n\n" +
      "Array Ratings:\n" +
      "• Average daily power < 90 kW: 'UNDERPERFORMING' (Inspection required)\n" +
      "• 90 kW <= Average daily power <= 140 kW: 'HEALTHY'\n" +
      "• Average daily power > 140 kW: 'OPTIMAL'\n\n" +
      "Requirements:\n" +
      "1. Allow an engineer to enter an array index (0-3), a day index (0-4), and an updated calibration reading in kW (e.g. 1, 3, 92).\n" +
      "   - If coordinates are invalid, print 'Invalid array or day index'.\n" +
      "   - Otherwise update solar_grid[array][day].\n" +
      "2. Write a subprogram get_array_average(row) that computes and returns the average daily output for that array.\n" +
      "3. Write a subprogram get_health_status(avg_kw) returning 'UNDERPERFORMING', 'HEALTHY', or 'OPTIMAL'.\n" +
      "4. Display a performance report table with:\n" +
      "   - Columns: Array, Mon, Tue, Wed, Thu, Fri, Avg(kW), Health\n" +
      "   - Dividing lines and the grand total power generated by the whole farm\n" +
      "5. Write the health audit to 'solar_weekly_report.txt' and display 'solar weekly report generated'.",
    starter:
      "# Q06 - Solar Photovoltaic Array Telemetry (20 Marks)\n" +
      "solar_grid = [\n" +
      "    [120, 135, 110, 140, 125],\n" +
      "    [85, 90, 78, 60, 80],\n" +
      "    [160, 155, 145, 170, 165],\n" +
      "    [95, 105, 100, 110, 98]\n" +
      "]\n\n" +
      "# Write your subprogram(s) and program below:\n",
    solution:
      "# Q06 - Solar Telemetry Solution\n" +
      "solar_grid = [\n" +
      "    [120, 135, 110, 140, 125],\n" +
      "    [85, 90, 78, 60, 80],\n" +
      "    [160, 155, 145, 170, 165],\n" +
      "    [95, 105, 100, 110, 98]\n" +
      "]\n\n" +
      "def get_array_average(row):\n" +
      "    return round(sum(row) / len(row), 1)\n\n" +
      "def get_health_status(avg_kw):\n" +
      "    if avg_kw < 90:\n" +
      '        return "UNDERPERFORMING"\n' +
      "    elif avg_kw <= 140:\n" +
      '        return "HEALTHY"\n' +
      "    else:\n" +
      '        return "OPTIMAL"\n\n' +
      'a_in = int(input("Enter array index (0-3): ").strip())\n' +
      'd_in = int(input("Enter day index (0-4): ").strip())\n' +
      'kw_in = int(input("Enter reading kW: ").strip())\n\n' +
      "if 0 <= a_in < 4 and 0 <= d_in < 5:\n" +
      "    solar_grid[a_in][d_in] = kw_in\n" +
      "else:\n" +
      '    print("Invalid array or day index")\n\n' +
      'array_names = ["Array A", "Array B", "Array C", "Array D"]\n' +
      'print("Array    Mon  Tue  Wed  Thu  Fri  Avg(kW) Health         ")\n' +
      'print("-" * 55)\n' +
      "grand_total = 0\n" +
      "report_lines = []\n\n" +
      "for i in range(4):\n" +
      "    row = solar_grid[i]\n" +
      "    grand_total += sum(row)\n" +
      "    avg_val = get_array_average(row)\n" +
      "    health = get_health_status(avg_val)\n" +
      '    row_str = f"{array_names[i]:<9}{row[0]:<5}{row[1]:<5}{row[2]:<5}{row[3]:<5}{row[4]:<5}{avg_val:<8.1f}{health}"\n' +
      "    print(row_str)\n" +
      '    report_lines.append(f"{array_names[i]},{avg_val},{health}\\n")\n\n' +
      'print("-" * 55)\n' +
      'print(f"Total Farm Output: {grand_total} kW")\n\n' +
      'with open("solar_weekly_report.txt", "w") as f:\n' +
      "    f.writelines(report_lines)\n" +
      'print("solar weekly report generated")\n',
    markScheme:
      "Pearson Edexcel 4CP0 Specification Mark Scheme (20 Marks):\n" +
      "• 2D array coordinate validation and assignment (3 marks)\n" +
      "• Subprogram for row averaging using sum/len or loops (4 marks)\n" +
      "• Subprogram with 3-way branch classification (3 marks)\n" +
      "• Nested/iteration processing with correct grand total accumulation (4 marks)\n" +
      "• Formatted console table alignment (3 marks)\n" +
      "• File writing to solar_weekly_report.txt with success confirmation (3 marks)",
    tests: [
      {
        in: ["1", "3", "92"],
        out:
          "Array    Mon  Tue  Wed  Thu  Fri  Avg(kW) Health         \n" +
          "-------------------------------------------------------\n" +
          "Array A  120  135  110  140  125  128.0   HEALTHY        \n" +
          "Array B  85   90   78   92   80   85.0    UNDERPERFORMING\n" +
          "Array C  160  155  145  170  165  159.0   OPTIMAL        \n" +
          "Array D  95   105  100  110  98   101.6   HEALTHY        \n" +
          "-------------------------------------------------------\n" +
          "Total Farm Output: 2389 kW\n" +
          "solar weekly report generated\n",
        m: 10,
      },
      {
        in: ["9", "0", "100"],
        out:
          "Invalid array or day index\n" +
          "Array    Mon  Tue  Wed  Thu  Fri  Avg(kW) Health         \n" +
          "-------------------------------------------------------\n" +
          "Array A  120  135  110  140  125  128.0   HEALTHY        \n" +
          "Array B  85   90   78   60   80   78.6    UNDERPERFORMING\n" +
          "Array C  160  155  145  170  165  159.0   OPTIMAL        \n" +
          "Array D  95   105  100  110  98   101.6   HEALTHY        \n" +
          "-------------------------------------------------------\n" +
          "Total Farm Output: 2357 kW\n" +
          "solar weekly report generated\n",
        m: 10,
      },
    ],
    hint: "Use sum(row) / len(row) to find the average kW for each row of the 2D matrix.",
  },

  // =========================================================================
  // 20-MARKER 18: City Marathon Chip Timing & Category Standings
  // Parallel 1D lists + Subprograms + Time Formatting + File Handling
  // =========================================================================
  {
    id: "cap20_18_marathon_timing_tracker",
    unit: "U20M",
    unitName: "Paper 2 20-Marker Capstone Mastery",
    title: "Q6 City Marathon Chip Timing & Age Division Standings",
    level: "Exam-style",
    difficulty: "Hard",
    type: "code",
    marks: 20,
    brief:
      "A city marathon organizers track chip finish times for elite runners.\n" +
      "Bib numbers, names, age categories ('Open', 'Master', 'Veteran'), and chip times in total seconds are stored in parallel lists:\n" +
      "• bibs = [101, 102, 103, 104, 105, 106]\n" +
      "• runners = ['Kenah', 'Cheptegei', 'Nielsen', 'Farah', 'Kipruto', 'Muller']\n" +
      "• categories = ['Open', 'Open', 'Master', 'Veteran', 'Open', 'Master']\n" +
      "• times_sec = [7540, 7380, 8120, 7920, 7410, 8340]\n\n" +
      "Time Conversion Formula:\n" +
      "• Hours = times_sec // 3600\n" +
      "• Minutes = (times_sec % 3600) // 60\n" +
      "• Seconds = times_sec % 60\n" +
      "• Format: HH:MM:SS with leading zeroes (e.g. 7380 seconds -> '02:03:00')\n\n" +
      "Requirements:\n" +
      "1. Allow a race official to enter a bib number and an adjusted penalty time in seconds (e.g. 104 and 7890).\n" +
      "   - If the bib is found, update times_sec with the new time.\n" +
      "   - If not found, print 'Bib number not registered'.\n" +
      "2. Write a subprogram format_time(total_seconds) that returns an 'HH:MM:SS' string.\n" +
      "3. Write a subprogram find_winner() that returns the name and formatted time of the fastest runner overall.\n" +
      "4. Display an official race results board with columns: Bib, Runner Name, Category, Seconds, Chip Time.\n" +
      "   - Print the Overall Race Winner.\n" +
      "5. Export the official race standings to 'marathon_results.csv' and print 'marathon results file generated'.",
    starter:
      "# Q06 - City Marathon Chip Timing (20 Marks)\n" +
      "bibs = [101, 102, 103, 104, 105, 106]\n" +
      'runners = ["Kenah", "Cheptegei", "Nielsen", "Farah", "Kipruto", "Muller"]\n' +
      'categories = ["Open", "Open", "Master", "Veteran", "Open", "Master"]\n' +
      "times_sec = [7540, 7380, 8120, 7920, 7410, 8340]\n\n" +
      "# Write your subprogram(s) and program below:\n",
    solution:
      "# Q06 - Marathon Timing Solution\n" +
      "bibs = [101, 102, 103, 104, 105, 106]\n" +
      'runners = ["Kenah", "Cheptegei", "Nielsen", "Farah", "Kipruto", "Muller"]\n' +
      'categories = ["Open", "Open", "Master", "Veteran", "Open", "Master"]\n' +
      "times_sec = [7540, 7380, 8120, 7920, 7410, 8340]\n\n" +
      "def format_time(sec):\n" +
      "    h = sec // 3600\n" +
      "    m = (sec % 3600) // 60\n" +
      "    s = sec % 60\n" +
      '    return f"{h:02d}:{m:02d}:{s:02d}"\n\n' +
      "def find_winner():\n" +
      "    min_time = min(times_sec)\n" +
      "    min_idx = times_sec.index(min_time)\n" +
      "    return runners[min_idx], format_time(min_time)\n\n" +
      'bib_in = int(input("Enter bib number: ").strip())\n' +
      'time_in = int(input("Enter new time in seconds: ").strip())\n\n' +
      "if bib_in in bibs:\n" +
      "    idx = bibs.index(bib_in)\n" +
      "    times_sec[idx] = time_in\n" +
      "else:\n" +
      '    print("Bib number not registered")\n\n' +
      'print("Bib   Runner Name    Category   Seconds  Chip Time")\n' +
      'print("-" * 50)\n' +
      'csv_lines = ["Bib,Runner,Category,Seconds,ChipTime\\n"]\n\n' +
      "for i in range(len(bibs)):\n" +
      "    ft = format_time(times_sec[i])\n" +
      '    row = f"{bibs[i]:<6}{runners[i]:<15}{categories[i]:<11}{times_sec[i]:<9}{ft}"\n' +
      "    print(row)\n" +
      '    csv_lines.append(f"{bibs[i]},{runners[i]},{categories[i]},{times_sec[i]},{ft}\\n")\n\n' +
      'print("-" * 50)\n' +
      "w_name, w_time = find_winner()\n" +
      'print(f"Overall Champion: {w_name} ({w_time})")\n\n' +
      'with open("marathon_results.csv", "w") as f:\n' +
      "    f.writelines(csv_lines)\n" +
      'print("marathon results file generated")\n',
    markScheme:
      "Pearson Edexcel 4CP0 Specification Mark Scheme (20 Marks):\n" +
      "• Time conversion algorithm (// 3600, // 60, % 60) with zero-padding (4 marks)\n" +
      "• Subprogram declaration and finding minimum value / index for race winner (4 marks)\n" +
      "• Linear search and update on bib list (3 marks)\n" +
      "• Iterating parallel lists with aligned table output (3 marks)\n" +
      "• Displaying winner announcement correctly (3 marks)\n" +
      "• Exporting results to CSV file with success message (3 marks)",
    tests: [
      {
        in: ["104", "7890"],
        out:
          "Bib   Runner Name    Category   Seconds  Chip Time\n" +
          "--------------------------------------------------\n" +
          "101   Kenah          Open       7540     02:05:40 \n" +
          "102   Cheptegei      Open       7380     02:03:00 \n" +
          "103   Nielsen        Master     8120     02:15:20 \n" +
          "104   Farah          Veteran    7890     02:11:30 \n" +
          "105   Kipruto        Open       7410     02:03:30 \n" +
          "106   Muller         Master     8340     02:19:00 \n" +
          "--------------------------------------------------\n" +
          "Overall Champion: Cheptegei (02:03:00)\n" +
          "marathon results file generated\n",
        m: 10,
      },
      {
        in: ["999", "7000"],
        out:
          "Bib number not registered\n" +
          "Bib   Runner Name    Category   Seconds  Chip Time\n" +
          "--------------------------------------------------\n" +
          "101   Kenah          Open       7540     02:05:40 \n" +
          "102   Cheptegei      Open       7380     02:03:00 \n" +
          "103   Nielsen        Master     8120     02:15:20 \n" +
          "104   Farah          Veteran    7920     02:12:00 \n" +
          "105   Kipruto        Open       7410     02:03:30 \n" +
          "106   Muller         Master     8340     02:19:00 \n" +
          "--------------------------------------------------\n" +
          "Overall Champion: Cheptegei (02:03:00)\n" +
          "marathon results file generated\n",
        m: 10,
      },
    ],
    hint: "Use h = sec // 3600, m = (sec % 3600) // 60, s = sec % 60, and format with :02d.",
  },

  // =========================================================================
  // 20-MARKER 19: Public Library Circulation & Tiered Overdue Fines
  // Parallel 1D lists + Subprograms + Capped Fine Calculation + File Handling
  // =========================================================================
  {
    id: "cap20_19_library_overdue_fines",
    unit: "U20M",
    unitName: "Paper 2 20-Marker Capstone Mastery",
    title: "Q6 Public Library Circulation & Overdue Fine Notification Ledger",
    level: "Exam-style",
    difficulty: "Hard",
    type: "code",
    marks: 20,
    brief:
      "A municipal library calculates overdue fines for books returned late.\n" +
      "Member cards, book titles, days overdue, and book formats ('F' for Fiction, 'N' for Non-Fiction, 'R' for Rare/Reference) are stored in parallel lists:\n" +
      "• members = ['MEM-11', 'MEM-22', 'MEM-33', 'MEM-44', 'MEM-55']\n" +
      "• titles = ['Clean Code', 'Dune', 'Britannica', '1984', 'Physics Vol 1']\n" +
      "• days_late = [4, 12, 2, 0, 18]\n" +
      "• formats = ['N', 'F', 'R', 'F', 'N']\n\n" +
      "Fine Rates & Maximum Caps:\n" +
      "• Fiction ('F'): £0.20 per day overdue (Maximum cap £5.00)\n" +
      "• Non-Fiction ('N'): £0.35 per day overdue (Maximum cap £8.00)\n" +
      "• Rare/Reference ('R'): £1.50 per day overdue (Maximum cap £20.00)\n" +
      "• Suspension Rule: If days late >= 14, member status is 'SUSPENDED', else 'ACTIVE'.\n\n" +
      "Requirements:\n" +
      "1. Allow a librarian to enter a member ID and updated days overdue (e.g. 'MEM-44' and 15).\n" +
      "   - If member exists, update days_late.\n" +
      "   - If not found, print 'Member card not found'.\n" +
      "2. Write a subprogram calc_fine(book_format, days) that returns the capped fine amount in £.\n" +
      "3. Write a subprogram get_member_status(days) returning 'SUSPENDED' or 'ACTIVE'.\n" +
      "4. Display a fine ledger table:\n" +
      "   - Columns: Member, Title, Format, Days Late, Fine(£), Status\n" +
      "   - Total fines collected across all members\n" +
      "   - Count of suspended members\n" +
      "5. Export notices for all suspended members to 'overdue_notices.txt' and print 'overdue notices file generated'.",
    starter:
      "# Q06 - Public Library Circulation & Overdue Fines (20 Marks)\n" +
      'members = ["MEM-11", "MEM-22", "MEM-33", "MEM-44", "MEM-55"]\n' +
      'titles = ["Clean Code", "Dune", "Britannica", "1984", "Physics Vol 1"]\n' +
      "days_late = [4, 12, 2, 0, 18]\n" +
      'formats = ["N", "F", "R", "F", "N"]\n\n' +
      "# Write your subprogram(s) and program below:\n",
    solution:
      "# Q06 - Library Overdue Solution\n" +
      'members = ["MEM-11", "MEM-22", "MEM-33", "MEM-44", "MEM-55"]\n' +
      'titles = ["Clean Code", "Dune", "Britannica", "1984", "Physics Vol 1"]\n' +
      "days_late = [4, 12, 2, 0, 18]\n" +
      'formats = ["N", "F", "R", "F", "N"]\n\n' +
      "def calc_fine(fmt, days):\n" +
      "    if days <= 0:\n" +
      "        return 0.0\n" +
      '    if fmt == "F":\n' +
      "        rate, cap = 0.20, 5.00\n" +
      '    elif fmt == "N":\n' +
      "        rate, cap = 0.35, 8.00\n" +
      "    else:\n" +
      "        rate, cap = 1.50, 20.00\n" +
      "    return round(min(days * rate, cap), 2)\n\n" +
      "def get_member_status(days):\n" +
      "    return \"SUSPENDED\" if days >= 14 else \"ACTIVE\"\n\n" +
      'mem_in = input("Enter member ID: ").strip()\n' +
      'days_in = int(input("Enter days overdue: ").strip())\n\n' +
      "if mem_in in members:\n" +
      "    idx = members.index(mem_in)\n" +
      "    days_late[idx] = days_in\n" +
      "else:\n" +
      '    print("Member card not found")\n\n' +
      'print("Member   Title            Format  Days  Fine(£)  Status    ")\n' +
      'print("-" * 58)\n' +
      "total_fines = 0.0\n" +
      "suspended_count = 0\n" +
      "notices = []\n\n" +
      "for i in range(len(members)):\n" +
      "    d = days_late[i]\n" +
      "    f = calc_fine(formats[i], d)\n" +
      "    st = get_member_status(d)\n" +
      "    total_fines += f\n" +
      '    if st == "SUSPENDED":\n' +
      "        suspended_count += 1\n" +
      '        notices.append(f"URGENT: {members[i]} overdue by {d} days on \'{titles[i]}\'. Fine: £{f:.2f}\\n")\n' +
      '    row = f"{members[i]:<9}{titles[i]:<17}{formats[i]:<8}{d:<6}{f:<9.2f}{st}"\n' +
      "    print(row)\n\n" +
      'print("-" * 58)\n' +
      'print(f"Total Fines Owed: £{total_fines:.2f}")\n' +
      'print(f"Suspended Accounts: {suspended_count}")\n\n' +
      'with open("overdue_notices.txt", "w") as fp:\n' +
      "    fp.writelines(notices)\n" +
      'print("overdue notices file generated")\n',
    markScheme:
      "Pearson Edexcel 4CP0 Specification Mark Scheme (20 Marks):\n" +
      "• Subprogram declaration with rate calculation and maximum ceiling capping (4 marks)\n" +
      "• Subprogram returning suspension boolean/string state (3 marks)\n" +
      "• Linear search and updating days overdue in parallel lists (3 marks)\n" +
      "• Iterating parallel lists with aligned table formatting (4 marks)\n" +
      "• Accumulating total fine revenue and suspended account counters (3 marks)\n" +
      "• Writing notices file and printing success verification (3 marks)",
    tests: [
      {
        in: ["MEM-44", "15"],
        out:
          "Member   Title            Format  Days  Fine(£)  Status    \n" +
          "----------------------------------------------------------\n" +
          "MEM-11   Clean Code       N       4     1.40     ACTIVE    \n" +
          "MEM-22   Dune             F       12    2.40     ACTIVE    \n" +
          "MEM-33   Britannica       R       2     3.00     ACTIVE    \n" +
          "MEM-44   1984             F       15    3.00     SUSPENDED \n" +
          "MEM-55   Physics Vol 1    N       18    6.30     SUSPENDED \n" +
          "----------------------------------------------------------\n" +
          "Total Fines Owed: £16.10\n" +
          "Suspended Accounts: 2\n" +
          "overdue notices file generated\n",
        m: 10,
      },
      {
        in: ["MEM-99", "10"],
        out:
          "Member card not found\n" +
          "Member   Title            Format  Days  Fine(£)  Status    \n" +
          "----------------------------------------------------------\n" +
          "MEM-11   Clean Code       N       4     1.40     ACTIVE    \n" +
          "MEM-22   Dune             F       12    2.40     ACTIVE    \n" +
          "MEM-33   Britannica       R       2     3.00     ACTIVE    \n" +
          "MEM-44   1984             F       0     0.00     ACTIVE    \n" +
          "MEM-55   Physics Vol 1    N       18    6.30     SUSPENDED \n" +
          "----------------------------------------------------------\n" +
          "Total Fines Owed: £13.10\n" +
          "Suspended Accounts: 1\n" +
          "overdue notices file generated\n",
        m: 10,
      },
    ],
    hint: "Calculate fine as min(days * rate, cap). Member status is SUSPENDED if days >= 14.",
  },

  // =========================================================================
  // 20-MARKER 20: International Space Station Docking Bay Telemetry
  // 2D Bay Matrix + Parallel Lists + Collision Check Subprogram + File Handling
  // =========================================================================
  {
    id: "cap20_20_space_station_docking_telemetry",
    unit: "U20M",
    unitName: "Paper 2 20-Marker Capstone Mastery",
    title: "Q6 Orbital Space Station 2D Docking Bay Telemetry & Collision Control",
    level: "Exam-style",
    difficulty: "Hard",
    type: "code",
    marks: 20,
    brief:
      "Mission Control monitors spacecraft docking bays at an orbital space station.\n" +
      "The station has 3 airlock hubs, each containing 3 docking ports (a 3x3 2D list of bay occupancy):\n" +
      "docking_grid = [\n" +
      "  ['FREE', 'DOCKED', 'FREE'],\n" +
      "  ['DOCKED', 'FREE', 'DOCKED'],\n" +
      "  ['FREE', 'FREE', 'DOCKED']\n" +
      "]\n\n" +
      "Inbound spacecraft are queued in parallel lists:\n" +
      "• shuttles = ['Orion-1', 'Dragon-9', 'Starliner-3']\n" +
      "• fuel_pct = [45, 18, 62]\n\n" +
      "Docking Rules:\n" +
      "• Critical Fuel Alert: If fuel_pct < 20, priority is 'CRITICAL_URGENT', else 'NORMAL'.\n" +
      "• Assigning a bay: To dock, the user enters hub index (0-2) and port index (0-2).\n" +
      "  - If coordinates out of range: print 'Invalid hub or port coordinate'.\n" +
      "  - If docking_grid[hub][port] is 'DOCKED': print 'Collision Alert: Bay already occupied'.\n" +
      "  - If 'FREE': change to 'DOCKED' and print 'Docking clearance granted'.\n\n" +
      "Requirements:\n" +
      "1. Input the shuttle name, target hub (0-2), and target port (0-2).\n" +
      "2. Write a subprogram is_bay_free(hub, port) returning True if bay is 'FREE' else False.\n" +
      "3. Write a subprogram count_free_bays() that counts and returns the number of 'FREE' ports in the 3x3 grid.\n" +
      "4. Display a telemetry map of the 3x3 airlock hubs with bay statuses.\n" +
      "   - Display remaining free ports.\n" +
      "   - Check fuel status of the shuttles and print any Critical Fuel Alerts.\n" +
      "5. Write the final mission control log to 'docking_telemetry.txt' and display 'docking telemetry log has been created'.",
    starter:
      "# Q06 - Orbital Space Station Docking Bay Telemetry (20 Marks)\n" +
      "docking_grid = [\n" +
      '    ["FREE", "DOCKED", "FREE"],\n' +
      '    ["DOCKED", "FREE", "DOCKED"],\n' +
      '    ["FREE", "FREE", "DOCKED"]\n' +
      "]\n" +
      'shuttles = ["Orion-1", "Dragon-9", "Starliner-3"]\n' +
      "fuel_pct = [45, 18, 62]\n\n" +
      "# Write your subprogram(s) and program below:\n",
    solution:
      "# Q06 - Space Station Docking Solution\n" +
      "docking_grid = [\n" +
      '    ["FREE", "DOCKED", "FREE"],\n' +
      '    ["DOCKED", "FREE", "DOCKED"],\n' +
      '    ["FREE", "FREE", "DOCKED"]\n' +
      "]\n" +
      'shuttles = ["Orion-1", "Dragon-9", "Starliner-3"]\n' +
      "fuel_pct = [45, 18, 62]\n\n" +
      "def is_bay_free(h, p):\n" +
      '    return docking_grid[h][p] == "FREE"\n\n' +
      "def count_free_bays():\n" +
      "    count = 0\n" +
      "    for r in range(3):\n" +
      "        for c in range(3):\n" +
      '            if docking_grid[r][c] == "FREE":\n' +
      "                count += 1\n" +
      "    return count\n\n" +
      'shuttle_name = input("Enter shuttle name: ").strip()\n' +
      'hub_in = int(input("Enter target hub (0-2): ").strip())\n' +
      'port_in = int(input("Enter target port (0-2): ").strip())\n\n' +
      "if 0 <= hub_in < 3 and 0 <= port_in < 3:\n" +
      "    if is_bay_free(hub_in, port_in):\n" +
      '        docking_grid[hub_in][port_in] = "DOCKED"\n' +
      '        print(f"Docking clearance granted for {shuttle_name}")\n' +
      "    else:\n" +
      '        print("Collision Alert: Bay already occupied")\n' +
      "else:\n" +
      '    print("Invalid hub or port coordinate")\n\n' +
      'print("--- Station Airlock Grid Status ---")\n' +
      "log_lines = []\n" +
      "for h in range(3):\n" +
      '    row_str = f"Hub {h}: "\n' +
      "    for p in range(3):\n" +
      '        row_str += f"[{docking_grid[h][p]}] "\n' +
      "    print(row_str.strip())\n" +
      '    log_lines.append(row_str.strip() + "\\n")\n\n' +
      'print("-" * 35)\n' +
      "free_now = count_free_bays()\n" +
      'print(f"Available Free Bays: {free_now}")\n\n' +
      'print("Inbound Shuttle Alerts:")\n' +
      "for i in range(len(shuttles)):\n" +
      "    if fuel_pct[i] < 20:\n" +
      '        alert = f"! CRITICAL FUEL: {shuttles[i]} at {fuel_pct[i]}% fuel !"\n' +
      "        print(alert)\n" +
      '        log_lines.append(alert + "\\n")\n\n' +
      'with open("docking_telemetry.txt", "w") as f:\n' +
      "    f.writelines(log_lines)\n" +
      'print("docking telemetry log has been created")\n',
    markScheme:
      "Pearson Edexcel 4CP0 Specification Mark Scheme (20 Marks):\n" +
      "• 2D array coordinate validation and collision check subprogram (4 marks)\n" +
      "• Nested iteration subprogram counting free ports across 3x3 matrix (4 marks)\n" +
      "• Updating 2D array state from 'FREE' to 'DOCKED' (3 marks)\n" +
      "• Parallel list processing for fuel threshold alert detection (3 marks)\n" +
      "• Formatted console output of hub status and warnings (3 marks)\n" +
      "• File writing to docking_telemetry.txt with confirmation message (3 marks)",
    tests: [
      {
        in: ["Orion-1", "0", "0"],
        out:
          "Docking clearance granted for Orion-1\n" +
          "--- Station Airlock Grid Status ---\n" +
          "Hub 0: [DOCKED] [DOCKED] [FREE]\n" +
          "Hub 1: [DOCKED] [FREE] [DOCKED]\n" +
          "Hub 2: [FREE] [FREE] [DOCKED]\n" +
          "-----------------------------------\n" +
          "Available Free Bays: 4\n" +
          "Inbound Shuttle Alerts:\n" +
          "! CRITICAL FUEL: Dragon-9 at 18% fuel !\n" +
          "docking telemetry log has been created\n",
        m: 10,
      },
      {
        in: ["Dragon-9", "1", "0"],
        out:
          "Collision Alert: Bay already occupied\n" +
          "--- Station Airlock Grid Status ---\n" +
          "Hub 0: [FREE] [DOCKED] [FREE]\n" +
          "Hub 1: [DOCKED] [FREE] [DOCKED]\n" +
          "Hub 2: [FREE] [FREE] [DOCKED]\n" +
          "-----------------------------------\n" +
          "Available Free Bays: 5\n" +
          "Inbound Shuttle Alerts:\n" +
          "! CRITICAL FUEL: Dragon-9 at 18% fuel !\n" +
          "docking telemetry log has been created\n",
        m: 10,
      },
    ],
    hint: "Check if docking_grid[hub][port] == 'FREE' before updating to 'DOCKED'. Loop through fuel_pct for alerts.",
  },
];
