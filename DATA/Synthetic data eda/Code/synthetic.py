
import pandas as pd
import numpy as np
import datetime
import random
from faker import Faker
import io

# Initialize faker generator
fake = Faker()

# Read the original data
csv_content = """Timestamp,Do you consent to participate in this academic research survey?,Age,"Program or Field of Study (e.g., BSc CSIT, BBA, MBBS, etc.)", Current Year of Study,Living Situation,Current CGPA(average GPA that you remember) or Overall CGPA (if graduated),Have you ever given compart exam or repeated course?,Average attendance in semesters till now,Daily study hours (outside class including the time of assignments and projects),I revise class materials regularly,Rate your faculty's academic teaching capability,"Use of online platforms (YouTube, Coursera, etc.)",How often do you do group studies?,Do you ask for help with teachers while facing academic difficulties?,Stress level regarding academics,Average sleep per night,Do you feel supported by friends or family in your academics?,How is your friend circle academically?,Estimated monthly household income (NPR),Are you the first in your family to attend university?,Do you work a part-time job while studying?,How much does financial pressure affect your studies?,Do family responsibilities affect your study time?,I am confident I will complete my degree,I feel motivated to do well in university,Anything else you'd like to share about your academic experience or challenges?,Column 28
5/13/2025 12:07:58,Yes,22,BBIS,4th,Rented/shared room,3.84,No,>90%,1 to 2,2,3,Sometimes,Sometimes,Rarely,2,7–8 hrs,Always,5,"30,000–50,000",Yes,No,1,Rarely,5,5,,
5/13/2025 12:10:11,Yes,21,BBIS,4th,At home with family,3.54,No,>90%,1 to 2,1,4,Sometimes,Sometimes,Rarely,5,5–6 hrs,Always,5,">50,000",Yes,No,2,No,3,3,No,
5/13/2025 12:14:26,Yes,20,BBIS,4th,Rented/shared room,3.3,Yes,75%–90%,<1,3,4,Frequently,Sometimes,Sometimes,2,6–7 hrs,Always,5,">50,000",Yes,No,1,Rarely,5,4,Never Give Up. Nothing can stop you except your own thoughts. Like an arrow the more responsibilities pull you back the further you go.,
5/13/2025 12:19:22,Yes,20,BBIS,4th,At home with family,3.4,No,>90%,<1,1,4,Rarely,Sometimes,Rarely,3,5–6 hrs,Always,5,">50,000",No,No,1,No,5,4,LUCK MATTERS,
5/15/2025 12:55:36,Yes,20,Bba,Graduated,At home with family,3.61,No,>90%,<1,1,4,Frequently,Sometimes,"Yes, regularly",4,6–7 hrs,Always,4,">50,000",No,No,3,Sometimes,4,4,,
5/15/2025 12:56:42,Yes,22,BBA,4th,At home with family,3.55,No,>90%,<1,1,2,Rarely,Never,Sometimes,3,6–7 hrs,Always,3,">50,000",No,No,3,Rarely,4,2,,"""

# Load the sample data
df = pd.read_csv(io.StringIO(csv_content))

# Analyze the original data to understand distributions
programs = [
    'BBIS', 'BBA', 'MBA', 'MBBS', 'BE', 'B.Tech', 'BSc', 'BCA', 'BDS', 'B.E', 
    'MPPM', 'Btech AI', 'LLB', 'BBM LLB', 'B.A.LLB', 'BA.LLB', 'BIM', 'BIT', 
    'BCE', 'BSc.CS', 'BPT', 'Bpt', 'CE', 'CS', 'GE', 'ME', 'CM', 'CA', 'EMBA',
    'MPhil', 'B.Sc', 'Environmental Engineering', 'Computer Engineering', 
    'Civil Engineering', 'Mechanical Engineering', 'Geomatics Engineering',
    'Computer science', 'B.Tech in AI', 'ENE', 'Nursing', 'MBS'
]

study_years = ['1st', '2nd', '3rd', '4th', '5th', 'Graduated']

living_situations = [
    'At home with family', 'Rented/shared room', 'Hostel', 'Alone', 'Other'
]

attendance_ranges = ['<50%', '50%–75%', '75%–90%', '>90%']

study_hours = ['<1', '1 to 2', '2 to 3', '3 to 4', '>4']

sleep_hours = ['<5 hrs', '5–6 hrs', '6–7 hrs', '7–8 hrs', '>8 hrs']

income_ranges = [
    '<15,000', '15,000–30,000', '30,000–50,000', '>50,000'
]

frequency_options = ['Never', 'Rarely', 'Sometimes', 'Frequently', 'Always']
ask_help_options = ['No', 'Rarely', 'Sometimes', 'Yes, regularly']
yes_no_options = ['Yes', 'No']

motivational_quotes = [
    "Never give up on your dreams.",
    "Hard work always pays off.",
    "Consistency is the key to success.",
    "Stay focused on your goals.",
    "Education is the most powerful weapon.",
    "The harder you work, the luckier you get.",
    "Success comes to those who persevere.",
    "Learning is a lifelong journey.",
    "Your attitude determines your direction.",
    "Every expert was once a beginner.",
    "The journey of a thousand miles begins with a single step.",
    "Believe in yourself and all that you are.",
    "The best way to predict the future is to create it.",
    "Don't watch the clock; do what it does. Keep going.",
    "Quality education is the foundation of success.",
    "",  # Empty for many entries
]

challenges = [
    "Balancing work and studies is challenging but rewarding.",
    "Financial constraints make it hard to focus fully on academics.",
    "The academic system needs more practical applications.",
    "Remote learning was difficult to adapt to initially.",
    "Finding time for self-study alongside assignments is tough.",
    "Group projects can be challenging with uneven participation.",
    "Maintaining mental health while pursuing academic excellence is crucial.",
    "Faculty support varies greatly across departments.",
    "The pressure to maintain high grades affects mental well-being.",
    "Lack of industry exposure in curriculum is concerning.",
    "Outdated teaching methodologies need revision.",
    "Not enough focus on skill development beyond theoretical knowledge.",
    "Family expectations create additional pressure to perform well.",
    "Infrastructure limitations affect learning experience.",
    "Limited access to research opportunities is demotivating.",
    "No",
    "None",
    "",  # Empty for many entries
]

# Generate synthetic data
def generate_synthetic_data(n=1000):
    synthetic_data = []
    
    for i in range(n):
        # Generate a random date between May 2025 and July 2025
        random_date = fake.date_time_between(
            start_date=datetime.datetime(2025, 5, 13), 
            end_date=datetime.datetime(2025, 7, 31)
        )
        timestamp = random_date.strftime("%m/%d/%Y %H:%M:%S")
        
        # Always Yes for consent
        consent = "Yes"
        
        # Age between 18 and 47 with the distribution weighted towards 20-25
        age_weights = [0.05, 0.1, 0.4, 0.25, 0.1, 0.05, 0.05]
        age_ranges = [
            (18, 19), (20, 21), (22, 23), (24, 25), 
            (26, 30), (31, 40), (41, 47)
        ]
        selected_range = random.choices(age_ranges, weights=age_weights)[0]
        age = random.randint(selected_range[0], selected_range[1])
        
        # Program/Field of Study
        program = random.choice(programs)
        
        # Current Year of Study - 4th and Graduated more common
        year_weights = [0.05, 0.05, 0.1, 0.4, 0.05, 0.35]
        study_year = random.choices(study_years, weights=year_weights)[0]
        
        # Living Situation - At home and Rented most common
        living_weights = [0.35, 0.3, 0.2, 0.1, 0.05]
        living = random.choices(living_situations, weights=living_weights)[0]
        
        # CGPA - Normal distribution around 3.4 with SD of 0.4, truncated between 2.0 and 4.0
        cgpa = round(min(max(np.random.normal(3.4, 0.4), 2.0), 4.0), 2)
        
        # Have you ever repeated a course - mostly No
        repeated = random.choices(["Yes", "No"], weights=[0.2, 0.8])[0]
        
        # Attendance - Higher attendance more likely
        attendance_weights = [0.05, 0.15, 0.3, 0.5]
        attendance = random.choices(attendance_ranges, weights=attendance_weights)[0]
        
        # Study hours - Less study hours more common
        hours_weights = [0.4, 0.3, 0.15, 0.1, 0.05]
        hours = random.choices(study_hours, weights=hours_weights)[0]
        
        # Revision frequency - Scale 1-5, lower is more common
        revision = random.choices(range(1, 6), weights=[0.3, 0.25, 0.2, 0.15, 0.1])[0]
        
        # Faculty rating - Scale 1-5, middle values more common
        faculty = random.choices(range(1, 6), weights=[0.15, 0.2, 0.3, 0.25, 0.1])[0]
        
        # Online platforms usage
        online = random.choices(frequency_options, weights=[0.1, 0.2, 0.3, 0.3, 0.1])[0]
        
        # Group studies - Less frequent more common
        group = random.choices(frequency_options[:-1], weights=[0.2, 0.4, 0.3, 0.1])[0]
        
        # Ask for help - Rarely/Sometimes more common
        ask_help = random.choices(ask_help_options, weights=[0.2, 0.3, 0.3, 0.2])[0]
        
        # Stress level - Scale 1-5, higher stress levels more common
        stress = random.choices(range(1, 6), weights=[0.1, 0.15, 0.2, 0.25, 0.3])[0]
        
        # Sleep hours - 6-7 hours most common
        sleep_weights = [0.1, 0.2, 0.35, 0.25, 0.1]
        sleep = random.choices(sleep_hours, weights=sleep_weights)[0]
        
        # Family support - Usually high
        family_support = random.choices(frequency_options, weights=[0.05, 0.1, 0.15, 0.2, 0.5])[0]
        
        # Friend circle academically - Scale 1-5, higher is more common
        friends = random.choices(range(1, 6), weights=[0.1, 0.1, 0.2, 0.25, 0.35])[0]
        
        # Income - Higher incomes more common
        income_weights = [0.1, 0.2, 0.3, 0.4]
        income = random.choices(income_ranges, weights=income_weights)[0]
        
        # First in family - Mostly No
        first_gen = random.choices(yes_no_options, weights=[0.3, 0.7])[0]
        
        # Part-time job - Mostly No
        part_time = random.choices(yes_no_options, weights=[0.25, 0.75])[0]
        
        # Financial pressure - Scale 1-5, varied distribution
        financial = random.choices(range(1, 6), weights=[0.2, 0.2, 0.2, 0.2, 0.2])[0]
        
        # Family responsibilities affect - No/Rarely more common
        responsibilities = random.choices(
            ["No", "Rarely", "Sometimes", "Significantly"], 
            weights=[0.3, 0.3, 0.25, 0.15]
        )[0]
        
        # Confidence to complete degree - Scale 1-5, higher is more common
        confidence = random.choices(range(1, 6), weights=[0.05, 0.05, 0.1, 0.2, 0.6])[0]
        
        # Motivation - Scale 1-5, varied distribution with peak at 4
        motivation = random.choices(range(1, 6), weights=[0.1, 0.1, 0.2, 0.35, 0.25])[0]
        
        # Comments - Usually empty, sometimes a quote or challenge
        comment_choice = random.choices(["quote", "challenge", "empty"], weights=[0.05, 0.1, 0.85])[0]
        if comment_choice == "quote":
            comment = random.choice(motivational_quotes)
        elif comment_choice == "challenge":
            comment = random.choice(challenges)
        else:
            comment = ""
        
        # Empty column 28
        col28 = ""
        
        synthetic_data.append([
            timestamp, consent, age, program, study_year, living, cgpa, repeated,
            attendance, hours, revision, faculty, online, group, ask_help,
            stress, sleep, family_support, friends, income, first_gen, part_time,
            financial, responsibilities, confidence, motivation, comment, col28
        ])
    
    synthetic_df = pd.DataFrame(synthetic_data, columns=df.columns)
    return synthetic_df

# Generate 1000 synthetic records
synthetic_df = generate_synthetic_data(1000)

# Export to CSV
synthetic_df.to_csv("synthetic_student_survey_data.csv", index=False)

# Display first few rows to verify
print(synthetic_df.head())

# Summary statistics to verify synthetic data follows expected patterns
print("\nSummary of synthetic data:")
print(f"Number of records: {len(synthetic_df)}")
print(f"Average CGPA: {synthetic_df['Current CGPA(average GPA that you remember) or Overall CGPA (if graduated)'].mean():.2f}")
print(f"Age range: {synthetic_df['Age'].min()} to {synthetic_df['Age'].max()}")

# Export a smaller sample for display
sample_for_display = synthetic_df.head(20).to_csv(index=False)
print("\nSample of generated data (first 20 rows):")
print(sample_for_display)