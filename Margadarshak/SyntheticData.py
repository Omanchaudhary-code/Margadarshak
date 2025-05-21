import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta

# Set random seed for reproducibility
np.random.seed(42)
random.seed(42)

def generate_synthetic_student_data(num_samples=1000):
    # 1) Generate timestamps
    start_date = datetime(2025, 5, 13, 12, 0, 0)
    end_date   = datetime(2025, 5, 20, 12, 0, 0)
    timestamps = []
    for _ in range(num_samples):
        delta_days  = random.uniform(0, (end_date - start_date).days)
        delta_hours = random.uniform(0, 24)
        ts = start_date + timedelta(days=delta_days, hours=delta_hours)
        timestamps.append(ts)
    timestamps.sort()
    formatted_timestamps = [ts.strftime('%m/%d/%Y %H:%M:%S') for ts in timestamps]

    # 2) Consent
    consent = ["Yes"] * num_samples

    # 3) Age distribution (normalize weights so they sum to 1)
    raw_age_weights = {
        20: 0.15, 21: 0.20, 22: 0.20, 23: 0.15, 24: 0.10,
        25: 0.05, 26: 0.03, 27: 0.03, 28: 0.02, 29: 0.02,
        30: 0.01,31:0.01,32:0.01, 36: 0.01, 47: 0.01
    }
    age_keys = list(raw_age_weights.keys())
    age_vals = np.array(list(raw_age_weights.values()), dtype=float)
    age_probs = age_vals / age_vals.sum()
    ages = np.random.choice(age_keys, size=num_samples, p=age_probs)

    # 4) Field of Study — only undergraduate programs + MBBS, BDS, BSc Nursing
    undergrad_programs = [
        "Bachelor of Craft & Design",
        "Bachelor of Fine Arts",
        "Bachelor in Community Development",
        "Bachelor in Media Studies",
        "Bachelor of Arts in English, Mass Communication & Journalism",
        "Bachelor in Ethnomusicology (B.Mus)",
        "Bachelors in Economics",
        "Bachelor in Yogic Science and Well-being",
        "BA in English Studies & BED in TESOL",
        "BED in Teaching Chinese with TESOL minor",
        "Bachelor of Technical Education in Civil Engineering",
        "Bachelor of Technical Education in Information Technology",
        "Bachelor in Heritage Conservation (BHC)",
        "Bachelor of Architecture (B.Arch)",
        "Bachelor of Technology in Artificial Intelligence",
        "Bachelor in Engineering (Chemical Engineering)",
        "Bachelor of Engineering in Civil Engineering",
        "Bachelor of Engineering in Mining Engineering",
        "Bachelor of Engineering (Computer Engineering)",
        "Bachelor of Information Technology (BIT)",
        "Bachelor of Science (Computer Science)",
        "Bachelor of Engineering in Electrical & Electronics Engineering",
        "Bachelors of Engineering in Geomatics Engineering",
        "Bachelor of Engineering in Mechanical Engineering",
        "Bachelor of Economics & Bachelor of Law (BEc-LL.B)",
        "Bachelor of Business Management & Bachelor of Law (BBM-LL.B)",
        "Bachelor of Business Information Systems (BBIS)",
        "Bachelor in Professional Hospitality (BPH)",
        "Bachelor of Business Administration (BBA)",
        "B.Sc. in Agriculture",
        "Bachelor of Science in Bioinformatics",
        "Bachelor of Technology in Biotechnology",
        "B.E. in Environmental Engineering",
        "B.Sc. in Environmental Science",
        "Bachelor of Data Science (BDSc)",
        "B.Sc. in Computational Mathematics",
        "Bachelor of Pharmacy",
        "B.Sc. in Applied Physics",
        "B.Sc. in Computer Science",
        # additions:
        "MBBS",
        "BDS",
        "BSc Nursing"
    ]
    p_prog = [1/len(undergrad_programs)] * len(undergrad_programs)
    fields_of_study = list(np.random.choice(undergrad_programs, size=num_samples, p=p_prog))

    # 5) Year of Study
    year_weights = {"4th": 0.60, "Graduated": 0.30, "3rd": 0.05, "5th": 0.04, "1st": 0.01}
    year_of_study = np.random.choice(list(year_weights.keys()), size=num_samples, p=list(year_weights.values()))

    # 6) Living Situation
    living_weights = {
        "At home with family": 0.40,
        "Rented/shared room":  0.25,
        "Hostel":               0.15,
        "Alone":                0.15,
        "Other":                0.05
    }
    living_situation = np.random.choice(list(living_weights.keys()), size=num_samples, p=list(living_weights.values()))

    # 7) CGPA
    def gen_cgpa():
        cgpa = np.random.normal(3.4, 0.45)
        return round(max(2.0, min(4.0, cgpa)), 2)
    cgpas = [gen_cgpa() for _ in range(num_samples)]

    # 8) Repeated courses
    rep_weights = {"No": 0.75, "Yes": 0.25}
    repeated_course = np.random.choice(list(rep_weights.keys()), size=num_samples, p=list(rep_weights.values()))

    # 9) Attendance
    att_weights = {">90%": 0.45, "75%–90%": 0.35, "50%–75%": 0.15, "<50%": 0.05}
    attendance = np.random.choice(list(att_weights.keys()), size=num_samples, p=list(att_weights.values()))

    # 10) Study hours
    study_weights = {"<1": 0.40, "1 to 2": 0.30, "2 to 3": 0.15, "3 to 4": 0.10, ">4": 0.05}
    study_hours = np.random.choice(list(study_weights.keys()), size=num_samples, p=list(study_weights.values()))

    # 11) Revision frequency
    material_revision = np.random.choice([1,2,3,4,5], size=num_samples, p=[0.30,0.25,0.20,0.15,0.10])

    # 12) Faculty rating
    faculty_rating = np.random.choice([1,2,3,4,5], size=num_samples, p=[0.10,0.20,0.30,0.30,0.10])

    # 13) Online usage
    online_weights = {"Frequently":0.45, "Sometimes":0.30, "Rarely":0.20, "Never":0.05}
    online_usage = np.random.choice(list(online_weights.keys()), size=num_samples, p=list(online_weights.values()))

    # 14) Group study
    group_weights = {"Never":0.25, "Rarely":0.35, "Sometimes":0.30, "Frequently":0.10}
    group_study = np.random.choice(list(group_weights.keys()), size=num_samples, p=list(group_weights.values()))

    # 15) Teacher help
    help_weights = {"No":0.20, "Rarely":0.35, "Sometimes":0.30, "Yes, regularly":0.15}
    teacher_help = np.random.choice(list(help_weights.keys()), size=num_samples, p=list(help_weights.values()))

    # 16) Stress level
    stress_level = np.random.choice([1,2,3,4,5], size=num_samples, p=[0.10,0.20,0.25,0.25,0.20])

    # 17) Sleep hours
    sleep_weights = {"<5 hrs":0.05, "5–6 hrs":0.25, "6–7 hrs":0.40, "7–8 hrs":0.20, ">8 hrs":0.10}
    sleep_hours = np.random.choice(list(sleep_weights.keys()), size=num_samples, p=list(sleep_weights.values()))

    # 18) Family/friend support
    support_weights = {"Always":0.60, "Sometimes":0.25, "Rarely":0.10, "Never":0.05}
    support = np.random.choice(list(support_weights.keys()), size=num_samples, p=list(support_weights.values()))

    # 19) Friend circle
    friend_circle = np.random.choice([1,2,3,4,5], size=num_samples, p=[0.05,0.10,0.25,0.30,0.30])

    # 20) Income
    income_weights = {"<15,000":0.05, "15,000–30,000":0.15, "30,000–50,000":0.30, ">50,000":0.50}
    income = np.random.choice(list(income_weights.keys()), size=num_samples, p=list(income_weights.values()))

    # 21) First-gen
    first_gen = np.random.choice(["No","Yes"], size=num_samples, p=[0.60,0.40])

    # 22) Part-time job
    part_time_job = np.random.choice(["No","Yes"], size=num_samples, p=[0.75,0.25])

    # 23) Financial pressure
    financial_pressure = np.random.choice([1,2,3,4,5], size=num_samples, p=[0.20]*5)

    # 24) Family responsibilities
    family_resp_weights = {"No":0.30, "Rarely":0.30, "Sometimes":0.25, "Significantly":0.15}
    family_resp = np.random.choice(list(family_resp_weights.keys()), size=num_samples, p=list(family_resp_weights.values()))

    # 25) Degree confidence
    degree_confidence = np.random.choice([1,2,3,4,5], size=num_samples, p=[0.05,0.05,0.10,0.20,0.60])

    # 26) Motivation
    motivation = np.random.choice([1,2,3,4,5], size=num_samples, p=[0.05,0.10,0.20,0.30,0.35])

    # #27) Comments
    # # comments = [""] * num_samples
    # real_comments = [
    #     "Never Give Up. Nothing can stop you except your own thoughts.",
    #     "LUCK MATTERS", "Running family, business and studies back-to-back is a huge challenge",
    #     "I learn everything online—grades aren't everything.",
    #     "Delayed results hurt my mental health.",
    #     "Medical life is hard", "i hate college", "Survey sucks", "Trying harder than yesterday"
    # ]
    # idxs = np.random.choice(num_samples, size=int(num_samples*0.2), replace=False)
    # for i in idxs:
    #     comments[i] = random.choice(real_comments)

    # 28) Correlations: attendance ↔ CGPA
    for i in range(num_samples):
        if cgpas[i] > 3.7 and random.random() < 0.8:
            attendance[i] = ">90%"
        if cgpas[i] < 2.8 and random.random() < 0.5:
            attendance[i] = np.random.choice(["50%–75%", "<50%"], p=[0.7,0.3])

    # 29) Correlations: motivation ↔ CGPA
    for i in range(num_samples):
        if motivation[i] >= 4:
            cgpas[i] = round(min(4.0, cgpas[i] + random.uniform(0.1,0.3)), 2)
        elif motivation[i] <= 2:
            cgpas[i] = round(max(2.0, cgpas[i] - random.uniform(0.1,0.3)), 2)

    # 30) Build DataFrame
    df = pd.DataFrame({
        "Timestamp": formatted_timestamps,
        "Consent": consent,
        "Age": ages,
        "Field of Study": fields_of_study,
        "Year of Study": year_of_study,
        "Living Situation": living_situation,
        "CGPA": cgpas,
        "Repeated Courses": repeated_course,
        "Attendance": attendance,
        "Study Hours": study_hours,
        "Revision Frequency": material_revision,
        "Faculty Rating": faculty_rating,
        "Online Platform Usage": online_usage,
        "Group Study Frequency": group_study,
        "Teacher Help-Seeking": teacher_help,
        "Academic Stress Level": stress_level,
        "Sleep Hours": sleep_hours,
        "Family/Friend Support": support,
        "Academic Friend Circle": friend_circle,
        "Monthly Household Income": income,
        "First-Gen Student": first_gen,
        "Part-Time Job": part_time_job,
        "Financial Pressure Impact": financial_pressure,
        "Family Responsibilities Impact": family_resp,
        "Degree Confidence": degree_confidence,
        "Motivation": motivation,
        # "Comments": comments
    })

    return df

if __name__ == "__main__":
    df = generate_synthetic_student_data(2000)
    df.to_csv("synthetic_student_survey_data.csv", index=False)
    print(f"Generated {len(df)} synthetic student records and saved to 'synthetic_student_survey_data.csv'")
