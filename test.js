import { getFileHistory } from './dist/index.js';

const test = async () => {
  try {
    const history = await getFileHistory(
      'teamleaderleo',
      'git-inline',
      'src/index.ts'
    );
    
    console.log('File history:', JSON.stringify(history, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
};

test();