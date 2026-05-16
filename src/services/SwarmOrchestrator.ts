import { blink } from '@/lib/blink';

let interval: ReturnType<typeof setInterval> | null = null;

export const startSwarmOrchestration = () => {
  if (interval) return;

  console.log('SwarmOrchestrator: Initiating autonomous task progression...');
  
  interval = setInterval(async () => {
    try {
      const tasks = await blink.db.tasks.list({
        where: { status: 'in_progress' }
      });

      if (tasks.length === 0) return;

      for (const task of tasks) {
        const newProgress = Math.min(100, task.progress + Math.floor(Math.random() * 5) + 2);
        const newStatus = newProgress === 100 ? 'completed' : 'in_progress';
        
        await blink.db.tasks.update(task.id, {
          progress: newProgress,
          status: newStatus
        });
        
        console.log(`SwarmOrchestrator: Task "${task.title}" progress updated to ${newProgress}%`);
      }
    } catch (e) {
      console.error('SwarmOrchestrator Error:', e);
    }
  }, 5000); // Update every 5 seconds
};

export const stopSwarmOrchestration = () => {
  if (interval) {
    clearInterval(interval);
    interval = null;
    console.log('SwarmOrchestrator: Autonomous progression halted.');
  }
};
