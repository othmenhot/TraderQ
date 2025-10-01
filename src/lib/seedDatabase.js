import { getFirestore, collection, doc, writeBatch } from 'firebase/firestore';
import app from './firebase';
import { LEARNING_PATHS, MODULES } from './mockData';

const db = getFirestore(app);

export const seedDatabase = async () => {
  // Create a batch to perform multiple writes as a single atomic operation.
  const batch = writeBatch(db);

  LEARNING_PATHS.forEach(path => {
    // Create a reference to the document in the 'learning_paths' collection
    const pathRef = doc(db, 'learning_paths', path.id);
    batch.set(pathRef, {
      name: path.name,
      description: path.description,
      difficulty_level: path.difficulty_level,
      path_type: path.path_type,
      is_premium: path.is_premium,
      // You might want to add an 'order' field for sorting
    });

    // Get the modules for this learning path
    const pathModules = MODULES[path.id];
    if (pathModules) {
      pathModules.forEach(module => {
        // Create a reference to the document in the 'modules' subcollection
        const moduleRef = doc(db, `learning_paths/${path.id}/modules`, module.id);
        batch.set(moduleRef, {
          title: module.title,
          order: module.order,
          chapterCount: module.chapterCount,
        });
      });
    }
  });

  try {
    // Commit the batch
    await batch.commit();
    console.log('Database seeded successfully!');
    alert('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    alert('Error seeding database. Check the console for details.');
  }
};
