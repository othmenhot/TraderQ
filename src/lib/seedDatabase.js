import { getFirestore, doc, writeBatch } from 'firebase/firestore';
import app from './firebase';
import { ROADMAP_DATA, CHAPTERS, CHAPTER_CONTENT } from './mockData';

const db = getFirestore(app);

export const seedDatabase = async () => {
  const batch = writeBatch(db);

  try {
    // 1. Seed Learning Paths and their Modules
    for (const pathKey in ROADMAP_DATA) {
      const path = ROADMAP_DATA[pathKey];
      const pathRef = doc(db, 'learning_paths', path.id);
      batch.set(pathRef, {
        name: path.name,
        description: path.description,
        type: path.type,
      });

      const modules = path.categories 
        ? path.categories.flatMap(c => c.modules) 
        : path.modules;

      modules.forEach(module => {
        const moduleRef = doc(db, `learning_paths/${path.id}/modules`, module.id);
        batch.set(moduleRef, {
          title: module.title,
          description: module.description,
          xpRequired: module.xpRequired,
          chapterCount: module.chapterCount || 0,
        });

        // 2. Seed Chapters for each Module
        const moduleChapters = CHAPTERS[module.id];
        if (moduleChapters) {
          moduleChapters.forEach(chapter => {
            const chapterRef = doc(db, `learning_paths/${path.id}/modules/${module.id}/chapters`, chapter.id);
            batch.set(chapterRef, {
              title: chapter.title,
              order: chapter.order,
              type: chapter.type || 'text',
            });
          });
        }
      });
    }

    // 3. Seed Chapter Content
    for (const chapterId in CHAPTER_CONTENT) {
      const contentData = CHAPTER_CONTENT[chapterId];
      // Note: This assumes you have Firestore rules allowing write access to 'chapter_content'
      const contentRef = doc(db, 'chapter_content', chapterId);
      batch.set(contentRef, {
        type: contentData.type,
        content: contentData.content || null,
        quizId: contentData.quizId || null,
      });
    }

    // Commit all writes at once
    await batch.commit();
    alert('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    alert(`Error seeding database: ${error.message}`);
  }
};
