import re

exams_data = [
    # Programming
    {"title": "React Fundamentals", "dur": 45, "q": 20, "diff": "medium", "cat": "Programming", "slug": "programming"},
    {"title": "JavaScript Essentials", "dur": 30, "q": 15, "diff": "easy", "cat": "Programming", "slug": "programming"},
    {"title": "Python Programming", "dur": 60, "q": 30, "diff": "medium", "cat": "Programming", "slug": "programming"},
    {"title": "Full Stack Web Development", "dur": 60, "q": 30, "diff": "medium", "cat": "Programming", "slug": "programming"},
    
    # Mathematics
    {"title": "Algebra Mastery", "dur": 30, "q": 20, "diff": "easy", "cat": "Mathematics", "slug": "mathematics"},
    {"title": "Calculus Challenge", "dur": 45, "q": 25, "diff": "hard", "cat": "Mathematics", "slug": "mathematics"},
    {"title": "Geometry & Mensuration", "dur": 35, "q": 20, "diff": "medium", "cat": "Mathematics", "slug": "mathematics"},
    {"title": "Probability & Statistics", "dur": 40, "q": 25, "diff": "medium", "cat": "Mathematics", "slug": "mathematics"},
    
    # Science
    {"title": "Physics Concepts", "dur": 40, "q": 20, "diff": "medium", "cat": "Science", "slug": "science"},
    {"title": "Chemistry Fundamentals", "dur": 35, "q": 20, "diff": "easy", "cat": "Science", "slug": "science"},
    {"title": "Biology Essentials", "dur": 30, "q": 18, "diff": "easy", "cat": "Science", "slug": "science"},
    {"title": "Environmental Science", "dur": 25, "q": 15, "diff": "easy", "cat": "Science", "slug": "science"},
    
    # English
    {"title": "English Grammar", "dur": 25, "q": 20, "diff": "easy", "cat": "English", "slug": "english"},
    {"title": "Reading Comprehension", "dur": 30, "q": 18, "diff": "medium", "cat": "English", "slug": "english"},
    {"title": "Vocabulary Builder", "dur": 20, "q": 15, "diff": "easy", "cat": "English", "slug": "english"},
    {"title": "Business English", "dur": 35, "q": 20, "diff": "medium", "cat": "English", "slug": "english"},
    
    # Aptitude
    {"title": "Quantitative Aptitude", "dur": 40, "q": 25, "diff": "medium", "cat": "Aptitude", "slug": "aptitude"},
    {"title": "Logical Reasoning", "dur": 30, "q": 20, "diff": "medium", "cat": "Aptitude", "slug": "aptitude"},
    {"title": "Analytical Thinking", "dur": 35, "q": 20, "diff": "hard", "cat": "Aptitude", "slug": "aptitude"},
    {"title": "Data Interpretation", "dur": 40, "q": 25, "diff": "medium", "cat": "Aptitude", "slug": "aptitude"},
    
    # General Knowledge
    {"title": "Current Affairs", "dur": 20, "q": 15, "diff": "easy", "cat": "General Knowledge", "slug": "general-knowledge"},
    {"title": "World History", "dur": 30, "q": 20, "diff": "medium", "cat": "General Knowledge", "slug": "general-knowledge"},
    {"title": "Geography Explorer", "dur": 25, "q": 18, "diff": "easy", "cat": "General Knowledge", "slug": "general-knowledge"},
    {"title": "Indian Constitution", "dur": 35, "q": 20, "diff": "medium", "cat": "General Knowledge", "slug": "general-knowledge"},
]

exams_js = "[\n"
for e in exams_data:
    exams_js += f"""        {{
          title: '{e['title']}',
          subject: '{e['cat']}',
          description: 'Comprehensive assessment for {e['title']}.',
          duration: {e['dur']},
          totalMarks: {e['q']},
          passingMarks: {e['q'] // 2},
          teacher: teacherId,
          status: 'published',
          difficulty: '{e['diff']}',
          category: getCatId('{e['slug']}'),
          instructions: 'Read each question carefully. Auto-graded.',
        }},\n"""
exams_js += "      ]"

with open('server/utils/seeder.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace between `const exams = await Exam.insertMany(` and `);`
new_content = re.sub(r'const exams = await Exam\.insertMany\(\[.*?\]\);', f'const exams = await Exam.insertMany({exams_js});', content, flags=re.DOTALL)

with open('server/utils/seeder.js', 'w', encoding='utf-8') as f:
    f.write(new_content)
print("Done")

