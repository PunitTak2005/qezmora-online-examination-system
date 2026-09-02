const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Category = require('../models/Category');

const allCategoriesToSeed = [
  // Active Categories
  {
    name: 'Programming',
    slug: 'programming',
    description: 'Coding languages, web development, algorithms, and software logic.',
    icon: 'Code',
    color: 'indigo',
    status: 'Active'
  },
  {
    name: 'Mathematics',
    slug: 'mathematics',
    description: 'Algebra, Calculus, Geometry, Probability, and Statistics.',
    icon: 'Calculator',
    color: 'blue',
    status: 'Active'
  },
  {
    name: 'Science',
    slug: 'science',
    description: 'Physics, Chemistry, Biology, and Environmental concepts.',
    icon: 'FlaskConical',
    color: 'green',
    status: 'Active'
  },
  {
    name: 'English',
    slug: 'english',
    description: 'Grammar, reading comprehension, vocabulary, and business communication.',
    icon: 'BookA',
    color: 'red',
    status: 'Active'
  },
  {
    name: 'Aptitude',
    slug: 'aptitude',
    description: 'Quantitative, logical reasoning, analytical thinking, and data interpretation.',
    icon: 'Target',
    color: 'orange',
    status: 'Active'
  },
  {
    name: 'General Knowledge',
    slug: 'general-knowledge',
    description: 'Current affairs, world history, geography, and constitutional facts.',
    icon: 'Globe',
    color: 'amber',
    status: 'Active'
  },
  {
    name: 'Advanced',
    slug: 'advanced',
    description: 'High-level technical assessments, system architecture, and cutting-edge topics.',
    icon: 'Award',
    color: 'purple',
    status: 'Active'
  },
  {
    name: 'Music',
    slug: 'music',
    description: 'Music theory, instruments, rhythm, and listening skills.',
    icon: 'Music',
    color: 'pink',
    status: 'Active'
  },

  // Draft Categories
  {
    name: 'Artificial Intelligence',
    slug: 'artificial-intelligence',
    description: 'Machine learning, neural networks, and AI fundamentals.',
    icon: 'BrainCircuit',
    color: 'purple',
    status: 'Draft'
  },
  {
    name: 'Cyber Security',
    slug: 'cyber-security',
    description: 'Network security, ethical hacking, and digital safety.',
    icon: 'Monitor',
    color: 'red',
    status: 'Draft'
  },
  {
    name: 'Cloud Computing',
    slug: 'cloud-computing',
    description: 'AWS, Azure, Docker, and Kubernetes fundamentals.',
    icon: 'Layers',
    color: 'cyan',
    status: 'Draft'
  },

  // Archived Categories
  {
    name: 'Basic Computing (Legacy)',
    slug: 'basic-computing-legacy',
    description: 'Retired introductory computer literacy assessments.',
    icon: 'Cpu',
    color: 'teal',
    status: 'Archived'
  },
  {
    name: 'Civics Practice (Legacy)',
    slug: 'civics-practice-legacy',
    description: 'Older civic awareness assessments retained for historical records.',
    icon: 'BookA',
    color: 'amber',
    status: 'Archived'
  },
  {
    name: 'Creative Writing Workshop (Legacy)',
    slug: 'creative-writing-workshop-legacy',
    description: 'Previously offered writing practice assessments.',
    icon: 'Newspaper',
    color: 'pink',
    status: 'Archived'
  }
];

const seedCategories = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/onlineexam';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully.');

    let addedCount = 0;
    let updatedCount = 0;

    for (const catData of allCategoriesToSeed) {
      const existing = await Category.findOne({
        $or: [{ name: catData.name }, { slug: catData.slug }]
      });

      if (!existing) {
        await Category.create(catData);
        console.log(`+ Created Category: ${catData.name} [${catData.status}]`);
        addedCount++;
      } else {
        // Ensure status & fields are up to date
        let modified = false;
        if (!existing.status || existing.status !== catData.status) {
          existing.status = catData.status;
          modified = true;
        }
        if (existing.icon !== catData.icon) {
          existing.icon = catData.icon;
          modified = true;
        }
        if (existing.color !== catData.color) {
          existing.color = catData.color;
          modified = true;
        }

        if (modified) {
          await existing.save();
          console.log(`~ Updated Category: ${existing.name} -> [${catData.status}, ${catData.icon}, ${catData.color}]`);
          updatedCount++;
        } else {
          console.log(`= Already exists: ${catData.name} [${catData.status}]`);
        }
      }
    }

    const activeCount = await Category.countDocuments({ status: 'Active' });
    const draftCount = await Category.countDocuments({ status: 'Draft' });
    const archivedCount = await Category.countDocuments({ status: 'Archived' });
    const totalCount = await Category.countDocuments();

    console.log('\n========================================');
    console.log('  QEZMORA CATEGORY SEEDING SUMMARY');
    console.log('========================================');
    console.log(`New Categories Inserted : ${addedCount}`);
    console.log(`Categories Updated      : ${updatedCount}`);
    console.log('----------------------------------------');
    console.log(`Active Categories       : ${activeCount}`);
    console.log(`Draft Categories        : ${draftCount}`);
    console.log(`Archived Categories     : ${archivedCount}`);
    console.log('----------------------------------------');
    console.log(`Total Categories in DB  : ${totalCount}`);
    console.log('========================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Category seeding error:', err);
    process.exit(1);
  }
};

seedCategories();
