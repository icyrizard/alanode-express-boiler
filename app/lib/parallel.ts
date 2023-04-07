/**
 * https://maximorlov.com/parallel-tasks-with-pure-javascript/
 *
 * First, we create an array of Length "max" concurrency.
 * tasks.entries() is used get an iterator with [{ index1: task1, index2: task2 }]
 *
 * `runTasks` closure will run 1 task at a time inside the same iterator using async/await.
 * Concurrency is happening because multiple runTasks are spawned by looping 'workers' using .map(runTasks;
 *
 * The original results array uses the index to build up the original order the tasks were defined.
 *
 * @param tasks
 * @param concurrency
 */
export const parallel = async(tasks, concurrency) => {
  const results = [];

  async function runTasks(tasksIterator) {
    for (const [index, task] of tasksIterator) {
      try {
        results[index] = await task();
      } catch (error) {
        results[index] = new Error(`Failed with: ${error.message}`);
      }
    }
  }

  const workers = new Array(concurrency).fill(tasks.entries()).map(runTasks);

  await Promise.allSettled(workers);

  return results;
};
